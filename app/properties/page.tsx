"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { List, MapIcon, SearchX, X } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/lib/mock-properties";
import { LOCATION_TO_NEIGHBORHOOD } from "@/lib/locations";
import { formatShortDate, fromISODate } from "@/lib/date-utils";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-sm text-ink-500">
      Loading map…
    </div>
  ),
});

function FilterChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-700 shadow-card">
      {label}
    </span>
  );
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const locationParam = searchParams.get("location");
  const guestsParam = searchParams.get("guests");
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const neighborhood = locationParam
    ? LOCATION_TO_NEIGHBORHOOD[locationParam]
    : null;
  const minGuests = guestsParam ? Number.parseInt(guestsParam, 10) : null;
  const checkIn = fromISODate(checkInParam);
  const checkOut = fromISODate(checkOutParam);

  const filtered = properties.filter((property) => {
    if (neighborhood && property.neighborhood !== neighborhood) return false;
    if (minGuests && property.guests < minGuests) return false;
    return true;
  });

  const hasFilters = Boolean(neighborhood || minGuests || checkIn || checkOut);

  // Carry the searched dates/guests through to the property detail page so
  // its booking widget can start prefilled with what the guest searched.
  const detailQuery = new URLSearchParams();
  if (checkInParam) detailQuery.set("checkIn", checkInParam);
  if (checkOutParam) detailQuery.set("checkOut", checkOutParam);
  if (guestsParam) detailQuery.set("guests", guestsParam);
  const detailQueryString = detailQuery.toString();

  return (
    <div className="mx-auto max-w-7xl lg:flex lg:h-[calc(100vh-72px)]">
      {/* List */}
      <div
        className={`overflow-y-auto px-6 py-10 sm:px-10 lg:w-1/2 lg:py-14 xl:w-[55%] xl:px-12 ${
          mobileView === "map" ? "hidden lg:block" : "block"
        }`}
      >
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
            {filtered.length} {filtered.length === 1 ? "stay" : "stays"}{" "}
            available
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
            Apartments in Torremolinos
          </h1>
          <p className="mt-3 text-sm text-ink-500">
            Hover a stay to locate it on the map, or explore the map to find
            your neighborhood.
          </p>

          {hasFilters && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {neighborhood && <FilterChip label={neighborhood} />}
              {minGuests && <FilterChip label={`${minGuests}+ guests`} />}
              {checkIn && checkOut && (
                <FilterChip
                  label={`${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}`}
                />
              )}
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-500"
              >
                <X size={13} /> Clear filters
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-ink-200 p-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-50 text-amber-600">
                <SearchX size={20} />
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-ink-800">
                No stays match your search
              </p>
              <p className="mt-2 max-w-xs text-sm text-ink-500">
                Try a different neighborhood or guest count, or browse
                everything we have.
              </p>
              <Link
                href="/properties"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-amber-300"
              >
                View all properties
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filtered.map((property) => (
                <PropertyCard
                  key={property.slug}
                  property={property}
                  active={property.slug === activeSlug}
                  onHover={setActiveSlug}
                  queryString={detailQueryString}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div
        className={`sticky top-18 h-[calc(100vh-72px)] shadow-[inset_1px_0_0_0_rgba(35,39,42,0.08)] lg:w-1/2 xl:w-[45%] ${
          mobileView === "list" ? "hidden lg:block" : "block"
        }`}
      >
        <PropertyMap
          properties={filtered}
          activeSlug={activeSlug}
          onMarkerHover={setActiveSlug}
        />
      </div>

      {/* Mobile list/map toggle */}
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <div className="flex items-center gap-1 rounded-full bg-ink-900 p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setMobileView("list")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              mobileView === "list"
                ? "bg-amber-400 text-ink-900"
                : "text-sand-100"
            }`}
          >
            <List size={14} /> List
          </button>
          <button
            type="button"
            onClick={() => setMobileView("map")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              mobileView === "map"
                ? "bg-amber-400 text-ink-900"
                : "text-sand-100"
            }`}
          >
            <MapIcon size={14} /> Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesContent />
    </Suspense>
  );
}
