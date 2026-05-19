"use client";

import { useMemo, useState } from "react";
import { MapView } from "./MapView";
import { HomeSaleCard } from "./HomeSaleCard";
import { CategoryFilter } from "./CategoryFilter";
import { ShareButton } from "./ShareButton";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { formatDate, formatTime, getSiteUrl } from "@/lib/utils";
import { getTier } from "@/lib/tiers";
import type { EventWithHomes } from "@/types/database";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

interface PublicEventPageProps {
  event: EventWithHomes;
  isSample?: boolean;
}

export function PublicEventPage({ event, isSample = false }: PublicEventPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);

  const filteredHomes = useMemo(() => {
    if (selectedCategories.length === 0) return event.homes;
    return event.homes.filter((home) =>
      home.categories.some((cat) => selectedCategories.includes(cat))
    );
  }, [event.homes, selectedCategories]);

  const mapPins = useMemo(
    () =>
      filteredHomes
        .filter((h) => h.latitude != null && h.longitude != null)
        .map((h) => ({
          id: h.id,
          lat: Number(h.latitude),
          lng: Number(h.longitude),
          title: h.seller_name || "Garage Sale",
          address: h.address,
        })),
    [filteredHomes]
  );

  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;
  const tier = getTier(event.tier);
  const showFlyer = tier?.includesFlyer;
  const showFeatured = event.is_featured || tier?.includesFeatured;
  const showPriorityStyling = tier?.includesPriorityStyling;

  return (
    <div className="min-h-screen bg-cream">
      {isSample && (
        <div className="bg-yellow px-4 py-2 text-center text-sm font-medium text-charcoal">
          This is a sample event to show how Treasure Finder works.{" "}
          <Link href="/pricing" className="underline">
            Create your own event →
          </Link>
        </div>
      )}

      <section
        className={`px-4 py-12 ${
          showFeatured
            ? "bg-gradient-to-br from-teal to-teal/80 text-white"
            : showPriorityStyling
              ? "bg-gradient-to-br from-yellow/40 via-teal to-teal/90 text-white"
              : "bg-teal text-white"
        }`}
      >
        <div className="mx-auto max-w-4xl text-center">
          {showFeatured && (
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-charcoal">
              <Sparkles className="h-3.5 w-3.5" /> Featured Event
            </span>
          )}
          {showPriorityStyling && !showFeatured && (
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
              Neighborhood Event
            </span>
          )}
          <h1 className="text-3xl font-bold md:text-4xl">{event.title}</h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-white/90">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(event.event_date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(event.start_time)} – {formatTime(event.end_time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {event.city}, {event.region}
            </span>
          </div>
          {event.description && (
            <p className="mx-auto mt-6 max-w-2xl text-white/90">{event.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ShareButton url={eventUrl} title={event.title} />
            {showFlyer && (
              <Link
                href={`/event/${event.slug}/flyer`}
                className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                Printable Flyer
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">Sale Map</h2>
          <p className="text-sm text-charcoal/60">
            {filteredHomes.length} participating home{filteredHomes.length !== 1 ? "s" : ""}
          </p>
        </div>

        <MapView
          pins={mapPins}
          center={
            event.latitude && event.longitude
              ? { lat: Number(event.latitude), lng: Number(event.longitude) }
              : undefined
          }
          onPinClick={setSelectedHomeId}
          selectedPinId={selectedHomeId}
          className="h-[350px] w-full rounded-2xl md:h-[450px]"
        />

        <div className="mt-8">
          <CategoryFilter selected={selectedCategories} onChange={setSelectedCategories} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredHomes.length === 0 ? (
            <p className="col-span-2 text-center text-charcoal/60">
              No homes match the selected categories.
            </p>
          ) : (
            filteredHomes.map((home) => (
              <HomeSaleCard
                key={home.id}
                home={home}
                selected={selectedHomeId === home.id}
                onSelect={(h) => setSelectedHomeId(h.id)}
              />
            ))
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 md:flex-row md:justify-center">
          <QRCodeGenerator url={eventUrl} eventTitle={event.title} />
        </div>
      </div>
    </div>
  );
}
