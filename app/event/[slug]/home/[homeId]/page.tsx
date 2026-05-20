import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Layout";
import { HomeListingDetail } from "@/components/HomeListingDetail";
import { createClient } from "@/lib/supabase/server";
import { SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import { getPublicSampleEvent } from "@/lib/server/marketing-sample";
import type { Event, HomeWithPhotos } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string; homeId: string }>;
}

async function getPublicHomeListing(
  slug: string,
  homeId: string
): Promise<{ event: Event; home: HomeWithPhotos } | null> {
  if (slug === SAMPLE_EVENT_SLUG) {
    const event = await getPublicSampleEvent();
    const home = event.homes.find((h) => h.id === homeId);
    if (!home) return null;
    return { event, home };
  }

  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!event) return null;

  const { data: home } = await supabase
    .from("homes")
    .select("*, home_photos(*)")
    .eq("id", homeId)
    .eq("event_id", event.id)
    .eq("approval_status", "approved")
    .single();

  if (!home) return null;

  return { event, home: home as HomeWithPhotos };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, homeId } = await params;
  const listing = await getPublicHomeListing(slug, homeId);
  if (!listing) return { title: "Listing Not Found" };

  const { event, home } = listing;
  const title = home.seller_name
    ? `${home.seller_name} — ${event.title}`
    : `Garage Sale — ${event.title}`;

  return {
    title,
    description:
      home.description ||
      `Browse photos and details for this participating home at ${event.title} in ${event.city}, ${event.region}.`,
    openGraph: {
      title,
      description: home.description || undefined,
      images: home.home_photos[0]?.image_url
        ? [{ url: home.home_photos[0].image_url }]
        : undefined,
    },
  };
}

export default async function HomeListingPage({ params }: PageProps) {
  const { slug, homeId } = await params;
  const listing = await getPublicHomeListing(slug, homeId);

  if (!listing) notFound();

  return (
    <>
      <Header />
      <HomeListingDetail event={listing.event} home={listing.home} />
      <Footer />
    </>
  );
}
