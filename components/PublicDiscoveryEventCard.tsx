"use client";

import { Calendar, Home, MapPin, Sparkles } from "lucide-react";
import { getCategoryByKey } from "@/lib/eventCategories";
import { inferEventCategory } from "@/lib/inferEventCategory";
import { formatEventDateRange } from "@/lib/utils";
import type { DiscoveryEvent } from "@/lib/discovery";

interface PublicDiscoveryEventCardProps {
  event: DiscoveryEvent;
}

export function PublicDiscoveryEventCard({ event }: PublicDiscoveryEventCardProps) {
  const category = getCategoryByKey(inferEventCategory(event));

  if (!event.slug) {
    return (
      <article className="overflow-hidden rounded-3xl border border-teal-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
        <p className="mt-2 text-sm text-charcoal/60">Event page unavailable</p>
      </article>
    );
  }

  const href = `/event/${event.slug}`;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.defaultPrevented
    ) {
      return;
    }
    e.preventDefault();
    window.location.assign(href);
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group block cursor-pointer overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-yellow/30 via-teal/20 to-coral/20">
        {event.banner_image_url ? (
          <img
            src={event.banner_image_url}
            alt={event.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            draggable={false}
          />
        ) : (
          <div
            className="flex h-full items-center justify-center px-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${category.color}33 0%, ${category.color}11 100%)`,
            }}
          >
            <p className="text-lg font-bold" style={{ color: category.color }}>
              {event.city}, {event.region}
            </p>
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ backgroundColor: category.color }}
        />
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </span>
        {event.is_featured && (
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-charcoal">
            <Sparkles className="h-3.5 w-3.5" />
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-charcoal group-hover:text-teal">{event.title}</h3>
        <div className="mt-3 space-y-2 text-sm text-charcoal/70">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-teal" />
            {formatEventDateRange(event.event_date, event.event_end_date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-teal" />
            {event.city}, {event.region}
          </p>
          {event.homeCount > 0 && (
            <p className="flex items-center gap-2">
              <Home className="h-4 w-4 shrink-0 text-teal" />
              {event.homeCount} participating location{event.homeCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
