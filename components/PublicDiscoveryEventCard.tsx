import Link from "next/link";
import { Calendar, Home, MapPin, Sparkles } from "lucide-react";
import { formatEventDateRange } from "@/lib/utils";
import type { DiscoveryEvent } from "@/lib/discovery";

interface PublicDiscoveryEventCardProps {
  event: DiscoveryEvent;
}

export function PublicDiscoveryEventCard({ event }: PublicDiscoveryEventCardProps) {
  return (
    <Link
      href={`/event/${event.slug}`}
      className="group overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-yellow/30 via-teal/20 to-coral/20">
        {event.banner_image_url ? (
          <img
            src={event.banner_image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-lg font-bold text-teal/80">{event.city}, {event.region}</p>
          </div>
        )}
        {event.is_featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-charcoal">
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
          <p className="flex items-center gap-2">
            <Home className="h-4 w-4 shrink-0 text-teal" />
            {event.homeCount} participating home{event.homeCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </Link>
  );
}
