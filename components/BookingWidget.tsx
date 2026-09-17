"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, ShieldCheck, Users } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import type { Property } from "@/lib/properties";
import { toISODate } from "@/lib/date-utils";
import { formatPrice } from "@/lib/currency";

// How far ahead to fetch booked dates for, in one go, so opening the
// calendar and flipping months doesn't need a fetch per month.
const AVAILABILITY_WINDOW_DAYS = 365;

function useAvailability(propertySlug: string) {
  const [bookedDates, setBookedDates] = useState<Set<string> | undefined>(
    undefined
  );

  useEffect(() => {
    let cancelled = false;
    const from = toISODate(new Date());
    const to = toISODate(
      new Date(Date.now() + AVAILABILITY_WINDOW_DAYS * 86400000)
    );

    fetch(
      `/api/availability?propertySlug=${propertySlug}&from=${from}&to=${to}`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.bookedDates)) return;
        setBookedDates(new Set<string>(data.bookedDates));
      })
      .catch(() => {
        // Leave bookedDates undefined — DateRangePicker treats that as
        // "nothing known to be booked," so a failed fetch never blocks
        // booking outright.
      });

    return () => {
      cancelled = true;
    };
  }, [propertySlug]);

  return bookedDates;
}

type Quote = {
  nights: number;
  pricePerNight: number;
  total: number;
  currency: string;
  cleaningFee?: number;
  fees?: { label: string; amount: number }[];
};

// Lodgify doesn't expose a minimum-stay field anywhere in the property/room
// data — the only place it shows up at all is this rejection message on the
// quote endpoint. Pulling the number out of it is the only way to know it.
function parseMinNights(message: string): number | null {
  const match = /minimum stay.*?(\d+)\s*(day|night)/i.exec(message);
  return match ? Number(match[1]) : null;
}

// Fetches the authoritative live price breakdown (nightly rate + any
// Lodgify fees, e.g. a cleaning fee) once dates/guests are picked. Also
// surfaces the error message as-is when Lodgify rejects the stay outright
// (e.g. "The minimum stay for this rental is 3 days") — the calendar only
// knows which individual dates are booked, not rules like minimum-stay, so
// a selection it allows can still be invalid, and the quote endpoint is
// what actually catches that. Showing it here means the guest finds out
// before checkout, not after clicking "Book now".
function useQuote(
  propertySlug: string,
  checkIn: Date | null,
  checkOut: Date | null,
  guests: number
) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Once learned from a rejected quote, kept around (not cleared on the
  // next dates change) so the calendar can keep enforcing it — it's a
  // property-level rule, not something tied to the specific stay that
  // happened to reveal it.
  const [minNights, setMinNights] = useState<number | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    let cancelled = false;
    fetch(
      `/api/quote?propertySlug=${propertySlug}&checkIn=${toISODate(checkIn)}&checkOut=${toISODate(checkOut)}&guests=${guests}`
    )
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        return { ok: res.ok, data };
      })
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (ok && data && typeof data.total === "number") {
          setQuote(data);
          setError(null);
          return;
        }
        // A real, user-facing rejection from Lodgify (minimum stay, dates
        // just got booked, etc.) — surface it. A missing/malformed response
        // is left silent, matching the previous fallback-to-local-math
        // behavior, since that's more likely a transient network hiccup.
        if (data?.error) {
          setError(data.error);
          const parsed = parseMinNights(data.error);
          if (parsed) setMinNights(parsed);
        }
      })
      .catch(() => {
        // Network failure — leave quote/error as-is, UI falls back to the
        // local nights * pricePerNight calculation.
      });

    return () => {
      cancelled = true;
    };
  }, [propertySlug, checkIn, checkOut, guests]);

  // Dates cleared: ignore whatever quote/error is left over from a previous
  // selection rather than resetting state synchronously in the effect
  // above (which the dates-picked branch already can't do without risking
  // a cascading render) — it'll be replaced the next time real dates land.
  return checkIn && checkOut
    ? { quote, error, minNights }
    : { quote: null, error: null, minNights };
}

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

// Lodgify's fee labels are whatever the property owner typed in (seen live:
// "Frais de ménage", "Frais de ménage Airbnb" — French even with
// Accept-Language: en). Rather than only surfacing a fee if it happens to
// match a "cleaning" keyword — which would silently fold any other real fee
// into the total with no line item — every fee Lodgify returns is shown,
// with cleaning-looking labels normalized to a consistent "Cleaning fee".
function feeLabel(label: string): string {
  return /clean|ménage|menage|limpieza/i.test(label) ? "Cleaning fee" : label;
}

function PriceBreakdown({
  nights,
  pricePerNight,
  rentalSubtotal,
  fees,
  total,
  currency,
}: {
  nights: number;
  pricePerNight: number;
  rentalSubtotal: number;
  fees: { label: string; amount: number }[];
  total: number;
  currency: string;
}) {
  return (
    <div className="mt-5 space-y-2 rounded-xl border border-ink-100 p-4 text-sm">
      <div className="flex items-center justify-between text-ink-500">
        <span>
          {formatPrice(pricePerNight, currency)} × {nights} {nights === 1 ? "night" : "nights"}
        </span>
        <span>{formatPrice(rentalSubtotal, currency)}</span>
      </div>

      {fees
        .filter((fee) => fee.amount > 0)
        .map((fee) => (
          <div key={fee.label} className="flex items-center justify-between text-ink-500">
            <span>{feeLabel(fee.label)}</span>
            <span>{formatPrice(fee.amount, currency)}</span>
          </div>
        ))}

      <div className="flex items-center justify-between border-t border-ink-100 pt-2 font-semibold text-ink-900">
        <span>Total ({currency})</span>
        <span>{formatPrice(total, currency)}</span>
      </div>
      <p className="text-xs text-ink-400">Taxes & fees included</p>
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
  const bookedDates = useAvailability(property.slug);
  const {
    quote,
    error: quoteError,
    minNights,
  } = useQuote(property.slug, state.checkIn, state.checkOut, state.guests);
  const pricePerNight = quote?.pricePerNight ?? property.pricePerNight;
  const rentalSubtotal = pricePerNight * state.nights;
  const total = quote?.total ?? rentalSubtotal;
  const currency = quote?.currency ?? property.currency;
  const canBook = Boolean(state.checkIn && state.checkOut) && !quoteError;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleBookNow() {
    if (!state.checkIn || !state.checkOut) return;
    setCheckoutError(null);
    setIsRedirecting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertySlug: property.slug,
          checkIn: toISODate(state.checkIn),
          checkOut: toISODate(state.checkOut),
          guests: state.guests,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Could not start checkout"
      );
      setIsRedirecting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
      <p className="text-sm text-ink-500">Starting from</p>
      <p className="mt-1 font-display text-3xl font-semibold text-ink-800">
        {formatPrice(property.pricePerNight, property.currency)}
        <span className="text-base font-normal text-ink-500"> / night</span>
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-ink-100">
        <DateRangePicker
          className="[&>button]:px-3 [&>button]:py-3"
          onChange={state.handleDateChange}
          initialCheckIn={initialCheckIn}
          initialCheckOut={initialCheckOut}
          bookedDates={bookedDates}
          minNights={minNights ?? undefined}
        />
      </div>

      <div className="mt-3">
        <GuestStepper
          guests={state.guests}
          maxGuests={property.guests}
          onChange={state.setGuests}
        />
      </div>

      {state.nights > 0 && quoteError && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {quoteError}
        </div>
      )}

      {state.nights > 0 && !quoteError && (
        <PriceBreakdown
          nights={state.nights}
          pricePerNight={pricePerNight}
          rentalSubtotal={rentalSubtotal}
          fees={quote?.fees ?? []}
          total={total}
          currency={currency}
        />
      )}

      <button
        type="button"
        disabled={!canBook || isRedirecting}
        onClick={handleBookNow}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3.5 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-400"
      >
        {isRedirecting && <Loader2 size={16} className="animate-spin" />}
        {isRedirecting ? "Redirecting to checkout…" : "Book now"}
      </button>
      {checkoutError && (
        <p className="mt-2 text-center text-xs text-red-600">{checkoutError}</p>
      )}
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-400">
        <ShieldCheck size={13} className="shrink-0 text-cyan-500" />
        {canBook
          ? "You'll pay securely via Stripe"
          : quoteError
            ? "Adjust your dates to continue"
            : "Select your dates to continue"}
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
