"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MapPin, X } from "lucide-react";
import { LOCATION_GROUPS, type LocationOption } from "@/lib/locations";

const POPOVER_WIDTH = 340;
const VIEWPORT_MARGIN = 16;

export default function LocationPicker({
  className = "",
  onChange,
}: {
  className?: string;
  onChange?: (option: LocationOption | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LocationOption | null>(null);
  const [coords, setCoords] = useState<{
    left: number;
    top: number;
    maxHeight: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  function recalcPosition() {
    const trigger = rootRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const width = Math.min(POPOVER_WIDTH, viewportW - VIEWPORT_MARGIN * 2);
    let left = rect.left;
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(left, viewportW - width - VIEWPORT_MARGIN),
    );

    setCoords({
      left,
      top: rect.bottom + 12,
      maxHeight: Math.max(240, viewportH - rect.bottom - VIEWPORT_MARGIN - 12),
    });
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

  function handleSelect(option: LocationOption) {
    const next = option.value === "any" ? null : option;
    setSelected(next);
    onChange?.(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative flex flex-[1.3] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-1 items-center gap-3 px-5 py-3.5 text-left"
      >
        <MapPin size={18} className="shrink-0 text-amber-500" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-medium text-ink-500">Location</span>
          <span className="truncate text-sm font-medium text-ink-800">
            {selected ? selected.label : "Anywhere"}
          </span>
        </span>
        {selected ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(null);
              onChange?.(null);
            }}
            aria-label="Clear location"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink-400 hover:bg-sand-100 hover:text-ink-600"
          >
            <X size={14} />
          </span>
        ) : (
          <ChevronDown
            size={16}
            className={`shrink-0 text-ink-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
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
              maxHeight: coords.maxHeight,
              width: POPOVER_WIDTH,
            }}
            className="fixed z-100 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl bg-white py-2 text-ink-800 shadow-soft ring-1 ring-ink-900/5"
          >
            {LOCATION_GROUPS.map((group) => (
              <div key={group.region}>
                <p className="bg-sand-50 px-5 py-2 text-xs font-semibold tracking-wide text-ink-500 uppercase">
                  {group.region}
                </p>
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center px-5 py-2.5 text-left text-sm transition-colors hover:bg-cyan-50 ${
                      option.value === "any"
                        ? "font-medium text-ink-800"
                        : "pl-8 text-ink-600"
                    } ${
                      (selected?.value ?? "any") === option.value
                        ? "bg-cyan-50 text-cyan-700"
                        : ""
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
