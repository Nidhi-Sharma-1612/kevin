import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  KeyRound,
  Mail,
  MapPin,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import FaqAccordion from "@/components/FaqAccordion";
import PartnerContactForm, { type PartnerFormText } from "@/components/PartnerContactForm";
import PartnerWhatsAppBar from "@/components/PartnerWhatsAppBar";
import Reveal from "@/components/Reveal";
import { RevealGroup, RevealItem } from "@/components/RevealGroup";
import TestimonialCard from "@/components/TestimonialCard";
import { getSiteSettings } from "@/lib/cms";
import { isUnoptimized } from "@/lib/image-src";
import { getPartnerContent, getPartnerSeo } from "@/lib/partner-cms";
import { PARTNER_ADDRESS, PARTNER_CONTENT } from "@/lib/partner-content";
import {
  PARTNER_PATHS,
  PARTNER_WHATSAPP,
  whatsappLink,
  type PartnerLang,
} from "@/lib/partner-pages";

const FORM_ANCHOR = "partner-form";

export async function partnerMetadata(lang: PartnerLang): Promise<Metadata> {
  const { locale } = PARTNER_CONTENT[lang].meta;
  const { title, description } = await getPartnerSeo(lang);

  // Paths resolve against the root layout's metadataBase (the live site).
  return {
    title,
    description,
    alternates: {
      canonical: PARTNER_PATHS[lang],
      languages: {
        fr: PARTNER_PATHS.fr,
        es: PARTNER_PATHS.es,
        en: PARTNER_PATHS.en,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      url: PARTNER_PATHS[lang],
      images: ["/partners/terraza-vista-mar.jpg"],
    },
  };
}

// Sample week from the client's design: 0 = normal, 1 = busier, 2 = peak.
const CALENDAR = [
  [
    [82, 0],
    [82, 0],
    [85, 0],
    [90, 0],
    [118, 1],
    [124, 1],
    [98, 1],
  ],
  [
    [88, 0],
    [92, 0],
    [96, 1],
    [132, 2],
    [156, 2],
    [184, 2],
    [142, 2],
  ],
] as const;

const CALENDAR_TONES = ["bg-sand-100 text-ink-600", "bg-amber-100 text-ink-800", "bg-amber-400 text-ink-900"];

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-sm font-semibold tracking-[0.2em] uppercase ${
        dark ? "text-amber-300" : "text-cyan-600"
      }`}
    >
      {children}
    </p>
  );
}

function Flag({ lang, id }: { lang: PartnerLang; id: string }) {
  if (lang === "fr") {
    return (
      <svg viewBox="0 0 3 2" width="21" height="14" aria-hidden className="rounded-[2px]">
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#FFFFFF" />
        <rect x="2" width="1" height="2" fill="#ED2939" />
      </svg>
    );
  }
  if (lang === "es") {
    return (
      <svg viewBox="0 0 3 2" width="21" height="14" aria-hidden className="rounded-[2px]">
        <rect width="3" height="2" fill="#AA151B" />
        <rect y="0.5" width="3" height="1" fill="#F1BF00" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 60 30"
      width="21"
      height="14"
      preserveAspectRatio="none"
      aria-hidden
      className="rounded-[2px]"
    >
      <clipPath id={id}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

// `idPrefix` keeps the UK flag's clipPath id unique, since the list is
// rendered twice on the page.
function PhoneList({ lang, idPrefix }: { lang: PartnerLang; idPrefix: string }) {
  const content = PARTNER_CONTENT[lang];
  return (
    <>
      {content.phoneOrder.map((phoneLang) => {
        const phone = PARTNER_WHATSAPP[phoneLang];
        return (
          <a
            key={phoneLang}
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            aria-label={`${content.languageNames[phoneLang]}: ${phone}`}
            className="inline-flex items-center gap-2 font-semibold text-ink-700 transition-colors hover:text-amber-600"
          >
            <Flag lang={phoneLang} id={`${idPrefix}-uk-flag`} />
            {phone}
          </a>
        );
      })}
    </>
  );
}

export default async function PartnerAgenciesPage({ lang }: { lang: PartnerLang }) {
  const [{ content: c, images }, settings] = await Promise.all([
    getPartnerContent(lang),
    getSiteSettings(),
  ]);
  const email = settings?.email || "Contact@laconciergeriedelsol.com";
  const whatsapp = PARTNER_WHATSAPP[lang];

  const offerCards = [
    { icon: Gift, ...c.offer.commission },
    { icon: TrendingUp, ...c.offer.estimate },
    { icon: KeyRound, ...c.offer.sellers },
    { icon: Users, ...c.offer.buyers },
  ];

  const apartCards = [
    { image: images.apart[0], ...c.apart.care },
    { image: images.apart[1], ...c.apart.cleaning },
    { image: images.apart[2], ...c.apart.marketing },
    { image: images.apart[3], ...c.apart.welcome },
    { image: null, imageAlt: "", ...c.apart.pricing },
    { image: images.apart[4], ...c.apart.team },
  ];

  const formText: PartnerFormText = {
    heading: c.form.heading,
    options: c.form.options,
    nameLabel: c.form.nameLabel,
    agencyLabel: c.form.agencyLabel,
    messageLabel: c.form.messageLabel,
    submit: c.form.submit,
    fine: c.form.fine,
  };

  return (
    // The client supplied this copy already translated, so Google Translate
    // (which drives the rest of the site) must leave it alone; the header's
    // language switcher sends visitors to the matching page instead.
    <div lang={lang} translate="no" className="notranslate">
      {/* Hero */}
      <section className="relative overflow-hidden bg-sand-100 py-16 sm:py-20">
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>{c.hero.eyebrow}</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-semibold text-ink-800 sm:text-5xl">
              {c.hero.title}
            </h1>
            <p className="mt-5 text-lg text-ink-600">{c.hero.lead}</p>
            <p className="mt-4 font-medium text-ink-700">{c.hero.lead2}</p>

            <div className="mt-6 flex max-w-xl items-start gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                <Gift size={20} />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-800">{c.hero.commissionTitle}</p>
                <p className="mt-1 text-sm text-ink-500">{c.hero.commissionText}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`#${FORM_ANCHOR}`}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
              >
                {c.hero.talkCta}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <a
                href={whatsappLink(whatsapp, c.hero.referMessage)}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-7 py-3.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-900 hover:text-sand-50"
              >
                {c.hero.referCta}
              </a>
            </div>

            <RevealGroup className="mt-6 flex flex-wrap gap-3">
              {c.hero.proof.map((label, i) => (
                <RevealItem
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-600 shadow-card"
                >
                  {i === 0 ? (
                    <Star size={14} className="text-amber-500" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <KeyRound size={14} className="text-amber-500" />
                  )}
                  {label}
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-tl-[3rem] rounded-tr-2xl rounded-br-[3rem] rounded-bl-2xl shadow-soft lg:max-w-none">
              <Image
                src={images.hero}
                alt={c.hero.imageAlt}
                fill
                priority
                unoptimized={isUnoptimized(images.hero)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why recommend us */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal className="order-last lg:order-first">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl shadow-soft lg:max-w-none">
              <Image
                src={images.why}
                alt={c.why.imageAlt}
                fill
                unoptimized={isUnoptimized(images.why)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>{c.why.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.why.title}
            </h2>
            {c.why.paragraphs.map((p) => (
              <p key={p} className="mt-4 text-ink-500">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {c.why.checklist.map((item) => (
                <li key={item} className="flex items-start gap-3 font-medium text-ink-700">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-2 border-amber-400 pl-4 font-display text-lg font-semibold text-ink-800">
              {c.why.quote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* What the agency gets */}
      <section className="bg-sand-100 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>{c.offer.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.offer.title}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2">
            {offerCards.map(({ icon: Icon, title, text, ...rest }) => (
              <RevealItem key={title} className="rounded-2xl bg-white p-7 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-800">{title}</h3>
                <p className="mt-2 text-ink-500">{text}</p>
                {"bullets" in rest && (
                  <>
                    <ul className="mt-3 space-y-1.5 text-ink-500">
                      {rest.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-block rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                      {rest.tag}
                    </span>
                  </>
                )}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>{c.steps.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.steps.title}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-8 md:grid-cols-3">
            {c.steps.items.map((step, i) => (
              <RevealItem key={step.title}>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-400 font-display text-lg font-semibold text-ink-900 shadow-soft">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-800">{step.title}</h3>
                <p className="mt-2 text-ink-500">{step.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* What sets us apart */}
      <section className="bg-sand-100 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>{c.apart.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.apart.title}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apartCards.map((card) => (
              <RevealItem
                key={card.title}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card"
              >
                {card.image ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      unoptimized={isUnoptimized(card.image)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    role="img"
                    aria-label={c.apart.pricing.ariaLabel}
                    className="flex aspect-[16/10] flex-col justify-center gap-3 border-b border-ink-100 px-5"
                  >
                    <div className="grid grid-cols-7 gap-1.5">
                      {c.apart.pricing.days.map((day, i) => (
                        <span key={i} className="text-center text-[11px] font-semibold text-ink-400">
                          {day}
                        </span>
                      ))}
                      {CALENDAR.flat().map(([price, tone], i) => (
                        <span
                          key={i}
                          className={`rounded-lg py-2.5 text-center text-xs font-semibold ${CALENDAR_TONES[tone]}`}
                        >
                          {price}€
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <i aria-hidden className="h-3 w-3 rounded-sm bg-sand-100" />
                        {c.apart.pricing.normal}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <i aria-hidden className="h-3 w-3 rounded-sm bg-amber-400" />
                        {c.apart.pricing.high}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex-1 p-6">
                  <h3 className="font-display text-lg font-semibold text-ink-800">{card.title}</h3>
                  <p className="mt-2 text-sm text-ink-500">{card.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{c.reviews.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.reviews.title}
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2">
            {c.reviews.items.map((review) => (
              <RevealItem key={review.name}>
                <TestimonialCard quote={review.quote} name={review.name} detail={review.detail} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Reputation band */}
      <section className="bg-ink-900 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-display text-2xl font-semibold text-sand-50 sm:text-3xl">
            {c.reputation.title}
          </h2>
          <a
            href={`#${FORM_ANCHOR}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
          >
            {c.reputation.cta}
          </a>
        </div>
      </section>

      {/* Contact form */}
      <section id={FORM_ANCHOR} className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <Reveal className="text-center">
            <Eyebrow>{c.form.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.form.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-500">{c.form.intro}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <PhoneList lang={lang} idPrefix="form" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <PartnerContactForm lang={lang} text={formText} />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-100 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="text-center">
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {c.faq.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <FaqAccordion faqs={c.faq.items} />
          </Reveal>
        </div>
      </section>

      {/* Closing contact */}
      <section className="py-20 pb-28 md:pb-20">
        <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
            {c.final.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500">{c.final.lead}</p>
          <a
            href={whatsappLink(whatsapp, c.talkMessage)}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
          >
            <MessageCircle size={16} />
            {c.final.cta}
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-ink-100 pt-6 text-sm">
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(c.final.emailSubject)}`}
              className="inline-flex items-center gap-2 font-semibold text-ink-700 transition-colors hover:text-amber-600"
            >
              <Mail size={16} className="text-amber-500" />
              {email}
            </a>
            <PhoneList lang={lang} idPrefix="final" />
          </div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-500">
            <MapPin size={15} className="text-amber-500" />
            {PARTNER_ADDRESS}
          </p>
          <div className="mt-4">
            <a
              href={whatsappLink(whatsapp, c.final.programmeMessage)}
              target="_blank"
              rel="noopener"
              className="text-sm font-semibold text-amber-600 underline underline-offset-4 hover:text-amber-500"
            >
              {c.final.programmeLink}
            </a>
          </div>
        </Reveal>
      </section>

      <PartnerWhatsAppBar lang={lang} label={c.stickyLabel} message={c.talkMessage} />
    </div>
  );
}
