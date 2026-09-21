import PropertiesPageClient from "@/components/PropertiesPageClient";
import { filterAvailableProperties, getAllProperties } from "@/lib/properties";
import { getPageSections, str } from "@/lib/cms";

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

  const [properties, sections] = await Promise.all([
    getAllProperties(),
    getPageSections("properties"),
  ]);
  const intro = sections.intro ?? {};
  // Only actually filter when both dates are present and form a real range
  // — a malformed/partial query string just falls back to the unfiltered
  // list rather than erroring the page.
  const available =
    checkIn && checkOut && checkIn < checkOut
      ? await filterAvailableProperties(properties, checkIn, checkOut)
      : properties;

  return (
    <PropertiesPageClient
      properties={available}
      heading={str(intro, "heading", "Apartments in Torremolinos")}
      description={str(
        intro,
        "description",
        "Hover a stay to locate it on the map, or explore the map to find your neighborhood.",
      )}
      emptyTitle={str(intro, "emptyTitle", "No stays match your search")}
      emptyText={str(
        intro,
        "emptyText",
        "Try a different neighborhood or guest count, or browse everything we have.",
      )}
    />
  );
}
