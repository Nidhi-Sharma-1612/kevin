"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MONTH_LABELS,
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  formatShortDate,
  isAfter,
  isBefore,
  isMockBooked,
  isSameDay,
  startOfDay,
} from "@/lib/date-utils";

const POPOVER_WIDTH = 680;
const VIEWPORT_MARGIN = 16;

function Month({
  year,
  month,
  checkIn,
  checkOut,
  hovered,
  today,
  onSelect,
  onHover,
}: {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hovered: Date | null;
  today: Date;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
}) {
  const days = buildMonthGrid(year, month);
  const rangeEnd = checkOut ?? hovered;

  return (
    <div className="w-full">
      <p className="text-center font-display text-sm font-semibold text-ink-800">
        {MONTH_LABELS[month]} {year}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-[11px] font-medium text-ink-500">
            {label}
          </span>
        ))}

        {days.map(({ date, inCurrentMonth }, i) => {
          const past = isBefore(date, today);
          const booked = inCurrentMonth && isMockBooked(date) && !past;
          const disabled = !inCurrentMonth || past || booked;

          const isCheckIn = isSameDay(date, checkIn);
          const isCheckOut = isSameDay(date, checkOut);
          const isEndpoint = isCheckIn || isCheckOut;

          const inRange =
            checkIn &&
            rangeEnd &&
            !isEndpoint &&
            isAfter(date, checkIn) &&
            isBefore(date, rangeEnd);

          const isRangeStartEdge = isCheckIn && checkIn && rangeEnd;
          const isRangeEndEdge = isCheckOut;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              title={booked ? "Not available" : undefined}
              onClick={() => onSelect(date)}
              onMouseEnter={() => onHover(date)}
              className={`relative h-9 text-sm transition-colors ${
                isRangeStartEdge ? "rounded-l-full" : ""
              } ${isRangeEndEdge ? "rounded-r-full" : ""} ${
                inRange || (checkIn && rangeEnd && isEndpoint && !isSameDay(checkIn, rangeEnd))
                  ? "bg-cyan-100"
                  : ""
              }`}
            >
              <span
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                  isEndpoint
                    ? "bg-cyan-500 font-semibold text-white"
                    : !inCurrentMonth
                      ? "text-ink-300 line-through"
                      : booked
                        ? "text-ink-300 line-through"
                        : past
                          ? "text-ink-200"
                          : "text-ink-700 hover:bg-cyan-50"
                }`}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({
  className = "",
  onChange,
  initialCheckIn = null,
  initialCheckOut = null,
}: {
  className?: string;
  onChange?: (checkIn: Date | null, checkOut: Date | null) => void;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
}) {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(() => initialCheckIn ?? new Date());
  const [coords, setCoords] = useState<{
    left: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());

  useEffect(() => {
    onChange?.(checkIn, checkOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut]);

  function recalcPosition() {
    const trigger = rootRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const width = Math.min(POPOVER_WIDTH, viewportW - VIEWPORT_MARGIN * 2);
    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, viewportW - width - VIEWPORT_MARGIN)
    );

    const spaceBelow = viewportH - rect.bottom - VIEWPORT_MARGIN - 12;
    const spaceAbove = rect.top - VIEWPORT_MARGIN - 12;

    if (spaceBelow >= 420 || spaceBelow >= spaceAbove) {
      setCoords({
        left,
        top: rect.bottom + 12,
        maxHeight: Math.max(280, spaceBelow),
      });
    } else {
      setCoords({
        left,
        bottom: viewportH - rect.top + 12,
        maxHeight: Math.max(280, spaceAbove),
      });
    }
  }

  useLayoutEffect(() => {
    if (!open) return;
    recalcPosition();
    function handle() {
      recalcPosition();
    }
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(date: Date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    if (isBefore(date, checkIn) || isSameDay(date, checkIn)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    setCheckOut(date);
    setOpen(false);
  }

  const secondMonth = addMonths(viewDate, 1);

  return (
    <div ref={rootRef} className={`relative flex flex-[1.6] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-1 items-center gap-3 px-5 py-3.5 text-left"
      >
        <CalendarDays size={18} className="shrink-0 text-amber-500" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium whitespace-nowrap text-ink-500">
            Check-in
          </span>
          <span className="text-sm font-medium text-ink-800">
            {checkIn ? formatShortDate(checkIn) : "Add date"}
          </span>
        </span>
      </button>

      <span className="my-2 w-px shrink-0 bg-ink-100" />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-1 items-center gap-3 px-5 py-3.5 text-left"
      >
        <CalendarDays size={18} className="shrink-0 text-amber-500" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium whitespace-nowrap text-ink-500">
            Check-out
          </span>
          <span className="text-sm font-medium text-ink-800">
            {checkOut ? formatShortDate(checkOut) : "Add date"}
          </span>
        </span>
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              left: coords.left,
              top: coords.top,
              bottom: coords.bottom,
              maxHeight: coords.maxHeight,
            }}
            className="fixed z-[100] w-[680px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl bg-white p-5 text-ink-800 shadow-soft ring-1 ring-ink-900/5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate((d) => addMonths(d, -1))}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-sand-100"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border border-ink-200" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-100 text-ink-300 line-through" /> Booked
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewDate((d) => addMonths(d, 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-sand-100"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div
              onMouseLeave={() => setHovered(null)}
              className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2"
            >
              <Month
                year={viewDate.getFullYear()}
                month={viewDate.getMonth()}
                checkIn={checkIn}
                checkOut={checkOut}
                hovered={hovered}
                today={today}
                onSelect={handleSelect}
                onHover={setHovered}
              />
              <div className="hidden sm:block">
                <Month
                  year={secondMonth.getFullYear()}
                  month={secondMonth.getMonth()}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  hovered={hovered}
                  today={today}
                  onSelect={handleSelect}
                  onHover={setHovered}
                />
              </div>
            </div>

            {(checkIn || checkOut) && (
              <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                <p className="text-sm text-ink-500">
                  {checkIn ? formatShortDate(checkIn) : "Add date"}
                  {" — "}
                  {checkOut ? formatShortDate(checkOut) : "Add date"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn(null);
                    setCheckOut(null);
                  }}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-500"
                >
                  Clear dates
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
