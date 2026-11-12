import "server-only";

import { getPageSections, imageSlots, objList, str, strList } from "@/lib/cms";
import { PARTNER_CONTENT, type PartnerContent } from "@/lib/partner-content";
import type { PartnerLang } from "@/lib/partner-pages";

// Each language is its own admin-panel page (partners-fr / -es / -en), with
// the same section and field keys. Every field falls back to the built-in
// copy in partner-content.ts when it's blank, missing, or (for lists paired
// with fixed icons/positions) has the wrong number of items.
export function partnerPageSlug(lang: PartnerLang): string {
  return `partners-${lang}`;
}

export type PartnerImages = {
  hero: string;
  why: string;
  // Cards 1–4 and 6 of "what sets us apart"; card 5 is the pricing calendar.
  apart: string[];
};

const DEFAULT_IMAGES: PartnerImages = {
  hero: "/partners/terraza-vista-mar.jpg",
  why: "/partners/salon-vista-mar.jpg",
  apart: [
    "/partners/capteur-bruit.jpg",
    "/partners/menage-chambre.jpg",
    "/partners/jacuzzi-terrasse.jpg",
    "/partners/cadeau-bienvenue.jpg",
    "/partners/bureau-torremolinos.jpg",
  ],
};

export async function getPartnerSeo(lang: PartnerLang) {
  const seo = (await getPageSections(partnerPageSlug(lang))).seo ?? {};
  const { meta } = PARTNER_CONTENT[lang];
  return {
    title: str(seo, "title", meta.title),
    description: str(seo, "description", meta.description),
  };
}

export async function getPartnerContent(
  lang: PartnerLang,
): Promise<{ content: PartnerContent; images: PartnerImages }> {
  const d = PARTNER_CONTENT[lang];
  const s = await getPageSections(partnerPageSlug(lang));
  const hero = s.hero ?? {};
  const why = s.why ?? {};
  const offer = s.offer ?? {};
  const steps = s.steps ?? {};
  const apart = s.apart ?? {};
  const reviews = s.reviews ?? {};
  const reputation = s.reputation ?? {};
  const form = s.form ?? {};
  const faq = s.faq ?? {};
  const final = s.final ?? {};
  const whatsapp = s.whatsapp ?? {};

  const offerCards = objList(
    offer,
    "cards",
    ["title", "text"],
    [d.offer.commission, d.offer.estimate, d.offer.sellers, d.offer.buyers],
    4,
  );
  const apartDefaults = [
    d.apart.care,
    d.apart.cleaning,
    d.apart.marketing,
    d.apart.welcome,
    d.apart.pricing,
    d.apart.team,
  ];
  const apartCards = objList(apart, "cards", ["title", "text"], apartDefaults, 6);
  const formOptions = objList(
    form,
    "options",
    ["label", "message"],
    d.form.options.map(({ label, value }) => ({ label, message: value })),
    4,
  );

  const content: PartnerContent = {
    ...d,
    meta: { ...d.meta, ...(await getPartnerSeo(lang)) },
    hero: {
      ...d.hero,
      eyebrow: str(hero, "eyebrow", d.hero.eyebrow),
      title: str(hero, "title", d.hero.title),
      lead: str(hero, "lead", d.hero.lead),
      lead2: str(hero, "lead2", d.hero.lead2),
      commissionTitle: str(hero, "commissionTitle", d.hero.commissionTitle),
      commissionText: str(hero, "commissionText", d.hero.commissionText),
      talkCta: str(hero, "talkCta", d.hero.talkCta),
      referCta: str(hero, "referCta", d.hero.referCta),
      referMessage: str(hero, "referMessage", d.hero.referMessage),
      proof: strList(hero, "proof", d.hero.proof, 2) as [string, string],
    },
    why: {
      ...d.why,
      eyebrow: str(why, "eyebrow", d.why.eyebrow),
      title: str(why, "title", d.why.title),
      paragraphs: strList(why, "paragraphs", d.why.paragraphs),
      checklist: strList(why, "checklist", d.why.checklist, 4),
      quote: str(why, "quote", d.why.quote),
    },
    offer: {
      eyebrow: str(offer, "eyebrow", d.offer.eyebrow),
      title: str(offer, "title", d.offer.title),
      commission: offerCards[0],
      estimate: {
        ...offerCards[1],
        bullets: strList(offer, "estimateBullets", d.offer.estimate.bullets, 3),
        tag: str(offer, "estimateTag", d.offer.estimate.tag),
      },
      sellers: offerCards[2],
      buyers: offerCards[3],
    },
    steps: {
      eyebrow: str(steps, "eyebrow", d.steps.eyebrow),
      title: str(steps, "title", d.steps.title),
      items: objList(steps, "items", ["title", "text"], d.steps.items, 3),
    },
    apart: {
      eyebrow: str(apart, "eyebrow", d.apart.eyebrow),
      title: str(apart, "title", d.apart.title),
      care: { ...d.apart.care, ...apartCards[0] },
      cleaning: { ...d.apart.cleaning, ...apartCards[1] },
      marketing: { ...d.apart.marketing, ...apartCards[2] },
      welcome: { ...d.apart.welcome, ...apartCards[3] },
      pricing: {
        ...d.apart.pricing,
        ...apartCards[4],
        normal: str(apart, "pricingNormal", d.apart.pricing.normal),
        high: str(apart, "pricingHigh", d.apart.pricing.high),
      },
      team: { ...d.apart.team, ...apartCards[5] },
    },
    reviews: {
      eyebrow: str(reviews, "eyebrow", d.reviews.eyebrow),
      title: str(reviews, "title", d.reviews.title),
      items: objList(reviews, "items", ["quote", "name", "detail"], d.reviews.items),
    },
    reputation: {
      title: str(reputation, "title", d.reputation.title),
      cta: str(reputation, "cta", d.reputation.cta),
    },
    form: {
      ...d.form,
      eyebrow: str(form, "eyebrow", d.form.eyebrow),
      title: str(form, "title", d.form.title),
      intro: str(form, "intro", d.form.intro),
      heading: str(form, "heading", d.form.heading),
      options: formOptions.map(({ label, message }) => ({ label, value: message })),
      nameLabel: str(form, "nameLabel", d.form.nameLabel),
      agencyLabel: str(form, "agencyLabel", d.form.agencyLabel),
      messageLabel: str(form, "messageLabel", d.form.messageLabel),
      submit: str(form, "submit", d.form.submit),
      fine: str(form, "fine", d.form.fine),
    },
    faq: {
      eyebrow: str(faq, "eyebrow", d.faq.eyebrow),
      title: str(faq, "title", d.faq.title),
      items: objList(faq, "items", ["question", "answer"], d.faq.items),
    },
    final: {
      title: str(final, "title", d.final.title),
      lead: str(final, "lead", d.final.lead),
      cta: str(final, "cta", d.final.cta),
      programmeLink: str(final, "programmeLink", d.final.programmeLink),
      programmeMessage: str(final, "programmeMessage", d.final.programmeMessage),
      emailSubject: str(final, "emailSubject", d.final.emailSubject),
    },
    talkMessage: str(whatsapp, "talkMessage", d.talkMessage),
    stickyLabel: str(whatsapp, "stickyLabel", d.stickyLabel),
  };

  const images: PartnerImages = {
    hero: str(hero, "image", DEFAULT_IMAGES.hero),
    why: str(why, "image", DEFAULT_IMAGES.why),
    apart: imageSlots(apart, "image", DEFAULT_IMAGES.apart, 5),
  };

  return { content, images };
}
