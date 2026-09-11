"use client";

import { formatShortDate } from "@/lib/date-utils";

export default function MobileBookNowBar({
  pricePerNight,
  initialCheckIn = null,
  initialCheckOut = null,
}: {
  pricePerNight: number;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
}) {
  function handleClick() {
    document
      .getElementById("booking-widget")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg font-semibold text-ink-800">
            €{pricePerNight}
            <span className="text-xs font-normal text-ink-500"> / night</span>
          </p>
          {initialCheckIn && initialCheckOut ? (
            <p className="text-xs text-ink-500">
              {formatShortDate(initialCheckIn)} –{" "}
              {formatShortDate(initialCheckOut)}
            </p>
          ) : (
            <p className="text-xs text-ink-500">Select your dates</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="shrink-0 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
        >
          Book now
        </button>
      </div>
    </div>
  );
}
