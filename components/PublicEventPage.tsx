"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { MapView } from "./MapView";
import { HomeSaleCard } from "./HomeSaleCard";
import { CategoryFilter } from "./CategoryFilter";
import { ShareButton } from "./ShareButton";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { formatEventDateRange, formatTime, getSiteUrl } from "@/lib/utils";
import { buildEventMapPins, EVENT_HQ_PIN_ID } from "@/lib/maps";
import { getTier } from "@/lib/tiers";
import type { EventWithHomes } from "@/types/database";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

interface PublicEventPageProps {
  event: EventWithHomes;
  isSample?: boolean;
}

export function PublicEventPage({ event, isSample = false }: PublicEventPageProps) {
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);

  const focusHomeOnMap = useCallback((homeId: string) => {
    setSelectedHomeId(homeId);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleMapPinClick = useCallback(
    (pinId: string) => {
      if (pinId === EVENT_HQ_PIN_ID) {
        setSelectedHomeId(null);
        return;
      }
      focusHomeOnMap(pinId);
      window.location.href = `/event/${event.slug}/home/${pinId}`;
    },
    [event.slug, focusHomeOnMap]
  );

  const filteredHomes = useMemo(() => {
    if (selectedCategories.length === 0) return event.homes;
    return event.homes.filter((home) =>
      home.categories.some((cat) => selectedCategories.includes(cat))
    );
  }, [event.homes, selectedCategories]);

  const mapPins = useMemo(
    () => buildEventMapPins({ event, homes: filteredHomes }),
    [event, filteredHomes]
  );

  const mapCenter = useMemo(() => {
    const hq = mapPins.find((pin) => pin.id === EVENT_HQ_PIN_ID);
    return hq ? { lat: hq.lat, lng: hq.lng } : undefined;
  }, [mapPins]);

  const headquarters = useMemo(
    () => ({
      address: event.main_address,
      city: event.city,
      region: event.region,
      country: event.country,
      title: "Main event location",
      displayAddress: event.main_address,
    }),
    [event.main_address, event.city, event.region, event.country]
  );

  const geocodeHomes = useMemo(
    () =>
      filteredHomes
        .filter((home) => (home.latitude == null || home.longitude == null) && home.address)
        .map((home) => ({
          id: home.id,
          address: home.address!,
          city: event.city,
          region: event.region,
          country: event.country,
          title: home.seller_name || "Garage Sale",
        })),
    [filteredHomes, event.city, event.region, event.country]
  );

  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;
  const tier = getTier(event.tier);
  const showFlyer = tier?.includesFlyer;
  const showFeatured = event.is_featured || tier?.includesFeatured;
  const showPriorityStyling = tier?.includesPriorityStyling;

  const heroActions = (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <ShareButton url={eventUrl} title={event.title} />
      {showFlyer && (
        <Link
          href={`/event/${event.slug}/flyer`}
          className="rounded-full border border-white/50 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
        >
          Printable Flyer
        </Link>
      )}
    </div>
  );

  const heroDescription = event.description ? (
    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/95">
      {event.description}
    </p>
  ) : null;

  const heroHeader = (
    <>
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
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.title}</h1>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-white">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatEventDateRange(event.event_date, event.event_end_date)}
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
    </>
  );

  const heroContent = (
    <>
      {heroHeader}
      {heroDescription}
      {heroActions}
    </>
  );

  const heroBannerContent = (
    <>
      {heroHeader}
      {heroActions}
      {heroDescription}
    </>
  );

  const heroTextShadows =
    "[&_h1]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] [&_p]:drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)] [&_span]:drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]";

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

      {event.banner_image_url ? (
        <section className="relative text-white">
          <div className="relative min-h-[min(42vw,280px)] w-full bg-charcoal">
            <div className="absolute inset-0">
              <img
                src={event.banner_image_url}
                alt=""
                className="h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-charcoal/15 via-transparent to-charcoal/45"
                aria-hidden
              />
            </div>
            <div className="relative z-10 px-4 py-6 pb-8 md:py-10">
              <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-charcoal/25 px-5 py-6 text-center shadow-lg backdrop-blur-[2px] md:px-10 md:py-8">
                <div className={heroTextShadows}>{heroBannerContent}</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`px-4 py-12 ${
            showFeatured
              ? "bg-gradient-to-br from-teal to-teal/80 text-white"
              : showPriorityStyling
                ? "bg-gradient-to-br from-yellow/40 via-teal to-teal/90 text-white"
                : "bg-teal text-white"
          }`}
        >
          <div className="mx-auto max-w-4xl text-center">{heroContent}</div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div ref={mapSectionRef} className="mb-6 scroll-mt-24">
          <h2 className="text-xl font-bold text-charcoal">Sale Map</h2>
          <p className="text-sm text-charcoal/60">
            {filteredHomes.length} participating home{filteredHomes.length !== 1 ? "s" : ""}
            {event.main_address ? " · yellow pin shows the main event address" : ""}
          </p>
        </div>

        <MapView
          pins={mapPins}
          headquarters={headquarters}
          geocodeHomes={geocodeHomes}
          center={mapCenter}
          onPinClick={handleMapPinClick}
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
                eventSlug={event.slug}
                selected={selectedHomeId === home.id}
                onSelect={(h) => focusHomeOnMap(h.id)}
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
