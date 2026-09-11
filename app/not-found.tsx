import Link from "next/link";
import { ArrowRight, MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600">
        <MapPinOff size={28} />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-cyan-600 uppercase">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink-800 sm:text-4xl">
        This page has wandered off
      </h1>
      <p className="mt-4 text-ink-500">
        We couldn&apos;t find what you were looking for. It may have moved,
        or the link might be out of date — let&apos;s get you back to the
        Andalusian sun.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-amber-300"
        >
          Back to home <ArrowRight size={16} />
        </Link>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-900 hover:text-sand-50"
        >
          Browse properties
        </Link>
      </div>
    </div>
  );
}
