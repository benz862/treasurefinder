import { NextResponse } from "next/server";
import {
  canHomeownerEditListing,
  getActiveListingByToken,
} from "@/lib/server/organizer";
import { getTier, type TierId } from "@/lib/tiers";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { token } = await params;
  const listing = await getActiveListingByToken(token);

  if (!listing) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  const tier = getTier(listing.events.tier as TierId);
  const editable = canHomeownerEditListing(listing.approval_status);

  return NextResponse.json({
    listing: {
      id: listing.id,
      seller_name: listing.seller_name,
      seller_email: listing.seller_email,
      seller_phone: listing.seller_phone,
      address: listing.address,
      description: listing.description,
      categories: listing.categories,
      featured_items: listing.featured_items,
      opening_time: listing.opening_time,
      closing_time: listing.closing_time,
      notes: listing.notes,
      approval_status: listing.approval_status,
      submitted_at: listing.submitted_at,
      last_edited_at: listing.last_edited_at,
      home_photos: listing.home_photos,
    },
    event: {
      title: listing.events.title,
      event_date: listing.events.event_date,
    },
    maxPhotos: tier?.maxPhotosPerHome || 3,
    editable,
  });
}
