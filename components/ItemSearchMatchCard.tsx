"use client";

import { MapPin, Package } from "lucide-react";
import type { DiscoveryEventResult, ItemSearchMatch } from "@/lib/discovery";

interface ItemSearchMatchCardProps {
  event: DiscoveryEventResult;
  match: ItemSearchMatch;
}

export function ItemSearchMatchCard({ event, match }: ItemSearchMatchCardProps) {
  if (!event.slug) return null;

  const href = `/event/${event.slug}/home/${match.homeId}`;

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
      className="block rounded-2xl border border-teal-100 bg-white p-4 shadow-sm transition hover:border-teal/40 hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-teal">
        {event.title}
      </p>
      <p className="mt-1 font-bold text-charcoal">
        {match.sellerName || "Participating home"}
      </p>
      {(match.address || event.city) && (
        <p className="mt-1 flex items-start gap-1 text-sm text-charcoal/70">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <span>
            {match.address || `${event.city}, ${event.region}`}
          </span>
        </p>
      )}
      {match.matchedItems.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {match.matchedItems.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-yellow/40 px-3 py-1 text-xs font-medium text-charcoal"
            >
              <Package className="h-3 w-3" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {match.snippet && (
        <p className="mt-2 line-clamp-2 text-sm text-charcoal/60">{match.snippet}</p>
      )}
    </a>
  );
}
