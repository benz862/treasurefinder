"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EventBannerUploadProps {
  eventId: string;
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}

export function EventBannerUpload({
  eventId,
  currentUrl,
  onUploaded,
}: EventBannerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be under 8MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `events/${eventId}/banner-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("garage-sale-photos")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("garage-sale-photos").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("events")
        .update({ banner_image_url: publicUrl })
        .eq("id", eventId);

      if (updateError) throw updateError;

      setPreviewUrl(publicUrl);
      onUploaded(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Event banner preview"
          className="aspect-video w-full rounded-2xl object-cover object-center"
        />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-teal-200 bg-teal/5 text-sm text-charcoal/60">
          No banner uploaded yet
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-teal-200 px-4 py-4 text-sm text-teal hover:border-teal/50 hover:bg-teal/5">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
        {uploading ? "Uploading banner..." : "Upload banner image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
