"use client";

import { useMemo, useState } from "react";
import { DiscoveryMap } from "@/components/DiscoveryMap";
import { ItemSearchMatchCard } from "@/components/ItemSearchMatchCard";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { CATEGORIES } from "@/lib/categories";
import type { DiscoveryEventResult } from "@/lib/discovery";

interface SearchResultsProps {
  events: DiscoveryEventResult[];
  initialFilters: {
    item?: string;
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

  const itemQuery = initialFilters.item?.trim() || "";
  const isItemSearch = itemQuery.length > 0;

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

  const listingMatchCount = useMemo(() => {
    if (!isItemSearch) return 0;
    return filteredEvents.reduce(
      (sum, event) => sum + (event.matchingHomes?.length || 0),
      0
    );
  }, [filteredEvents, isItemSearch]);

  function buildFilterUrl(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (initialFilters.item) params.set("item", initialFilters.item);
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
                  disabled={!initialFilters.location}
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
            {isItemSearch ? (
              <>
                {listingMatchCount > 0
                  ? `${listingMatchCount} listing${listingMatchCount === 1 ? "" : "s"}`
                  : `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"}`}{" "}
                matching &ldquo;{itemQuery}&rdquo;
                {initialFilters.location
                  ? ` near ${initialFilters.location}`
                  : " nationwide"}
                {initialFilters.region ? `, ${initialFilters.region}` : ""}
              </>
            ) : (
              <>
                {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"} found
                {initialFilters.location ? ` near ${initialFilters.location}` : ""}
                {initialFilters.region ? `, ${initialFilters.region}` : ""}
              </>
            )}
          </p>

          <div className="mt-6">
            <DiscoveryMap
              events={filteredEvents}
              className="h-[280px] w-full rounded-2xl md:h-[360px]"
            />
          </div>

          {filteredEvents.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-teal-200 bg-white p-10 text-center">
              <p className="text-lg font-medium text-charcoal">No sales found</p>
              <p className="mt-2 text-sm text-charcoal/60">
                {isItemSearch
                  ? "Try different keywords, check spelling, or search without a location to scan the whole country."
                  : "Try a nearby city, another weekend, or browse by state below."}
              </p>
            </div>
          ) : isItemSearch ? (
            <div className="mt-8 space-y-8">
              {filteredEvents.map((event) => {
                const matches = event.matchingHomes || [];
                if (matches.length > 0) {
                  return (
                    <section key={event.id}>
                      <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
                      <p className="text-sm text-charcoal/60">
                        {event.city}, {event.region}
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {matches.map((match) => (
                          <ItemSearchMatchCard
                            key={match.homeId}
                            event={event}
                            match={match}
                          />
                        ))}
                      </div>
                    </section>
                  );
                }

                return (
                  <section key={event.id}>
                    <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
                    <p className="mt-1 text-sm text-charcoal/60">
                      Event mentions &ldquo;{itemQuery}&rdquo; — browse all participating homes.
                    </p>
                    <div className="mt-4 max-w-md">
                      <PublicDiscoveryEventCard event={event} />
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {filteredEvents.map((event) => (
                <PublicDiscoveryEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
