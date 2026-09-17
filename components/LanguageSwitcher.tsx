"use client";

import Script from "next/script";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages, Loader2 } from "lucide-react";

type TranslateElementOptions = {
  pageLanguage: string;
  includedLanguages: string;
  layout: number;
  autoDisplay: boolean;
};

type GoogleTranslateGlobal = {
  translate: {
    TranslateElement: {
      new (options: TranslateElementOptions, containerId: string): void;
      InlineLayout: { SIMPLE: number };
    };
  };
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: GoogleTranslateGlobal;
    __gtDomPatched?: boolean;
    __gtInitialized?: boolean;
    __gtBannerSuppressorInstalled?: boolean;
  }
}

const CONTAINER_ID = "google_translate_element";

const OPTIONS: TranslateElementOptions = {
  pageLanguage: "en",
  includedLanguages: "en,fr,es",
  layout: 0, // filled in with the real InlineLayout.SIMPLE value at init time
  autoDisplay: false,
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

// Google's Website Translator widget only supports one active instance per
// page, and its own popup UI is cross-origin content we can't restyle to
// match the site. So the widget itself is kept mounted but visually
// hidden (see the sr-only wrapper below) purely so it can perform the
// actual translation, while a fully custom-themed control drives it by
// setting the "googtrans" cookie it reads on load and reloading the page.
function initWidget() {
  if (!window.google || window.__gtInitialized) return;
  const el = document.getElementById(CONTAINER_ID);
  if (!el || el.hasChildNodes()) return;
  window.__gtInitialized = true;
  new window.google.translate.TranslateElement(
    { ...OPTIONS, layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
    CONTAINER_ID
  );
}

// React and Google's translate widget both mutate the same DOM, and the
// widget can detach/replace text nodes that React still expects to own.
// When React later tries to remove or reinsert one of those nodes, the
// browser throws a NotFoundError that crashes the app. This guards the two
// DOM methods involved so a mismatch is a no-op instead of a crash — a
// narrow, well-documented workaround for this specific combination.
function patchDomForGoogleTranslate() {
  if (window.__gtDomPatched) return;
  window.__gtDomPatched = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (this: Node, child: Node): Node {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child);
  } as typeof Node.prototype.removeChild;

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (
    this: Node,
    newNode: Node,
    referenceNode: Node | null
  ): Node {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode);
  } as typeof Node.prototype.insertBefore;
}

// Belt-and-suspenders: our own UI never touches Google's native trigger, so
// its "Translated into: X ▾" banner shouldn't appear — but if a future
// script version does show it on load, hide it. Detected structurally
// (a "skiptranslate" iframe fixed at top:0 spanning most of the viewport)
// since Google's banner class name is obfuscated and changes across
// versions.
function installBannerSuppressor() {
  if (window.__gtBannerSuppressorInstalled) return;
  window.__gtBannerSuppressorInstalled = true;

  function isBannerFrame(el: Element): el is HTMLIFrameElement {
    if (!(el instanceof HTMLIFrameElement)) return false;
    if (!el.classList.contains("skiptranslate")) return false;
    const style = window.getComputedStyle(el);
    if (style.position !== "fixed" || style.top !== "0px") return false;
    return el.getBoundingClientRect().width > window.innerWidth * 0.5;
  }

  function rescan() {
    document.querySelectorAll("iframe.skiptranslate").forEach((el) => {
      if (isBannerFrame(el)) el.style.setProperty("display", "none", "important");
    });
  }

  rescan();
  const observer = new MutationObserver(rescan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

// Google's own script can write the googtrans cookie back with an explicit
// domain attribute (host or ".host"), separate from the plain path=/ cookie
// we set ourselves. Once that happens there are two cookies with the same
// name, and the browser can send either one first — so just overwriting our
// own copy isn't reliable; every variant has to be cleared before setting
// (or not setting) a new one, or "switch back to English" can silently pick
// up a stale French/Spanish cookie instead.
function clearGoogTransCookie() {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  const host = window.location.hostname;
  document.cookie = `googtrans=; path=/; ${expired}`;
  document.cookie = `googtrans=; path=/; domain=${host}; ${expired}`;
  document.cookie = `googtrans=; path=/; domain=.${host}; ${expired}`;
}

// Switching languages does a full reload (the widget's own translation
// pass needs a fresh DOM to scan), which otherwise means a jarring flash of
// the outgoing language's page before the new one is ready. This flag
// survives the reload (a cookie/URL param would too, but this never needs
// to reach the server) and drives a full-screen "Translating…" overlay
// that covers that flash, cleared once the target language is actually
// showing — see the SwitchOverlay component below.
const SWITCHING_KEY = "gt-switching";

function selectLanguage(code: string) {
  clearGoogTransCookie();
  sessionStorage.setItem(SWITCHING_KEY, code);
  // English is the page's own source language — leaving the cookie unset
  // is the reliable way back to it. Setting "/en/en" (source=target) still
  // leaves a cookie for Google's widget to find on load, and in practice
  // that's enough for it to re-run its translation pass instead of leaving
  // the original English markup alone.
  if (code !== "en") {
    document.cookie = `googtrans=/en/${code}; path=/`;
  }
  window.location.reload();
}

// Safety net if Google's script is slow, blocked, or the translated-*
// class it adds ever changes shape — the overlay must never get stuck.
const SWITCH_TIMEOUT_MS = 4000;

function SwitchOverlay() {
  // Must start false: the server has no sessionStorage to read, so it
  // always renders "not visible" — starting from anything else here is a
  // hydration mismatch (React expects the client's first render to match
  // the server's exactly), not just a cosmetic issue. useLayoutEffect runs
  // synchronously after that first render commits but before the browser
  // paints, so flipping it there still shows the overlay in the very first
  // painted frame — no visible gap, and no mismatch either.
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const target = sessionStorage.getItem(SWITCHING_KEY);
    if (!target) return;
    // Reading sessionStorage is reading state external to React that the
    // server has no access to — exactly the case the "don't setState in an
    // effect" rule carves out an exception for (synchronizing with an
    // external system), not a computation that belongs during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);

    function finish() {
      sessionStorage.removeItem(SWITCHING_KEY);
      setVisible(false);
    }

    // Switching to English needs no translation pass to wait for — just
    // hold the overlay briefly so the reload itself doesn't flash.
    if (target === "en") {
      const t = setTimeout(finish, 300);
      return () => clearTimeout(t);
    }

    // Google adds translated-ltr/translated-rtl to <html> once its
    // translation pass finishes.
    function isTranslated() {
      return /\btranslated-(ltr|rtl)\b/.test(document.documentElement.className);
    }

    if (isTranslated()) {
      const t = setTimeout(finish, 150);
      return () => clearTimeout(t);
    }

    const observer = new MutationObserver(() => {
      if (isTranslated()) {
        observer.disconnect();
        setTimeout(finish, 150);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const timeout = setTimeout(() => {
      observer.disconnect();
      finish();
    }, SWITCH_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      translate="no"
      className="notranslate fixed inset-0 z-[300] flex items-center justify-center bg-sand-50/90 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink-700 shadow-soft">
        <Loader2 size={16} className="animate-spin text-amber-500" />
        Translating…
      </div>
    </div>
  );
}

export default function LanguageSwitcher({
  initialLanguage,
  className = "",
}: {
  initialLanguage: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // Read server-side (RootLayout reads the googtrans cookie and passes it
  // down) rather than from document.cookie client-side: the server render
  // and the client's first render then agree from the start, with no
  // hydration flip. That flip used to race Google Translate's own DOM scan
  // (which starts as soon as its script loads) and could leave the wrong
  // text behind depending on timing.
  const [current] = useState(initialLanguage);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    patchDomForGoogleTranslate();
    installBannerSuppressor();

    window.googleTranslateElementInit = initWidget;
    if (window.google) initWidget();
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  return (
    // "notranslate" tells Google's engine to skip this subtree — without
    // it, the engine translates our own language names too (e.g. the
    // English label becomes "Anglais" once the page is in French), which
    // defeats the point of using fixed native-script labels here.
    <div ref={rootRef} translate="no" className={`notranslate relative ${className}`}>
      <SwitchOverlay />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-ink-100 bg-sand-50 px-3.5 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-amber-300 hover:bg-sand-100"
      >
        <Languages size={15} className="shrink-0 text-amber-500" aria-hidden />
        <span>{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-amber-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-40 overflow-hidden rounded-xl bg-white p-1.5 shadow-soft ring-1 ring-ink-900/5"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === current}
              onClick={() => {
                setOpen(false);
                if (lang.code !== current) selectLanguage(lang.code);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                lang.code === current
                  ? "bg-amber-50 font-semibold text-amber-600"
                  : "text-ink-700 hover:bg-sand-100"
              }`}
            >
              {lang.label}
              {lang.code === current && <Check size={14} className="shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {/* Google's actual translation engine — visually hidden, its own
          popup UI is never shown; the button above drives it via cookie. */}
      <div className="sr-only" aria-hidden="true">
        <div id={CONTAINER_ID} />
      </div>
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
