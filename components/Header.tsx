"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/contact", label: "Contact" },
];

// How far (px) to scroll on the home page before the navbar solidifies —
// roughly the distance from the top to below the hero's text block.
const SOLIDIFY_AT = 80;

export default function Header({ initialLanguage }: { initialLanguage: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    if (!isHome) return;

    function onScroll() {
      setScrolled(window.scrollY > SOLIDIFY_AT);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-ink-900/5 bg-sand-50/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo light={transparent} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors duration-300 ${
                  active
                    ? transparent
                      ? "text-amber-300"
                      : "text-amber-600"
                    : transparent
                      ? "text-white/90 hover:text-amber-300"
                      : "text-ink-600 hover:text-amber-600"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full ${
                      transparent ? "bg-amber-300" : "bg-amber-500"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher initialLanguage={initialLanguage} />

          <div className="hidden md:block">
            <Link
              href="/properties"
              className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
            >
              Book your stay
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex items-center justify-center rounded-full p-2 transition-colors duration-300 md:hidden ${
              transparent ? "text-white" : "text-ink-700"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-900/5 bg-sand-50 px-5 pb-5 md:hidden">
          <nav className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-amber-50 text-amber-600"
                      : "text-ink-700 hover:bg-sand-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/properties"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-amber-400 px-4 py-2.5 text-center text-sm font-semibold text-ink-900"
            >
              Book your stay
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
