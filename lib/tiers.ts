export type TierId = "starter" | "neighborhood" | "community";

export interface TierConfig {
  id: TierId;
  name: string;
  price: number;
  priceDisplay: string;
  maxHomes: number;
  maxPhotosPerHome: number;
  features: string[];
  highlighted?: boolean;
  includesFlyer?: boolean;
  includesFeatured?: boolean;
}

export const TIERS: Record<TierId, TierConfig> = {
  starter: {
    id: "starter",
    name: "Starter Event",
    price: 1900,
    priceDisplay: "$19",
    maxHomes: 5,
    maxPhotosPerHome: 3,
    features: [
      "Up to 5 homes",
      "Public event page",
      "Interactive map",
      "Up to 3 photos per home",
    ],
  },
  neighborhood: {
    id: "neighborhood",
    name: "Neighborhood Event",
    price: 3900,
    priceDisplay: "$39",
    maxHomes: 20,
    maxPhotosPerHome: 5,
    highlighted: true,
    includesFlyer: true,
    features: [
      "Up to 20 homes",
      "Public event page",
      "Interactive map",
      "Up to 5 photos per home",
      "Category filtering",
      "Printable flyer with QR code",
    ],
  },
  community: {
    id: "community",
    name: "Community Event",
    price: 7900,
    priceDisplay: "$79",
    maxHomes: 75,
    maxPhotosPerHome: 8,
    includesFlyer: true,
    includesFeatured: true,
    features: [
      "Up to 75 homes",
      "Public event page",
      "Interactive map",
      "Up to 8 photos per home",
      "Category filtering",
      "Printable flyer with QR code",
      "Featured event styling",
    ],
  },
};

export const TIER_LIST = Object.values(TIERS);

export function getTier(id: string): TierConfig | undefined {
  return TIERS[id as TierId];
}
