import {
  POPULAR_CITIES_BY_REGION,
  type PopularCity,
} from "@/lib/popular-cities-by-region";

export type { PopularCity };

export type StateLocation = {
  type: "state";
  slug: string;
  name: string;
  region: string;
  country: "US";
};

export type ProvinceLocation = {
  type: "province";
  slug: string;
  name: string;
  region: string;
  country: "CA";
};

export type RegionLocation = StateLocation | ProvinceLocation;

export type CityLocation = {
  type: "city";
  slug: string;
  name: string;
  city: string;
  region: string;
};

export type LocationPage = StateLocation | ProvinceLocation | CityLocation;

export const US_STATES: StateLocation[] = [
  { type: "state", slug: "alabama", name: "Alabama", region: "AL", country: "US" },
  { type: "state", slug: "alaska", name: "Alaska", region: "AK", country: "US" },
  { type: "state", slug: "arizona", name: "Arizona", region: "AZ", country: "US" },
  { type: "state", slug: "arkansas", name: "Arkansas", region: "AR", country: "US" },
  { type: "state", slug: "california", name: "California", region: "CA", country: "US" },
  { type: "state", slug: "colorado", name: "Colorado", region: "CO", country: "US" },
  { type: "state", slug: "connecticut", name: "Connecticut", region: "CT", country: "US" },
  { type: "state", slug: "delaware", name: "Delaware", region: "DE", country: "US" },
  { type: "state", slug: "florida", name: "Florida", region: "FL", country: "US" },
  { type: "state", slug: "georgia", name: "Georgia", region: "GA", country: "US" },
  { type: "state", slug: "hawaii", name: "Hawaii", region: "HI", country: "US" },
  { type: "state", slug: "idaho", name: "Idaho", region: "ID", country: "US" },
  { type: "state", slug: "illinois", name: "Illinois", region: "IL", country: "US" },
  { type: "state", slug: "indiana", name: "Indiana", region: "IN", country: "US" },
  { type: "state", slug: "iowa", name: "Iowa", region: "IA", country: "US" },
  { type: "state", slug: "kansas", name: "Kansas", region: "KS", country: "US" },
  { type: "state", slug: "kentucky", name: "Kentucky", region: "KY", country: "US" },
  { type: "state", slug: "louisiana", name: "Louisiana", region: "LA", country: "US" },
  { type: "state", slug: "maine", name: "Maine", region: "ME", country: "US" },
  { type: "state", slug: "maryland", name: "Maryland", region: "MD", country: "US" },
  { type: "state", slug: "massachusetts", name: "Massachusetts", region: "MA", country: "US" },
  { type: "state", slug: "michigan", name: "Michigan", region: "MI", country: "US" },
  { type: "state", slug: "minnesota", name: "Minnesota", region: "MN", country: "US" },
  { type: "state", slug: "mississippi", name: "Mississippi", region: "MS", country: "US" },
  { type: "state", slug: "missouri", name: "Missouri", region: "MO", country: "US" },
  { type: "state", slug: "montana", name: "Montana", region: "MT", country: "US" },
  { type: "state", slug: "nebraska", name: "Nebraska", region: "NE", country: "US" },
  { type: "state", slug: "nevada", name: "Nevada", region: "NV", country: "US" },
  { type: "state", slug: "new-hampshire", name: "New Hampshire", region: "NH", country: "US" },
  { type: "state", slug: "new-jersey", name: "New Jersey", region: "NJ", country: "US" },
  { type: "state", slug: "new-mexico", name: "New Mexico", region: "NM", country: "US" },
  { type: "state", slug: "new-york", name: "New York", region: "NY", country: "US" },
  { type: "state", slug: "north-carolina", name: "North Carolina", region: "NC", country: "US" },
  { type: "state", slug: "north-dakota", name: "North Dakota", region: "ND", country: "US" },
  { type: "state", slug: "ohio", name: "Ohio", region: "OH", country: "US" },
  { type: "state", slug: "oklahoma", name: "Oklahoma", region: "OK", country: "US" },
  { type: "state", slug: "oregon", name: "Oregon", region: "OR", country: "US" },
  { type: "state", slug: "pennsylvania", name: "Pennsylvania", region: "PA", country: "US" },
  { type: "state", slug: "rhode-island", name: "Rhode Island", region: "RI", country: "US" },
  { type: "state", slug: "south-carolina", name: "South Carolina", region: "SC", country: "US" },
  { type: "state", slug: "south-dakota", name: "South Dakota", region: "SD", country: "US" },
  { type: "state", slug: "tennessee", name: "Tennessee", region: "TN", country: "US" },
  { type: "state", slug: "texas", name: "Texas", region: "TX", country: "US" },
  { type: "state", slug: "utah", name: "Utah", region: "UT", country: "US" },
  { type: "state", slug: "vermont", name: "Vermont", region: "VT", country: "US" },
  { type: "state", slug: "virginia", name: "Virginia", region: "VA", country: "US" },
  { type: "state", slug: "washington", name: "Washington", region: "WA", country: "US" },
  { type: "state", slug: "west-virginia", name: "West Virginia", region: "WV", country: "US" },
  { type: "state", slug: "wisconsin", name: "Wisconsin", region: "WI", country: "US" },
  { type: "state", slug: "wyoming", name: "Wyoming", region: "WY", country: "US" },
];

export const CA_PROVINCES: ProvinceLocation[] = [
  { type: "province", slug: "ontario", name: "Ontario", region: "ON", country: "CA" },
  { type: "province", slug: "quebec", name: "Quebec", region: "QC", country: "CA" },
  { type: "province", slug: "british-columbia", name: "British Columbia", region: "BC", country: "CA" },
  { type: "province", slug: "alberta", name: "Alberta", region: "AB", country: "CA" },
  { type: "province", slug: "manitoba", name: "Manitoba", region: "MB", country: "CA" },
  { type: "province", slug: "saskatchewan", name: "Saskatchewan", region: "SK", country: "CA" },
  { type: "province", slug: "nova-scotia", name: "Nova Scotia", region: "NS", country: "CA" },
  { type: "province", slug: "new-brunswick", name: "New Brunswick", region: "NB", country: "CA" },
  { type: "province", slug: "newfoundland-and-labrador", name: "Newfoundland and Labrador", region: "NL", country: "CA" },
  { type: "province", slug: "prince-edward-island", name: "Prince Edward Island", region: "PE", country: "CA" },
  { type: "province", slug: "northwest-territories", name: "Northwest Territories", region: "NT", country: "CA" },
  { type: "province", slug: "yukon", name: "Yukon", region: "YT", country: "CA" },
  { type: "province", slug: "nunavut", name: "Nunavut", region: "NU", country: "CA" },
];

export const BROWSE_REGIONS: RegionLocation[] = [...US_STATES, ...CA_PROVINCES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export { POPULAR_CITIES_BY_REGION };

function cityEntry(region: string, city: string, slug: string): CityLocation {
  const area = getBrowseRegion(region);
  return {
    type: "city",
    slug,
    name: `${city}, ${area?.name || region}`,
    city,
    region,
  };
}

/** Cities with dedicated SEO landing pages */
export const SEO_CITIES: CityLocation[] = Object.entries(POPULAR_CITIES_BY_REGION).flatMap(
  ([region, cities]) =>
    cities
      .filter((entry): entry is PopularCity & { slug: string } => Boolean(entry.slug))
      .map((entry) => cityEntry(region, entry.city, entry.slug))
);

export const ALL_LOCATION_PAGES: LocationPage[] = [
  ...US_STATES,
  ...CA_PROVINCES,
  ...SEO_CITIES,
];

export function resolveLocationSlug(slug: string): LocationPage | null {
  return ALL_LOCATION_PAGES.find((location) => location.slug === slug) || null;
}

export function getBrowseRegion(region: string): RegionLocation | null {
  const code = region.toUpperCase();
  return BROWSE_REGIONS.find((entry) => entry.region === code) || null;
}

/** @deprecated Use getBrowseRegion */
export function getStateByRegion(region: string) {
  return getBrowseRegion(region);
}

export function getPopularCitiesForRegion(region: string): PopularCity[] {
  return POPULAR_CITIES_BY_REGION[region.toUpperCase()] || [];
}

export function getCityHref(city: PopularCity, region: string) {
  if (city.slug) return `/${city.slug}`;
  return `/search?location=${encodeURIComponent(city.city)}&region=${encodeURIComponent(region)}`;
}

export function getLocationHref(location: LocationPage) {
  return `/${location.slug}`;
}

export function getRegionHref(region: string) {
  const area = getBrowseRegion(region);
  return area ? getLocationHref(area) : `/search?region=${encodeURIComponent(region)}`;
}

/** @deprecated Use getRegionHref */
export function getStateHref(region: string) {
  return getRegionHref(region);
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

export const REGION_ALIASES: Record<string, string[]> = Object.fromEntries(
  BROWSE_REGIONS.map((area) => [
    area.region,
    [area.name.toLowerCase(), area.region.toLowerCase(), area.slug.replace(/-/g, " ")],
  ])
);

export function normalizeRegionInput(input?: string) {
  if (!input?.trim()) return "OH";

  const trimmed = input.trim();
  const upper = trimmed.toUpperCase();
  const byCode = BROWSE_REGIONS.find((area) => area.region === upper);
  if (byCode) return byCode.region;

  const byName = BROWSE_REGIONS.find((area) => regionMatches(trimmed, area.region));
  return byName?.region || "OH";
}

export function regionMatches(value: string, region: string) {
  const normalized = value.trim().toLowerCase();
  const code = region.trim().toUpperCase();
  const aliases = REGION_ALIASES[code] || [code.toLowerCase()];
  return aliases.some((alias) => alias === normalized);
}
