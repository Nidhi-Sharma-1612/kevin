"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, Users } from "lucide-react";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/currency";

export default function FeaturedPropertyTile({
  property,
  size = "sm",
  className = "",
}: {
  property: Property;
  size?: "lg" | "md" | "sm";
  className?: string;
}) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      className={`group relative block h-full w-full overflow-hidden rounded-2xl shadow-card ${className}`}
    >
      <Image
        src={property.image}
        alt={property.title}
        fill
        sizes={size === "lg" ? "(max-width: 1024px) 100vw, 700px" : "(max-width: 1024px) 100vw, 400px"}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Strong, tall scrim so baked-in marketing text from the source
          photos (badges like "Fantastic Sea View") is fully obscured
          before our own title/location text starts. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 from-15% via-ink-950/55 via-45% to-transparent" />

      <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-800 shadow-soft">
        from {formatPrice(property.pricePerNight, property.currency)}/night
      </span>

      <div className={`absolute inset-x-0 bottom-0 p-4 ${size === "lg" ? "sm:p-6" : "sm:p-4"}`}>
        <h3
          className={`font-display font-semibold text-white ${
            size === "lg"
              ? "text-xl sm:text-2xl"
              : size === "md"
                ? "text-lg"
                : "text-base"
          }`}
        >
          {property.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/90">
          <MapPin size={13} className="shrink-0 text-cyan-300" />
          {property.location}
        </p>

        {size !== "sm" && (
          <div className="mt-2.5 flex items-center gap-4 text-xs text-white/85">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-amber-300" />
              {property.guests} Guests
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble size={14} className="text-amber-300" />
              {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
