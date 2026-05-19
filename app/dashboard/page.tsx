import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { EventCard } from "@/components/EventCard";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", profile?.id)
    .order("created_at", { ascending: false });

  const { data: unpaidPayments } = await supabase
    .from("payments")
    .select("*")
    .eq("organizer_id", profile?.id)
    .eq("status", "completed")
    .is("event_id", null);

  const homeCounts: Record<string, number> = {};
  let pendingReview = 0;

  if (events?.length) {
    for (const event of events) {
      const { count } = await supabase
        .from("homes")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id);
      homeCounts[event.id] = count || 0;
    }

    const eventIds = events.map((event) => event.id);
    const { count } = await supabase
      .from("homes")
      .select("*", { count: "exact", head: true })
      .in("event_id", eventIds)
      .eq("approval_status", "submitted");

    pendingReview = count || 0;
  }

  return (
    <DashboardShell userEmail={user.email}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Your Events</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Manage your garage sale events and participating homes.
          </p>
        </div>
        <Link
          href="/dashboard/events/new"
          className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral/90"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      {pendingReview > 0 && (
        <div className="mt-6 rounded-xl border border-yellow/50 bg-yellow/20 p-4">
          <p className="font-medium text-charcoal">
            {pendingReview} listing{pendingReview > 1 ? "s" : ""} waiting for your review.
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            Open an event&apos;s Manage Homes page to approve or request changes.
          </p>
        </div>
      )}

      {unpaidPayments && unpaidPayments.length > 0 && (
        <div className="mt-6 rounded-xl border border-leaf/30 bg-leaf/10 p-4">
          <p className="font-medium text-charcoal">
            You have {unpaidPayments.length} paid plan{unpaidPayments.length > 1 ? "s" : ""} ready to use!
          </p>
          <p className="mt-1 text-sm text-charcoal/70">
            Create a new event to use your {unpaidPayments[0].tier} plan.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {!events?.length ? (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-white p-12 text-center">
            <p className="text-lg font-medium text-charcoal">No events yet</p>
            <p className="mt-2 text-sm text-charcoal/60">
              Purchase a plan and create your first garage sale event.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-white"
              >
                View Pricing
              </Link>
              <Link
                href="/dashboard/events/new"
                className="rounded-full border border-teal px-6 py-2.5 text-sm font-medium text-teal"
              >
                Create Event
              </Link>
            </div>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              homeCount={homeCounts[event.id] || 0}
              showActions
            />
          ))
        )}
      </div>
    </DashboardShell>
  );
}
