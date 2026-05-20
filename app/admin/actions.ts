"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  installMarketingSampleEvent,
  SAMPLE_EVENT_SLUG,
} from "@/lib/server/marketing-sample";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdminProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) throw new Error("Admin profile not found");
  return profile;
}

export async function installMarketingSample() {
  try {
    const profile = await requireAdminProfile();
    const result = await installMarketingSampleEvent(profile.id);

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath(`/event/${SAMPLE_EVENT_SLUG}`);
    revalidatePath(`/event/${SAMPLE_EVENT_SLUG}`, "page");
    revalidatePath("/");
    revalidatePath("/search");

    const status = result.created ? "installed" : result.photosSynced ? "synced" : "updated";
    redirect(`/admin?sample=${status}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not install the marketing sample.";
    redirect(`/admin?error=${encodeURIComponent(message)}`);
  }
}

export async function toggleFeatured(eventId: string, featured: boolean) {
  const supabase = createAdminClient();
  await supabase.from("events").update({ is_featured: featured }).eq("id", eventId);
  revalidatePath("/admin");
}

export async function toggleEventStatus(eventId: string, status: string) {
  const supabase = createAdminClient();
  await supabase.from("events").update({ status }).eq("id", eventId);
  revalidatePath("/admin");
}

export async function deleteEvent(eventId: string) {
  const supabase = createAdminClient();
  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/admin");
}
