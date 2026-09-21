import "server-only";

import { cache } from "react";

// Fetches editable marketing copy (hero text, FAQs, settings, etc.) from the
// Design by Dial admin panel. Every call has a hardcoded fallback in the
// calling component, so the live site keeps working even if the admin panel
// or its database is unreachable.
//
// Deliberately uncached across requests (`cache: "no-store"`): this is a
// low-traffic marketing site, so a fresh request per page load is cheap, and
// it means an edit in the admin panel shows up on the very next page load
// with zero cache-invalidation complexity. `cache()` below only de-duplicates
// identical calls *within* one render (e.g. the layout and a page both
// reading the same settings).
const CMS_URL = process.env.ADMIN_PANEL_API_URL;
const CMS_API_KEY = process.env.ADMIN_PANEL_API_KEY;
const CMS_SITE_SLUG = "kevin";

const cmsFetch = cache(async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!CMS_URL || !CMS_API_KEY) return null;

  try {
    const res = await fetch(`${CMS_URL}/api/public/${CMS_SITE_SLUG}${path}`, {
      headers: { "x-api-key": CMS_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
});

export type Section = Record<string, unknown>;

export async function getPageSections(pageSlug: string): Promise<Record<string, Section>> {
  const data = await cmsFetch<{ sections: Record<string, Section> }>(`/pages/${pageSlug}`);
  return data?.sections ?? {};
}

export async function getCmsFaqs(): Promise<{ question: string; answer: string }[] | null> {
  const data = await cmsFetch<{ faqs: { question: string; answer: string }[] }>("/faqs");
  return data?.faqs?.length ? data.faqs : null;
}

export type CmsSettings = {
  siteName?: string;
  logoUrl?: string | null;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  responseTimeNote?: string;
  footerTagline?: string;
  copyrightName?: string;
  socialLinks?: Record<string, string>;
};

export async function getSiteSettings(): Promise<CmsSettings | null> {
  const data = await cmsFetch<{ settings: CmsSettings | null }>("/settings");
  return data?.settings ?? null;
}

// A single string field off a section's content, or the fallback when it is
// missing/blank.
export function str(section: Section, key: string, fallback: string): string {
  const value = section[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

// A list of strings (nav labels, chips, paragraphs…). When `exactLength` is
// set the CMS list is only used if it has that many entries — for lists whose
// items are paired with fixed icons or links in code, so a stray added or
// deleted row can never shift a label onto the wrong icon.
export function strList(
  section: Section,
  key: string,
  fallback: string[],
  exactLength?: number,
): string[] {
  const value = section[key];
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((v) => typeof v === "string" && v.trim())
  ) {
    return fallback;
  }
  if (exactLength !== undefined && value.length !== exactLength) return fallback;
  return value as string[];
}

// A list of flat objects (FAQ-style cards, testimonials…). Items missing any
// of `fields` are dropped; same `exactLength` rule as strList.
export function objList<K extends string>(
  section: Section,
  key: string,
  fields: readonly K[],
  fallback: Record<K, string>[],
  exactLength?: number,
): Record<K, string>[] {
  const value = section[key];
  if (!Array.isArray(value)) return fallback;
  const items = value.filter(
    (item): item is Record<K, string> =>
      !!item &&
      typeof item === "object" &&
      fields.every((f) => typeof (item as Record<string, unknown>)[f] === "string"),
  );
  if (items.length === 0) return fallback;
  if (exactLength !== undefined && items.length !== exactLength) return fallback;
  return items;
}

// Image "slots" stored as `${prefix}1`, `${prefix}2`, … (the admin's image
// picker edits one URL per field). Each empty slot falls back to the
// automatically chosen photo at the same position, so clearing a slot in the
// admin restores the default instead of leaving a hole.
export function imageSlots(
  section: Section,
  prefix: string,
  fallback: string[],
  count: number,
): string[] {
  const out: string[] = [];
  for (let i = 1; i <= count; i++) {
    const cms = str(section, `${prefix}${i}`, "");
    const src = cms || fallback[i - 1] || "";
    if (src) out.push(src);
  }
  return out;
}
