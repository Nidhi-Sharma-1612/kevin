"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BedDouble, MapPin, Users } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/currency";

export default function PropertyCard({
  property,
  onHover,
  active = false,
  queryString = "",
}: {
  property: Property;
  onHover?: (slug: string | null) => void;
  active?: boolean;
  queryString?: string;
}) {
  return (
    <Link
      href={`/properties/${property.slug}${queryString ? `?${queryString}` : ""}`}
      onMouseEnter={() => onHover?.(property.slug)}
      onMouseLeave={() => onHover?.(null)}
      className={`group block overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft ${
        active ? "ring-2 ring-amber-400" : ""
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-800 backdrop-blur">
          from {formatPrice(property.pricePerNight, property.currency)}/night
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-base font-semibold text-ink-800">
            {property.title}
          </h3>
          <ArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-500"
          />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
          <MapPin size={13} className="text-amber-500" />
          {property.location}
        </p>

        <div className="mt-4 flex items-center gap-5 border-t border-ink-100 pt-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-amber-500" />
            {property.guests} Guests
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} className="text-amber-500" />
            {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
          </span>
        </div>
      </div>
    </Link>
  );
}
