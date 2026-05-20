"use client";

import { useMemo } from "react";
import { MapView } from "@/components/MapView";
import { buildDiscoveryMapPins } from "@/lib/maps";
import type { DiscoveryEvent } from "@/lib/discovery";

interface DiscoveryMapProps {
  events: DiscoveryEvent[];
  className?: string;
}

export function DiscoveryMap({ events, className }: DiscoveryMapProps) {
  const { pins, geocodeEvents } = useMemo(() => buildDiscoveryMapPins(events), [events]);

  return (
    <MapView
      pins={pins}
      geocodeEvents={geocodeEvents}
      nationwideView
      className={className ?? "h-[320px] w-full rounded-2xl sm:h-[420px] md:h-[480px]"}
    />
  );
}
