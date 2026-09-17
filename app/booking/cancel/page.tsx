import Link from "next/link";
import { CalendarX } from "lucide-react";

export default function BookingCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <div className="max-w-md text-center">
        <CalendarX size={48} className="mx-auto text-ink-300" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">
          Checkout cancelled
        </h1>
        <p className="mt-3 text-ink-600">
          No payment was taken and your selected dates are still free —
          you&apos;re welcome to pick up where you left off any time.
        </p>
        <Link
          href="/properties"
          className="mt-8 inline-block rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
        >
          Back to properties
        </Link>
      </div>
    </main>
  );
}
