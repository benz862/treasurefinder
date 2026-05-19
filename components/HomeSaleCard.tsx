import { getDirectionsUrl, formatTime } from "@/lib/utils";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import type { HomeWithPhotos } from "@/types/database";

interface HomeSaleCardProps {
  home: HomeWithPhotos;
  onSelect?: (home: HomeWithPhotos) => void;
  selected?: boolean;
}

export function HomeSaleCard({ home, onSelect, selected }: HomeSaleCardProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${
        selected ? "border-teal ring-2 ring-teal/30" : "border-teal-100 hover:border-teal/40"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onClick={() => onSelect?.(home)}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-charcoal">
            {home.seller_name || "Garage Sale"}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {home.address}
          </p>
        </div>
      </div>

      {home.description && (
        <p className="mt-3 text-sm text-charcoal/80">{home.description}</p>
      )}

      {home.featured_items.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">Featured Items</p>
          <ul className="mt-1 list-inside list-disc text-sm text-charcoal/70">
            {home.featured_items.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {home.categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {home.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-yellow/30 px-2.5 py-0.5 text-xs font-medium text-charcoal"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {(home.opening_time || home.closing_time) && (
        <p className="mt-3 flex items-center gap-1 text-xs text-charcoal/60">
          <Clock className="h-3.5 w-3.5" />
          {home.opening_time && formatTime(home.opening_time)}
          {home.opening_time && home.closing_time && " – "}
          {home.closing_time && formatTime(home.closing_time)}
        </p>
      )}

      {home.notes && (
        <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-xs text-charcoal/70">{home.notes}</p>
      )}

      {home.home_photos.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {home.home_photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.image_url}
              alt={photo.caption || "Sale photo"}
              className="h-16 w-16 shrink-0 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <a
        href={getDirectionsUrl(home.address)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
      >
        Get Directions
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}
