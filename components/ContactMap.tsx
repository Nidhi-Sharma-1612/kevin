"use client";

import dynamic from "next/dynamic";

const ContactMapInner = dynamic(() => import("./ContactMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-sm text-ink-500">
      Loading map…
    </div>
  ),
});

export default function ContactMap() {
  return <ContactMapInner />;
}
