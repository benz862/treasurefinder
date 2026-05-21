"use client";

import { useMemo, useState } from "react";
import { MapView } from "@/components/MapView";
import { CategoryChips } from "@/components/CategoryChips";
import { DiscoveryEventPreviewCard } from "@/components/DiscoveryEventPreviewCard";
import { buildDiscoveryMapPins } from "@/lib/maps";
import { filterByEventCategories } from "@/lib/inferEventCategory";
import type { EventCategoryKey } from "@/lib/eventCategories";
import type { DiscoveryEvent } from "@/lib/discovery";

interface DiscoveryMapProps {
  events: DiscoveryEvent[];
  className?: string;
  showCategoryFilters?: boolean;
  previewOnClick?: boolean;
}

export function DiscoveryMap({
  events,
  className,
  showCategoryFilters = false,
  previewOnClick = false,
}: DiscoveryMapProps) {
  const [categories, setCategories] = useState<EventCategoryKey[]>([]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const filteredEvents = useMemo(
    () => filterByEventCategories(events, categories),
    [events, categories],
  );

  const { pins, geocodeEvents } = useMemo(
    () => buildDiscoveryMapPins(filteredEvents),
    [filteredEvents],
  );

  const selectedEvent = filteredEvents.find((event) => event.id === selectedPinId) ?? null;

  return (
    <div className="relative">
      {showCategoryFilters && (
        <div className="absolute left-3 right-3 top-3 z-10 rounded-2xl border border-teal-100 bg-white/95 p-2 shadow-md backdrop-blur-sm sm:left-4 sm:right-4 sm:top-4 sm:p-3">
          <CategoryChips selected={categories} onChange={setCategories} compact />
        </div>
      )}
      <MapView
        pins={pins}
        geocodeEvents={geocodeEvents}
        nationwideView
        previewMode={previewOnClick}
        selectedPinId={selectedPinId}
        onPinClick={(pinId) => setSelectedPinId((current) => (current === pinId ? null : pinId))}
        className={className ?? "h-[320px] w-full rounded-2xl sm:h-[420px] md:h-[480px]"}
      />
      {previewOnClick && selectedEvent && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          <DiscoveryEventPreviewCard
            event={selectedEvent}
            onClose={() => setSelectedPinId(null)}
          />
        </div>
      )}
    </div>
  );
}
