import type { EventCategoryKey } from "@/lib/eventCategories";

/** Infer public event type from title/description until DB column exists. */
export function inferEventCategory(input: {
  title: string;
  description?: string | null;
}): EventCategoryKey {
  const text = `${input.title} ${input.description ?? ""}`.toLowerCase();

  if (text.includes("estate")) return "estate_sale";
  if (text.includes("flea")) return "flea_market";
  if (text.includes("craft")) return "craft_fair";
  if (text.includes("farmer")) return "farmers_market";
  if (text.includes("vendor") || text.includes("pop-up") || text.includes("pop up")) {
    return "vendor_market";
  }
  if (
    text.includes("bazaar") ||
    text.includes("charity") ||
    text.includes("church") ||
    text.includes("community")
  ) {
    return "community_bazaar";
  }

  return "garage_sale";
}

export function filterByEventCategories<T extends { title: string; description?: string | null }>(
  events: T[],
  categories: EventCategoryKey[],
): T[] {
  if (!categories.length) return events;
  const set = new Set(categories);
  return events.filter((event) => set.has(inferEventCategory(event)));
}
