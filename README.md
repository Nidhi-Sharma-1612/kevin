# La Conciergerie Del Sol

A vacation rental marketing site for **La Conciergerie Del Sol**, a concierge-managed
apartment rental business in Torremolinos, Costa del Sol, Spain. Rebuilt from an
existing Lodgify site with a custom design system, a searchable/filterable
properties list with an interactive map, and a property detail page with a
functional (front-end) booking widget.

All property data (listings, photos, amenities, pricing, availability) is
fetched live from the client's real Lodgify account — see
[Data & content](#data--content) below for details and the one thing that's
still generated rather than pulled from Lodgify.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, TypeScript)
- **[Tailwind CSS 4](https://tailwindcss.com)** (CSS-first theme in `app/globals.css`)
- **[Framer Motion](https://www.framer.com/motion/)** — scroll reveals, hero animations, micro-interactions
- **[Lucide React](https://lucide.dev)** — icon set
- **[Leaflet](https://leafletjs.com) / [react-leaflet](https://react-leaflet.js.org)** — property map, with Esri's free World Street Map tiles (no API key required)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

Requires a `.env.local` with `LODGIFY_API_KEY` (and Stripe keys for
checkout) — see `.env.example` for the full list. Without a valid Lodgify
key, every page that lists or shows a property will fail, since there's no
mock-data fallback anymore.

## Project structure

```
app/
  layout.tsx              Root layout — fonts, header/footer, skip link, metadata
  page.tsx                Homepage (hero, welcome, featured stays, amenities,
                           concierge promise, testimonials, FAQ, CTA)
  not-found.tsx            Branded 404
  properties/
    page.tsx               Properties list — split card list + map, search/filter
                            via URL query params
    [slug]/page.tsx         Property detail — gallery, amenities, booking widget,
                            location map, similar properties
  contact/page.tsx         Contact page — form, map, FAQ link

components/                One component per concern (Header, Footer, Hero,
                           SearchBar, LocationPicker, DateRangePicker,
                           BookingWidget, PropertyMap, PropertyCard, etc.)

lib/
  lodgify.ts               Server-only Lodgify API v2 client (properties,
                            rooms, availability, quote, booking creation)
  properties.ts            Builds the site's Property shape from live
                            Lodgify data — the sole source of property data
  pricing.ts               Shared quote logic used by both the price
                            display and the Stripe checkout total
  locations.ts             Neighborhood filter options
  date-utils.ts            Calendar grid, date parsing/formatting for the
                            search → booking-widget flow
```

## Key features

- **Homepage** — animated hero with a search bar (location, dates, guests),
  featured-stays bento grid, amenities, testimonials, FAQ accordion, and a CTA.
- **Search → filtered results → prefilled booking**: submitting the homepage
  search bar navigates to `/properties` with the search encoded in the URL
  (`?location=&checkIn=&checkOut=&guests=`), which filters the list and map.
  Opening a property from a filtered search carries the dates/guests through
  so its booking widget starts prefilled.
- **Properties page** — card list synced with an interactive Leaflet map
  (hover a card to highlight its pin, click a pin to preview the property).
  Below `lg`, list and map are toggled via a bottom List/Map switch instead
  of a split view.
- **Property detail page** — photo hero grid (real multi-photo gallery from
  Lodgify; falls back to a single hero image for any listing with fewer
  than 3 photos), amenities, house rules, cancellation policy, location map
  with "Get directions", similar-properties, and a booking widget. On mobile the
  widget renders inline in the page flow (not just a sidebar), and the
  fixed bottom bar's "Book now" scrolls to it.
- **Responsive** — audited at mobile (375px), tablet portrait/landscape
  (768–1024px), and laptop+ (1280px+) breakpoints.

## Design system

Defined as CSS variables in `app/globals.css` under `@theme`:

- **Amber** — primary brand accent / CTAs (sun-gold, from the client's logo)
- **Cyan** — secondary accent, used sparingly (sea/sky)
- **Ink** — charcoal text and dark sections
- **Sand** — warm cream backgrounds (not stark white)
- **Fraunces** (display/serif headings) + **Inter** (body) via `next/font`

Logo assets (`public/logo.png`, `public/logo-icon.png`, favicons) were
generated from the client's original `public/logo.jpeg` by keying out its
white background, since JPEG can't hold transparency.

## Data & content

**Real, fetched live from Lodgify on every request (cached ~5 min via
Next's fetch cache to stay well under Lodgify's rate limit):**
- The full property list (currently 34 listings), titles, descriptions,
  photos (up to 22 per listing), bedrooms/bathrooms/max occupancy, exact
  lat/lng and address
- Nightly pricing and full price breakdown (including fees like a cleaning
  fee), availability/booked dates, all via `/api/quote` and
  `/api/availability`
- Business contact details (phone, email) — hand-entered, not from Lodgify

**Generated, not pulled from Lodgify:**
- **Amenity icons/tags and neighborhood** (`lib/properties.ts`) — Lodgify's
  structured amenity data reliably covers in-unit items (kitchen
  appliances, entertainment, heating, laundry), but shared-building
  features (pool, beach access, terrace) aren't consistently tagged there,
  so those — plus which of the 4 Torremolinos neighborhoods a listing is
  in — are derived by matching keywords against the listing's real
  name/description, the same way the very first mock version of this data
  was authored, just fed by real text now instead of hand-picked tags.
- **URL slugs** — Lodgify doesn't expose one, so each listing's slug is
  generated from its real name (e.g. "The Lodge - Torre La Roca" →
  `the-lodge-torre-la-roca`).

## Integrations

- **Lodgify** — `lib/lodgify.ts` is a server-only client (never imported
  from a Client Component) that calls Lodgify API v2 using a single API key
  (`LODGIFY_API_KEY`, header `X-ApiKey` — this account has no OAuth
  credentials, matching Lodgify's own authorization docs). `lib/properties.ts`
  builds every page's property data from `/v2/properties` (list) and
  `/v2/properties/{id}/rooms` (photos, amenities, occupancy — the property
  endpoint alone only has summary fields). `/api/availability` and
  `/api/quote` call `/v2/availability/{id}` and `/v2/quote/{id}` for a
  specific listing's real dates/pricing. All of these were verified against
  live responses (2026-09-17) and their param names/response shapes
  corrected from an initial best guess to match reality — e.g. availability
  takes `start`/`end` (not `periodStart`/`periodEnd`) and returns per-day
  periods with an `available` flag rather than a list of booked ranges; the
  quote endpoint takes `arrival`/`departure` plus a `roomTypes[0].Id`
  (`Property.roomTypeId`, a *different* id from the property id) and
  returns fees as named `price_types` line items — a property's own custom
  fee names come through in whatever language the owner set them in (seen
  in French) regardless of the `Accept-Language` header, so exact-string
  fee matching (e.g. "is this the cleaning fee") is best-effort.
  **`createBooking` is still unverified and confirmed broken as written** —
  a live test got `405 Method Not Allowed` on `/v2/reservations/bookings`
  POST, meaning that's not the real booking-creation endpoint. This was
  deliberately not fixed by further trial and error, since a "successful"
  guess against the live account risks creating a real reservation and
  blocking real calendar dates — find the correct endpoint from Lodgify
  support/docs before relying on it. Until then, every post-payment
  `createBooking` call fails safely and guests see "our concierge team will
  follow up by email" on `/booking/success` instead of an instant
  Lodgify-side confirmation.
- **Stripe** — `/api/checkout` creates a hosted Stripe Checkout Session
  (`mode: "payment"`); the server always re-derives the charged total from
  the live Lodgify quote, never trusting a client-supplied amount. Only a
  secret key and publishable key are available for this project (no
  webhook signing secret), so payment confirmation happens by re-fetching
  the Checkout Session server-side when the guest's browser reaches
  `/booking/success?session_id=...`, instead of via webhook. This means a
  booking is only finalized if that redirect actually happens (e.g. not if
  the guest closes the tab mid-payment) — acceptable given the available
  keys, but revisit if a webhook secret becomes available later. **The keys
  currently in `.env.local` are live-mode** (`sk_live_`/`pk_live_`), not
  test-mode — any completed checkout charges a real card.
- **Google Translate** — `components/LanguageSwitcher.tsx` is a fully
  custom-themed EN/FR/ES dropdown (Google's own widget UI is cross-origin
  content that can't be restyled, so it's kept mounted but invisible and
  driven via its `googtrans` cookie instead) shown in the header at every
  breakpoint.
- Real secret values are supplied by the client directly into `.env.local`
  (gitignored); see `.env.example` for the variable names this project
  expects.

## Known limitations / next steps

- **`createBooking` endpoint is wrong** (see above) — the highest-priority
  fix, since it silently no-ops today
- **Stripe webhook** — add one (and verify its signature) if a webhook
  signing secret becomes available, as a more reliable alternative to the
  redirect-based confirmation described above
- **Neighborhood/amenity keyword matching** (see Data & content) is a
  reasonable approximation but not as reliable as a real structured field
  — worth revisiting if Lodgify adds one, or if a listing gets
  miscategorized
- The Lodgify reference site (`laconciergeriedelsol.lodgify.com`) and its
  docs (`docs.lodgify.com`) are behind Cloudflare bot protection, so they
  can only be read by a real person in a browser, not fetched by tooling —
  screenshots or pasted content from the client are the fallback when
  that's needed
