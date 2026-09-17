import "server-only";

import { fromISODate, toISODate } from "@/lib/date-utils";

const LODGIFY_BASE_URL = "https://api.lodgify.com/v2";

// Lodgify's error responses are JSON with a human-readable `message` (e.g.
// "The minimum stay for this rental is 3 days", "The house is already
// booked on these dates") and a numeric `code`. That message is a real,
// user-actionable business rule — not an implementation detail — so it's
// kept distinct from an opaque network/server failure and surfaced by
// callers (see app/api/quote, app/api/checkout) instead of being flattened
// into a generic "something went wrong".
export class LodgifyRequestError extends Error {
  status: number;
  lodgifyCode?: number;

  constructor(status: number, message: string, lodgifyCode?: number) {
    super(message);
    this.name = "LodgifyRequestError";
    this.status = status;
    this.lodgifyCode = lodgifyCode;
  }
}

function apiKey(): string {
  const key = process.env.LODGIFY_API_KEY;
  if (!key) throw new Error("LODGIFY_API_KEY is not set");
  return key;
}

async function throwForResponse(res: Response, path: string): Promise<never> {
  const body = await res.text().catch(() => "");
  if (body) {
    try {
      const parsed = JSON.parse(body) as { message?: string; code?: number };
      if (typeof parsed.message === "string") {
        throw new LodgifyRequestError(res.status, parsed.message, parsed.code);
      }
    } catch (err) {
      if (err instanceof LodgifyRequestError) throw err;
      // Body wasn't JSON (or had no `message`) — fall through to the
      // generic message below.
    }
  }
  throw new LodgifyRequestError(
    res.status,
    `Lodgify request failed (${res.status}): ${path}${body ? ` — ${body}` : ""}`
  );
}

// Property/room data (name, photos, amenities) changes rarely, so those
// calls are cached for a while via Next's fetch cache — both to keep the
// properties list/detail pages fast and to stay well under Lodgify's rate
// limit (750 req/min on v2) when the list page fans out to ~2 requests per
// listing. Availability and pricing must stay live, so those callers omit
// `revalidateSeconds` to fall back to "no-store".
async function lodgifyFetch<T>(
  path: string,
  options?: { revalidateSeconds?: number }
): Promise<T> {
  const res = await fetch(`${LODGIFY_BASE_URL}${path}`, {
    headers: {
      "X-ApiKey": apiKey(),
      // Lodgify defaults to English when this is omitted, but setting it
      // explicitly avoids depending on that default (their docs list
      // en/de/es/it as supported).
      "Accept-Language": "en",
    },
    ...(options?.revalidateSeconds !== undefined
      ? { next: { revalidate: options.revalidateSeconds } }
      : { cache: "no-store" }),
  });
  if (!res.ok) {
    await throwForResponse(res, path);
  }
  return res.json() as Promise<T>;
}

// How long property/room responses are cached before Next re-fetches them.
const CATALOG_REVALIDATE_SECONDS = 300;

export type LodgifyBookedPeriod = {
  start: string;
  end: string;
};

export type LodgifyPropertySummary = {
  id: number;
  name: string;
};

// Lists every property on the account, paginating until a page comes back
// short. In practice this account has 34 listings (one page), but this
// loops rather than assuming that stays true.
export async function listProperties(): Promise<LodgifyPropertySummary[]> {
  const all: LodgifyPropertySummary[] = [];
  const pageSize = 50;
  for (let page = 1; page <= 20; page++) {
    const data = await lodgifyFetch<{ items?: LodgifyPropertySummary[] }>(
      `/properties?page=${page}&size=${pageSize}`,
      { revalidateSeconds: CATALOG_REVALIDATE_SECONDS }
    );
    const items = data.items ?? [];
    all.push(...items);
    if (items.length < pageSize) break;
  }
  return all;
}

export type LodgifyPropertyDetail = {
  id: number;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  currency_code?: string;
  min_price?: number;
  // Extra rental-agreement terms the owner set for this specific listing.
  // Confirmed sparse on this account — sampling 8 properties live found
  // only 1 with has_agreement true and real text; the rest had both
  // has_agreement false and agreement_text null together.
  has_agreement?: boolean;
  agreement_text?: string;
};

export async function getPropertyDetail(
  lodgifyId: string
): Promise<LodgifyPropertyDetail> {
  return lodgifyFetch(`/properties/${lodgifyId}`, {
    revalidateSeconds: CATALOG_REVALIDATE_SECONDS,
  });
}

export type LodgifyAmenityItem = {
  name?: string;
  text?: string;
};

export type LodgifyRoom = {
  id: number;
  name: string;
  description?: string;
  images?: Array<{ url: string; text?: string }>;
  amenities?: Record<string, LodgifyAmenityItem[]>;
  bedrooms?: number;
  bathrooms?: number;
  max_people?: number;
  min_price?: number;
  max_price?: number;
  has_wifi?: boolean;
  has_parking?: boolean;
  pets_allowed?: boolean;
  adults_only?: boolean;
  breakfast_included?: boolean;
  area?: number;
  area_unit?: string;
};

// A "property" on Lodgify has one or more "rooms" (room types) — for this
// account every listing has exactly one, which is where the real photos,
// amenities and occupancy data actually live (the property endpoint above
// only has the summary fields).
export async function getPropertyRooms(
  lodgifyId: string
): Promise<LodgifyRoom[]> {
  return lodgifyFetch(`/properties/${lodgifyId}/rooms`, {
    revalidateSeconds: CATALOG_REVALIDATE_SECONDS,
  });
}

type LodgifyAvailabilityPeriod = {
  start: string;
  end: string;
  available: number;
};

type LodgifyRoomTypeAvailability = {
  room_type_id: number;
  periods?: LodgifyAvailabilityPeriod[];
};

// Returns the date ranges that are already booked for this property between
// `from` and `to` (both YYYY-MM-DD). The real endpoint takes `start`/`end`
// query params (not `periodStart`/`periodEnd`, despite what a first guess
// at the naming might suggest) and returns one entry per room type, each
// with periods spanning the *entire* requested range — both open and
// booked — distinguished by `available` (0 = booked/blocked, >0 = free).
// This account has exactly one room type per property, so the first entry
// is used.
export async function getAvailability(
  lodgifyId: string,
  from: string,
  to: string
): Promise<LodgifyBookedPeriod[]> {
  const data = await lodgifyFetch<LodgifyRoomTypeAvailability[]>(
    `/availability/${lodgifyId}?start=${from}&end=${to}`
  );
  const periods = data[0]?.periods ?? [];
  return periods
    .filter((period) => period.available < 1)
    .map((period) => ({ start: period.start, end: period.end }));
}

// Turns Lodgify's booked *periods* (start/end ranges) into the flat set of
// individual YYYY-MM-DD strings they cover — what both the calendar UI and
// the location-level aggregate (see lib/properties.ts) actually need.
export function expandBookedDates(periods: LodgifyBookedPeriod[]): Set<string> {
  const dates = new Set<string>();
  for (const period of periods) {
    const start = fromISODate(period.start);
    const end = fromISODate(period.end);
    if (!start || !end) continue;
    for (
      let d = new Date(start);
      d.getTime() <= end.getTime();
      d.setDate(d.getDate() + 1)
    ) {
      dates.add(toISODate(d));
    }
  }
  return dates;
}

// Whether this property has zero booked nights within [from, to) — used to
// filter the properties list page down to what's actually bookable for a
// searched date range, rather than just decorating the results with a date
// chip that didn't actually filter anything.
export async function isRangeAvailable(
  lodgifyId: string,
  from: string,
  to: string
): Promise<boolean> {
  const booked = await getAvailability(lodgifyId, from, to);
  return booked.length === 0;
}

export type LodgifyFeeLine = {
  label: string;
  amount: number;
};

export type LodgifyQuote = {
  total: number;
  currency: string;
  cleaningFee?: number;
  fees: LodgifyFeeLine[];
  cancellationPolicy?: string;
  securityDeposit?: string;
};

// Confirmed against a live quote response (property 626946, 2026-09-17):
// the endpoint returns an array with one entry, whose `room_types[].
// price_types[]` breaks the stay into typed groups — "Room rate" (type 0),
// "Promotion" (1), "Fees" (2), "Taxes" (4) — each with named `prices[]`
// line items. Fee names are whatever the property owner configured (seen
// in French — "Frais de ménage" — even with Accept-Language: en), so
// matching for "the cleaning fee" specifically is best-effort; all fees are
// shown generically regardless. `cancellation_policy_text` and
// `security_deposit_text` are plain-English policy sentences (e.g. "All
// paid prepayments are non-refundable.") and were confirmed stable across
// two different (available) date ranges on the same property — they read
// as a property-level policy setting, not something that varies by stay.
type LodgifyQuoteResponse = Array<{
  total_including_vat?: number;
  currency_code?: string;
  cancellation_policy_text?: string;
  security_deposit_text?: string;
  room_types?: Array<{
    price_types?: Array<{
      type?: number;
      description?: string;
      prices?: Array<{ description?: string; amount?: number }>;
    }>;
  }>;
}>;

const FEES_PRICE_TYPE = 2;

export async function getQuote(
  lodgifyId: string,
  roomTypeId: string,
  from: string,
  to: string,
  guests: number
): Promise<LodgifyQuote> {
  const data = await lodgifyFetch<LodgifyQuoteResponse>(
    `/quote/${lodgifyId}?arrival=${from}&departure=${to}&roomTypes[0].Id=${roomTypeId}&roomTypes[0].guestBreakdown.adults=${guests}`
  );
  const quote = data[0];

  const feePriceTypes = (quote?.room_types ?? []).flatMap(
    (roomType) =>
      roomType.price_types?.filter((pt) => pt.type === FEES_PRICE_TYPE) ?? []
  );
  const fees: LodgifyFeeLine[] = feePriceTypes
    .flatMap((pt) => pt.prices ?? [])
    .map((price) =>
      price.description && typeof price.amount === "number"
        ? { label: price.description.trim(), amount: price.amount }
        : null
    )
    .filter((line): line is LodgifyFeeLine => line !== null);

  const cleaningFee = fees.find((line) => /clean|ménage|menage/i.test(line.label))?.amount;

  return {
    total: quote?.total_including_vat ?? 0,
    currency: quote?.currency_code ?? "EUR",
    cleaningFee,
    fees,
    cancellationPolicy: quote?.cancellation_policy_text,
    securityDeposit: quote?.security_deposit_text,
  };
}

export type LodgifyPolicyInfo = {
  cancellationPolicy?: string;
  securityDeposit?: string;
};

// The quote endpoint errors outright ("The house is already booked on
// these dates") rather than returning policy text for unavailable dates,
// so getting the policy sentences means first finding *some* genuinely
// open 2-night window and quoting that — the policy text itself doesn't
// depend on which dates are used (see LodgifyQuoteResponse comment above).
// Returns null if no open window is found in the horizon, or if the quote
// call fails for any other reason (never blocks rendering the page).
export async function findPolicyInfo(
  lodgifyId: string,
  roomTypeId: string,
  horizonDays = 180
): Promise<LodgifyPolicyInfo | null> {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const to = new Date(today.getTime() + horizonDays * 86400000)
    .toISOString()
    .slice(0, 10);

  let booked: LodgifyBookedPeriod[];
  try {
    booked = await getAvailability(lodgifyId, from, to);
  } catch {
    return null;
  }

  const bookedDates = new Set<string>();
  for (const period of booked) {
    for (
      let d = new Date(period.start);
      d.getTime() <= new Date(period.end).getTime();
      d.setDate(d.getDate() + 1)
    ) {
      bookedDates.add(d.toISOString().slice(0, 10));
    }
  }

  let arrival: string | null = null;
  for (let i = 1; i < horizonDays - 1; i++) {
    const day1 = new Date(today.getTime() + i * 86400000);
    const day2 = new Date(today.getTime() + (i + 1) * 86400000);
    const iso1 = day1.toISOString().slice(0, 10);
    const iso2 = day2.toISOString().slice(0, 10);
    if (!bookedDates.has(iso1) && !bookedDates.has(iso2)) {
      arrival = iso1;
      break;
    }
  }
  if (!arrival) return null;

  const departure = new Date(
    new Date(arrival).getTime() + 2 * 86400000
  )
    .toISOString()
    .slice(0, 10);

  try {
    const quote = await getQuote(lodgifyId, roomTypeId, arrival, departure, 1);
    return {
      cancellationPolicy: quote.cancellationPolicy,
      securityDeposit: quote.securityDeposit,
    };
  } catch {
    return null;
  }
}

export type LodgifyBookingRequest = {
  lodgifyId: string;
  from: string;
  to: string;
  guests: number;
  guestName: string;
  guestEmail: string;
};

// STILL UNVERIFIED — confirmed broken, not just unconfirmed: a live test
// (2026-09-17) got 405 Method Not Allowed with `allow: GET` on this exact
// path, meaning /v2/reservations/bookings is read-only and this is not the
// real booking-creation endpoint. The correct endpoint/payload shape has
// deliberately not been guessed further by trial and error, since a
// "successful" POST against the live account could create a real
// reservation and block real calendar dates. Until this is fixed, every
// call below will throw and the booking/success page's existing fallback
// (`bookingHandedToLodgify = false`, "concierge team will follow up by
// email") is what guests actually see — find the right endpoint from
// Lodgify's docs/support before relying on this.
export async function createBooking(request: LodgifyBookingRequest) {
  const res = await fetch(`${LODGIFY_BASE_URL}/reservations/bookings`, {
    method: "POST",
    headers: {
      "X-ApiKey": apiKey(),
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
    body: JSON.stringify({
      property_id: request.lodgifyId,
      arrival: request.from,
      departure: request.to,
      guest_breakdown: { adults: request.guests },
      guest: { name: request.guestName, email: request.guestEmail },
    }),
  });
  if (!res.ok) {
    throw new Error(`Lodgify booking creation failed (${res.status})`);
  }
  return res.json();
}
