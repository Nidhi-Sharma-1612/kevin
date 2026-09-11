"use client";

import { Users, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DateRangePicker from "./DateRangePicker";
import LocationPicker from "./LocationPicker";
import { toISODate } from "@/lib/date-utils";
import type { LocationOption } from "@/lib/locations";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (location) params.set("location", location.value);
    if (checkIn) params.set("checkIn", toISODate(checkIn));
    if (checkOut) params.set("checkOut", toISODate(checkOut));
    if (guests > 1) params.set("guests", String(guests));

    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ""}`);
  }

  return (
    <form
      className={`flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft lg:flex-row lg:items-stretch lg:rounded-full ${className}`}
      onSubmit={handleSubmit}
    >
      <LocationPicker
        className="border-b border-ink-100 lg:border-r lg:border-b-0"
        onChange={setLocation}
      />

      <DateRangePicker
        className="border-b border-ink-100 lg:border-r lg:border-b-0"
        onChange={(a, b) => {
          setCheckIn(a);
          setCheckOut(b);
        }}
      />

      <div className="flex flex-[0.8] items-center gap-3 border-b border-ink-100 px-5 py-3.5 lg:border-r lg:border-b-0">
        <Users size={18} className="shrink-0 text-amber-500" />
        <span className="flex flex-1 flex-col text-left">
          <span className="text-[11px] font-medium text-ink-500">
            {guests === 1 ? "Guest" : "Guests"}
          </span>
          <span className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              className="grid h-5 w-5 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-100"
              aria-label="Decrease guests"
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-medium text-ink-800">
              {guests}
            </span>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(12, g + 1))}
              disabled={guests >= 12}
              className="grid h-5 w-5 place-items-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-100"
              aria-label="Increase guests"
            >
              +
            </button>
          </span>
        </span>
      </div>

      <div className="p-2.5 lg:shrink-0 lg:self-center">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-amber-300 lg:w-auto"
        >
          <Search size={16} />
          Search
        </button>
      </div>
    </form>
  );
}
