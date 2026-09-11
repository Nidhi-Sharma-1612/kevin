"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, ShieldCheck, Users } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import type { Property } from "@/lib/mock-properties";

function useBookingState(
  maxGuests: number,
  initialCheckIn: Date | null,
  initialCheckOut: Date | null,
  initialGuests: number
) {
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  const [guests, setGuests] = useState(
    Math.min(maxGuests, Math.max(1, initialGuests))
  );

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const ms = checkOut.getTime() - checkIn.getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  return {
    checkIn,
    checkOut,
    guests,
    nights,
    setGuests: (fn: (g: number) => number) =>
      setGuests((g) => Math.min(maxGuests, Math.max(1, fn(g)))),
    handleDateChange: (a: Date | null, b: Date | null) => {
      setCheckIn(a);
      setCheckOut(b);
    },
  };
}

function GuestStepper({
  guests,
  maxGuests,
  onChange,
}: {
  guests: number;
  maxGuests: number;
  onChange: (fn: (g: number) => number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-ink-700">
        <Users size={16} className="text-amber-500" />
        Guests
      </span>
      <span className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange((g) => g - 1)}
          disabled={guests <= 1}
          className="grid h-7 w-7 place-items-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-100"
          aria-label="Decrease guests"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-semibold text-ink-800">
          {guests}
        </span>
        <button
          type="button"
          onClick={() => onChange((g) => g + 1)}
          disabled={guests >= maxGuests}
          className="grid h-7 w-7 place-items-center rounded-full bg-ink-100 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ink-100"
          aria-label="Increase guests"
        >
          +
        </button>
      </span>
    </div>
  );
}

function BookingCard({
  property,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: {
  property: Property;
  initialCheckIn: Date | null;
  initialCheckOut: Date | null;
  initialGuests: number;
}) {
  const state = useBookingState(
    property.guests,
    initialCheckIn,
    initialCheckOut,
    initialGuests
  );
  const subtotal = state.nights * property.pricePerNight;
  const canBook = Boolean(state.checkIn && state.checkOut);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <p className="text-sm text-ink-500">Starting from</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink-800">
        €{property.pricePerNight}
        <span className="text-base font-normal text-ink-500"> / night</span>
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-ink-100">
        <DateRangePicker
          className="[&>button]:px-3 [&>button]:py-3"
          onChange={state.handleDateChange}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
        />
      </div>

      <div className="mt-3">
        <GuestStepper
          guests={state.guests}
          maxGuests={property.guests}
          onChange={state.setGuests}
        />
      </div>

      {state.nights > 0 && (
        <div className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
          <div className="flex items-center justify-between text-ink-500">
            <span>
              €{property.pricePerNight} × {state.nights}{" "}
              {state.nights === 1 ? "night" : "nights"}
            </span>
            <span>€{subtotal}</span>
          </div>
          <div className="flex items-center justify-between border-t border-ink-100 pt-2 font-semibold text-ink-800">
            <span>Total</span>
            <span>€{subtotal}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!canBook}
        className="mt-5 w-full rounded-full bg-amber-400 px-5 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-400"
      >
        Book now
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
        <ShieldCheck size={13} className="shrink-0 text-cyan-500" />
        {canBook ? "You won't be charged yet" : "Select your dates to continue"}
      </p>

      <div className="mt-5 border-t border-ink-100 pt-4 text-center">
        <p className="text-xs text-ink-400">Prefer to book with us directly?</p>
        <div className="mt-2 flex flex-col items-center gap-1.5 text-xs font-medium text-ink-600">
          <a
            href="tel:+34635861443"
            className="flex items-center gap-1.5 hover:text-amber-600"
          >
            <Phone size={12} /> +34 635 861 443
          </a>
          <a
            href="mailto:Contact@laconciergeriedelsol.com"
            className="flex items-center gap-1.5 hover:text-amber-600"
          >
            <Mail size={12} /> Contact@laconciergeriedelsol.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookingWidget({
  property,
  initialCheckIn = null,
  initialCheckOut = null,
  initialGuests = 1,
  variant = "sidebar",
}: {
  property: Property;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialGuests?: number;
  variant?: "sidebar" | "inline";
}) {
  if (variant === "inline") {
    return (
      <div id="booking-widget" className="scroll-mt-24 lg:hidden">
        <BookingCard
          property={property}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
          initialGuests={initialGuests}
        />
      </div>
    );
  }

  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
      <BookingCard
        property={property}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
        initialGuests={initialGuests}
      />
    </aside>
  );
}
