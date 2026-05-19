"use client";

import { useMemo, useState } from "react";
import { MapView } from "@/components/MapView";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { CATEGORIES } from "@/lib/categories";
import type { DiscoveryEvent } from "@/lib/discovery";

interface SearchResultsProps {
  events: DiscoveryEvent[];
  initialFilters: {
    location?: string;
    region?: string;
    category?: string;
    date?: string;
    distance?: string;
  };
}

export function SearchResults({ events, initialFilters }: SearchResultsProps) {
  const [category, setCategory] = useState(initialFilters.category || "");
  const [date, setDate] = useState(initialFilters.date || "upcoming");
  const [distance, setDistance] = useState(initialFilters.distance || "");

  const filteredEvents = useMemo(() => {
    let results = events;

    if (date === "weekend") {
      const now = new Date();
      const day = now.getDay();
      const saturday = new Date(now);
      if (day === 0) saturday.setDate(saturday.getDate() - 1);
      else if (day !== 6) saturday.setDate(saturday.getDate() + (6 - day));
      const sunday = new Date(saturday);
      sunday.setDate(sunday.getDate() + 1);
      const from = saturday.toISOString().slice(0, 10);
      const to = sunday.toISOString().slice(0, 10);
      results = results.filter((event) => {
        const end = event.event_end_date || event.event_date;
        return event.event_date <= to && end >= from;
      });
    }

    return results;
  }, [events, date]);

  const mapPins = useMemo(
    () =>
      filteredEvents
        .filter((event) => event.latitude != null && event.longitude != null)
        .map((event) => ({
          id: event.id,
          lat: Number(event.latitude),
          lng: Number(event.longitude),
          title: event.title,
          address: `${event.city}, ${event.region}`,
        })),
    [filteredEvents]
  );

  const center = mapPins[0]
    ? { lat: mapPins[0].lat, lng: mapPins[0].lng }
    : undefined;

  function buildFilterUrl(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (initialFilters.location) params.set("location", initialFilters.location);
    if (initialFilters.region) params.set("region", initialFilters.region);
    if (updates.category ?? category) params.set("category", updates.category ?? category);
    if (updates.date ?? date) params.set("date", updates.date ?? date);
    if (updates.distance ?? distance) params.set("distance", updates.distance ?? distance);
    return `/search?${params.toString()}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-teal-100 bg-white p-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-charcoal">Filters</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-charcoal/60">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    window.location.href = buildFilterUrl({ category: e.target.value });
                  }}
                  className="mt-1 w-full rounded-xl border border-teal-100 px-3 py-2 text-sm"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal/60">Date</label>
                <select
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    window.location.href = buildFilterUrl({ date: e.target.value });
                  }}
                  className="mt-1 w-full rounded-xl border border-teal-100 px-3 py-2 text-sm"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="weekend">This weekend</option>
                  <option value="all">All dates</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal/60">Distance</label>
                <select
                  value={distance}
                  onChange={(e) => {
                    setDistance(e.target.value);
                    window.location.href = buildFilterUrl({ distance: e.target.value });
                  }}
                  className="mt-1 w-full rounded-xl border border-teal-100 px-3 py-2 text-sm"
                >
                  <option value="">Any distance</option>
                  <option value="25">Within 25 miles</option>
                  <option value="50">Within 50 miles</option>
                  <option value="100">Within 100 miles</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <p className="text-sm text-charcoal/60">
            {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"} found
            {initialFilters.location ? ` near ${initialFilters.location}` : ""}
            {initialFilters.region ? `, ${initialFilters.region}` : ""}
          </p>

          {mapPins.length > 0 && (
            <div className="mt-6">
              <MapView
                pins={mapPins}
                center={center}
                className="h-[280px] w-full rounded-2xl md:h-[360px]"
              />
            </div>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-white p-10 text-center">
                <p className="text-lg font-medium text-charcoal">No sales found</p>
                <p className="mt-2 text-sm text-charcoal/60">
                  Try a nearby city, another weekend, or browse by state below.
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <PublicDiscoveryEventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
