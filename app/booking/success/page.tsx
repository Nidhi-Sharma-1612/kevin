import Link from "next/link";
import Stripe from "stripe";
import { CheckCircle2, XCircle } from "lucide-react";
import { getPropertyBySlug } from "@/lib/properties";
import { createBooking } from "@/lib/lodgify";
import { getPageSections, str, type Section } from "@/lib/cms";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

// There is no Stripe webhook secret available for this project, so payment
// confirmation happens here instead: re-fetching the Checkout Session
// server-side, by its id, is the standard fallback when webhooks aren't an
// option. The tradeoff is that a booking is only finalized if the guest's
// browser actually reaches this page after paying (e.g. not if they close
// the tab mid-redirect) — acceptable for now, revisit if a webhook secret
// becomes available later.
export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const t = (await getPageSections("booking-success")).content ?? {};

  if (!session_id) {
    return <Failure t={t} />;
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripeClient().checkout.sessions.retrieve(session_id);
  } catch (error) {
    console.error("Could not retrieve checkout session", error);
    return <Failure t={t} />;
  }

  if (session.payment_status !== "paid") {
    return <Failure t={t} />;
  }

  const { propertySlug, checkIn, checkOut, guests } = session.metadata ?? {};
  const property = propertySlug ? await getPropertyBySlug(propertySlug) : null;

  let bookingHandedToLodgify = false;
  if (property && checkIn && checkOut && guests) {
    try {
      await createBooking({
        lodgifyId: property.lodgifyId,
        from: checkIn,
        to: checkOut,
        guests: Number(guests),
        guestName: session.customer_details?.name ?? "Guest",
        guestEmail: session.customer_details?.email ?? "",
      });
      bookingHandedToLodgify = true;
    } catch (error) {
      console.error("Lodgify booking creation failed after payment", error);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <div className="max-w-md text-center">
        <CheckCircle2 size={48} className="mx-auto text-cyan-500" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">
          {str(t, "heading", "Booking confirmed")}
        </h1>
        <p className="mt-3 text-ink-600">
          {property ? (
            <>
              Your payment for <strong>{property.title}</strong> was
              successful
              {checkIn && checkOut ? (
                <>
                  {" "}
                  for <strong>{checkIn}</strong> to <strong>{checkOut}</strong>
                </>
              ) : null}
              .
            </>
          ) : (
            "Your payment was successful."
          )}
        </p>
        <p className="mt-3 text-sm text-ink-500">
          {bookingHandedToLodgify
            ? str(
                t,
                "confirmedNote",
                "Your reservation has been created. A confirmation email will follow shortly.",
              )
            : str(
                t,
                "pendingNote",
                "Our concierge team will follow up by email shortly to confirm the final details of your stay.",
              )}
        </p>
        <Link
          href="/properties"
          className="mt-8 inline-block rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
        >
          {str(t, "buttonLabel", "Browse more properties")}
        </Link>
      </div>
    </main>
  );
}

function Failure({ t }: { t: Section }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <div className="max-w-md text-center">
        <XCircle size={48} className="mx-auto text-ink-300" />
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">
          {str(t, "failedHeading", "We couldn't confirm this payment")}
        </h1>
        <p className="mt-3 text-ink-600">
          {str(
            t,
            "failedText",
            "If you completed a payment, please contact us and we'll sort it out — you have not been charged twice.",
          )}
        </p>
        <Link
          href="/properties"
          className="mt-8 inline-block rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
        >
          {str(t, "failedButtonLabel", "Back to properties")}
        </Link>
      </div>
    </main>
  );
}
