import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getListingInviteUrl } from "@/lib/invite";
import { assertEventOwner, getSessionOrganizer } from "@/lib/server/organizer";

export async function POST(request: Request) {
  const session = await getSessionOrganizer();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { homeId } = await request.json();
  if (!homeId) {
    return NextResponse.json({ error: "Home ID is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: home, error } = await admin
    .from("homes")
    .select("*, events(id, organizer_id)")
    .eq("id", homeId)
    .single();

  if (error || !home || !home.invite_token) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const { error: ownerError } = await assertEventOwner(
    home.event_id,
    session.profile.id,
    { email: session.user.email, role: session.profile.role }
  );
  if (ownerError) {
    return NextResponse.json({ error: ownerError }, { status: 403 });
  }

  if (home.invite_status !== "active") {
    return NextResponse.json({ error: "Invite is inactive" }, { status: 400 });
  }

  return NextResponse.json({
    inviteUrl: getListingInviteUrl(home.invite_token),
    sellerEmail: home.seller_email,
  });
}
