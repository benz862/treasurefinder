import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { SAMPLE_EVENT, SAMPLE_EVENT_SLUG } from "@/lib/sample-event";
import type { EventWithHomes } from "@/types/database";

export { SAMPLE_EVENT_SLUG };

async function fetchPublicSampleFromDatabase(): Promise<EventWithHomes | null> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", SAMPLE_EVENT_SLUG)
    .eq("status", "published")
    .maybeSingle();

  if (!event) return null;

  const { data: homes } = await supabase
    .from("homes")
    .select("*, home_photos(*)")
    .eq("event_id", event.id)
    .eq("approval_status", "approved")
    .order("sort_order");

  return { ...event, homes: homes || [] } as EventWithHomes;
}

/** Admin / dashboard: always read via service role (bypasses RLS, any status). */
async function fetchManagedSampleFromDatabase(): Promise<EventWithHomes | null> {
  const admin = createAdminClient();

  const { data: event } = await admin
    .from("events")
    .select("*")
    .eq("slug", SAMPLE_EVENT_SLUG)
    .maybeSingle();

  if (!event) return null;

  const { data: homes } = await admin
    .from("homes")
    .select("*, home_photos(*)")
    .eq("event_id", event.id)
    .order("sort_order");

  return { ...event, homes: homes || [] } as EventWithHomes;
}

/** Public pages: database copy when installed, otherwise built-in demo data. */
export async function getPublicSampleEvent(): Promise<EventWithHomes> {
  const fromDb = await fetchPublicSampleFromDatabase();
  return fromDb ?? SAMPLE_EVENT;
}

/** Admin / dashboard: database row if present (any status). */
export async function getManagedSampleEvent(): Promise<EventWithHomes | null> {
  return fetchManagedSampleFromDatabase();
}

export async function getSampleEventId(): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("events")
    .select("id")
    .eq("slug", SAMPLE_EVENT_SLUG)
    .maybeSingle();

  return data?.id ?? null;
}

/** Copy the built-in Maplewood demo into Supabase under the admin organizer (first-time homes only). */
export async function installMarketingSampleEvent(organizerProfileId: string) {
  const admin = createAdminClient();
  const template = SAMPLE_EVENT;

  const { data: existing } = await admin
    .from("events")
    .select("id")
    .eq("slug", template.slug)
    .maybeSingle();

  const eventPayload = {
    organizer_id: organizerProfileId,
    title: template.title,
    slug: template.slug,
    description: template.description,
    event_date: template.event_date,
    event_end_date: template.event_end_date,
    start_time: template.start_time,
    end_time: template.end_time,
    city: template.city,
    region: template.region,
    country: template.country,
    main_address: template.main_address,
    latitude: template.latitude,
    longitude: template.longitude,
    status: "published" as const,
    tier: template.tier,
    max_homes: template.max_homes,
    is_featured: template.is_featured,
    payment_status: "paid" as const,
    banner_image_url: template.banner_image_url,
  };

  let eventId: string;
  let created = false;

  if (existing) {
    const { error } = await admin.from("events").update(eventPayload).eq("id", existing.id);
    if (error) throw error;
    eventId = existing.id;
  } else {
    const { data: inserted, error } = await admin
      .from("events")
      .insert(eventPayload)
      .select("id")
      .single();
    if (error || !inserted) throw error ?? new Error("Failed to create sample event");
    eventId = inserted.id;
    created = true;
  }

  const { count: homeCount } = await admin
    .from("homes")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  async function syncPhotosFromTemplate() {
    const { data: homes } = await admin
      .from("homes")
      .select("id, sort_order")
      .eq("event_id", eventId);

    if (!homes?.length) return;

    for (const templateHome of template.homes) {
      const dbHome = homes.find((home) => home.sort_order === templateHome.sort_order);
      if (!dbHome) continue;

      await admin.from("home_photos").delete().eq("home_id", dbHome.id);

      if (templateHome.home_photos.length) {
        const { error: photoError } = await admin.from("home_photos").insert(
          templateHome.home_photos.map((photo) => ({
            home_id: dbHome.id,
            image_url: photo.image_url,
            caption: photo.caption,
            sort_order: photo.sort_order,
          }))
        );
        if (photoError) throw photoError;
      }
    }
  }

  if (!homeCount) {
    for (const home of template.homes) {
      const { data: insertedHome, error: homeError } = await admin
        .from("homes")
        .insert({
          event_id: eventId,
          seller_name: home.seller_name,
          address: home.address,
          latitude: home.latitude,
          longitude: home.longitude,
          description: home.description,
          categories: home.categories,
          featured_items: home.featured_items,
          opening_time: home.opening_time,
          closing_time: home.closing_time,
          notes: home.notes,
          sort_order: home.sort_order,
          invite_token: null,
          invite_status: "active",
          approval_status: "approved",
          approved_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (homeError || !insertedHome) throw homeError ?? new Error("Failed to create sample home");

      if (home.home_photos.length) {
        const { error: photoError } = await admin.from("home_photos").insert(
          home.home_photos.map((photo) => ({
            home_id: insertedHome.id,
            image_url: photo.image_url,
            caption: photo.caption,
            sort_order: photo.sort_order,
          }))
        );
        if (photoError) throw photoError;
      }
    }
  } else {
    await syncPhotosFromTemplate();
  }

  return { eventId, created, homesSeeded: !homeCount, photosSynced: Boolean(homeCount) };
}

/** Create the Maplewood sample in Supabase if missing (admin dashboard only). */
export async function ensureMarketingSampleInstalled(organizerProfileId: string) {
  const existing = await getManagedSampleEvent();
  if (existing) return { event: existing, created: false };

  await installMarketingSampleEvent(organizerProfileId);
  const event = await getManagedSampleEvent();
  if (!event) throw new Error("Sample event was not found after install.");

  return { event, created: true };
}
