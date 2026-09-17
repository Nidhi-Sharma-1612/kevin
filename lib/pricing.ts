import "server-only";

import { getPropertyBySlug } from "@/lib/properties";
import { getQuote } from "@/lib/lodgify";

export type FeeLine = {
  label: string;
  amount: number;
};

export type StayQuote = {
  nights: number;
  pricePerNight: number;
  total: number;
  currency: string;
  cleaningFee?: number;
  fees: FeeLine[];
};

// Single source of truth for "how much does this stay cost" — used by both
// the quote API route (to display a price) and the checkout route (to set
// the Stripe line-item amount), so a client can never influence the charged
// total by sending its own number.
export async function computeQuote(
  propertySlug: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<StayQuote> {
  const property = await getPropertyBySlug(propertySlug);
  if (!property) throw new Error(`Unknown property: ${propertySlug}`);

  const nights = Math.max(
    0,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const quote = await getQuote(
    property.lodgifyId,
    property.roomTypeId,
    checkIn,
    checkOut,
    guests
  );
  // Lodgify's total includes one-time fees (cleaning, etc.) alongside the
  // nightly rental cost — subtract them back out before deriving a
  // per-night figure, or the displayed nightly rate would be inflated by
  // whatever one-time fees happen to apply to this stay.
  const feesTotal = quote.fees.reduce((sum, fee) => sum + fee.amount, 0);
  const rentalSubtotal = quote.total - feesTotal;

  return {
    nights,
    pricePerNight: nights > 0 ? rentalSubtotal / nights : rentalSubtotal,
    total: quote.total,
    currency: quote.currency,
    cleaningFee: quote.cleaningFee,
    fees: quote.fees,
  };
}
