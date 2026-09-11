import Image from "next/image";
import Link from "next/link";
import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "All Properties" },
  { href: "/contact", label: "Contact Us" },
];

const NEIGHBORHOODS = ["Santa Clara", "La Nogalera", "Torre La Roca", "City Centre"];

export default function Footer() {
  return (
    <footer className="relative bg-ink-900 text-sand-100">
      <div
        aria-hidden
        className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400"
      />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-200">
              Curated apartments across Torremolinos, Costa del Sol — with a
              dedicated concierge team to make every stay unforgettable.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Website"
                className="rounded-full border border-white/10 bg-ink-800 p-2.5 text-sand-100 transition-colors hover:border-amber-400/40 hover:bg-amber-400 hover:text-ink-900"
              >
                <Globe size={16} />
              </a>
              <a
                href="#"
                aria-label="WhatsApp"
                className="rounded-full border border-white/10 bg-ink-800 p-2.5 text-sand-100 transition-colors hover:border-amber-400/40 hover:bg-amber-400 hover:text-ink-900"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-sand-50 uppercase">
              Explore
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-2.5 text-sm text-ink-200">
              {EXPLORE_LINKS.map((link) => (
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
              Torremolinos
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-2.5 text-sm text-ink-200">
              {NEIGHBORHOODS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-sand-50 uppercase">
              Get in touch
            </h3>
            <span className="mt-2 block h-px w-8 bg-amber-400/60" />
            <ul className="mt-4 space-y-3 text-sm text-ink-200">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
                Torremolinos, Costa del Sol, Spain
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-amber-300" />
                <a href="tel:+34635861443" className="hover:text-amber-300">
                  +34 635 861 443
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-amber-300" />
                <a
                  href="mailto:Contact@laconciergeriedelsol.com"
                  className="hover:text-amber-300"
                >
                  Contact@laconciergeriedelsol.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-ink-800 pt-6 text-center text-xs text-ink-400 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} La Conciergerie Del Sol. All rights
            reserved. · Andalusia, Spain
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
