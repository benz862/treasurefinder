import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { formatDate } from "@/lib/utils";
import { toggleFeatured, toggleEventStatus, deleteEvent } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/");
  }

  const admin = createAdminClient();

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

  return (
    <DashboardShell userEmail={user.email}>
      <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Platform overview and management.</p>

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
                    {event.is_featured && (
                      <span className="text-xs text-yellow-700">Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {(event.profiles as { email: string })?.email}
                  </td>
                  <td className="px-4 py-3">{formatDate(event.event_date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.payment_status} variant="payment" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
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
