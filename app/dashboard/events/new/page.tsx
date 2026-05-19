import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { EventForm } from "@/components/EventForm";
import { ADMIN_EVENT_TIER, isPlatformAdmin } from "@/lib/admin";
import { getTier } from "@/lib/tiers";
import { createClient } from "@/lib/supabase/server";

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  const isAdmin = isPlatformAdmin({ email: user.email, role: profile.role });

  const { data: availablePayment } = await supabase
    .from("payments")
    .select("*")
    .eq("organizer_id", profile.id)
    .eq("status", "completed")
    .is("event_id", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const adminBypass = isAdmin && !availablePayment;
  const availableTier = availablePayment
    ? { tier: availablePayment.tier, paymentId: availablePayment.id }
    : isAdmin
      ? { tier: ADMIN_EVENT_TIER }
      : null;

  const adminTierLabel = getTier(ADMIN_EVENT_TIER)?.name;

  return (
    <DashboardShell userEmail={user.email}>
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-teal hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">Create New Event</h1>
        {availablePayment ? (
          <p className="mt-1 text-sm text-charcoal/60">
            Using your <span className="capitalize font-medium">{availablePayment.tier}</span> plan.
          </p>
        ) : adminBypass ? (
          <p className="mt-1 text-sm text-charcoal/60">
            Admin account — <span className="font-medium">{adminTierLabel}</span> access, no payment
            required.
          </p>
        ) : (
          <div className="mt-4 rounded-xl border border-yellow/50 bg-yellow/20 p-4">
            <p className="text-sm text-charcoal">
              You need a paid plan to create an event.{" "}
              <Link href="/pricing" className="font-medium text-teal underline">
                View pricing
              </Link>
            </p>
          </div>
        )}
      </div>

      {availableTier && (
        <EventForm
          profileId={profile.id}
          availableTier={availableTier}
          adminBypass={adminBypass}
        />
      )}
    </DashboardShell>
  );
}
