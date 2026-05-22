import { getThisWeekendRange } from "@/lib/discovery";
import type { DiscoveryEvent } from "@/lib/discovery";
import type { EventWithHomes } from "@/types/database";

const now = new Date().toISOString();

function weekendDates() {
  const { from, to } = getThisWeekendRange();
  return { event_date: from, event_end_date: to };
}

/** Fictional events that keep discovery maps and listings feeling alive. */
export const SEED_DISCOVERY_EVENTS: DiscoveryEvent[] = [
  {
    id: "seed-maplewood",
    organizer_id: "seed",
    title: "Maplewood Neighborhood Treasure Hunt",
    slug: "maplewood-community-garage-sale",
    description:
      "Fifteen homes along Oak, Birch, and Pine streets — furniture, kids' gear, tools, antiques, and curb-side freebies.",
    ...weekendDates(),
    start_time: "08:00:00",
    end_time: "15:00:00",
    city: "Maplewood",
    region: "NJ",
    country: "US",
    main_address: "45 Maple Avenue, Maplewood, NJ 07040",
    latitude: 40.7312,
    longitude: -74.2734,
    status: "published",
    tier: "neighborhood",
    max_homes: 20,
    is_featured: true,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/banner.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 5,
  },
  {
    id: "seed-columbus-flea",
    organizer_id: "seed",
    title: "Columbus Weekend Flea Market",
    slug: "columbus-weekend-flea-market",
    description:
      "200+ vendor booths, vintage finds, handmade goods, and food trucks at the Ohio Expo Center.",
    ...weekendDates(),
    start_time: "09:00:00",
    end_time: "17:00:00",
    city: "Columbus",
    region: "OH",
    country: "US",
    main_address: "717 E 17th Ave, Columbus, OH 43211",
    latitude: 39.996,
    longitude: -82.983,
    status: "published",
    tier: "community",
    max_homes: 0,
    is_featured: true,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h3-tools.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 0,
  },
  {
    id: "seed-girard-estate",
    organizer_id: "seed",
    title: "Girard Estate Sale — Mid-Century Collection",
    slug: "girard-estate-sale",
    description:
      "Whole-home estate sale featuring mid-century furniture, art glass, vinyl, and rare collectibles.",
    ...weekendDates(),
    start_time: "10:00:00",
    end_time: "16:00:00",
    city: "Philadelphia",
    region: "PA",
    country: "US",
    main_address: "4521 Girard Ave, Philadelphia, PA 19131",
    latitude: 39.972,
    longitude: -75.214,
    status: "published",
    tier: "community",
    max_homes: 1,
    is_featured: false,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h4-antiques.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 1,
  },
  {
    id: "seed-naples-farmers",
    organizer_id: "seed",
    title: "Naples Farmers Market",
    slug: "naples-farmers-market",
    description:
      "Fresh produce, local honey, artisan bread, and live music every Saturday morning downtown.",
    ...weekendDates(),
    start_time: "07:30:00",
    end_time: "12:00:00",
    city: "Naples",
    region: "FL",
    country: "US",
    main_address: "801 5th Ave S, Naples, FL 34102",
    latitude: 26.142,
    longitude: -81.794,
    status: "published",
    tier: "community",
    max_homes: 0,
    is_featured: true,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h3-garden.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 0,
  },
  {
    id: "seed-austin-craft",
    organizer_id: "seed",
    title: "East Austin Craft Fair",
    slug: "east-austin-craft-fair",
    description:
      "Local makers, pottery, jewelry, and handmade textiles in a colorful outdoor market setting.",
    ...weekendDates(),
    start_time: "10:00:00",
    end_time: "18:00:00",
    city: "Austin",
    region: "TX",
    country: "US",
    main_address: "1100 E 5th St, Austin, TX 78702",
    latitude: 30.262,
    longitude: -97.731,
    status: "published",
    tier: "community",
    max_homes: 0,
    is_featured: false,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h2-toys.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 0,
  },
  {
    id: "seed-portland-vendor",
    organizer_id: "seed",
    title: "Portland Saturday Vendor Market",
    slug: "portland-saturday-vendor-market",
    description:
      "Pop-up vendors, vintage clothing, plants, and local food in the Pearl District.",
    ...weekendDates(),
    start_time: "09:00:00",
    end_time: "15:00:00",
    city: "Portland",
    region: "OR",
    country: "US",
    main_address: "937 NW Everett St, Portland, OR 97209",
    latitude: 45.526,
    longitude: -122.682,
    status: "published",
    tier: "community",
    max_homes: 0,
    is_featured: false,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h2-clothes.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 0,
  },
  {
    id: "seed-denver-community",
    organizer_id: "seed",
    title: "St. Mark's Community Bazaar",
    slug: "st-marks-community-bazaar",
    description:
      "Church bazaar with bake sale, kids' games, silent auction, and family-friendly treasure hunting.",
    ...weekendDates(),
    start_time: "08:00:00",
    end_time: "14:00:00",
    city: "Denver",
    region: "CO",
    country: "US",
    main_address: "4900 Colorado Blvd, Denver, CO 80216",
    latitude: 39.785,
    longitude: -104.937,
    status: "published",
    tier: "community",
    max_homes: 0,
    is_featured: false,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h5-curb.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 0,
  },
  {
    id: "seed-san-diego-garage",
    organizer_id: "seed",
    title: "Pacific Beach Block Garage Sale",
    slug: "pacific-beach-block-garage-sale",
    description:
      "Eight homes on Diamond Street — surf gear, patio furniture, and beach-house treasures.",
    ...weekendDates(),
    start_time: "07:00:00",
    end_time: "13:00:00",
    city: "San Diego",
    region: "CA",
    country: "US",
    main_address: "1800 Diamond St, San Diego, CA 92109",
    latitude: 32.796,
    longitude: -117.254,
    status: "published",
    tier: "neighborhood",
    max_homes: 8,
    is_featured: true,
    payment_status: "paid",
    stripe_session_id: null,
    banner_image_url: "/sample/h5-tv.jpg",
    created_at: now,
    updated_at: now,
    homeCount: 8,
  },
];

export function isSeedEventId(id: string) {
  return id.startsWith("seed-");
}

export function mergeWithSeedEvents(events: DiscoveryEvent[]): DiscoveryEvent[] {
  const slugs = new Set(events.map((event) => event.slug));
  const merged = [...events];

  for (const seed of SEED_DISCOVERY_EVENTS) {
    if (!slugs.has(seed.slug)) {
      merged.push(seed);
    }
  }

  return merged;
}

/** Lightweight seed pages for non-Maplewood fictional events. */
export const SEED_EVENT_PAGES: Record<string, EventWithHomes> = Object.fromEntries(
  SEED_DISCOVERY_EVENTS.filter((event) => event.slug !== "maplewood-community-garage-sale").map(
    (event) => [
      event.slug,
      {
        ...event,
        homes: [],
      } as EventWithHomes,
    ],
  ),
);

export function getSeedEventBySlug(slug: string): EventWithHomes | null {
  return SEED_EVENT_PAGES[slug] ?? null;
}
