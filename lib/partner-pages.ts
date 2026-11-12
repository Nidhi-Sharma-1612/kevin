// The partner-agencies page exists as three hand-translated pages at the
// addresses the client chose, rather than one English page run through
// Google Translate like the rest of the site. Shared by the server pages
// and by client components (Header, LanguageSwitcher), so no server-only.

export type PartnerLang = "en" | "fr" | "es";

export const PARTNER_PATHS: Record<PartnerLang, string> = {
  en: "/en/partner-agencies",
  fr: "/fr/agences-partenaires",
  es: "/agencias-colaboradoras",
};

// Each language's page is answered from a different team member's
// WhatsApp, as set out in the client's brief.
export const PARTNER_WHATSAPP: Record<PartnerLang, string> = {
  fr: "+34 695 044 128",
  es: "+34 659 431 087",
  en: "+34 744 649 533",
};

export function partnerPath(language: string): string {
  return PARTNER_PATHS[language as PartnerLang] ?? PARTNER_PATHS.en;
}

export function isPartnerPath(pathname: string): boolean {
  return Object.values(PARTNER_PATHS).includes(pathname);
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
