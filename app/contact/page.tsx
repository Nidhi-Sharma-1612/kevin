import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import ContactMap from "@/components/ContactMap";
import Reveal from "@/components/Reveal";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import { getAllProperties } from "@/lib/properties";

export default async function ContactPage() {
  const properties = await getAllProperties();

  const trustPills = [
    { icon: Clock, label: "Replies within a few hours" },
    { icon: ShieldCheck, label: "Local Torremolinos team" },
    { icon: MessageCircle, label: `${properties.length}+ apartments managed` },
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
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink-800">
            We&apos;re here to help plan your stay
          </h1>
          <p className="mt-4 text-ink-500">
            Questions about a property, dates or local recommendations? Our
            concierge team in Torremolinos replies to every message
            personally.
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
                  Address
                </p>
                <p className="mt-1 text-sm text-ink-500">
                  Torremolinos, Costa del Sol, Spain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Phone size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">
                  Phone
                </p>
                <a
                  href="tel:+34635861443"
                  className="mt-1 block text-sm text-ink-500 hover:text-amber-600"
                >
                  +34 635 861 443
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Mail size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">
                  Email
                </p>
                <a
                  href="mailto:Contact@laconciergeriedelsol.com"
                  className="mt-1 block text-sm text-ink-500 hover:text-amber-600"
                >
                  Contact@laconciergeriedelsol.com
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="space-y-4 rounded-2xl bg-white p-6 shadow-card sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-ink-500">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-500">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-ink-500">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
                    placeholder="+34 ..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink-500">
                    Dates of stay (optional)
                  </label>
                  <input
                    type="text"
                    className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
                    placeholder="e.g. 12–19 July"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-500">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
                  placeholder="Tell us about your trip..."
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300 sm:w-auto"
              >
                <Send size={15} /> Send message
              </button>
              <p className="text-xs text-ink-400">
                We typically reply within a few hours.
              </p>
            </form>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal delay={0.15} className="mt-16">
          <h2 className="font-display text-xl font-semibold text-ink-800">
            Where we host
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            Our apartments are spread across Torremolinos, Costa del Sol.
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
              Have a quick question?
            </p>
            <p className="mt-1 text-sm text-ink-600">
              Check-in times, cancellation policy and more — our FAQ covers
              the essentials.
            </p>
          </div>
          <Link
            href="/#faq"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-800"
          >
            Read the FAQ
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
