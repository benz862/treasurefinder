import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SAMPLE_EVENT, SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import { getTier } from "@/lib/tiers";
import { formatEventDateRange, formatTime, getSiteUrl } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { PrintButton } from "@/components/PrintButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  if (slug === SAMPLE_EVENT_SLUG) return SAMPLE_EVENT;

  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Flyer Not Found" };
  return { title: `Flyer — ${event.title}` };
}

export default async function FlyerPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const tier = getTier(event.tier);
  if (!tier?.includesFlyer) notFound();

  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      <div className="mx-auto max-w-lg border-4 border-teal p-8 text-center print:border-2">
        <p className="text-sm font-bold uppercase tracking-widest text-teal">
          Garage Sale Event
        </p>
        <h1 className="mt-4 text-3xl font-bold text-charcoal">{event.title}</h1>
        <p className="mt-4 text-xl text-charcoal">
          {formatEventDateRange(event.event_date, event.event_end_date)}
        </p>
        <p className="text-lg text-charcoal/80">
          {formatTime(event.start_time)} – {formatTime(event.end_time)}
        </p>
        <p className="mt-2 text-lg font-medium text-teal">
          {event.city}, {event.region}
        </p>
        {event.description && (
          <p className="mt-4 text-sm text-charcoal/70">{event.description}</p>
        )}
        <div className="mt-8 flex justify-center">
          <QRCodeSVG value={eventUrl} size={180} level="M" />
        </div>
        <p className="mt-4 text-sm font-bold text-charcoal">
          Scan to see the full garage sale map
        </p>
        <p className="mt-2 break-all text-xs text-charcoal/60">{eventUrl}</p>
        <p className="mt-8 text-xs text-charcoal/40">Powered by Treasure Finder</p>
      </div>
      <div className="no-print mx-auto mt-6 max-w-lg text-center">
        <PrintButton />
      </div>
    </div>
  );
}
