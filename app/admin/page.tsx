import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { formatEventDateRange, getSiteUrl } from "@/lib/utils";
import { isPlatformAdmin } from "@/lib/admin";
import {
  ensureMarketingSampleInstalled,
  getManagedSampleEvent,
  SAMPLE_EVENT_SLUG,
} from "@/lib/server/marketing-sample";
import { installMarketingSample, toggleFeatured, toggleEventStatus, deleteEvent } from "./actions";

interface PageProps {
  searchParams: Promise<{ sample?: string; error?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  if (!user || !isPlatformAdmin({ email: user.email, role: profile?.role ?? null })) {
    redirect("/");
  }

  const admin = createAdminClient();

  let marketingSample = await getManagedSampleEvent();
  let autoInstallError: string | null = null;

  if (!marketingSample && profile?.id) {
    try {
      const ensured = await ensureMarketingSampleInstalled(profile.id);
      marketingSample = ensured.event;
    } catch (error) {
      autoInstallError =
        error instanceof Error
          ? error.message
          : "Could not create the marketing sample automatically.";
    }
  }

  const { data: events } = await admin
    .from("events")
    .select("*, profiles(email, full_name)")
    .order("created_at", { ascending: false });

  const { data: profiles } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: payments } = await admin
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  const totalRevenue =
    payments
      ?.filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0) || 0;

  const samplePublicUrl = `${getSiteUrl()}/event/${SAMPLE_EVENT_SLUG}`;
  const actionMessage =
    params.sample === "installed"
      ? "Marketing sample installed. Use Edit event below."
      : params.sample === "synced"
        ? "Photos synced from template. Your text edits were kept."
        : params.sample === "updated"
          ? "Event details updated from template."
          : null;

  return (
    <DashboardShell userEmail={user.email} showAdminLink>
      <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Platform overview and management.</p>

      {params.error && (
        <div className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-charcoal">
          {decodeURIComponent(params.error)}
        </div>
      )}

      {actionMessage && (
        <div className="mt-6 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-charcoal">
          {actionMessage}
        </div>
      )}

      {autoInstallError && (
        <div className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-charcoal">
          {autoInstallError} Use the button below to try again.
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-yellow/50 bg-yellow/10 p-6">
        <h2 className="text-lg font-bold text-charcoal">Marketing sample event</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          The Maplewood demo powers &quot;Sample Event&quot; links on the site. The public page can
          show a built-in preview before install — editing only works after the database copy
          exists here.
        </p>

        {marketingSample ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-medium text-charcoal">
              {marketingSample.title}{" "}
              <StatusBadge status={marketingSample.status} />
            </p>
            <p className="text-sm text-charcoal/60">
              {marketingSample.homes.length} participating home
              {marketingSample.homes.length === 1 ? "" : "s"} ·{" "}
              <Link href={samplePublicUrl} target="_blank" className="text-teal underline">
                View public page
              </Link>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dashboard/events/${marketingSample.id}/edit`}
                className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-teal/90"
              >
                Edit event
              </Link>
              <Link
                href={`/dashboard/events/${marketingSample.id}/homes`}
                className="rounded-full border border-teal-200 px-5 py-2.5 text-sm font-medium text-teal hover:bg-teal/5"
              >
                Manage homes &amp; photos
              </Link>
            </div>
            <p className="text-xs text-charcoal/50">
              Keep the URL slug as{" "}
              <code className="rounded bg-white/80 px-1 text-teal">{SAMPLE_EVENT_SLUG}</code> so
              homepage and footer links keep working.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-charcoal/60">
              Not installed yet — visitors still see the built-in demo. Click below to create the
              editable copy in your database.
            </p>
            <form action={installMarketingSample} className="mt-4">
              <button
                type="submit"
                className="rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white hover:bg-coral/90"
              >
                Install sample for editing
              </button>
            </form>
          </div>
        )}

        {marketingSample && (
          <form action={installMarketingSample} className="mt-4 border-t border-yellow/40 pt-4">
            <button type="submit" className="text-sm font-medium text-teal hover:underline">
              Sync event &amp; listing photos from template
            </button>
            <span className="ml-2 text-xs text-charcoal/50">
              (refreshes banner and all listing images; text you edited is kept)
            </span>
          </form>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-teal-100 bg-white p-5">
          <p className="text-sm text-charcoal/60">Total Events</p>
          <p className="text-3xl font-bold text-teal">{events?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-teal-100 bg-white p-5">
          <p className="text-sm text-charcoal/60">Organizers</p>
          <p className="text-3xl font-bold text-teal">{profiles?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-teal-100 bg-white p-5">
          <p className="text-sm text-charcoal/60">Total Revenue</p>
          <p className="text-3xl font-bold text-teal">
            ${(totalRevenue / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-charcoal">All Events</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-teal-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-teal/5">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Organizer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events?.map((event) => (
                <tr key={event.id} className="border-t border-teal-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{event.title}</p>
                    {event.slug === SAMPLE_EVENT_SLUG && (
                      <span className="text-xs text-yellow-700">Marketing sample</span>
                    )}
                    {event.is_featured && (
                      <span className="text-xs text-yellow-700">Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {(event.profiles as { email: string })?.email}
                  </td>
                  <td className="px-4 py-3">
                    {formatEventDateRange(event.event_date, event.event_end_date)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.payment_status} variant="payment" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/events/${event.id}/edit`}
                        className="text-xs text-teal hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={toggleFeatured.bind(null, event.id, !event.is_featured)}>
                        <button type="submit" className="text-xs text-teal hover:underline">
                          {event.is_featured ? "Unfeature" : "Feature"}
                        </button>
                      </form>
                      <form
                        action={toggleEventStatus.bind(
                          null,
                          event.id,
                          event.status === "published" ? "draft" : "published"
                        )}
                      >
                        <button type="submit" className="text-xs text-teal hover:underline">
                          {event.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteEvent.bind(null, event.id)}>
                        <button type="submit" className="text-xs text-coral hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-charcoal">Recent Payments</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-teal-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-teal/5">
              <tr>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments?.slice(0, 20).map((payment) => (
                <tr key={payment.id} className="border-t border-teal-100">
                  <td className="px-4 py-3 capitalize">{payment.tier}</td>
                  <td className="px-4 py-3">${(payment.amount / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
