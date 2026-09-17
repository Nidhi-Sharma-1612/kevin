"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/lib/properties";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-sm text-ink-500">
      Loading map…
    </div>
  ),
});

// Shows every real listing's actual location rather than one fixed,
// hand-picked "office" coordinate — this section is titled "Where we
// host," so the honest answer is "here are the apartments," not a single
// static pin.
export default function ContactMap({ properties }: { properties: Property[] }) {
  return <PropertyMap properties={properties} />;
}
