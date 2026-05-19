"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { HomeForm } from "@/components/HomeForm";
import { InviteHomeListItem } from "@/components/InviteHomeListItem";
import { LimitCounter } from "@/components/LimitCounter";
import { createClient } from "@/lib/supabase/client";
import type { Home } from "@/types/database";
import { Link2, Plus } from "lucide-react";

export default function ManageHomesPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<{ id: string; title: string; tier: string; max_homes: number } | null>(null);
  const [homes, setHomes] = useState<Home[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingHome, setEditingHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email || "");

    const { data: eventData } = await supabase
      .from("events")
      .select("id, title, tier, max_homes")
      .eq("id", eventId)
      .single();

    const { data: homesData } = await supabase
      .from("homes")
      .select("*")
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
    setShowInviteForm(false);
  }

  async function handleInviteHome(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setError(null);
    setLastInviteUrl(null);

    try {
      const res = await fetch("/api/invite/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          sellerEmail: inviteEmail || null,
          sellerName: inviteName || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invite");

      setLastInviteUrl(data.inviteUrl);
      setInviteEmail("");
      setInviteName("");
      setShowInviteForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite");
    } finally {
      setInviting(false);
    }
  }

  async function handleApprove(homeId: string) {
    const res = await fetch("/api/listings/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeId }),
    });
    if (res.ok) loadData();
  }

  async function handleReject(homeId: string) {
    const res = await fetch("/api/listings/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeId }),
    });
    if (res.ok) loadData();
  }

  async function handleDeactivateInvite(homeId: string) {
    const res = await fetch("/api/invite/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ homeId }),
    });
    if (res.ok) loadData();
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
  const pendingReview = homes.filter((home) => home.approval_status === "submitted").length;

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

      {pendingReview > 0 && (
        <div className="mb-6 rounded-xl border border-yellow/50 bg-yellow/20 p-4 text-sm text-charcoal">
          {pendingReview} listing{pendingReview > 1 ? "s" : ""} waiting for your review.
        </div>
      )}

      {lastInviteUrl && (
        <div className="mb-6 rounded-xl border border-leaf/30 bg-leaf/10 p-4 text-sm text-charcoal">
          <p className="font-medium">Invite link created!</p>
          <p className="mt-1 break-all text-charcoal/70">{lastInviteUrl}</p>
        </div>
      )}

      {!showForm && !editingHome && !showInviteForm && (
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowInviteForm(true)}
            disabled={atLimit}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white hover:bg-coral/90 disabled:opacity-50"
          >
            <Link2 className="h-4 w-4" />
            Invite Home
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={atLimit}
            className="inline-flex items-center gap-2 rounded-full border border-teal px-5 py-2.5 text-sm font-medium text-teal hover:bg-teal/5 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Home Yourself
          </button>
        </div>
      )}

      {showInviteForm && (
        <form
          onSubmit={handleInviteHome}
          className="mb-6 space-y-4 rounded-2xl border border-teal-100 bg-white p-6"
        >
          <h2 className="text-lg font-bold text-charcoal">Invite a Homeowner</h2>
          <p className="text-sm text-charcoal/60">
            Create a private link so they can fill out their own listing. No account needed.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal">Homeowner Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Optional"
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5"
              />
            </div>
          </div>
          {error && <p className="text-sm text-coral">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={inviting}
              className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {inviting ? "Creating..." : "Create Invite Link"}
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="rounded-full border border-teal-200 px-5 py-2.5 text-sm text-teal"
            >
              Cancel
            </button>
          </div>
        </form>
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
            <p className="text-charcoal/60">
              No homes yet. Invite homeowners with a private link or add homes yourself.
            </p>
          </div>
        ) : (
          homes.map((home) => (
            <InviteHomeListItem
              key={home.id}
              home={home}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onReject={handleReject}
              onDeactivateInvite={handleDeactivateInvite}
            />
          ))
        )}
      </div>
    </DashboardShell>
  );
}
