"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DiscoveryMap } from "@/components/DiscoveryMap";
import { CategoryChips } from "@/components/CategoryChips";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { filterByEventCategories } from "@/lib/inferEventCategory";
import { getCategoryBySlug } from "@/lib/eventCategories";
import type { EventCategoryKey } from "@/lib/eventCategories";
import type { DiscoveryEvent } from "@/lib/discovery";

interface ExploreMapClientProps {
  initialEvents: DiscoveryEvent[];
}

export function ExploreMapClient({ initialEvents }: ExploreMapClientProps) {
  const searchParams = useSearchParams();
  const typeSlug = searchParams.get("type");

  const [categories, setCategories] = useState<EventCategoryKey[]>(() => {
    const cat = typeSlug ? getCategoryBySlug(typeSlug) : undefined;
    return cat ? [cat.key] : [];
  });
  const [locating, setLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const cat = typeSlug ? getCategoryBySlug(typeSlug) : undefined;
    if (cat) setCategories([cat.key]);
  }, [typeSlug]);

  const filteredEvents = useMemo(() => {
    let results = filterByEventCategories(initialEvents, categories);
    if (userLocation) {
      results = [...results].sort((a, b) => {
        const dist = (event: DiscoveryEvent) => {
          if (event.latitude == null || event.longitude == null) return Infinity;
          const dLat = event.latitude - userLocation.lat;
          const dLng = event.longitude - userLocation.lng;
          return dLat * dLat + dLng * dLng;
        };
        return dist(a) - dist(b);
      });
    }
    return results;
  }, [initialEvents, categories, userLocation]);

  const handleNearMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal">Map-first discovery</p>
          <h1 className="text-3xl font-bold text-charcoal md:text-4xl">Explore Local Events</h1>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
            Color-coded markers for garage sales, estate sales, markets, and community events.
            Click a pin for a quick preview.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNearMe}
          disabled={locating}
          className="shrink-0 rounded-full border-2 border-teal bg-teal/10 px-5 py-2.5 text-sm font-bold text-teal hover:bg-teal/20 disabled:opacity-50"
        >
          {locating ? "Locating…" : "📍 Events Near Me"}
        </button>
      </div>

      <DiscoveryMap
        events={filteredEvents}
        showCategoryFilters
        previewOnClick
        userLocation={userLocation}
        className="h-[360px] w-full rounded-2xl sm:h-[480px] md:h-[560px]"
      />

      <div className="mt-6 rounded-2xl border border-teal-100 bg-white p-4 md:hidden">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal">Filter by type</p>
        <CategoryChips selected={categories} onChange={setCategories} />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-charcoal">
          {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}
          {userLocation ? " · sorted by distance" : ""}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <PublicDiscoveryEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
