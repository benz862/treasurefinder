export const EVENT_CATEGORY_KEYS = [
  "garage_sale",
  "estate_sale",
  "flea_market",
  "craft_fair",
  "vendor_market",
  "community_bazaar",
  "farmers_market",
] as const;

export type EventCategoryKey = (typeof EVENT_CATEGORY_KEYS)[number];

export interface EventCategoryConfig {
  key: EventCategoryKey;
  label: string;
  slug: string;
  color: string;
  mood: string;
  markerIcon: "garage" | "home" | "tent" | "palette" | "storefront" | "heart" | "leaf";
  description: string;
}

export const EVENT_CATEGORIES: Record<EventCategoryKey, EventCategoryConfig> = {
  garage_sale: {
    key: "garage_sale",
    label: "Garage Sales",
    slug: "garage-sales",
    color: "#C94F3D",
    mood: "Neighborhood excitement",
    markerIcon: "garage",
    description: "Treasure hunts, yard sales, and neighborhood finds",
  },
  estate_sale: {
    key: "estate_sale",
    label: "Estate Sales",
    slug: "estate-sales",
    color: "#7A2E3A",
    mood: "Vintage / premium",
    markerIcon: "home",
    description: "Estate sales and whole-home treasure discoveries",
  },
  flea_market: {
    key: "flea_market",
    label: "Flea Markets",
    slug: "flea-markets",
    color: "#2E7C7B",
    mood: "Busy treasure hunting",
    markerIcon: "tent",
    description: "Vendor rows, vintage booths, and bargain hunting",
  },
  craft_fair: {
    key: "craft_fair",
    label: "Craft Fairs",
    slug: "craft-fairs",
    color: "#D89A2B",
    mood: "Creative / handmade",
    markerIcon: "palette",
    description: "Handmade goods, artisans, and creative makers",
  },
  vendor_market: {
    key: "vendor_market",
    label: "Vendor Markets",
    slug: "vendor-markets",
    color: "#4C7A4D",
    mood: "Community shopping",
    markerIcon: "storefront",
    description: "Local vendors, pop-ups, and community shopping",
  },
  community_bazaar: {
    key: "community_bazaar",
    label: "Community Events",
    slug: "community-events",
    color: "#8364A8",
    mood: "Family / community",
    markerIcon: "heart",
    description: "Church bazaars, charity sales, and community gatherings",
  },
  farmers_market: {
    key: "farmers_market",
    label: "Farmers Markets",
    slug: "farmers-markets",
    color: "#6E9B4B",
    mood: "Fresh / local",
    markerIcon: "leaf",
    description: "Fresh produce, local growers, and weekend markets",
  },
};

export const EVENT_CATEGORY_LIST = Object.values(EVENT_CATEGORIES);

export function getCategoryByKey(key: EventCategoryKey): EventCategoryConfig {
  return EVENT_CATEGORIES[key];
}

export function getCategoryBySlug(slug: string): EventCategoryConfig | undefined {
  return EVENT_CATEGORY_LIST.find((c) => c.slug === slug);
}

export const CATEGORY_SLUGS = EVENT_CATEGORY_LIST.map((c) => c.slug);
