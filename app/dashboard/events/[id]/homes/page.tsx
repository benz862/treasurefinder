"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { HomeForm, HomeListItem } from "@/components/HomeForm";
import { LimitCounter } from "@/components/LimitCounter";
import { createClient } from "@/lib/supabase/client";
import type { Event, Home } from "@/types/database";
import { Plus } from "lucide-react";

export default function ManageHomesPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [homes, setHomes] = useState<Home[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email || "");

    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    const { data: homesData } = await supabase
      .from("homes")
      .select("*, home_photos(*)")
      .eq("event_id", eventId)
      .order("sort_order");

    setEvent(eventData);
    setHomes(homesData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [eventId]);

  async function handleDelete(homeId: string) {
    if (!confirm("Delete this home?")) return;
    const supabase = createClient();
    await supabase.from("homes").delete().eq("id", homeId);
    setHomes((prev) => prev.filter((h) => h.id !== homeId));
  }

  async function handleEdit(home: Home) {
    const supabase = createClient();
    const { data } = await supabase
      .from("homes")
      .select("*, home_photos(*)")
      .eq("id", home.id)
      .single();
    setEditingHome(data);
    setShowForm(false);
  }

  function handleSaved() {
    setShowForm(false);
    setEditingHome(null);
    loadData();
  }

  if (loading) {
    return (
      <DashboardShell userEmail={userEmail}>
        <p className="text-charcoal/60">Loading...</p>
      </DashboardShell>
    );
  }

  if (!event) {
    return (
      <DashboardShell userEmail={userEmail}>
        <p className="text-coral">Event not found.</p>
      </DashboardShell>
    );
  }

  const atLimit = homes.length >= event.max_homes;

  return (
    <DashboardShell userEmail={userEmail}>
      <div className="mb-6">
        <Link
          href={`/dashboard/events/${eventId}/edit`}
          className="text-sm text-teal hover:underline"
        >
          ← Back to Event
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">Manage Homes</h1>
        <p className="mt-1 text-sm text-charcoal/60">{event.title}</p>
      </div>

      <div className="mb-6">
        <LimitCounter current={homes.length} max={event.max_homes} />
      </div>

      {!showForm && !editingHome && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={atLimit}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Home
        </button>
      )}

      {(showForm || editingHome) && (
        <div className="mb-6">
          <HomeForm
            eventId={eventId}
            tier={event.tier}
            home={editingHome || undefined}
            onSaved={handleSaved}
            onCancel={() => {
              setShowForm(false);
              setEditingHome(null);
            }}
          />
        </div>
      )}

      <div className="space-y-3">
        {homes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal-200 p-8 text-center">
            <p className="text-charcoal/60">No homes added yet. Add your first participating home!</p>
          </div>
        ) : (
          homes.map((home) => (
            <HomeListItem
              key={home.id}
              home={home}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </DashboardShell>
  );
}
