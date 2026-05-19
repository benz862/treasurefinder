"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { formatDate } from "@/lib/utils";
import type { ApprovalStatus, HomePhoto } from "@/types/database";
import { CheckCircle2, ImagePlus, Loader2, Save, Send, X } from "lucide-react";

interface ListingData {
  id: string;
  seller_name: string | null;
  seller_email: string | null;
  seller_phone: string | null;
  address: string | null;
  description: string | null;
  categories: string[];
  featured_items: string[];
  opening_time: string | null;
  closing_time: string | null;
  notes: string | null;
  approval_status: ApprovalStatus;
  submitted_at: string | null;
  home_photos: HomePhoto[];
}

interface ListingEditorProps {
  token: string;
}

export function ListingEditor({ token }: ListingEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editable, setEditable] = useState(true);
  const [maxPhotos, setMaxPhotos] = useState(3);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("draft");

  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredItems, setFeaturedItems] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<HomePhoto[]>([]);

  useEffect(() => {
    async function loadListing() {
      try {
        const res = await fetch(`/api/listing/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Unable to load listing");
        }

        const listing: ListingData = data.listing;
        setEventTitle(data.event.title);
        setEventDate(data.event.event_date);
        setEditable(data.editable);
        setMaxPhotos(data.maxPhotos);
        setApprovalStatus(listing.approval_status);
        setSellerName(listing.seller_name || "");
        setSellerEmail(listing.seller_email || "");
        setSellerPhone(listing.seller_phone || "");
        setAddress(listing.address || "");
        setDescription(listing.description || "");
        setCategories(listing.categories || []);
        setFeaturedItems((listing.featured_items || []).join("\n"));
        setOpeningTime(listing.opening_time?.slice(0, 5) || "");
        setClosingTime(listing.closing_time?.slice(0, 5) || "");
        setNotes(listing.notes || "");
        setPhotos(listing.home_photos || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load listing");
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [token]);

  function toggleCategory(cat: string) {
    if (!editable) return;
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleSaveDraft() {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/listing/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          sellerName,
          sellerEmail,
          sellerPhone,
          address,
          description,
          categories,
          featuredItems: featuredItems
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          openingTime: openingTime || null,
          closingTime: closingTime || null,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setApprovalStatus(data.listing.approval_status);
      setMessage("Draft saved. You can come back to this link anytime.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await handleSaveDraftInternal();

      const res = await fetch("/api/listing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      setApprovalStatus(data.listing.approval_status);
      setEditable(false);
      setMessage("Thanks! Your listing was submitted for organizer review.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveDraftInternal() {
    const res = await fetch("/api/listing/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        sellerName,
        sellerEmail,
        sellerPhone,
        address,
        description,
        categories,
        featuredItems: featuredItems
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        openingTime: openingTime || null,
        closingTime: closingTime || null,
        notes,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save");
    setApprovalStatus(data.listing.approval_status);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editable) return;

    if (photos.length >= maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("file", file);

      const res = await fetch("/api/listing/photos/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setPhotos((prev) => [...prev, data.photo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handlePhotoDelete(photoId: string) {
    if (!editable) return;

    const res = await fetch("/api/listing/photos/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, photoId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to delete photo");
      return;
    }

    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    );
  }

  if (error && !eventTitle) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-medium text-charcoal">Listing unavailable</p>
        <p className="mt-2 text-sm text-charcoal/60">{error}</p>
      </div>
    );
  }

  const statusMessage =
    approvalStatus === "submitted"
      ? "Submitted and waiting for organizer approval."
      : approvalStatus === "approved"
        ? "Approved! Your listing will appear on the public event map."
        : approvalStatus === "needs_changes"
          ? "The organizer requested changes. Update your listing and submit again."
          : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-teal">Your garage sale listing</p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal">{eventTitle}</h1>
        <p className="mt-1 text-sm text-charcoal/60">{formatDate(eventDate)}</p>

        {statusMessage && (
          <div className="mt-4 rounded-xl bg-teal/5 px-4 py-3 text-sm text-charcoal">
            {statusMessage}
          </div>
        )}

        {message && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-leaf/10 px-4 py-3 text-sm text-charcoal">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
            <span>{message}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal">Your Name</label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              disabled={!editable}
              placeholder="The Johnson Family"
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
                disabled={!editable}
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal">Phone</label>
              <input
                type="tel"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                disabled={!editable}
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">Sale Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!editable}
              placeholder="123 Maple Street, Your City"
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!editable}
              placeholder="Tell shoppers what you are selling..."
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">Categories</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  disabled={!editable}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    categories.includes(cat)
                      ? "bg-teal text-white"
                      : "border border-teal-100 text-charcoal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">
              Featured Items (one per line)
            </label>
            <textarea
              rows={3}
              value={featuredItems}
              onChange={(e) => setFeaturedItems(e.target.value)}
              disabled={!editable}
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-charcoal">Opening Time</label>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                disabled={!editable}
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal">Closing Time</label>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                disabled={!editable}
                className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!editable}
              placeholder="Cash only, early birds welcome..."
              className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 disabled:bg-charcoal/5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal">Photos</label>
            {photos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.image_url}
                      alt="Sale photo"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    {editable && (
                      <button
                        type="button"
                        onClick={() => handlePhotoDelete(photo.id)}
                        className="absolute -right-1 -top-1 rounded-full bg-coral p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {editable && photos.length < maxPhotos && (
              <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-teal-200 px-4 py-5 text-sm text-teal">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ImagePlus className="h-5 w-5" />
                )}
                {uploading
                  ? "Uploading..."
                  : `Add photo (${photos.length}/${maxPhotos})`}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-coral">{error}</p>}

        {editable && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-teal px-5 py-3 text-sm font-medium text-teal disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit for Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
