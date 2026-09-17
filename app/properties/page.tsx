import PropertiesPageClient from "@/components/PropertiesPageClient";
import { filterAvailableProperties, getAllProperties } from "@/lib/properties";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = await searchParams;
  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const checkIn = asString(search.checkIn);
  const checkOut = asString(search.checkOut);

  const properties = await getAllProperties();
  // Only actually filter when both dates are present and form a real range
  // — a malformed/partial query string just falls back to the unfiltered
  // list rather than erroring the page.
  const available =
    checkIn && checkOut && checkIn < checkOut
      ? await filterAvailableProperties(properties, checkIn, checkOut)
      : properties;

  return <PropertiesPageClient properties={available} />;
}
