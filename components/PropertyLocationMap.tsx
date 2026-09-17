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

export default function PropertyLocationMap({
  property,
}: {
  property: Property;
}) {
  return <PropertyMap properties={[property]} />;
}
