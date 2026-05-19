export type TierId = "starter" | "neighborhood" | "community";

export interface TierConfig {
  id: TierId;
  name: string;
  price: number;
  priceDisplay: string;
  maxHomes: number;
  maxPhotosPerHome: number;
  stripeProductId: string;
  idealFor: string;
  features: string[];
  highlighted?: boolean;
  includesFlyer?: boolean;
  includesFeatured?: boolean;
  includesPriorityStyling?: boolean;
}

export const TIERS: Record<TierId, TierConfig> = {
  starter: {
    id: "starter",
    name: "Starter Garage Sale Event",
    price: 1900,
    priceDisplay: "$19",
    maxHomes: 5,
    maxPhotosPerHome: 3,
    stripeProductId: "prod_UXzsCubzPrJxJE",
    idealFor: "Families, small streets, and first-time organizers",
    features: [
      "Up to 5 participating homes",
      "Interactive public map",
      "Public event page",
      "Up to 3 photos per home",
      "Mobile-friendly sharing page",
      "Social media sharing links",
    ],
  },
  neighborhood: {
    id: "neighborhood",
    name: "Neighborhood Garage Sale Event",
    price: 3900,
    priceDisplay: "$39",
    maxHomes: 20,
    maxPhotosPerHome: 5,
    stripeProductId: "prod_UXzsDsIdMYJw4E",
    idealFor: "Subdivisions, churches, schools, and annual neighborhood sales",
    highlighted: true,
    includesFlyer: true,
    includesPriorityStyling: true,
    features: [
      "Up to 20 participating homes",
      "Interactive public map",
      "Up to 5 photos per home",
      "Category filtering",
      "Printable flyer with QR code",
      "Priority event styling",
      "Social sharing tools",
    ],
  },
  community: {
    id: "community",
    name: "Community Mega Sale Event",
    price: 7900,
    priceDisplay: "$79",
    maxHomes: 75,
    maxPhotosPerHome: 8,
    stripeProductId: "prod_UXzswy59x7W35i",
    idealFor: "Town-wide sales, large HOAs, flea markets, and charity events",
    includesFlyer: true,
    includesFeatured: true,
    features: [
      "Up to 75 participating homes",
      "Interactive event map",
      "Up to 8 photos per home",
      "Featured event placement",
      "Printable flyers with QR codes",
      "Enhanced event branding",
      "Category filtering",
      "Priority support",
    ],
  },
};

export const TIER_LIST = Object.values(TIERS);

export function getTier(id: string): TierConfig | undefined {
  return TIERS[id as TierId];
}
