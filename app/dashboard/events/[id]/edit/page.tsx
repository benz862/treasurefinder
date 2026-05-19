import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { EventForm } from "@/components/EventForm";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { LimitCounter } from "@/components/LimitCounter";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";
import { getTier, type TierId } from "@/lib/tiers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event || event.organizer_id !== profile?.id) notFound();

  const { count: homeCount } = await supabase
    .from("homes")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  const tier = getTier(event.tier as TierId);
  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;

  return (
    <DashboardShell userEmail={user.email}>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-teal hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">Edit Event</h1>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <LimitCounter current={homeCount || 0} max={event.max_homes} />
        {event.status === "published" && (
          <div className="rounded-xl border border-teal-100 bg-white p-4">
            <p className="text-sm font-medium text-charcoal">Public event page</p>
            <Link
              href={`/event/${event.slug}`}
              target="_blank"
              className="mt-1 text-sm text-teal underline break-all"
            >
              {eventUrl}
            </Link>
          </div>
        )}
      </div>

      <EventForm profileId={profile!.id} event={event} />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/events/${id}/homes`}
          className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-teal/90"
        >
          Manage Homes ({homeCount || 0})
        </Link>
        {tier?.includesFlyer && event.status === "published" && (
          <Link
            href={`/event/${event.slug}/flyer`}
            target="_blank"
            className="rounded-full border border-teal-200 px-5 py-2.5 text-sm font-medium text-teal"
          >
            View Printable Flyer
          </Link>
        )}
      </div>

      {event.status === "published" && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-charcoal">Event QR Code</h2>
          <QRCodeGenerator url={eventUrl} eventTitle={event.title} />
        </div>
      )}
    </DashboardShell>
  );
}
