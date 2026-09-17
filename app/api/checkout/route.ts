import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPropertyBySlug } from "@/lib/properties";
import { computeQuote } from "@/lib/pricing";
import { LodgifyRequestError } from "@/lib/lodgify";

// Distinct from a real Stripe API failure (declined card, bad request,
// etc.) — this means the deployment itself is missing an env var, which
// `.env.local` being gitignored makes an easy thing to forget when setting
// up a new hosting environment (it's never present unless configured
// there separately). Worth telling guests something more useful than
// "Could not start checkout" for this case (see the catch block below).
class MissingConfigError extends Error {}

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new MissingConfigError("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { propertySlug, checkIn, checkOut, guests } = body as {
    propertySlug?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };

  if (!propertySlug || !checkIn || !checkOut || !guests) {
    return NextResponse.json(
      { error: "propertySlug, checkIn, checkOut and guests are required" },
      { status: 400 }
    );
  }

  const property = await getPropertyBySlug(propertySlug);
  if (!property) {
    return NextResponse.json({ error: "Unknown property" }, { status: 404 });
  }

  let quote;
  try {
    // The total is always re-derived here from the property + dates, never
    // taken from the client, so a tampered request can't change the price.
    quote = await computeQuote(propertySlug, checkIn, checkOut, guests);
  } catch (error) {
    console.error("Quote lookup failed for checkout", error);
    // Same real rental-rule message as /api/quote (e.g. a minimum-stay
    // violation) — the booking widget already tries to catch this before
    // checkout via its own quote fetch, but dates can still slip past that
    // (a stale availability cache, a race with another booking), so this is
    // the last line of defense and should say the same thing.
    if (error instanceof LodgifyRequestError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Quote lookup failed" }, { status: 502 });
  }

  if (quote.nights <= 0 || quote.total <= 0) {
    return NextResponse.json({ error: "Invalid stay dates" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    // Not fatal (falls back below), but worth flagging loudly — a guest
    // who actually pays would get redirected back to localhost afterwards,
    // which only shows up once someone completes a real payment.
    console.warn(
      "NEXT_PUBLIC_SITE_URL is not set — success/cancel URLs will point at localhost."
    );
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: quote.currency.toLowerCase(),
            unit_amount: Math.round(quote.total * 100),
            product_data: {
              name: `${property.title} — ${quote.nights} night${quote.nights === 1 ? "" : "s"}`,
              description: `${checkIn} to ${checkOut}, ${guests} guest${guests === 1 ? "" : "s"}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/properties/${propertySlug}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
      metadata: {
        propertySlug,
        checkIn,
        checkOut,
        guests: String(guests),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof MissingConfigError) {
      console.error(
        "Checkout is not configured on this deployment:",
        error.message
      );
      return NextResponse.json(
        {
          error:
            "Online payment isn't available right now — please book by phone or email below.",
        },
        { status: 503 }
      );
    }
    console.error("Stripe checkout session creation failed", error);
    return NextResponse.json(
      { error: "Could not start checkout" },
      { status: 502 }
    );
  }
}
