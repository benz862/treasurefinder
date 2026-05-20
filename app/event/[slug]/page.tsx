import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Layout";
import { PublicEventPage } from "@/components/PublicEventPage";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { geocodeAddress } from "@/lib/maps";
import { SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import { getPublicSampleEvent } from "@/lib/server/marketing-sample";
import { formatEventDateRange } from "@/lib/utils";
import type { EventWithHomes } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string): Promise<EventWithHomes | null> {
  if (slug === SAMPLE_EVENT_SLUG) {
    return getPublicSampleEvent();
  }

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

  return {
    title: `${event.title} | ${formatEventDateRange(event.event_date, event.event_end_date)}`,
    description:
      event.description ||
      `Browse participating homes and view the interactive map for ${event.title}.`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
    },
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) notFound();

  return (
    <>
      <Header />
      <PublicEventPage event={event} isSample={slug === SAMPLE_EVENT_SLUG} />
      <Footer />
    </>
  );
}
