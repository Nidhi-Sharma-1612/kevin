"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { PARTNER_CONTENT } from "@/lib/partner-content";
import { PARTNER_WHATSAPP, whatsappLink, type PartnerLang } from "@/lib/partner-pages";

// Mobile-only shortcut to WhatsApp, held back until the visitor has
// scrolled past most of the hero so it doesn't cover the hero's own CTAs.
export default function PartnerWhatsAppBar({ lang }: { lang: PartnerLang }) {
  const content = PARTNER_CONTENT[lang];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink(PARTNER_WHATSAPP[lang], content.talkMessage)}
      target="_blank"
      rel="noopener"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed inset-x-4 bottom-4 z-40 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-[160%]"
      }`}
    >
      <MessageCircle size={18} />
      {content.stickyLabel}
    </a>
  );
}
