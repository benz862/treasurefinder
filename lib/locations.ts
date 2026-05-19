export type StateLocation = {
  type: "state";
  slug: string;
  name: string;
  region: string;
};

export type CityLocation = {
  type: "city";
  slug: string;
  name: string;
  city: string;
  region: string;
};

export type LocationPage = StateLocation | CityLocation;

export type PopularCity = {
  city: string;
  slug?: string;
};

export const US_STATES: StateLocation[] = [
  { type: "state", slug: "alabama", name: "Alabama", region: "AL" },
  { type: "state", slug: "alaska", name: "Alaska", region: "AK" },
  { type: "state", slug: "arizona", name: "Arizona", region: "AZ" },
  { type: "state", slug: "arkansas", name: "Arkansas", region: "AR" },
  { type: "state", slug: "california", name: "California", region: "CA" },
  { type: "state", slug: "colorado", name: "Colorado", region: "CO" },
  { type: "state", slug: "connecticut", name: "Connecticut", region: "CT" },
  { type: "state", slug: "delaware", name: "Delaware", region: "DE" },
  { type: "state", slug: "florida", name: "Florida", region: "FL" },
  { type: "state", slug: "georgia", name: "Georgia", region: "GA" },
  { type: "state", slug: "hawaii", name: "Hawaii", region: "HI" },
  { type: "state", slug: "idaho", name: "Idaho", region: "ID" },
  { type: "state", slug: "illinois", name: "Illinois", region: "IL" },
  { type: "state", slug: "indiana", name: "Indiana", region: "IN" },
  { type: "state", slug: "iowa", name: "Iowa", region: "IA" },
  { type: "state", slug: "kansas", name: "Kansas", region: "KS" },
  { type: "state", slug: "kentucky", name: "Kentucky", region: "KY" },
  { type: "state", slug: "louisiana", name: "Louisiana", region: "LA" },
  { type: "state", slug: "maine", name: "Maine", region: "ME" },
  { type: "state", slug: "maryland", name: "Maryland", region: "MD" },
  { type: "state", slug: "massachusetts", name: "Massachusetts", region: "MA" },
  { type: "state", slug: "michigan", name: "Michigan", region: "MI" },
  { type: "state", slug: "minnesota", name: "Minnesota", region: "MN" },
  { type: "state", slug: "mississippi", name: "Mississippi", region: "MS" },
  { type: "state", slug: "missouri", name: "Missouri", region: "MO" },
  { type: "state", slug: "montana", name: "Montana", region: "MT" },
  { type: "state", slug: "nebraska", name: "Nebraska", region: "NE" },
  { type: "state", slug: "nevada", name: "Nevada", region: "NV" },
  { type: "state", slug: "new-hampshire", name: "New Hampshire", region: "NH" },
  { type: "state", slug: "new-jersey", name: "New Jersey", region: "NJ" },
  { type: "state", slug: "new-mexico", name: "New Mexico", region: "NM" },
  { type: "state", slug: "new-york", name: "New York", region: "NY" },
  { type: "state", slug: "north-carolina", name: "North Carolina", region: "NC" },
  { type: "state", slug: "north-dakota", name: "North Dakota", region: "ND" },
  { type: "state", slug: "ohio", name: "Ohio", region: "OH" },
  { type: "state", slug: "oklahoma", name: "Oklahoma", region: "OK" },
  { type: "state", slug: "oregon", name: "Oregon", region: "OR" },
  { type: "state", slug: "pennsylvania", name: "Pennsylvania", region: "PA" },
  { type: "state", slug: "rhode-island", name: "Rhode Island", region: "RI" },
  { type: "state", slug: "south-carolina", name: "South Carolina", region: "SC" },
  { type: "state", slug: "south-dakota", name: "South Dakota", region: "SD" },
  { type: "state", slug: "tennessee", name: "Tennessee", region: "TN" },
  { type: "state", slug: "texas", name: "Texas", region: "TX" },
  { type: "state", slug: "utah", name: "Utah", region: "UT" },
  { type: "state", slug: "vermont", name: "Vermont", region: "VT" },
  { type: "state", slug: "virginia", name: "Virginia", region: "VA" },
  { type: "state", slug: "washington", name: "Washington", region: "WA" },
  { type: "state", slug: "west-virginia", name: "West Virginia", region: "WV" },
  { type: "state", slug: "wisconsin", name: "Wisconsin", region: "WI" },
  { type: "state", slug: "wyoming", name: "Wyoming", region: "WY" },
];

/** Popular cities per state — links use SEO slug when available, otherwise search */
export const POPULAR_CITIES_BY_REGION: Record<string, PopularCity[]> = {
  AL: [
    { city: "Birmingham", slug: "birmingham-alabama" },
    { city: "Huntsville" },
    { city: "Mobile" },
    { city: "Montgomery" },
  ],
  AK: [{ city: "Anchorage" }, { city: "Fairbanks" }, { city: "Juneau" }],
  AZ: [
    { city: "Phoenix", slug: "phoenix-arizona" },
    { city: "Tucson" },
    { city: "Mesa" },
    { city: "Scottsdale" },
  ],
  AR: [{ city: "Little Rock" }, { city: "Fayetteville" }, { city: "Fort Smith" }],
  CA: [
    { city: "Los Angeles", slug: "los-angeles-california" },
    { city: "San Diego", slug: "san-diego-california" },
    { city: "San Francisco", slug: "san-francisco-california" },
    { city: "Sacramento" },
  ],
  CO: [
    { city: "Denver", slug: "denver-colorado" },
    { city: "Colorado Springs" },
    { city: "Boulder" },
  ],
  CT: [{ city: "Hartford" }, { city: "New Haven" }, { city: "Stamford" }],
  DE: [{ city: "Wilmington" }, { city: "Dover" }, { city: "Newark" }],
  FL: [
    { city: "Miami", slug: "miami-florida" },
    { city: "Orlando", slug: "orlando-florida" },
    { city: "Tampa", slug: "tampa-florida" },
    { city: "Naples", slug: "naples-florida" },
    { city: "Jacksonville" },
  ],
  GA: [
    { city: "Atlanta", slug: "atlanta-georgia" },
    { city: "Savannah" },
    { city: "Augusta" },
  ],
  HI: [{ city: "Honolulu" }, { city: "Hilo" }, { city: "Kailua" }],
  ID: [{ city: "Boise" }, { city: "Meridian" }, { city: "Idaho Falls" }],
  IL: [
    { city: "Chicago", slug: "chicago-illinois" },
    { city: "Springfield" },
    { city: "Naperville" },
  ],
  IN: [
    { city: "Indianapolis", slug: "indianapolis-indiana" },
    { city: "Fort Wayne" },
    { city: "Evansville" },
  ],
  IA: [{ city: "Des Moines" }, { city: "Cedar Rapids" }, { city: "Davenport" }],
  KS: [{ city: "Wichita" }, { city: "Overland Park" }, { city: "Kansas City" }],
  KY: [{ city: "Louisville" }, { city: "Lexington" }, { city: "Bowling Green" }],
  LA: [{ city: "New Orleans" }, { city: "Baton Rouge" }, { city: "Shreveport" }],
  ME: [{ city: "Portland" }, { city: "Bangor" }, { city: "Lewiston" }],
  MD: [{ city: "Baltimore" }, { city: "Annapolis" }, { city: "Frederick" }],
  MA: [{ city: "Boston" }, { city: "Worcester" }, { city: "Springfield" }],
  MI: [
    { city: "Detroit", slug: "detroit-michigan" },
    { city: "Grand Rapids" },
    { city: "Ann Arbor" },
  ],
  MN: [{ city: "Minneapolis" }, { city: "Saint Paul" }, { city: "Rochester" }],
  MS: [{ city: "Jackson" }, { city: "Gulfport" }, { city: "Hattiesburg" }],
  MO: [{ city: "Kansas City" }, { city: "St. Louis" }, { city: "Springfield" }],
  MT: [{ city: "Billings" }, { city: "Missoula" }, { city: "Bozeman" }],
  NE: [{ city: "Omaha" }, { city: "Lincoln" }, { city: "Bellevue" }],
  NV: [{ city: "Las Vegas" }, { city: "Reno" }, { city: "Henderson" }],
  NH: [{ city: "Manchester" }, { city: "Nashua" }, { city: "Concord" }],
  NJ: [{ city: "Newark" }, { city: "Jersey City" }, { city: "Trenton" }],
  NM: [{ city: "Albuquerque" }, { city: "Santa Fe" }, { city: "Las Cruces" }],
  NY: [
    { city: "New York City", slug: "new-york-city-new-york" },
    { city: "Buffalo" },
    { city: "Rochester" },
    { city: "Albany" },
  ],
  NC: [
    { city: "Charlotte", slug: "charlotte-north-carolina" },
    { city: "Raleigh" },
    { city: "Asheville" },
  ],
  ND: [{ city: "Fargo" }, { city: "Bismarck" }, { city: "Grand Forks" }],
  OH: [
    { city: "Columbus", slug: "columbus-ohio" },
    { city: "Cleveland", slug: "cleveland-ohio" },
    { city: "Cincinnati", slug: "cincinnati-ohio" },
    { city: "Girard", slug: "girard-ohio" },
    { city: "Dayton" },
    { city: "Akron" },
  ],
  OK: [{ city: "Oklahoma City" }, { city: "Tulsa" }, { city: "Norman" }],
  OR: [{ city: "Portland" }, { city: "Salem" }, { city: "Eugene" }],
  PA: [
    { city: "Philadelphia", slug: "philadelphia-pennsylvania" },
    { city: "Pittsburgh", slug: "pittsburgh-pennsylvania" },
    { city: "Harrisburg" },
  ],
  RI: [{ city: "Providence" }, { city: "Warwick" }, { city: "Cranston" }],
  SC: [{ city: "Charleston" }, { city: "Columbia" }, { city: "Greenville" }],
  SD: [{ city: "Sioux Falls" }, { city: "Rapid City" }, { city: "Aberdeen" }],
  TN: [
    { city: "Nashville", slug: "nashville-tennessee" },
    { city: "Memphis" },
    { city: "Knoxville" },
  ],
  TX: [
    { city: "Houston", slug: "houston-texas" },
    { city: "Dallas", slug: "dallas-texas" },
    { city: "Austin", slug: "austin-texas" },
    { city: "San Antonio" },
  ],
  UT: [{ city: "Salt Lake City" }, { city: "Provo" }, { city: "Ogden" }],
  VT: [{ city: "Burlington" }, { city: "Montpelier" }, { city: "Rutland" }],
  VA: [
    { city: "Virginia Beach" },
    { city: "Richmond" },
    { city: "Arlington" },
  ],
  WA: [{ city: "Seattle" }, { city: "Spokane" }, { city: "Tacoma" }],
  WV: [{ city: "Charleston" }, { city: "Huntington" }, { city: "Morgantown" }],
  WI: [{ city: "Milwaukee" }, { city: "Madison" }, { city: "Green Bay" }],
  WY: [{ city: "Cheyenne" }, { city: "Casper" }, { city: "Laramie" }],
};

function cityEntry(region: string, city: string, slug: string): CityLocation {
  const state = US_STATES.find((entry) => entry.region === region);
  return {
    type: "city",
    slug,
    name: `${city}, ${state?.name || region}`,
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

export const ALL_LOCATION_PAGES: LocationPage[] = [...US_STATES, ...SEO_CITIES];

export function resolveLocationSlug(slug: string): LocationPage | null {
  return ALL_LOCATION_PAGES.find((location) => location.slug === slug) || null;
}

export function getStateByRegion(region: string) {
  return US_STATES.find((state) => state.region === region.toUpperCase()) || null;
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

export function getStateHref(region: string) {
  const state = getStateByRegion(region);
  return state ? getLocationHref(state) : `/search?region=${encodeURIComponent(region)}`;
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
  US_STATES.map((state) => [
    state.region,
    [state.name.toLowerCase(), state.region.toLowerCase(), state.slug.replace(/-/g, " ")],
  ])
);

export function normalizeRegionInput(input?: string) {
  if (!input?.trim()) return "OH";

  const trimmed = input.trim();
  const upper = trimmed.toUpperCase();
  const byCode = US_STATES.find((state) => state.region === upper);
  if (byCode) return byCode.region;

  const byName = US_STATES.find((state) => regionMatches(trimmed, state.region));
  return byName?.region || "OH";
}

export function regionMatches(value: string, region: string) {
  const normalized = value.trim().toLowerCase();
  const code = region.trim().toUpperCase();
  const aliases = REGION_ALIASES[code] || [code.toLowerCase()];
  return aliases.some((alias) => alias === normalized);
}
