import { createClient } from "@/lib/supabase/server";
import { regionMatches } from "@/lib/locations";
import type { Event } from "@/types/database";

export type DiscoveryEvent = Event & { homeCount: number };

export type DiscoveryFilters = {
  query?: string;
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
): Promise<DiscoveryEvent[]> {
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

  let filtered = events as Event[];

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

  return attachHomeCounts(filtered);
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
