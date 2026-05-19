import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  canHomeownerEditListing,
  getActiveListingByToken,
} from "@/lib/server/organizer";
import { getSiteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, ...fields } = body;

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const listing = await getActiveListingByToken(token);
  if (!listing) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  if (!canHomeownerEditListing(listing.approval_status)) {
    return NextResponse.json(
      { error: "This listing can no longer be edited. Contact the organizer if changes are needed." },
      { status: 403 }
    );
  }

  const address = typeof fields.address === "string" ? fields.address.trim() : listing.address;
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  let latitude = listing.latitude;
  let longitude = listing.longitude;

  try {
    const geoRes = await fetch(`${getSiteUrl()}/api/geocode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const geo = await geoRes.json();
    latitude = geo.latitude ?? latitude;
    longitude = geo.longitude ?? longitude;
  } catch {
    // Geocoding is best-effort for drafts.
  }

  const payload = {
    seller_name: fields.sellerName?.trim() || listing.seller_name,
    seller_email: fields.sellerEmail?.trim() || listing.seller_email,
    seller_phone: fields.sellerPhone?.trim() || listing.seller_phone,
    address,
    latitude,
    longitude,
    description: fields.description?.trim() || null,
    categories: Array.isArray(fields.categories) ? fields.categories : listing.categories,
    featured_items: Array.isArray(fields.featuredItems)
      ? fields.featuredItems.filter(Boolean)
      : listing.featured_items,
    opening_time: fields.openingTime || null,
    closing_time: fields.closingTime || null,
    notes: fields.notes?.trim() || null,
    approval_status: "draft",
    last_edited_at: new Date().toISOString(),
  };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("homes")
    .update(payload)
    .eq("id", listing.id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Failed to save listing" }, { status: 500 });
  }

  return NextResponse.json({ listing: data });
}
