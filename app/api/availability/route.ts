import { NextRequest, NextResponse } from "next/server";
import { getPropertyBySlug } from "@/lib/properties";
import { expandBookedDates, getAvailability } from "@/lib/lodgify";

// Returns booked dates for a property between `from` and `to` (inclusive,
// YYYY-MM-DD), sourced live from Lodgify.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertySlug = searchParams.get("propertySlug");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!propertySlug || !from || !to) {
    return NextResponse.json(
      { error: "propertySlug, from and to are required" },
      { status: 400 }
    );
  }

  const property = await getPropertyBySlug(propertySlug);
  if (!property) {
    return NextResponse.json({ error: "Unknown property" }, { status: 404 });
  }

  try {
    const periods = await getAvailability(property.lodgifyId, from, to);
    const bookedDates = Array.from(expandBookedDates(periods));
    return NextResponse.json({ bookedDates });
  } catch (error) {
    console.error("Lodgify availability lookup failed", error);
    return NextResponse.json(
      { error: "Availability lookup failed" },
      { status: 502 }
    );
  }
}
