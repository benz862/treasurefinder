import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Layout";
import { PublicEventPage } from "@/components/PublicEventPage";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildEventJsonLd } from "@/lib/eventSchema";
import { geocodeAddress } from "@/lib/maps";
import { getMapEvents } from "@/lib/discovery";
import { getCategoryByKey } from "@/lib/eventCategories";
import { inferEventCategory } from "@/lib/inferEventCategory";
import { getSeedEventBySlug } from "@/lib/seedPublicEvents";
import { SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import { getPublicSampleEvent } from "@/lib/server/marketing-sample";
import { formatEventDateRange, getSiteUrl } from "@/lib/utils";
import type { EventWithHomes } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string): Promise<EventWithHomes | null> {
  if (slug === SAMPLE_EVENT_SLUG) {
    return getPublicSampleEvent();
  }

  const seedEvent = getSeedEventBySlug(slug);
  if (seedEvent) return seedEvent;

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) return null;

  if (!event.latitude || !event.longitude) {
    const geo = await geocodeAddress({
      address: event.main_address,
      city: event.city,
      region: event.region,
      country: event.country,
    });

    if (geo) {
      event.latitude = geo.latitude;
      event.longitude = geo.longitude;

      const admin = createAdminClient();
      await admin
        .from("events")
        .update({
          latitude: geo.latitude,
          longitude: geo.longitude,
        })
        .eq("id", event.id);
    }
  }

  const { data: homes } = await supabase
    .from("homes")
    .select("*, home_photos(*)")
    .eq("event_id", event.id)
    .eq("approval_status", "approved")
    .order("sort_order");

  return { ...event, homes: homes || [] } as EventWithHomes;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found" };

  const category = getCategoryByKey(inferEventCategory(event));
  const description =
    event.description ||
    `${category.label} in ${event.city}, ${event.region}. Browse the interactive map and discover local treasures.`;
  const url = `${getSiteUrl()}/event/${event.slug}`;

  return {
    title: `${event.title} | ${formatEventDateRange(event.event_date, event.event_end_date)}`,
    description,
    keywords: [
      category.label,
      event.city,
      event.region,
      "local events",
      "treasure finder",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: event.title,
      description,
      url,
      type: "website",
      locale: "en_US",
      images: event.banner_image_url
        ? [{ url: `${getSiteUrl()}${event.banner_image_url}`, alt: event.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: event.banner_image_url ? [`${getSiteUrl()}${event.banner_image_url}`] : undefined,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, nearbyEvents] = await Promise.all([getEvent(slug), getMapEvents()]);

  if (!event) notFound();

  const jsonLd = buildEventJsonLd(event);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <PublicEventPage
        event={event}
        isSample={slug === SAMPLE_EVENT_SLUG}
        nearbyEvents={nearbyEvents}
      />
      <Footer />
    </>
  );
}
