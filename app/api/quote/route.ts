import { NextRequest, NextResponse } from "next/server";
import { computeQuote } from "@/lib/pricing";
import { LodgifyRequestError } from "@/lib/lodgify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertySlug = searchParams.get("propertySlug");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = Number(searchParams.get("guests") ?? "1");

  if (!propertySlug || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "propertySlug, checkIn and checkOut are required" },
      { status: 400 }
    );
  }

  try {
    const quote = await computeQuote(propertySlug, checkIn, checkOut, guests);
    return NextResponse.json(quote);
  } catch (error) {
    console.error("Quote lookup failed", error);
    // A LodgifyRequestError carries a real, user-facing rental rule (e.g.
    // "The minimum stay for this rental is 3 days") — worth showing as-is,
    // unlike an opaque network/server failure.
    if (error instanceof LodgifyRequestError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Quote lookup failed" }, { status: 502 });
  }
}
