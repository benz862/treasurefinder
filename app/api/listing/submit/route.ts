import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  canHomeownerEditListing,
  getActiveListingByToken,
} from "@/lib/server/organizer";

function mapRpcError(message: string) {
  if (message.includes("listing_not_editable")) {
    return "This listing has already been submitted.";
  }
  if (message.includes("address_required")) {
    return "Please add your address before submitting.";
  }
  return message;
}

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

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("submit_listing_by_invite_token", {
    p_token: token,
  });

  if (error) {
    return NextResponse.json({ error: mapRpcError(error.message) }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Invite link not found or expired" }, { status: 404 });
  }

  return NextResponse.json({ listing: data });
}
