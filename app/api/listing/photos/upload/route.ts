import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canHomeownerEditListing,
  getActiveListingByToken,
} from "@/lib/server/organizer";
import { getTier, type TierId } from "@/lib/tiers";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = formData.get("token")?.toString();
  const file = formData.get("file");

  if (!token || !(file instanceof File)) {
    return NextResponse.json({ error: "Token and file are required" }, { status: 400 });
  }

  const listing = await getActiveListingByToken(token);
  if (!listing) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  if (!canHomeownerEditListing(listing.approval_status)) {
    return NextResponse.json({ error: "This listing can no longer be edited." }, { status: 403 });
  }

  const tier = getTier(listing.events.tier as TierId);
  const maxPhotos = tier?.maxPhotosPerHome || 3;

  if ((listing.home_photos?.length || 0) >= maxPhotos) {
    return NextResponse.json(
      { error: `Maximum ${maxPhotos} photos allowed for this event.` },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `events/${listing.event_id}/homes/${listing.id}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("garage-sale-photos")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("garage-sale-photos").getPublicUrl(path);

  const { data: photo, error: insertError } = await admin
    .from("home_photos")
    .insert({
      home_id: listing.id,
      image_url: publicUrl,
      sort_order: listing.home_photos?.length || 0,
    })
    .select("*")
    .single();

  if (insertError || !photo) {
    return NextResponse.json({ error: insertError?.message || "Failed to save photo" }, { status: 500 });
  }

  await admin
    .from("homes")
    .update({ last_edited_at: new Date().toISOString() })
    .eq("id", listing.id);

  return NextResponse.json({ photo });
}

export async function DELETE(request: Request) {
  const { token, photoId } = await request.json();

  if (!token || !photoId) {
    return NextResponse.json({ error: "Token and photo ID are required" }, { status: 400 });
  }

  const listing = await getActiveListingByToken(token);
  if (!listing) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  if (!canHomeownerEditListing(listing.approval_status)) {
    return NextResponse.json({ error: "This listing can no longer be edited." }, { status: 403 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("home_photos")
    .delete()
    .eq("id", photoId)
    .eq("home_id", listing.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
