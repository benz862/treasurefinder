import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApprovalStatus, Home, HomePhoto } from "@/types/database";

export async function getSessionOrganizer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return profile ? { user, profile } : null;
}

export async function assertEventOwner(eventId: string, organizerProfileId: string) {
  const admin = createAdminClient();
  const { data: event, error } = await admin
    .from("events")
    .select("id, organizer_id, tier, max_homes")
    .eq("id", eventId)
    .single();

  if (error || !event) {
    return { error: "Event not found", event: null as null };
  }

  if (event.organizer_id !== organizerProfileId) {
    return { error: "Forbidden", event: null as null };
  }

  return { error: null, event };
}

export async function getActiveListingByToken(token: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("homes")
    .select("*, events(id, title, tier, event_date, status), home_photos(*)")
    .eq("invite_token", token)
    .eq("invite_status", "active")
    .single();

  if (error || !data) return null;
  return data;
}

export function canHomeownerEditListing(approvalStatus: ApprovalStatus) {
  return approvalStatus === "draft" || approvalStatus === "needs_changes";
}

export type ListingWithEvent = Home & {
  events: {
    id: string;
    title: string;
    tier: string;
    event_date: string;
    status: string;
  };
  home_photos: HomePhoto[];
};
