# La Conciergerie Del Sol

A vacation rental marketing site for **La Conciergerie Del Sol**, a concierge-managed
apartment rental business in Torremolinos, Costa del Sol, Spain. Rebuilt from an
existing Lodgify site with a custom design system, a searchable/filterable
properties list with an interactive map, and a property detail page with a
functional (front-end) booking widget.

Live content is currently **mock data** modeled on the client's real listings —
see [Data & content](#data--content) below for what's real vs. placeholder.

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

There's no `.env` — the site doesn't call any external API yet (see
[Data & content](#data--content)).

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
  mock-properties.ts       Property data model + the 26 mock listings
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
- **Property detail page** — photo hero (supports a real multi-photo gallery
  grid once available; falls back to a single hero image otherwise),
  amenities, house rules, cancellation policy, location map with "Get
  directions", similar-properties, and a booking widget. On mobile the
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

**Real:**
- Business contact details (phone, email) in the footer, contact page, CTA
  section, and booking widget
- Property titles, images, and cover-photo captions, pulled from the
  client's real Lodgify listings
- Location (Torremolinos + its neighborhoods) and general business context

**Mocked / generated (pending Lodgify integration):**
- `lib/mock-properties.ts` — bathrooms, descriptions, and amenity lists are
  derived programmatically from each listing's title/tags/neighborhood, not
  hand-authored per property
- Nightly prices, availability/"booked" dates on the calendar, and the
  price breakdown in the booking widget
- Property coordinates (jittered around real neighborhood centers, not
  exact addresses)
- The "Book now" button has no backend — no live availability, payment, or
  reservation system is connected yet

## Known limitations / next steps

- **Lodgify (or another PMS) integration** — replace mock data with real
  listings, live pricing/availability, and an actual booking flow
- **Real photo galleries** — `PropertyHeroGallery` and the properties-list
  cards are built to use multiple real photos per listing once available
- **Language/currency switcher** — the original site had one; this rebuild
  is English/EUR only for now
- The Lodgify reference site (`laconciergeriedelsol.lodgify.com`) is behind
  Cloudflare bot protection, so some content (e.g. full photo galleries,
  the live contact page) couldn't be scraped directly — screenshots or
  pasted content from the client are the fallback when that's needed
