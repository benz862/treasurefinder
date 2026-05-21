"use client";

import Link from "next/link";
import { Calendar, MapPin, X } from "lucide-react";
import { getCategoryByKey } from "@/lib/eventCategories";
import { inferEventCategory } from "@/lib/inferEventCategory";
import { formatEventDateRange } from "@/lib/utils";
import type { DiscoveryEvent } from "@/lib/discovery";

interface DiscoveryEventPreviewCardProps {
  event: DiscoveryEvent;
  onClose: () => void;
}

export function DiscoveryEventPreviewCard({ event, onClose }: DiscoveryEventPreviewCardProps) {
  const category = getCategoryByKey(inferEventCategory(event));

  return (
    <div className="animate-fade-in w-[min(100vw-2rem,360px)] overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xl">
      <div
        className="relative h-24"
        style={{
          background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}99 50%, #1A6B6B 100%)`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
        <span
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/60">
          <Calendar className="h-3.5 w-3.5" />
          {formatEventDateRange(event.event_date, event.event_end_date)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/60">
          <MapPin className="h-3.5 w-3.5" />
          {event.city}, {event.region}
        </p>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal/75">{event.description}</p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/event/${event.slug}`}
            className="rounded-xl bg-coral py-2 text-center text-xs font-bold text-white hover:bg-coral/90"
          >
            View Event
          </Link>
          <Link
            href={`/explore?focus=${event.slug}`}
            className="rounded-xl border border-teal-100 py-2 text-center text-xs font-bold text-teal hover:bg-teal/5"
          >
            Open Map
          </Link>
        </div>
      </div>
    </div>
  );
}
