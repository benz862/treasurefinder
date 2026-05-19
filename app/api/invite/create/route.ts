import { NextResponse } from "next/server";
import { generateInviteToken, getListingInviteUrl } from "@/lib/invite";
import { createClient } from "@/lib/supabase/server";
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
    session.profile.id,
    { email: session.user.email, role: session.profile.role }
  );
  if (ownerError || !event) {
    return NextResponse.json({ error: ownerError || "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { count } = await supabase
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
  let home = null;
  let insertError = null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await supabase
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

    home = result.data;
    insertError = result.error;

    if (!insertError) break;
    if (insertError.code !== "23505") break;
    token = generateInviteToken();
  }

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
