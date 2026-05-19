import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_ACCOUNTS = [
  {
    email: "info+starter@skillbinder.com",
    password: "Test10",
    tier: "starter",
    amount: 1900,
    fullName: "Starter Demo Organizer",
    event: {
      title: "Oak Street Block Sale",
      slug: "oak-street-block-sale-demo",
      description:
        "Demo starter plan event with up to 5 participating homes. Perfect for a small street or cul-de-sac sale.",
      event_date: "2026-06-14",
      start_time: "08:00:00",
      end_time: "14:00:00",
      city: "SkillBinder",
      region: "ON",
      main_address: "100 Oak Street, SkillBinder, ON",
      latitude: 43.6532,
      longitude: -79.3832,
      max_homes: 5,
      is_featured: false,
    },
  },
  {
    email: "info+neighborhood@skillbinder.com",
    password: "Test20",
    tier: "neighborhood",
    amount: 3900,
    fullName: "Neighborhood Demo Organizer",
    event: {
      title: "Willow Creek Neighborhood Sale",
      slug: "willow-creek-neighborhood-sale-demo",
      description:
        "Demo neighborhood plan event with category filters, printable flyer, and priority styling.",
      event_date: "2026-06-21",
      start_time: "08:00:00",
      end_time: "15:00:00",
      city: "SkillBinder",
      region: "ON",
      main_address: "500 Willow Creek Drive, SkillBinder, ON",
      latitude: 43.651,
      longitude: -79.347,
      max_homes: 20,
      is_featured: false,
    },
  },
  {
    email: "info+community@skillbinder.com",
    password: "Test30",
    tier: "community",
    amount: 7900,
    fullName: "Community Demo Organizer",
    event: {
      title: "Riverside Community Mega Sale",
      slug: "riverside-community-mega-sale-demo",
      description:
        "Demo community mega sale with featured placement and support for large multi-home events.",
      event_date: "2026-06-28",
      start_time: "07:00:00",
      end_time: "16:00:00",
      city: "SkillBinder",
      region: "ON",
      main_address: "1 Riverside Plaza, SkillBinder, ON",
      latitude: 43.6426,
      longitude: -79.3871,
      max_homes: 75,
      is_featured: true,
    },
  },
];

const DEMO_HOMES = [
  {
    seller_name: "The Johnson Family",
    address: "12 Oak Street, SkillBinder, ON",
    latitude: 43.6535,
    longitude: -79.3829,
    description: "Moving sale — furniture and kitchen items.",
    categories: ["Furniture", "Kitchen"],
    featured_items: ["Dining table set", "KitchenAid mixer"],
    opening_time: "08:00:00",
    closing_time: "14:00:00",
    notes: "Cash preferred.",
  },
  {
    seller_name: "Sarah M.",
    address: "28 Birch Lane, SkillBinder, ON",
    latitude: 43.6528,
    longitude: -79.3844,
    description: "Kids clothes, toys, and baby gear.",
    categories: ["Baby & Kids", "Toys"],
    featured_items: ["LEGO sets", "Stroller"],
    opening_time: "08:00:00",
    closing_time: "15:00:00",
    notes: null,
  },
  {
    seller_name: "Mike's Tool Shed",
    address: "55 Pine Court, SkillBinder, ON",
    latitude: 43.6521,
    longitude: -79.3815,
    description: "Hand tools, power tools, and workshop equipment.",
    categories: ["Tools", "Garden"],
    featured_items: ["Circular saw", "Garden tools"],
    opening_time: "07:30:00",
    closing_time: "13:00:00",
    notes: "Multi-family sale next door too!",
  },
];

async function findUserByEmail(email) {
  const normalized = email.toLowerCase();
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;

    const match = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (match) return match;

    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function ensureUser(account) {
  const existing = await findUserByEmail(account.email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.fullName },
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { full_name: account.fullName },
  });
  if (error) throw error;
  return data.user;
}

async function ensureProfile(user, account) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (profile) {
    await supabase
      .from("profiles")
      .update({ email: account.email, full_name: account.fullName })
      .eq("id", profile.id);
    return profile;
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: account.email,
      full_name: account.fullName,
      role: "organizer",
    })
    .select("*")
    .single();

  if (createError) throw createError;
  return created;
}

async function ensureDemoEvent(account, profileId) {
  const { data: existingEvent } = await supabase
    .from("events")
    .select("*")
    .eq("slug", account.event.slug)
    .maybeSingle();

  let event = existingEvent;

  if (!event) {
    const { data: createdEvent, error: eventError } = await supabase
      .from("events")
      .insert({
        organizer_id: profileId,
        title: account.event.title,
        slug: account.event.slug,
        description: account.event.description,
        event_date: account.event.event_date,
        start_time: account.event.start_time,
        end_time: account.event.end_time,
        city: account.event.city,
        region: account.event.region,
        country: "CA",
        main_address: account.event.main_address,
        latitude: account.event.latitude,
        longitude: account.event.longitude,
        status: "published",
        tier: account.tier,
        max_homes: account.event.max_homes,
        is_featured: account.event.is_featured,
        payment_status: "paid",
      })
      .select("*")
      .single();

    if (eventError) throw eventError;
    event = createdEvent;
  } else {
    await supabase
      .from("events")
      .update({
        organizer_id: profileId,
        title: account.event.title,
        description: account.event.description,
        status: "published",
        tier: account.tier,
        max_homes: account.event.max_homes,
        is_featured: account.event.is_featured,
        payment_status: "paid",
      })
      .eq("id", event.id);
  }

  const { count } = await supabase
    .from("homes")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id);

  if (!count) {
    const { error: homesError } = await supabase.from("homes").insert(
      DEMO_HOMES.map((home, index) => ({
        event_id: event.id,
        ...home,
        sort_order: index,
      }))
    );
    if (homesError) throw homesError;
  }

  const sessionId = `demo_${account.tier}_${profileId.slice(0, 8)}`;

  const { data: existingPayment } = await supabase
    .from("payments")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (!existingPayment) {
    const { error: paymentError } = await supabase.from("payments").insert({
      organizer_id: profileId,
      event_id: event.id,
      stripe_session_id: sessionId,
      amount: account.amount,
      currency: "usd",
      tier: account.tier,
      status: "completed",
    });
    if (paymentError) throw paymentError;
  } else {
    await supabase
      .from("payments")
      .update({ event_id: event.id, status: "completed", tier: account.tier })
      .eq("id", existingPayment.id);
  }

  return event;
}

async function main() {
  console.log("Seeding Treasure Finder demo accounts...\n");

  for (const account of DEMO_ACCOUNTS) {
    const user = await ensureUser(account);
    const profile = await ensureProfile(user, account);
    const event = await ensureDemoEvent(account, profile.id);

    console.log(`✓ ${account.tier.toUpperCase()} ($${account.amount / 100})`);
    console.log(`  Email:    ${account.email}`);
    console.log(`  Password: ${account.password}`);
    console.log(`  Event:    https://treasurefinder.app/event/${event.slug}`);
    console.log("");
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
