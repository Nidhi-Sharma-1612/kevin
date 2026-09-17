import { NextRequest, NextResponse } from "next/server";
import { getNeighborhoodBookedDates } from "@/lib/properties";
import { LOCATION_TO_NEIGHBORHOOD } from "@/lib/locations";

// Returns the dates between `from` and `to` (inclusive, YYYY-MM-DD) where
// every property in the given location is booked — used by the homepage
// search widget so its calendar can reflect real per-neighborhood
// availability before a specific property has been chosen. `location` is a
// LocationPicker value (see lib/locations); omitted or unrecognized falls
// back to aggregating across every property.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { error: "from and to are required" },
      { status: 400 }
    );
  }

  const neighborhood = location ? (LOCATION_TO_NEIGHBORHOOD[location] ?? null) : null;

  try {
    const bookedDates = await getNeighborhoodBookedDates(neighborhood, from, to);
    return NextResponse.json({ bookedDates: Array.from(bookedDates) });
  } catch (error) {
    console.error("Location availability lookup failed", error);
    return NextResponse.json(
      { error: "Availability lookup failed" },
      { status: 502 }
    );
  }
}
