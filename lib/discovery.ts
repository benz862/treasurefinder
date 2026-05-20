import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoEvent } from "@/lib/demo-events";
import { geocodeAddress } from "@/lib/maps";
import { regionMatches } from "@/lib/locations";
import type { Event } from "@/types/database";

export type DiscoveryEvent = Event & { homeCount: number };

/** A participating home that matched an item/treasure keyword search. */
export type ItemSearchMatch = {
  homeId: string;
  sellerName: string | null;
  address: string | null;
  matchedItems: string[];
  snippet: string | null;
};

export type DiscoveryEventResult = DiscoveryEvent & {
  matchingHomes?: ItemSearchMatch[];
};

export type DiscoveryFilters = {
  query?: string;
  /** Search listings nationwide for tools, antiques, brands, etc. */
  itemQuery?: string;
  city?: string;
  region?: string;
  zip?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean;
  upcomingOnly?: boolean;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  limit?: number;
};

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getThisWeekendRange(reference = new Date()) {
  const day = reference.getDay();
  const saturday = new Date(reference);
  saturday.setHours(12, 0, 0, 0);

  if (day === 6) {
    // Saturday
  } else if (day === 0) {
    saturday.setDate(saturday.getDate() - 1);
  } else {
    saturday.setDate(saturday.getDate() + (6 - day));
  }

  const sunday = new Date(saturday);
  sunday.setDate(sunday.getDate() + 1);

  return { from: toDateString(saturday), to: toDateString(sunday) };
}

function eventMatchesDateRange(
  event: Event,
  dateFrom?: string,
  dateTo?: string
) {
  if (!dateFrom && !dateTo) return true;

  const start = event.event_date;
  const end = event.event_end_date || event.event_date;
  const from = dateFrom || "1900-01-01";
  const to = dateTo || "9999-12-31";

  return start <= to && end >= from;
}

function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseSearchTerms(text: string) {
  return text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function termsMatchHaystack(terms: string[], haystack: string) {
  return terms.length > 0 && terms.every((term) => haystack.includes(term));
}

function buildHomeSearchHaystack(home: {
  seller_name: string | null;
  address: string | null;
  description: string | null;
  notes: string | null;
  featured_items: string[];
  categories: string[];
}) {
  return [
    home.seller_name,
    home.address,
    home.description,
    home.notes,
    ...(home.featured_items || []),
    ...(home.categories || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

async function attachItemMatches(
  events: DiscoveryEvent[],
  itemQuery: string
): Promise<DiscoveryEventResult[]> {
  const terms = parseSearchTerms(itemQuery);
  if (!terms.length) return events;

  const eventIds = events.map((event) => event.id);
  if (!eventIds.length) return [];

  const supabase = await createClient();
  const { data: homes } = await supabase
    .from("homes")
    .select(
      "id, event_id, seller_name, address, description, featured_items, categories, notes"
    )
    .in("event_id", eventIds)
    .eq("approval_status", "approved");

  const matchesByEvent = new Map<string, ItemSearchMatch[]>();

  for (const home of homes || []) {
    const haystack = buildHomeSearchHaystack(home);
    if (!termsMatchHaystack(terms, haystack)) continue;

    const matchedItems = ((home.featured_items || []) as string[]).filter((item: string) =>
      terms.some((term) => item.toLowerCase().includes(term))
    );

    const list = matchesByEvent.get(home.event_id) || [];
    list.push({
      homeId: home.id,
      sellerName: home.seller_name,
      address: home.address,
      matchedItems,
      snippet: home.description?.trim() || null,
    });
    matchesByEvent.set(home.event_id, list);
  }

  const results: DiscoveryEventResult[] = [];

  for (const event of events) {
    const eventHaystack = [event.title, event.description || "", event.city, event.region]
      .join(" ")
      .toLowerCase();
    const homeMatches = matchesByEvent.get(event.id);
    const eventLevelMatch = termsMatchHaystack(terms, eventHaystack);

    if (homeMatches?.length) {
      results.push({ ...event, matchingHomes: homeMatches });
    } else if (eventLevelMatch) {
      results.push({ ...event, matchingHomes: [] });
    }
  }

  return results;
}

function matchesTextQuery(event: Event, query: string) {
  const haystack = [
    event.title,
    event.city,
    event.region,
    event.main_address,
    event.description || "",
  ]
    .join(" ")
    .toLowerCase();

  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

async function attachHomeCounts(events: Event[]): Promise<DiscoveryEvent[]> {
  if (!events.length) return [];

  const supabase = await createClient();
  const eventIds = events.map((event) => event.id);

  const { data: homes } = await supabase
    .from("homes")
    .select("event_id")
    .in("event_id", eventIds)
    .eq("approval_status", "approved");

  const counts = new Map<string, number>();
  for (const home of homes || []) {
    counts.set(home.event_id, (counts.get(home.event_id) || 0) + 1);
  }

  return events.map((event) => ({
    ...event,
    homeCount: counts.get(event.id) || 0,
  }));
}

async function getCategoryEventIds(category: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homes")
    .select("event_id")
    .eq("approval_status", "approved")
    .contains("categories", [category]);

  return new Set((data || []).map((row) => row.event_id));
}

export async function searchPublishedEvents(
  filters: DiscoveryFilters = {}
): Promise<DiscoveryEventResult[]> {
  const supabase = await createClient();
  const today = toDateString(new Date());

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true });

  if (filters.featured) {
    query = query.eq("is_featured", true);
  }

  const { data: events, error } = await query;
  if (error || !events?.length) return [];

  let filtered = (events as Event[]).filter((event) => !isDemoEvent(event));

  if (filters.upcomingOnly !== false) {
    filtered = filtered.filter((event) => {
      const end = event.event_end_date || event.event_date;
      return end >= today;
    });
  }

  if (filters.city) {
    const city = filters.city.trim().toLowerCase();
    filtered = filtered.filter((event) => event.city.toLowerCase().includes(city));
  }

  if (filters.region) {
    filtered = filtered.filter(
      (event) =>
        regionMatches(event.region, filters.region!) ||
        regionMatches(filters.region!, event.region)
    );
  }

  if (filters.zip) {
    const zip = filters.zip.trim();
    filtered = filtered.filter((event) => event.main_address.includes(zip));
  }

  if (filters.query) {
    filtered = filtered.filter((event) => matchesTextQuery(event, filters.query!));
  }

  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter((event) =>
      eventMatchesDateRange(event, filters.dateFrom, filters.dateTo)
    );
  }

  if (filters.category) {
    const categoryEventIds = await getCategoryEventIds(filters.category);
    filtered = filtered.filter((event) => categoryEventIds.has(event.id));
  }

  if (
    filters.latitude != null &&
    filters.longitude != null &&
    filters.radiusMiles
  ) {
    filtered = filtered.filter((event) => {
      if (event.latitude == null || event.longitude == null) return false;
      return (
        haversineMiles(
          filters.latitude!,
          filters.longitude!,
          Number(event.latitude),
          Number(event.longitude)
        ) <= filters.radiusMiles!
      );
    });
  }

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  const withCounts = await attachHomeCounts(filtered);

  if (filters.itemQuery?.trim()) {
    return attachItemMatches(withCounts, filters.itemQuery);
  }

  return withCounts;
}

/** Published events with optional item matches on participating homes (nationwide when no location set). */
export async function searchDiscovery(
  filters: DiscoveryFilters = {}
): Promise<DiscoveryEventResult[]> {
  return searchPublishedEvents(filters);
}

export async function getFeaturedEvents(limit = 6) {
  return searchPublishedEvents({ featured: true, limit });
}

export async function getWeekendEvents(limit = 6) {
  const { from, to } = getThisWeekendRange();
  return searchPublishedEvents({ dateFrom: from, dateTo: to, limit });
}

export async function getUpcomingEvents(limit = 6) {
  return searchPublishedEvents({ limit });
}

/** All published upcoming events for the nationwide discovery map. */
export async function getMapEvents() {
  return searchPublishedEvents({ upcomingOnly: true });
}

/** Fill missing coordinates so map pins can render on first paint when possible. */
export async function hydrateEventCoordinates<T extends Event>(
  events: T[]
): Promise<T[]> {
  const missing = events.filter(
    (event) =>
      event.main_address?.trim() &&
      (event.latitude == null || event.longitude == null)
  );

  if (!missing.length) return events;

  let admin: ReturnType<typeof createAdminClient> | null = null;
  try {
    admin = createAdminClient();
  } catch {
    admin = null;
  }

  const byId = new Map(events.map((event) => [event.id, { ...event } as T]));

  for (const event of missing) {
    const geo = await geocodeAddress({
      address: event.main_address,
      city: event.city,
      region: event.region,
      country: event.country,
    });

    if (!geo) continue;

    const updated = byId.get(event.id);
    if (!updated) continue;

    updated.latitude = geo.latitude;
    updated.longitude = geo.longitude;

    if (admin) {
      await admin
        .from("events")
        .update({
          latitude: geo.latitude,
          longitude: geo.longitude,
        })
        .eq("id", event.id);
    }
  }

  return Array.from(byId.values()) as T[];
}
