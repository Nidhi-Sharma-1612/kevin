import "server-only";

import {
  expandBookedDates,
  findPolicyInfo,
  getAvailability,
  getPropertyDetail,
  getPropertyRooms,
  isRangeAvailable,
  listProperties,
  type LodgifyPolicyInfo,
  type LodgifyRoom,
} from "@/lib/lodgify";

export type Amenity = {
  label: string;
  icon:
    | "wifi"
    | "wind"
    | "kitchen"
    | "tv"
    | "washer"
    | "car"
    | "waves"
    | "pool"
    | "jacuzzi"
    | "sun"
    | "key"
    | "fridge";
};

export type Property = {
  slug: string;
  lodgifyId: string;
  // Lodgify's quote/availability endpoints operate per "room type" (a
  // sub-resource of the property) rather than the property id itself —
  // every listing on this account has exactly one, so it's the first
  // room's id.
  roomTypeId: string;
  title: string;
  neighborhood: string;
  location: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  currency: string;
  petsAllowed: boolean;
  // Extra owner-set rental-agreement terms — undefined for the (majority
  // of) listings that don't have one configured in Lodgify.
  agreementText?: string;
  image: string;
  images: string[];
  tags: string[];
  // Plain-text description, used for tag/amenity keyword matching.
  description: string;
  // The same description, sanitized but with Lodgify's original formatting
  // (headings, bold, lists) intact — this is what the About section
  // renders, since the plain-text version above loses the structure owners
  // actually wrote (e.g. a dedicated "Guest Access" section with real
  // check-in details).
  descriptionHtml: string;
  amenities: Amenity[];
  lat: number;
  lng: number;
  // Only set when Lodgify reports a plausible sqm figure — some listings
  // default to "1 sqf", which reads as a data error rather than real data,
  // so that placeholder is filtered out rather than shown.
  areaSqm?: number;
  adultsOnly: boolean;
  breakfastIncluded: boolean;
};

// Torremolinos fallback center, used only if a listing is somehow missing
// coordinates from Lodgify (shouldn't happen for a real address, but keeps
// the map from rendering a marker at (0,0) if it ever does).
const FALLBACK_COORDS = { lat: 36.6229, lng: -4.502 };

function detectNeighborhood(haystack: string): string {
  const text = haystack.toLowerCase();
  if (text.includes("santa clara")) return "Santa Clara";
  if (text.includes("nogalera")) return "La Nogalera";
  if (text.includes("torre la roca") || text.includes("la roca")) return "Torre La Roca";
  return "City Centre";
}

function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents (é -> e)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Lodgify listing descriptions are owner-authored rich text (headings,
// bold, lists) — not arbitrary user-generated content — but they still
// come from an external API, so this strips anything that could execute
// script or carry event-handler attributes before the markup is rendered
// with dangerouslySetInnerHTML. It also drops the empty
// "<h2><br></h2>"-style spacer headings Lodgify's editor leaves behind,
// since real margin/spacing is handled by CSS instead.
function sanitizeDescriptionHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/(href|src)=(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/<(h[1-6])(\s[^>]*)?>(\s|<br\s*\/?>)*<\/h[1-6]>/gi, "")
    .trim();
}

// Lodgify's structured amenity taxonomy is only reliably populated for
// in-unit items (kitchen appliances, entertainment, heating, laundry) —
// shared-building features like a communal pool or beach access are
// usually only mentioned in the free-text name/description, not tagged.
// So highlight tags are derived the same way the original mock data was
// authored: keyword matches against the listing's real name + description.
const TAG_RULES: Array<{ test: RegExp; label: string }> = [
  { test: /sea view|bay view/i, label: "Sea view" },
  { test: /beachfront|direct beach access|beach access/i, label: "Beachfront" },
  { test: /\bpool\b/i, label: "Pool" },
  { test: /jacuzzi/i, label: "Jacuzzi" },
  { test: /terrace|balcony/i, label: "Terrace" },
  { test: /\bparking\b/i, label: "Parking" },
  { test: /city cent(er|re)|downtown|central/i, label: "City centre" },
];

function deriveTags(name: string, description: string): string[] {
  const haystack = `${name} ${description}`;
  return TAG_RULES.filter((rule) => rule.test.test(haystack)).map((rule) => rule.label);
}

function hasAmenity(room: LodgifyRoom, category: string, pattern: RegExp): boolean {
  const items = room.amenities?.[category] ?? [];
  return items.some(
    (item) => pattern.test(item.name ?? "") || pattern.test(item.text ?? "")
  );
}

function deriveAmenities(room: LodgifyRoom, tags: string[]): Amenity[] {
  const amenities: Amenity[] = [];
  const hasTag = (needle: string) => tags.some((t) => t.toLowerCase().includes(needle));

  if (room.has_wifi || hasAmenity(room, "entertainment", /internet/i)) {
    amenities.push({ label: "Wifi", icon: "wifi" });
  }
  if (hasAmenity(room, "heating", /airconditioning/i)) {
    amenities.push({ label: "Air conditioning", icon: "wind" });
  }
  if ((room.amenities?.cooking ?? []).length > 0) {
    amenities.push({ label: "Fully-equipped kitchen", icon: "kitchen" });
  }
  if (hasAmenity(room, "entertainment", /\btv\b/i)) {
    amenities.push({ label: "Smart TV", icon: "tv" });
  }
  if (hasAmenity(room, "laundry", /washingmachine/i)) {
    amenities.push({ label: "Washing machine", icon: "washer" });
  }
  if (hasAmenity(room, "cooking", /refrigerator/i)) {
    amenities.push({ label: "Refrigerator", icon: "fridge" });
  }
  if (room.has_parking || hasAmenity(room, "parking", /./)) {
    amenities.push({ label: "Private parking", icon: "car" });
  }
  if (hasTag("pool")) amenities.push({ label: "Swimming pool access", icon: "pool" });
  if (hasTag("jacuzzi")) amenities.push({ label: "Private jacuzzi", icon: "jacuzzi" });
  if (hasTag("beachfront")) amenities.push({ label: "Direct beach access", icon: "waves" });
  if (hasTag("sea view")) amenities.push({ label: "Sea view", icon: "sun" });
  if (hasTag("terrace")) amenities.push({ label: "Private terrace / balcony", icon: "sun" });
  if (hasTag("city centre")) amenities.push({ label: "Self check-in", icon: "key" });

  return amenities;
}

// Lodgify serves images as protocol-relative URLs ("//l.icdbcdn.com/...")
// — next/image needs an absolute URL.
function absoluteImageUrl(url: string): string {
  return url.startsWith("//") ? `https:${url}` : url;
}

async function buildProperty(id: number): Promise<Property | null> {
  const [detail, rooms] = await Promise.all([
    getPropertyDetail(String(id)),
    getPropertyRooms(String(id)),
  ]);

  const room = rooms[0];
  if (!room) return null;

  const title = detail.name.trim();
  const rawDescription = room.description ?? detail.description ?? "";
  const description = stripHtml(rawDescription) || `${title} in Torremolinos.`;
  const descriptionHtml = rawDescription
    ? sanitizeDescriptionHtml(rawDescription)
    : `<p>${description}</p>`;
  const neighborhood = detectNeighborhood(`${title} ${detail.address ?? ""}`);
  const tags = deriveTags(title, description);
  const areaSqm =
    room.area_unit === "sqm" && room.area && room.area > 1 ? room.area : undefined;

  const images = (room.images ?? [])
    .map((img) => absoluteImageUrl(img.url))
    .filter(Boolean);

  return {
    slug: slugify(title),
    lodgifyId: String(id),
    roomTypeId: String(room.id),
    title,
    neighborhood,
    location:
      neighborhood === "City Centre"
        ? "Torremolinos Centre"
        : `${neighborhood}, Torremolinos`,
    guests: room.max_people ?? 2,
    bedrooms: room.bedrooms ?? 0,
    bathrooms: room.bathrooms ?? 1,
    pricePerNight: room.min_price ?? detail.min_price ?? 0,
    currency: detail.currency_code ?? "EUR",
    petsAllowed: room.pets_allowed ?? false,
    agreementText:
      detail.has_agreement && detail.agreement_text
        ? stripHtml(detail.agreement_text) || undefined
        : undefined,
    image: images[0] ?? "",
    images: images.length > 0 ? images : [""],
    tags,
    description,
    descriptionHtml,
    amenities: deriveAmenities(room, tags),
    lat: detail.latitude ?? FALLBACK_COORDS.lat,
    lng: detail.longitude ?? FALLBACK_COORDS.lng,
    areaSqm,
    adultsOnly: room.adults_only ?? false,
    breakfastIncluded: room.breakfast_included ?? false,
  };
}

export async function getAllProperties(): Promise<Property[]> {
  const summaries = await listProperties();
  const built = await Promise.all(summaries.map((p) => buildProperty(p.id)));
  return built.filter((p): p is Property => p !== null);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const summaries = await listProperties();
  const match = summaries.find((p) => slugify(p.name) === slug);
  if (!match) return null;
  return buildProperty(match.id);
}

// Narrows a property list down to whatever is actually free for the given
// stay — used by the properties list page so a searched date range filters
// results instead of just labeling them. Runs one live availability check
// per property in parallel; if an individual check fails (rate limit,
// transient network error), that property is kept rather than silently
// dropped, since a listing shouldn't disappear from search just because its
// own availability lookup happened to error.
export async function filterAvailableProperties(
  properties: Property[],
  checkIn: string,
  checkOut: string
): Promise<Property[]> {
  const results = await Promise.all(
    properties.map(async (property) => {
      try {
        const available = await isRangeAvailable(property.lodgifyId, checkIn, checkOut);
        return available ? property : null;
      } catch {
        return property;
      }
    })
  );
  return results.filter((p): p is Property => p !== null);
}

// A date is "booked for a location" only when every property in that
// neighborhood is booked that day — if even one is free, the location still
// has something to offer, so it isn't shown as unavailable. Used by the
// homepage search widget once a location is picked, so its calendar can
// show real availability for that neighborhood before a specific property
// is even chosen.
export async function getNeighborhoodBookedDates(
  neighborhood: string | null,
  from: string,
  to: string
): Promise<Set<string>> {
  const properties = await getAllProperties();
  const scoped = neighborhood
    ? properties.filter((p) => p.neighborhood === neighborhood)
    : properties;
  if (scoped.length === 0) return new Set();

  const perPropertyBooked = await Promise.all(
    scoped.map(async (property) => {
      try {
        const periods = await getAvailability(property.lodgifyId, from, to);
        return expandBookedDates(periods);
      } catch {
        // A property whose own availability check failed contributes an
        // empty set — it can never cause a date to look booked for the
        // whole location, only ever fail to confirm one. Fails open, not
        // closed: better to under-report a fully-booked date than to hide
        // real availability elsewhere in the neighborhood over one glitch.
        return new Set<string>();
      }
    })
  );

  const [first, ...rest] = perPropertyBooked;
  const intersection = new Set(first);
  for (const dates of rest) {
    for (const date of intersection) {
      if (!dates.has(date)) intersection.delete(date);
    }
  }
  return intersection;
}

// Real cancellation/security-deposit policy text, fetched separately from
// the rest of a property's data (see findPolicyInfo) since it requires an
// extra availability + quote round trip — only called from the detail
// page, never from getAllProperties, so the list page stays fast.
export async function getPropertyPolicy(
  property: Property
): Promise<LodgifyPolicyInfo | null> {
  return findPolicyInfo(property.lodgifyId, property.roomTypeId);
}
