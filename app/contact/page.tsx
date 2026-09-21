import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import ContactMap from "@/components/ContactMap";
import Reveal from "@/components/Reveal";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { getAllProperties } from "@/lib/properties";
import { getPageSections, getSiteSettings, str } from "@/lib/cms";

export default async function ContactPage() {
  const [properties, sections, settings] = await Promise.all([
    getAllProperties(),
    getPageSections("contact"),
    getSiteSettings(),
  ]);
  const intro = sections.intro ?? {};
  const mapCms = sections.map ?? {};
  const nudge = sections.faqNudge ?? {};

  const address = settings?.address || "Torremolinos, Costa del Sol, Spain";
  const phone = settings?.phone || "+34 635 861 443";
  const email = settings?.email || "Contact@laconciergeriedelsol.com";
  const replyNote = settings?.responseTimeNote || "We typically reply within a few hours.";

  const trustPills = [
    { icon: Clock, label: str(intro, "replyPill", "Replies within a few hours") },
    { icon: ShieldCheck, label: str(intro, "teamPill", "Local Torremolinos team") },
    {
      icon: MessageCircle,
      label: `${properties.length}+ ${str(intro, "managedPillSuffix", "apartments managed")}`,
    },
  ];

  return (
    <div className="relative overflow-hidden py-16">
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
            {str(intro, "eyebrow", "Get in touch")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-800">
            {str(intro, "heading", "We're here to help plan your stay")}
          </h1>
          <p className="mt-4 text-ink-500">
            {str(
              intro,
              "description",
              "Questions about a property, dates or local recommendations? Our concierge team in Torremolinos replies to every message personally.",
            )}
          </p>

          <RevealGroup className="mt-6 flex flex-wrap gap-3">
            {trustPills.map(({ icon: Icon, label }) => (
              <RevealItem
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-600 shadow-card"
              >
                <Icon size={14} className="text-amber-500" />
                {label}
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <MapPin size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">
                  {str(intro, "addressLabel", "Address")}
                </p>
                <p className="mt-1 text-sm text-ink-500">{address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Phone size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">
                  {str(intro, "phoneLabel", "Phone")}
                </p>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="mt-1 block text-sm text-ink-500 hover:text-amber-600"
                >
                  {phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Mail size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">
                  {str(intro, "emailLabel", "Email")}
                </p>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 block text-sm text-ink-500 hover:text-amber-600"
                >
                  {email}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm replyNote={replyNote} />
          </Reveal>
        </div>

        {/* Map */}
        <Reveal delay={0.15} className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink-800">
            {str(mapCms, "heading", "Where we host")}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            {str(
              mapCms,
              "description",
              "Our apartments are spread across Torremolinos, Costa del Sol.",
            )}
          </p>
          <div className="mt-5 h-80 w-full overflow-hidden rounded-2xl shadow-soft">
            <ContactMap properties={properties} />
          </div>
        </Reveal>

        {/* FAQ nudge */}
        <Reveal
          delay={0.2}
          className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-amber-50 p-6 sm:flex-row sm:items-center"
        >
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-ink-800">
              {str(nudge, "heading", "Have a quick question?")}
            </p>
            <p className="mt-1 text-sm text-ink-600">
              {str(
                nudge,
                "text",
                "Check-in times, cancellation policy and more — our FAQ covers the essentials.",
              )}
            </p>
          </div>
          <Link
            href="/#faq"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-800"
          >
            {str(nudge, "buttonLabel", "Read the FAQ")}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
