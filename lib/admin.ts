import { env } from "@/lib/env";
import type { TierId } from "@/lib/tiers";

export const ADMIN_EVENT_TIER: TierId = "community";

export function isPlatformAdmin(options: {
  email?: string | null;
  role?: string | null;
}) {
  if (options.role === "admin") return true;

  const adminEmail = env("NEXT_PUBLIC_ADMIN_EMAIL");
  if (!adminEmail || !options.email) return false;

  return options.email.toLowerCase() === adminEmail.toLowerCase();
}
