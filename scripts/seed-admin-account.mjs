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

const ADMIN = {
  email: "info@skillbinder.com",
  password: "Bomber862!",
  fullName: "Full Admin",
};

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

async function main() {
  let user = await findUserByEmail(ADMIN.email);

  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN.password,
      email_confirm: true,
      user_metadata: { full_name: ADMIN.fullName },
    });
    if (error) throw error;
    user = data.user;
    console.log("Updated existing user password and metadata.");
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN.email,
      password: ADMIN.password,
      email_confirm: true,
      user_metadata: { full_name: ADMIN.fullName },
    });
    if (error) throw error;
    user = data.user;
    console.log("Created admin user.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (profile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: ADMIN.email,
        full_name: ADMIN.fullName,
        role: "admin",
      })
      .eq("id", profile.id);
    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      email: ADMIN.email,
      full_name: ADMIN.fullName,
      role: "admin",
    });
    if (insertError) throw insertError;
  }

  console.log("\nAdmin account ready:");
  console.log(`  Email:    ${ADMIN.email}`);
  console.log(`  Password: ${ADMIN.password}`);
  console.log(`  Role:     admin`);
  console.log(`  Login:    https://treasurefinder.app/auth/login`);
  console.log(`  Admin:    https://treasurefinder.app/admin`);
  console.log(
    "\nSet NEXT_PUBLIC_ADMIN_EMAIL=info@skillbinder.com in Vercel for /admin access."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
