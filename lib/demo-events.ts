/** Slugs created by scripts/seed-demo-accounts.mjs — hidden from public discovery. */
export const DEMO_EVENT_SLUGS = new Set([
  "oak-street-block-sale-demo",
  "willow-creek-neighborhood-sale-demo",
  "riverside-community-mega-sale-demo",
]);

export function isDemoEvent(event: { slug: string }) {
  return DEMO_EVENT_SLUGS.has(event.slug) || event.slug.endsWith("-demo");
}
