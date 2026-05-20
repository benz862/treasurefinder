import Link from "next/link";
import { MapPin, Clock, ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import {
  formatEventDateRange,
  formatTime,
  getDirectionsUrl,
  getSiteUrl,
} from "@/lib/utils";
import type { Event, HomeWithPhotos } from "@/types/database";

interface HomeListingDetailProps {
  event: Event;
  home: HomeWithPhotos;
}

export function HomeListingDetail({ event, home }: HomeListingDetailProps) {
  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;
  const photos = [...home.home_photos].sort((a, b) => a.sort_order - b.sort_order);
  const hours =
    home.opening_time || home.closing_time
      ? `${home.opening_time ? formatTime(home.opening_time) : ""}${
          home.opening_time && home.closing_time ? " – " : ""
        }${home.closing_time ? formatTime(home.closing_time) : ""}`
      : `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6 text-sm text-charcoal/60">
        <Link
          href={eventUrl}
          className="inline-flex items-center gap-1.5 font-medium text-teal hover:text-teal/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {event.title}
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-sm font-medium text-teal">
          {event.city}, {event.region}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-charcoal md:text-4xl">
          {home.seller_name || "Garage Sale"}
        </h1>
        {home.address && (
          <p className="mt-2 flex items-center gap-1.5 text-charcoal/70">
            <MapPin className="h-4 w-4 shrink-0 text-teal" />
            {home.address}
          </p>
        )}
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal/60">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatEventDateRange(event.event_date, event.event_end_date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {hours}
          </span>
        </p>
      </header>

      {photos.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-charcoal">Photos</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `${home.seller_name || "Garage sale"} photo`}
                  className="aspect-[4/3] w-full object-cover"
                />
                {photo.caption && (
                  <figcaption className="px-3 py-2 text-sm text-charcoal/70">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {home.description && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-charcoal">About this sale</h2>
          <p className="whitespace-pre-wrap text-charcoal/80 leading-relaxed">
            {home.description}
          </p>
        </section>
      )}

      {home.featured_items.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-charcoal">Featured items</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {home.featured_items.map((item) => (
              <li
                key={item}
                className="rounded-xl bg-yellow/20 px-4 py-2.5 text-sm font-medium text-charcoal"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {home.categories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold text-charcoal">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {home.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal"
              >
                {cat}
              </span>
            ))}
          </div>
        </section>
      )}

      {home.notes && (
        <section className="mb-8 rounded-2xl bg-cream px-5 py-4">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-charcoal/60">
            Notes
          </h2>
          <p className="whitespace-pre-wrap text-sm text-charcoal/80">{home.notes}</p>
        </section>
      )}

      <div className="flex flex-wrap gap-3 border-t border-teal-100 pt-8">
        {home.address && (
          <a
            href={getDirectionsUrl(home.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal/90"
          >
            Get Directions
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <Link
          href={eventUrl}
          className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-5 py-2.5 text-sm font-medium text-teal hover:bg-teal/5"
        >
          View full event map
        </Link>
      </div>
    </article>
  );
}
