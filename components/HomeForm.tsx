"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import { PhotoUploader } from "./PhotoUploader";
import { getTier, type TierId } from "@/lib/tiers";
import type { Home, HomePhoto } from "@/types/database";
import { Trash2 } from "lucide-react";

interface HomeFormProps {
  eventId: string;
  tier: string;
  home?: Home & { home_photos?: HomePhoto[] };
  onSaved?: () => void;
  onCancel?: () => void;
}

export function HomeForm({ eventId, tier, home, onSaved, onCancel }: HomeFormProps) {
  const router = useRouter();
  const tierConfig = getTier(tier as TierId);
  const maxPhotos = tierConfig?.maxPhotosPerHome || 3;
  const isEditing = !!home;

  const [sellerName, setSellerName] = useState(home?.seller_name || "");
  const [address, setAddress] = useState(home?.address || "");
  const [description, setDescription] = useState(home?.description || "");
  const [categories, setCategories] = useState<string[]>(home?.categories || []);
  const [featuredItems, setFeaturedItems] = useState(
    home?.featured_items?.join("\n") || ""
  );
  const [openingTime, setOpeningTime] = useState(home?.opening_time?.slice(0, 5) || "");
  const [closingTime, setClosingTime] = useState(home?.closing_time?.slice(0, 5) || "");
  const [notes, setNotes] = useState(home?.notes || "");
  const [photos, setPhotos] = useState<HomePhoto[]>(home?.home_photos || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!address) {
      setError("Address is required.");
      setLoading(false);
      return;
    }

    try {
      const geoRes = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const geo = await geoRes.json();

      const supabase = createClient();
      const payload = {
        event_id: eventId,
        seller_name: sellerName || null,
        address,
        latitude: geo.latitude || null,
        longitude: geo.longitude || null,
        description: description || null,
        categories,
        featured_items: featuredItems
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        opening_time: openingTime || null,
        closing_time: closingTime || null,
        notes: notes || null,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("homes")
          .update(payload)
          .eq("id", home!.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("homes").insert(payload);
        if (insertError) throw insertError;
      }

      onSaved?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save home");
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload(url: string) {
    if (!home) return;
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("home_photos")
      .insert({
        home_id: home.id,
        image_url: url,
        sort_order: photos.length,
      })
      .select()
      .single();

    if (!insertError && data) {
      setPhotos((prev) => [...prev, data]);
    }
  }

  async function handlePhotoDelete(photoId: string) {
    const supabase = createClient();
    await supabase.from("home_photos").delete().eq("id", photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-teal-100 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-charcoal">Seller Name</label>
          <input
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder="The Johnson Family"
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">Address *</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Categories</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  categories.includes(cat)
                    ? "bg-teal text-white"
                    : "border border-teal-100 text-charcoal hover:border-teal/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">
            Featured Items (one per line)
          </label>
          <textarea
            rows={3}
            value={featuredItems}
            onChange={(e) => setFeaturedItems(e.target.value)}
            placeholder="Dining table set&#10;KitchenAid mixer"
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">Opening Time</label>
          <input
            type="time"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal">Closing Time</label>
          <input
            type="time"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cash only, early birds welcome..."
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-2.5 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
      </div>

      {isEditing && home && (
        <PhotoUploader
          eventId={eventId}
          homeId={home.id}
          maxPhotos={maxPhotos}
          currentCount={photos.length}
          existingPhotos={photos}
          onUploadComplete={handlePhotoUpload}
          onDelete={handlePhotoDelete}
        />
      )}

      {error && <p className="text-sm text-coral">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-teal/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : isEditing ? "Update Home" : "Add Home"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-teal-200 px-5 py-2.5 text-sm font-medium text-teal"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

interface HomeListItemProps {
  home: Home;
  onEdit: (home: Home) => void;
  onDelete: (homeId: string) => void;
}

export function HomeListItem({ home, onEdit, onDelete }: HomeListItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-teal-100 bg-white p-4">
      <div>
        <p className="font-medium text-charcoal">{home.seller_name || "Garage Sale"}</p>
        <p className="text-sm text-charcoal/60">{home.address}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(home)}
          className="rounded-full border border-teal-200 px-3 py-1.5 text-sm text-teal hover:bg-teal/5"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(home.id)}
          className="rounded-full p-1.5 text-coral hover:bg-coral/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
