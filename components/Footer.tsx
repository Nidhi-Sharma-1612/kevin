import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";
import Logo from "./Logo";
import { getPageSections, getSiteSettings, str, strList } from "@/lib/cms";

// Hrefs are fixed; the visible labels can be overridden from the admin panel
// (same order as below).
const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "All Properties" },
  { href: "/contact", label: "Contact Us" },
];

const NEIGHBORHOODS = ["Santa Clara", "La Nogalera", "Torre La Roca", "City Centre"];

export default async function Footer() {
  const [settings, global] = await Promise.all([getSiteSettings(), getPageSections("global")]);
  const footer = global.footer ?? {};

  const exploreLabels = strList(footer, "exploreLinks", [], EXPLORE_LINKS.length);
  const exploreLinks = EXPLORE_LINKS.map((link, i) => ({
    ...link,
    label: exploreLabels[i] ?? link.label,
  }));
  const neighborhoods = strList(footer, "neighborhoods", NEIGHBORHOODS);

  const tagline =
    settings?.footerTagline ||
    "Curated apartments across Torremolinos, Costa del Sol — with a dedicated concierge team to make every stay unforgettable.";
  const address = settings?.address || "Torremolinos, Costa del Sol, Spain";
  const phone = settings?.phone || "+34 635 861 443";
  const email = settings?.email || "Contact@laconciergeriedelsol.com";
  const copyrightName = settings?.copyrightName || settings?.siteName || "La Conciergerie Del Sol";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  // Social buttons only render when a link is set in Settings > Social links.
  const instagramUrl = settings?.socialLinks?.instagram || "";
  const whatsappRaw = settings?.socialLinks?.whatsapp || settings?.whatsapp || "";
  const whatsappUrl = whatsappRaw
    ? /^https?:\/\//.test(whatsappRaw)
      ? whatsappRaw
      : `https://wa.me/${whatsappRaw.replace(/\D/g, "")}`
    : "";

  return (
    <footer className="relative bg-ink-900 text-sand-100">
      <div
        aria-hidden
        className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400"
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo logoUrl={settings?.logoUrl ?? null} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-200">
              {tagline}
            </p>
            {(instagramUrl || whatsappUrl) && (
              <div className="mt-5 flex gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="rounded-full border border-white/10 bg-ink-800 p-2.5 text-sand-100 transition-colors hover:border-amber-400/40 hover:bg-amber-400 hover:text-ink-900"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="rounded-full border border-white/10 bg-ink-800 p-2.5 text-sand-100 transition-colors hover:border-amber-400/40 hover:bg-amber-400 hover:text-ink-900"
                  >
                    <MessageCircle size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-sand-50 uppercase">
              {str(footer, "exploreHeading", "Explore")}
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-2.5 text-sm text-ink-200">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-sand-50 uppercase">
              {str(footer, "neighborhoodsHeading", "Torremolinos")}
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-2.5 text-sm text-ink-200">
              {neighborhoods.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-sand-50 uppercase">
              {str(footer, "contactHeading", "Get in touch")}
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-3 text-sm text-ink-200">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                {address}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-amber-300" />
                <a href={phoneHref} className="hover:text-amber-300">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-amber-300" />
                <a href={`mailto:${email}`} className="hover:text-amber-300">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-ink-800 pt-6 text-center text-xs text-ink-400 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {copyrightName}.{" "}
            {str(footer, "copyrightNote", "All rights reserved. · Andalusia, Spain")}
          </p>
          <div className="flex items-center gap-1.5">
            <span>Design and developed by</span>
            <Image
              src="/company_logo.png"
              alt="Design by Dial"
              width={94}
              height={22}
              className="h-4 w-auto opacity-90"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
