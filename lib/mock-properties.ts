export type Amenity = {
  label: string;
  icon:
    | "wifi"
    | "wind"
    | "kitchen"
    | "tv"
    | "washer"
    | "car"
    | "waves"
    | "pool"
    | "jacuzzi"
    | "sun"
    | "key"
    | "fridge";
};

export type Property = {
  slug: string;
  title: string;
  neighborhood: string;
  location: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  pricePerNight: number;
  image: string;
  tags: string[];
  description: string;
  amenities: Amenity[];
  lat: number;
  lng: number;
};

// Coordinates are approximate neighborhood centers in Torremolinos, jittered
// per-property. Lodgify will supply exact geocoding once the API is wired in.
const NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
  "Santa Clara": { lat: 36.6135, lng: -4.499 },
  "La Nogalera": { lat: 36.6209, lng: -4.4996 },
  "Torre La Roca": { lat: 36.6257, lng: -4.4899 },
  "City Centre": { lat: 36.6229, lng: -4.4998 },
};

function jitter(base: number, seed: number, spread = 0.004) {
  const pseudoRandom = Math.sin(seed * 12.9898) * 43758.5453;
  const frac = pseudoRandom - Math.floor(pseudoRandom);
  return base + (frac - 0.5) * spread;
}

function withCoords(
  neighborhood: string,
  seed: number
): { lat: number; lng: number } {
  const base = NEIGHBORHOODS[neighborhood] ?? NEIGHBORHOODS["City Centre"];
  return {
    lat: jitter(base.lat, seed),
    lng: jitter(base.lng, seed + 1),
  };
}

// Bedrooms/bathrooms/amenities/description below are derived from the
// title, tags and neighborhood each property already has, rather than
// hand-authored per listing — real copy and amenity lists will come from
// Lodgify once that integration is connected.

function deriveBathrooms(bedrooms: number): number {
  return Math.max(1, bedrooms);
}

const BASE_AMENITIES: Amenity[] = [
  { label: "Wifi", icon: "wifi" },
  { label: "Air conditioning", icon: "wind" },
  { label: "Fully-equipped kitchen", icon: "kitchen" },
  { label: "Smart TV", icon: "tv" },
  { label: "Washing machine", icon: "washer" },
  { label: "Refrigerator", icon: "fridge" },
];

function deriveAmenities(tags: string[]): Amenity[] {
  const amenities = [...BASE_AMENITIES];
  const has = (needle: string) =>
    tags.some((tag) => tag.toLowerCase().includes(needle));

  if (has("pool")) amenities.push({ label: "Swimming pool access", icon: "pool" });
  if (has("jacuzzi")) amenities.push({ label: "Private jacuzzi", icon: "jacuzzi" });
  if (has("beach") || has("beachfront"))
    amenities.push({ label: "Direct beach access", icon: "waves" });
  if (has("sea view") || has("bay view"))
    amenities.push({ label: "Sea view", icon: "sun" });
  if (has("terrace") || has("balcony"))
    amenities.push({ label: "Private terrace / balcony", icon: "sun" });
  if (has("parking")) amenities.push({ label: "Private parking", icon: "car" });
  if (has("city centre") || has("central"))
    amenities.push({ label: "Self check-in", icon: "key" });

  return amenities;
}

function deriveDescription(property: {
  title: string;
  neighborhood: string;
  guests: number;
  bedrooms: number;
  tags: string[];
}): string {
  const name = property.title.split(" — ")[0].split(" - ")[0];
  const bedroomPhrase =
    property.bedrooms <= 0
      ? "cosy studio"
      : property.bedrooms === 1
        ? "one-bedroom apartment"
        : `${property.bedrooms}-bedroom apartment`;

  const highlights = property.tags
    .filter((t) => !/bedroom|guest/i.test(t))
    .join(", ")
    .toLowerCase();

  const areaPhrase =
    property.neighborhood === "City Centre"
      ? "Torremolinos' lively centre, close to restaurants, shops and nightlife"
      : `the ${property.neighborhood} area, close to the beach and local cafés`;

  return (
    `${name} is a bright, well-appointed ${bedroomPhrase} in ${property.neighborhood}, ` +
    `Torremolinos, comfortably sleeping up to ${property.guests} guests. ` +
    (highlights
      ? `Guests love the ${highlights} this home offers. `
      : "") +
    `You're just moments from ${areaPhrase}, with everything you need for a relaxed, ` +
    `sun-soaked Andalusian stay — and La Conciergerie Del Sol's team on hand throughout your visit.`
  );
}

// Hand-written description for the listing the client shared as a
// reference example, rather than the generic template used elsewhere.
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "aurora-sea-view-pool-central-1br-direct-beach":
    "Aurora is a bright, central one-bedroom apartment with direct access to Torremolinos' beach and a shared sea-view pool just steps from your door. " +
    "Wake up to the sound of the Mediterranean, spend your afternoons by the pool, and stroll home in minutes after dinner on the seafront. " +
    "The apartment comfortably sleeps 3, with a well-equipped kitchen, fast WiFi and air conditioning throughout — everything you need for an easy, sun-filled stay in the heart of the Costa del Sol.",
};

type RawProperty = Omit<
  Property,
  "lat" | "lng" | "bathrooms" | "description" | "amenities"
>;

const RAW_PROPERTIES: RawProperty[] = [
  {
    slug: "carre-dor-santa-clara-direct-beach-access-bay-views",
    title: "Carré d'Or — Santa Clara, Direct Beach Access, Bay Views",
    neighborhood: "Santa Clara",
    location: "Santa Clara, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 165,
    image: "https://l.icdbcdn.com/oh/a2d791bb-5dee-41d1-8f04-4d4f007a14be.jpg?w=800",
    tags: ["Sea view", "Beachfront"],
  },
  {
    slug: "golden-sunrise-santa-clara-direct-beach-access",
    title: "Golden Sunrise — Santa Clara, Direct Beach Access",
    neighborhood: "Santa Clara",
    location: "Santa Clara, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 158,
    image: "https://l.icdbcdn.com/oh/ed618548-92ca-4a6d-9705-650c00118ff8.jpg?w=800",
    tags: ["Sea view", "Beachfront"],
  },
  {
    slug: "oasis-sea-sky-nogalera-city-center-balcony-sea-view",
    title: "Oasis Sea & Sky — Nogalera, City Centre, Balcony Sea View",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 132,
    image: "https://l.icdbcdn.com/oh/c724040f-e3b7-466a-9706-bdff61f2158c.jpg?w=800",
    tags: ["Sea view", "Balcony"],
  },
  {
    slug: "andalucia-dream-bright-sea-views-2-bedroom",
    title: "Andalucía Dream — Bright, Sea Views, 2 Bedroom",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 6,
    bedrooms: 2,
    pricePerNight: 178,
    image: "https://l.icdbcdn.com/oh/bf1256e7-31ce-4b5c-8baf-19f6bd55f5df.jpg?w=800",
    tags: ["Sea view", "2 Bedroom"],
  },
  {
    slug: "cocoon-studio-1br-terrace-city-centre",
    title: "Cocoon Studio — 1BR, Terrace, City Centre",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 2,
    bedrooms: 1,
    pricePerNight: 79,
    image: "https://l.icdbcdn.com/oh/e85df100-f887-4eee-99f5-003d65fe553c.jpg?w=800",
    tags: ["Terrace", "City centre"],
  },
  {
    slug: "lucia-nogalera-bright-renovated-spacious-flat",
    title: "Lucía Nogalera — Bright, Renovated, Spacious Flat",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 4,
    bedrooms: 2,
    pricePerNight: 138,
    image: "https://l.icdbcdn.com/oh/8185df9a-e5f9-47a0-bc43-a8526c7f42e7.jpg?w=800",
    tags: ["Renovated", "Spacious"],
  },
  {
    slug: "blue-pearl-nogalera-town-centre-spacious-flat",
    title: "Blue Pearl Nogalera — Town Centre, Spacious Flat",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 3,
    bedrooms: 1,
    pricePerNight: 84,
    image: "https://l.icdbcdn.com/oh/6e0eee6c-b07a-4af7-b15c-cdd38b22aba2.jpg?w=800",
    tags: ["City centre"],
  },
  {
    slug: "helios-city-center-parking-included",
    title: "Hélios — City Centre, Parking Included",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 2,
    bedrooms: 1,
    pricePerNight: 54,
    image: "https://l.icdbcdn.com/oh/6d5ef51b-6006-4629-a86a-48764eae5a98.jpg?w=800",
    tags: ["Parking", "City centre"],
  },
  {
    slug: "the-lodge-torre-la-roca",
    title: "The Lodge — Torre La Roca",
    neighborhood: "Torre La Roca",
    location: "Torre La Roca, Torremolinos",
    guests: 4,
    bedrooms: 2,
    pricePerNight: 156,
    image: "https://l.icdbcdn.com/oh/dfe84343-3455-4701-9427-6b851543df94.jpg?w=800",
    tags: ["Tower views"],
  },
  {
    slug: "atlantis-torre-la-roca-stylish-apartment-sea-view",
    title: "Atlantis — Torre La Roca, Stylish Apartment, Sea View",
    neighborhood: "Torre La Roca",
    location: "Torre La Roca, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 99,
    image: "https://l.icdbcdn.com/oh/03ba1999-3776-472c-b94a-610840be13c8.jpg?w=800",
    tags: ["Sea view", "Stylish"],
  },
  {
    slug: "serenity-private-spa",
    title: "Serenity — Private Spa",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 145,
    image: "https://l.icdbcdn.com/oh/4493cf1f-30e2-4fac-9476-b8f12f8c860e.jpg?w=800",
    tags: ["Private spa"],
  },
  {
    slug: "lovely-world-stylish-apartment-bay-views-pool",
    title: "Lovely World — Stylish Apartment, Bay Views, Pool",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 2,
    bedrooms: 1,
    pricePerNight: 109,
    image: "https://l.icdbcdn.com/oh/78043275-d66c-4809-a514-0a3d51fc8069.png?w=800",
    tags: ["Pool", "Bay views"],
  },
  {
    slug: "colmena-69-city-center",
    title: "Colmena 69 — City Centre",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 110,
    image: "https://l.icdbcdn.com/oh/01bdd3af-6f8b-4c40-a445-f01015e6b224.jpg?w=800",
    tags: ["City centre"],
  },
  {
    slug: "the-garden-2-bedrooms-2-baths-nogalera-city-centre",
    title: "The Garden — 2 Bedrooms & 2 Baths, La Nogalera, City Centre",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 4,
    bedrooms: 2,
    pricePerNight: 133,
    image: "https://l.icdbcdn.com/oh/6edf2abb-472e-464f-b768-4124c17b8437.jpg?w=800",
    tags: ["2 Bedroom", "City centre"],
  },
  {
    slug: "amazonia-downtown-torremolinos-quiet-apartment-for-4",
    title: "Amazonia — Downtown Torremolinos, Quiet Apartment for 4",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 97,
    image: "https://l.icdbcdn.com/oh/cdde12ce-e39f-4e3c-bc23-e4a6d747539f.jpg?w=800",
    tags: ["Quiet", "Downtown"],
  },
  {
    slug: "costa-relax-pool-beach-access-la-roca-tower",
    title: "Costa Relax — Pool & Beach Access, La Roca Tower",
    neighborhood: "Torre La Roca",
    location: "Torre La Roca, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 133,
    image: "https://l.icdbcdn.com/oh/b04f7cca-7770-4eda-8409-390ff4055692.jpg?w=800",
    tags: ["Pool", "Beach access"],
  },
  {
    slug: "sira-central-studio-balcony-10min-to-beach",
    title: "Sira — Central Studio w/ Balcony, 10min to Beach",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 74,
    image: "https://l.icdbcdn.com/oh/28dc8a1c-8725-4f1c-b8b3-df9d5b8eb56a.jpg?w=800",
    tags: ["Balcony", "Central"],
  },
  {
    slug: "sky-heaven-2-spacious-br-heart-of-torremolinos",
    title: "Sky Heaven — 2 Spacious Bedrooms, Heart of Torremolinos",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 2,
    pricePerNight: 109,
    image: "https://l.icdbcdn.com/oh/7a7911db-0f95-4578-8dad-3928eb0a7515.png?w=800",
    tags: ["2 Bedroom", "Central"],
  },
  {
    slug: "sunny-waves",
    title: "Sunny Waves",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 97,
    image: "https://l.icdbcdn.com/oh/26da5cca-df7f-45af-99b6-3ad71aac12b5.jpg?w=800",
    tags: ["Sea view"],
  },
  {
    slug: "ocean-sounds",
    title: "Ocean Sounds",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 172,
    image: "https://l.icdbcdn.com/oh/b57e7456-53a6-476c-95cd-633b7fa268f0.jpg?w=800",
    tags: ["Sea view", "Beachfront"],
  },
  {
    slug: "lili-sun-bright-spacious-studio-10th-floor",
    title: "Lili Sun — Bright Spacious Studio, 10th Floor, Heart of Town",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 3,
    bedrooms: 1,
    pricePerNight: 82,
    image: "https://l.icdbcdn.com/oh/57b4b5d3-d9cf-4c1a-bd86-50163b53602e.jpg?w=800",
    tags: ["High floor", "City centre"],
  },
  {
    slug: "aurora-sea-view-pool-central-1br-direct-beach",
    title: "Aurora — Sea View & Pool, Central 1BR, Direct Beach",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 3,
    bedrooms: 1,
    pricePerNight: 62,
    image: "https://l.icdbcdn.com/oh/cbcdb895-583e-4e75-a21b-7aebb76ca8d7.jpg?w=800",
    tags: ["Pool", "Beachfront"],
  },
  {
    slug: "horizon-del-mar-sea-views-plunge-pool-2br-sleeps-6",
    title: "Horizon Del Mar — Sea Views & Plunge Pool, 2BR, Sleeps 6",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 6,
    bedrooms: 2,
    pricePerNight: 158,
    image: "https://l.icdbcdn.com/oh/1c5ad309-2c66-4f5f-8a19-d0c21aea5180.jpg?w=800",
    tags: ["Plunge pool", "Sea view"],
  },
  {
    slug: "terrazas-private-jacuzzi-convertible-terrace-sleeps-4",
    title: "Terrazas — Private Jacuzzi & Convertible Terrace, Sleeps 4",
    neighborhood: "City Centre",
    location: "Torremolinos Centre",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 134,
    image: "https://l.icdbcdn.com/oh/40a54a52-4a66-46ef-bf3a-65964d467085.jpg?w=800",
    tags: ["Jacuzzi", "Terrace"],
  },
  {
    slug: "islas-la-nogalera-city-center-garden-view",
    title: "Islas La Nogalera — City Centre, Garden View",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 2,
    bedrooms: 1,
    pricePerNight: 85,
    image: "https://l.icdbcdn.com/oh/62de023f-ffab-454d-afe3-f9a77610ccb0.png?w=800",
    tags: ["Garden view"],
  },
  {
    slug: "sunrise-la-nogalera-city-centre-pools-sea-view",
    title: "Sunrise La Nogalera — City Centre, Swimming Pools, Sea View",
    neighborhood: "La Nogalera",
    location: "La Nogalera, Torremolinos",
    guests: 4,
    bedrooms: 1,
    pricePerNight: 94,
    image: "https://l.icdbcdn.com/oh/9fbe4f19-85c9-4c0b-be3e-5539d4657440.jpg?w=800",
    tags: ["Pool", "Sea view"],
  },
];

export const properties: Property[] = RAW_PROPERTIES.map((property, index) => ({
  ...property,
  bathrooms: deriveBathrooms(property.bedrooms),
  description:
    DESCRIPTION_OVERRIDES[property.slug] ?? deriveDescription(property),
  amenities: deriveAmenities(property.tags),
  ...withCoords(property.neighborhood, index),
}));
