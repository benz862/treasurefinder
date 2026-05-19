"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

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
