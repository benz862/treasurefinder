export type LocationPage =
  | {
      type: "state";
      slug: string;
      name: string;
      region: string;
    }
  | {
      type: "city";
      slug: string;
      name: string;
      city: string;
      region: string;
    };

export const US_STATES: LocationPage[] = [
  { type: "state", slug: "ohio", name: "Ohio", region: "OH" },
  { type: "state", slug: "florida", name: "Florida", region: "FL" },
  { type: "state", slug: "texas", name: "Texas", region: "TX" },
  { type: "state", slug: "california", name: "California", region: "CA" },
  { type: "state", slug: "pennsylvania", name: "Pennsylvania", region: "PA" },
  { type: "state", slug: "michigan", name: "Michigan", region: "MI" },
  { type: "state", slug: "georgia", name: "Georgia", region: "GA" },
  { type: "state", slug: "north-carolina", name: "North Carolina", region: "NC" },
  { type: "state", slug: "virginia", name: "Virginia", region: "VA" },
  { type: "state", slug: "new-york", name: "New York", region: "NY" },
  { type: "state", slug: "illinois", name: "Illinois", region: "IL" },
  { type: "state", slug: "arizona", name: "Arizona", region: "AZ" },
];

export const SEO_CITIES: LocationPage[] = [
  {
    type: "city",
    slug: "columbus-ohio",
    name: "Columbus, Ohio",
    city: "Columbus",
    region: "OH",
  },
  {
    type: "city",
    slug: "cleveland-ohio",
    name: "Cleveland, Ohio",
    city: "Cleveland",
    region: "OH",
  },
  {
    type: "city",
    slug: "cincinnati-ohio",
    name: "Cincinnati, Ohio",
    city: "Cincinnati",
    region: "OH",
  },
  {
    type: "city",
    slug: "girard-ohio",
    name: "Girard, Ohio",
    city: "Girard",
    region: "OH",
  },
  {
    type: "city",
    slug: "naples-florida",
    name: "Naples, Florida",
    city: "Naples",
    region: "FL",
  },
  {
    type: "city",
    slug: "tampa-florida",
    name: "Tampa, Florida",
    city: "Tampa",
    region: "FL",
  },
  {
    type: "city",
    slug: "orlando-florida",
    name: "Orlando, Florida",
    city: "Orlando",
    region: "FL",
  },
  {
    type: "city",
    slug: "austin-texas",
    name: "Austin, Texas",
    city: "Austin",
    region: "TX",
  },
  {
    type: "city",
    slug: "dallas-texas",
    name: "Dallas, Texas",
    city: "Dallas",
    region: "TX",
  },
  {
    type: "city",
    slug: "los-angeles-california",
    name: "Los Angeles, California",
    city: "Los Angeles",
    region: "CA",
  },
];

export const ALL_LOCATION_PAGES = [...US_STATES, ...SEO_CITIES];

export function resolveLocationSlug(slug: string): LocationPage | null {
  return ALL_LOCATION_PAGES.find((location) => location.slug === slug) || null;
}

export function getLocationHref(location: LocationPage) {
  return `/${location.slug}`;
}

/** Homepage browse categories mapped to listing category filters */
export const DISCOVERY_CATEGORIES = [
  { label: "Tools", value: "Tools" },
  { label: "Antiques", value: "Antiques" },
  { label: "Collectibles", value: "Collectibles" },
  { label: "Furniture", value: "Furniture" },
  { label: "Artwork", value: "Home Decor" },
  { label: "Electronics", value: "Electronics" },
  { label: "Pet Supplies", value: "Garden" },
  { label: "Baby Items", value: "Baby & Kids" },
  { label: "Estate Sales", value: "Estate Sale" },
] as const;

export const FEATURED_STATES = US_STATES.slice(0, 4);

export const REGION_ALIASES: Record<string, string[]> = {
  OH: ["ohio", "oh"],
  FL: ["florida", "fl"],
  TX: ["texas", "tx"],
  CA: ["california", "ca"],
  PA: ["pennsylvania", "pa"],
  MI: ["michigan", "mi"],
  GA: ["georgia", "ga"],
  NC: ["north carolina", "nc"],
  VA: ["virginia", "va"],
  NY: ["new york", "ny"],
  IL: ["illinois", "il"],
  AZ: ["arizona", "az"],
};

export function regionMatches(value: string, region: string) {
  const normalized = value.trim().toLowerCase();
  const code = region.trim().toUpperCase();
  const aliases = REGION_ALIASES[code] || [code.toLowerCase()];
  return aliases.some((alias) => alias === normalized);
}
