"use client";

import Link from "next/link";
import { Calendar, ExternalLink, Heart, MapPin, Navigation, Share2, X } from "lucide-react";
import { useState } from "react";
import { getCategoryByKey } from "@/lib/eventCategories";
import { inferEventCategory } from "@/lib/inferEventCategory";
import { formatDistanceMiles, haversineMiles } from "@/lib/geo";
import { formatEventDateRange, getDirectionsUrl, getSiteUrl } from "@/lib/utils";
import type { DiscoveryEvent } from "@/lib/discovery";

interface DiscoveryEventPreviewCardProps {
  event: DiscoveryEvent;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

export function DiscoveryEventPreviewCard({
  event,
  onClose,
  userLocation,
}: DiscoveryEventPreviewCardProps) {
  const category = getCategoryByKey(inferEventCategory(event));
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const distance =
    userLocation && event.latitude != null && event.longitude != null
      ? formatDistanceMiles(
          haversineMiles(
            userLocation.lat,
            userLocation.lng,
            Number(event.latitude),
            Number(event.longitude),
          ),
        )
      : null;

  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;
  const directionsUrl = getDirectionsUrl(event.main_address || `${event.city}, ${event.region}`);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, url: eventUrl });
        return;
      } catch {
        // cancelled
      }
    }
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-fade-in w-[min(100vw-2rem,380px)] overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-2xl">
      <div className="relative aspect-[2/1] bg-charcoal/10">
        {event.banner_image_url ? (
          <img src={event.banner_image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}88 100%)`,
            }}
          />
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ backgroundColor: category.color }}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>
        <span
          className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-charcoal/60">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatEventDateRange(event.event_date, event.event_end_date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.city}, {event.region}
          </span>
          {distance && <span className="font-medium text-teal">{distance}</span>}
        </div>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm text-charcoal/75">{event.description}</p>
        )}
        {event.homeCount > 0 && (
          <p className="mt-2 text-xs font-medium text-charcoal/55">
            {event.homeCount} participating location{event.homeCount === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href={`/event/${event.slug}`}
            className="rounded-xl bg-coral py-2.5 text-center text-xs font-bold text-white hover:bg-coral/90"
          >
            View Event
          </Link>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-teal-100 py-2.5 text-xs font-bold text-teal hover:bg-teal/5"
          >
            <Navigation className="h-3.5 w-3.5" />
            Directions
          </a>
          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            className={`inline-flex items-center justify-center gap-1 rounded-xl border py-2.5 text-xs font-bold ${
              saved
                ? "border-coral/30 bg-coral/10 text-coral"
                : "border-teal-100 text-charcoal/70 hover:bg-teal/5"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-teal-100 py-2.5 text-xs font-bold text-charcoal/70 hover:bg-teal/5"
          >
            {copied ? <ExternalLink className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
