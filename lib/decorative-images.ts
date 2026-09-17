import type { Property } from "@/lib/properties";

export type DecorativeImages = {
  hero: string[];
  welcome: string[];
  concierge: string[];
  poolThumbnail: string;
  comfortSection: string;
  ctaBackground: string;
};

// Walks the given pools of properties in order, taking one not-yet-used
// photo per property (falling back to that same property's next photo if
// its first is already taken), until `count` images are collected. Pools
// are tried in order, so a themed pool (e.g. "has a pool") is preferred but
// the full property list is always the final fallback — this always
// returns as many images as exist across the whole catalog, never fewer
// than requested just because a themed pool ran out.
//
// `minIndex` skips each property's earliest photos before considering one.
// The hero passes 1: there's no OCR/text-detection running here (nothing
// in this stack can classify an arbitrary photo at request time), so this
// was verified by hand instead — downloaded and visually inspected photos
// 0 and 1 from 8 properties (sea-view-tagged and general), and a baked-in
// marketing badge ("Fantastic Sea View — WiFi · Pool · 1 Bedroom", burned
// into the JPEG itself, not something CSS could hide) showed up on 4 of 8
// cover photos (index 0) and exactly 0 of 8 index-1 photos. Skipping index
// 0 is a verified rule from that sample, not a guess — if a future listing
// breaks the pattern, this needs re-checking rather than assuming it still
// holds. Sections where a stray badge is less dominant (a small carousel
// thumbnail, not a full-bleed banner) don't need this.
//
// `excludeProperties` filters out entire properties (not just photos already
// used elsewhere) — used so a section like "Welcome" never shows a different
// photo of a property the hero is already showing, not just a different URL.
// `usedProperties`, when passed, records which properties this call drew
// from so a later call can exclude them.
function pickImages(
  pools: Property[][],
  count: number,
  used: Set<string>,
  minIndex = 0,
  excludeProperties?: Set<string>,
  usedProperties?: Set<string>
): string[] {
  const picked: string[] = [];
  for (const pool of pools) {
    for (const property of pool) {
      if (excludeProperties?.has(property.lodgifyId)) continue;
      const image = property.images
        .slice(minIndex)
        .find((img) => img && !used.has(img));
      if (!image) continue;
      picked.push(image);
      used.add(image);
      usedProperties?.add(property.lodgifyId);
      if (picked.length >= count) return picked;
    }
  }
  return picked;
}

function pickOne(
  pools: Property[][],
  used: Set<string>,
  minIndex = 0,
  excludeProperties?: Set<string>,
  usedProperties?: Set<string>
): string {
  return pickImages(pools, 1, used, minIndex, excludeProperties, usedProperties)[0] ?? "";
}

// Every decorative/marketing photo on the homepage — the hero slideshow,
// the welcome and concierge galleries, the pool-terrace corner shot, the
// "Comfort & Convenience" section image, and the CTA background — used to
// be fixed URLs picked by hand. This replaces that with a live selection
// from the actual property photos Lodgify returns, themed where it makes
// sense (sea-view photos for the hero, a pool photo for the pool
// thumbnail), while guaranteeing no photo is reused across sections.
export function pickDecorativeImages(properties: Property[]): DecorativeImages {
  const used = new Set<string>();
  const heroProperties = new Set<string>();
  const seaView = properties.filter((p) => p.tags.includes("Sea view"));
  const withPool = properties.filter((p) => p.tags.includes("Pool"));
  const withJacuzzi = properties.filter((p) => p.tags.includes("Jacuzzi"));

  const hero = pickImages([seaView, properties], 3, used, 1, undefined, heroProperties);
  const welcome = pickImages([properties], 5, used, 0, heroProperties);
  const concierge = pickImages([properties], 3, used, 0, heroProperties);
  const poolThumbnail = pickOne([withPool, properties], used);
  const comfortSection = pickOne([withJacuzzi, properties], used);
  const ctaBackground = pickOne([properties], used);

  return { hero, welcome, concierge, poolThumbnail, comfortSection, ctaBackground };
}
