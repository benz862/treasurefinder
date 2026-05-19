"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PhotoUploaderProps {
  eventId: string;
  homeId: string;
  maxPhotos: number;
  currentCount: number;
  onUploadComplete: (url: string) => void;
  onDelete?: (photoId: string) => void;
  existingPhotos?: { id: string; image_url: string }[];
}

export function PhotoUploader({
  eventId,
  homeId,
  maxPhotos,
  currentCount,
  onUploadComplete,
  onDelete,
  existingPhotos = [],
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (currentCount >= maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed for your plan.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `events/${eventId}/homes/${homeId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("garage-sale-photos")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("garage-sale-photos")
        .getPublicUrl(path);

      onUploadComplete(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const canUpload = currentCount < maxPhotos;

  return (
    <div className="space-y-3">
      {existingPhotos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingPhotos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.image_url}
                alt="Sale photo"
                className="h-20 w-20 rounded-lg object-cover"
              />
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(photo.id)}
                  className="absolute -right-1 -top-1 rounded-full bg-coral p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {canUpload && (
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-teal-200 px-4 py-6 text-sm text-teal hover:border-teal/50 hover:bg-teal/5">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {uploading ? "Uploading..." : `Upload photo (${currentCount}/${maxPhotos})`}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
