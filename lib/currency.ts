// Every price in the UI ultimately comes from a Lodgify property/quote
// response, which carries its own real currency code — this replaces every
// spot that used to hardcode "€" regardless of what currency a listing was
// actually priced in.
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: Math.round(amount) === amount ? 0 : 2,
  }).format(amount);
}
