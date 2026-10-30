import Link from "next/link";
import Stripe from "stripe";
import { CheckCircle2, XCircle } from "lucide-react";
import { getPropertyBySlug } from "@/lib/properties";
import { createBooking, setBookingNote } from "@/lib/lodgify";
import { sendBookingFailureAlert } from "@/lib/mailer";
import { getPageSections, str, type Section } from "@/lib/cms";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

function formatAmountPaid(session: Stripe.Checkout.Session): string {
  const amount = (session.amount_total ?? 0) / 100;
  return `${amount.toFixed(2)} ${(session.currency ?? "").toUpperCase()}`;
}

async function saveSessionMetadata(
  sessionId: string,
  metadata: Record<string, string>,
) {
  await stripeClient().checkout.sessions.update(sessionId, { metadata });
}

// Never throws — a failed alert must not take down the confirmation page
// for a guest who has already paid. Sent once per session so that refreshes
// (each of which retries the booking) don't flood the inbox.
async function alertConcierge(
  session: Stripe.Checkout.Session,
  propertyName: string | undefined,
  amountPaid: string,
  error: unknown,
) {
  const metadata = session.metadata ?? {};
  if (metadata.bookingAlertSent) return;
  try {
    await sendBookingFailureAlert({
      stripeSessionId: session.id,
      propertyName: propertyName ?? metadata.propertySlug ?? "Unknown property",
      checkIn: metadata.checkIn ?? "unknown",
      checkOut: metadata.checkOut ?? "unknown",
      guests: metadata.guests ?? "unknown",
      guestName: session.customer_details?.name ?? "unknown",
      guestEmail: session.customer_details?.email ?? "unknown",
      amountPaid,
      reason: error instanceof Error ? error.message : String(error),
    });
    await saveSessionMetadata(session.id, { bookingAlertSent: "true" });
  } catch (alertError) {
    console.error("Could not send booking failure alert", alertError);
  }
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

  const { propertySlug, checkIn, checkOut, guests, lodgifyBookingId } =
    session.metadata ?? {};
  const property = propertySlug
    ? await getPropertyBySlug(propertySlug).catch(() => null)
    : null;

  // This page runs on every load, so a refresh must not create a second
  // reservation — the Lodgify id saved on the Stripe session is what marks
  // this payment as already handled.
  let bookingHandedToLodgify = Boolean(lodgifyBookingId);
  if (!lodgifyBookingId) {
    const amountPaid = formatAmountPaid(session);
    try {
      if (!property || !checkIn || !checkOut || !guests) {
        throw new Error("Stripe session is missing booking details");
      }
      const bookingId = await createBooking({
        lodgifyId: property.lodgifyId,
        roomTypeId: property.roomTypeId,
        from: checkIn,
        to: checkOut,
        guests: Number(guests),
        guestName: session.customer_details?.name ?? "Guest",
        guestEmail: session.customer_details?.email ?? "",
        total: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? "eur").toUpperCase(),
      });
      bookingHandedToLodgify = true;
      await saveSessionMetadata(session.id, {
        lodgifyBookingId: String(bookingId),
      });
      await setBookingNote(
        bookingId,
        `${amountPaid} paid by card via Stripe (${session.id}).`,
      );
    } catch (error) {
      console.error("Lodgify booking creation failed after payment", error);
      if (!bookingHandedToLodgify) {
        await alertConcierge(session, property?.title, amountPaid, error);
      }
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
