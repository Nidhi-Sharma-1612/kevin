import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Bath,
  BedDouble,
  Car,
  CigaretteOff,
  Clock,
  ExternalLink,
  Key,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageCircleHeart,
  Refrigerator,
  ShieldCheck,
  Sun,
  Tv,
  Users,
  UtensilsCrossed,
  Waves,
  WashingMachine,
  Wifi,
  Wind,
} from "lucide-react";
import BookingWidget from "@/components/BookingWidget";
import MobileBookNowBar from "@/components/MobileBookNowBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyHeroGallery from "@/components/PropertyHeroGallery";
import PropertyLocationMap from "@/components/PropertyLocationMap";
import { properties, type Amenity } from "@/lib/mock-properties";
import { fromISODate } from "@/lib/date-utils";

const AMENITY_ICONS: Record<Amenity["icon"], typeof Wifi> = {
  wifi: Wifi,
  wind: Wind,
  kitchen: UtensilsCrossed,
  tv: Tv,
  washer: WashingMachine,
  car: Car,
  waves: Waves,
  pool: Waves,
  jacuzzi: Bath,
  sun: Sun,
  key: Key,
  fridge: Refrigerator,
};

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const property = properties.find((p) => p.slug === slug);

  if (!property) notFound();

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const initialCheckIn = fromISODate(asString(search.checkIn));
  const initialCheckOut = fromISODate(asString(search.checkOut));
  const guestsParam = asString(search.guests);
  const initialGuests = guestsParam ? Number.parseInt(guestsParam, 10) : 1;

  const sameNeighborhood = properties.filter(
    (p) => p.slug !== property.slug && p.neighborhood === property.neighborhood
  );
  const similar = (
    sameNeighborhood.length >= 3
      ? sameNeighborhood
      : properties.filter((p) => p.slug !== property.slug)
  ).slice(0, 3);

  return (
    <div className="pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-amber-600"
        >
          <ArrowLeft size={15} /> Back to all properties
        </Link>
      </div>

      <div className="mx-auto mt-4 max-w-7xl px-5 sm:px-8">
        <PropertyHeroGallery images={[property.image]} alt={property.title} />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-500">
              <MapPin size={16} className="text-amber-500" />
              {property.location}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-ink-100 py-4 text-sm text-ink-700">
              <span className="flex items-center gap-2">
                <Users size={16} className="text-amber-500" />
                {property.guests} {property.guests === 1 ? "Guest" : "Guests"}
              </span>
              <span className="flex items-center gap-2">
                <BedDouble size={16} className="text-amber-500" />
                {property.bedrooms === 0
                  ? "Studio"
                  : `${property.bedrooms} ${property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}`}
              </span>
              <span className="flex items-center gap-2">
                <Bath size={16} className="text-amber-500" />
                {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>

            {/* About */}
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold text-ink-800">
                About this apartment
              </h2>
              <p className="mt-3 leading-relaxed text-ink-600">
                {property.description}
              </p>
            </section>

            {/* Booking widget — shown inline here on mobile/tablet only;
                desktop uses the sticky sidebar instead. */}
            <div className="mt-8">
              <BookingWidget
                property={property}
                initialCheckIn={initialCheckIn}
                initialCheckOut={initialCheckOut}
                initialGuests={initialGuests}
                variant="inline"
              />
            </div>

            {/* Amenities */}
            <section className="mt-10 border-t border-ink-100 pt-8">
              <h2 className="font-display text-xl font-semibold text-ink-800">
                What this place offers
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {property.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity.icon];
                  return (
                    <div
                      key={amenity.label}
                      className="flex items-center gap-3 text-sm text-ink-700"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600">
                        <Icon size={16} />
                      </span>
                      {amenity.label}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Good to know */}
            <section className="mt-10 border-t border-ink-100 pt-8">
              <h2 className="font-display text-xl font-semibold text-ink-800">
                Good to know
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <LogIn size={16} />
                  </span>
                  Check-in from 3:00 PM
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <LogOut size={16} />
                  </span>
                  Check-out by 11:00 AM
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <Clock size={16} />
                  </span>
                  Minimum stay: 2–3 nights
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <MessageCircleHeart size={16} />
                  </span>
                  24/7 concierge support
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <CigaretteOff size={16} />
                  </span>
                  No smoking
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-700">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sand-100 text-ink-600">
                    <Ban size={16} />
                  </span>
                  No parties or events
                </div>
              </div>
            </section>

            {/* Cancellation policy */}
            <section className="mt-10 border-t border-ink-100 pt-8">
              <h2 className="font-display text-xl font-semibold text-ink-800">
                Cancellation policy
              </h2>
              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-4 text-sm">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                  <p className="text-ink-700">
                    <span className="font-semibold">Full refund</span> for
                    cancellations made 14+ days before check-in.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-4 text-sm">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                  <p className="text-ink-700">
                    <span className="font-semibold">50% refund</span> for
                    cancellations made 7–13 days before check-in.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-sand-50 p-4 text-sm">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                  <p className="text-ink-700">
                    <span className="font-semibold">No refund</span> for
                    cancellations made within 7 days of check-in.
                  </p>
                </div>
                <p className="text-xs text-ink-400">
                  Exact terms are confirmed with your concierge at the time of
                  booking.
                </p>
              </div>
            </section>

            {/* Location */}
            <section className="mt-10 border-t border-ink-100 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-ink-800">
                  Where you&apos;ll be
                </h2>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.lat},${property.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500"
                >
                  Get directions <ExternalLink size={14} />
                </a>
              </div>
              <p className="mt-2 text-sm text-ink-500">{property.location}</p>
              <div className="mt-5 h-80 w-full overflow-hidden rounded-2xl shadow-soft">
                <PropertyLocationMap property={property} />
              </div>
            </section>

            {/* Concierge card */}
            <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-amber-50 p-6 sm:flex-row sm:items-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-400 text-ink-900">
                <MessageCircleHeart size={20} />
              </span>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-ink-800">
                  Managed by La Conciergerie Del Sol
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Our concierge team is on hand before, during and after your
                  stay — questions answered, local recommendations included.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-sand-50 transition-colors hover:bg-ink-800"
              >
                <Mail size={14} /> Contact us
              </Link>
            </section>
          </div>

          <BookingWidget
            property={property}
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialGuests={initialGuests}
            variant="sidebar"
          />
        </div>
      </div>

      <MobileBookNowBar
        pricePerNight={property.pricePerNight}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
      />

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink-800">
              You might also like
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {similar.map((p) => (
                <PropertyCard key={p.slug} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
