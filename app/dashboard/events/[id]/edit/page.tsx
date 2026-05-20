import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { EventForm } from "@/components/EventForm";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { LimitCounter } from "@/components/LimitCounter";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/admin";
import { assertEventOwner, getSessionOrganizer } from "@/lib/server/organizer";
import { SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import { getSiteUrl } from "@/lib/utils";
import { getTier, type TierId } from "@/lib/tiers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSessionOrganizer();
  if (!session) redirect("/auth/login");

  const { error: accessError } = await assertEventOwner(id, session.profile.id, {
    email: session.user.email,
    role: session.profile.role,
  });

  if (accessError) notFound();

  const isAdmin = isPlatformAdmin({
    email: session.user.email,
    role: session.profile.role,
  });
  const db = isAdmin ? createAdminClient() : await createClient();
  const { data: event } = await db.from("events").select("*").eq("id", id).single();

  if (!event) notFound();

  const { count: homeCount } = await db
    .from("homes")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  const tier = getTier(event.tier as TierId);
  const eventUrl = `${getSiteUrl()}/event/${event.slug}`;
  const isMarketingSample = event.slug === SAMPLE_EVENT_SLUG;

  return (
    <DashboardShell userEmail={session.user.email}>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-teal hover:underline">
          ← Back to Dashboard
        </Link>
        {isMarketingSample && (
          <Link
            href="/admin"
            className="ml-4 text-sm text-teal hover:underline"
          >
            Admin → Marketing sample
          </Link>
        )}
        <h1 className="mt-2 text-2xl font-bold text-charcoal">Edit Event</h1>
        {isMarketingSample && (
          <p className="mt-2 text-sm text-charcoal/60">
            This is the public marketing sample. Keep the slug{" "}
            <code className="rounded bg-teal/10 px-1.5 py-0.5 text-teal">
              {SAMPLE_EVENT_SLUG}
            </code>{" "}
            so homepage and footer links keep working.
          </p>
        )}
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

      <EventForm profileId={session.profile.id} event={event} adminBypass />

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
