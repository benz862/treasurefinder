"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { getTier, type TierId } from "@/lib/tiers";
import type { Event } from "@/types/database";

interface EventFormProps {
  profileId: string;
  availableTier?: { tier: string; paymentId: string } | null;
  event?: Event;
}

export function EventForm({ profileId, availableTier, event }: EventFormProps) {
  const router = useRouter();
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [description, setDescription] = useState(event?.description || "");
  const [eventDate, setEventDate] = useState(event?.event_date || "");
  const [startTime, setStartTime] = useState(event?.start_time?.slice(0, 5) || "08:00");
  const [endTime, setEndTime] = useState(event?.end_time?.slice(0, 5) || "15:00");
  const [city, setCity] = useState(event?.city || "");
  const [region, setRegion] = useState(event?.region || "");
  const [country, setCountry] = useState(event?.country || "US");
  const [mainAddress, setMainAddress] = useState(event?.main_address || "");
  const [status, setStatus] = useState(event?.status || "draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isEditing && !availableTier) {
      setError("Please purchase a plan before creating an event.");
      setLoading(false);
      return;
    }

    if (!title || !slug || !eventDate || !city || !region || !mainAddress) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const geoRes = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: mainAddress }),
      });
      const geo = await geoRes.json();

      const supabase = createClient();
      const tier = isEditing ? event!.tier : availableTier?.tier || "starter";
      const tierConfig = getTier(tier as TierId);

      const payload = {
        organizer_id: profileId,
        title,
        slug,
        description: description || null,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        city,
        region,
        country,
        main_address: mainAddress,
        latitude: geo.latitude || null,
        longitude: geo.longitude || null,
        status: isEditing ? status : "draft",
        tier,
        max_homes: tierConfig?.maxHomes || 5,
        payment_status: isEditing ? event!.payment_status : "paid",
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", event!.id);

        if (updateError) throw updateError;
        router.push(`/dashboard/events/${event!.id}/edit`);
      } else {
        const { data: newEvent, error: insertError } = await supabase
          .from("events")
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;

        if (availableTier?.paymentId) {
          await supabase
            .from("payments")
            .update({ event_id: newEvent.id })
            .eq("id", availableTier.paymentId);
        }

        router.push(`/dashboard/events/${newEvent.id}/homes`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Event Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">URL Slug *</label>
          <div className="mt-1 flex items-center rounded-xl border border-teal-100 focus-within:ring-2 focus-within:ring-teal/20">
            <span className="pl-4 text-sm text-charcoal/50">/event/</span>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="flex-1 py-3 pr-4 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">Event Date *</label>
          <input
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal">Start Time *</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal">End Time *</label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">City *</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">State/Province *</label>
          <input
            type="text"
            required
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Main Event Address *</label>
          <input
            type="text"
            required
            value={mainAddress}
            onChange={(e) => setMainAddress(e.target.value)}
            placeholder="123 Main St, City, State ZIP"
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-charcoal">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-coral">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-teal px-6 py-3 font-bold text-white hover:bg-teal/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
