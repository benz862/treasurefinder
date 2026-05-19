import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateInviteToken, getListingInviteUrl } from "@/lib/invite";
import { assertEventOwner, getSessionOrganizer } from "@/lib/server/organizer";

export async function POST(request: Request) {
  const session = await getSessionOrganizer();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { eventId, sellerEmail, sellerPhone, sellerName } = body;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  const { error: ownerError, event } = await assertEventOwner(
    eventId,
    session.profile.id
  );
  if (ownerError || !event) {
    return NextResponse.json({ error: ownerError || "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { count } = await admin
    .from("homes")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  if ((count || 0) >= event.max_homes) {
    return NextResponse.json(
      { error: `Your plan allows up to ${event.max_homes} homes.` },
      { status: 400 }
    );
  }

  let token = generateInviteToken();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: existing } = await admin
      .from("homes")
      .select("id")
      .eq("invite_token", token)
      .maybeSingle();
    if (!existing) break;
    token = generateInviteToken();
  }

  const { data: home, error: insertError } = await admin
    .from("homes")
    .insert({
      event_id: eventId,
      seller_name: sellerName || null,
      seller_email: sellerEmail || null,
      seller_phone: sellerPhone || null,
      address: null,
      invite_token: token,
      invite_status: "active",
      approval_status: "draft",
      sort_order: count || 0,
    })
    .select("*")
    .single();

  if (insertError || !home) {
    return NextResponse.json(
      { error: insertError?.message || "Failed to create invite" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    home,
    inviteUrl: getListingInviteUrl(token),
  });
}
