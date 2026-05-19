import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canHomeownerEditListing,
  getActiveListingByToken,
} from "@/lib/server/organizer";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const listing = await getActiveListingByToken(token);
  if (!listing) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  if (!canHomeownerEditListing(listing.approval_status)) {
    return NextResponse.json(
      { error: "This listing has already been submitted." },
      { status: 403 }
    );
  }

  if (!listing.address?.trim()) {
    return NextResponse.json({ error: "Please add your address before submitting." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("homes")
    .update({
      approval_status: "submitted",
      submitted_at: new Date().toISOString(),
      last_edited_at: new Date().toISOString(),
    })
    .eq("id", listing.id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to submit listing" }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}
