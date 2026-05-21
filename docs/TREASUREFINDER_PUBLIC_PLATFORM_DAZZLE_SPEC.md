# TreasureFinder Public Platform — Dazzle Spec

Production implementation lives in **TreasureTrail** (treasurefinder.app).

## Event type colors

| Category | Hex |
|---|---|
| Garage Sales | `#C94F3D` |
| Estate Sales | `#7A2E3A` |
| Flea Markets | `#2E7C7B` |
| Craft Fairs | `#D89A2B` |
| Vendor Markets | `#4C7A4D` |
| Community Events | `#8364A8` |
| Farmers Markets | `#6E9B4B` |

## Key files

- `lib/eventCategories.ts` — category definitions
- `lib/markerIcons.ts` — SVG map pins
- `lib/inferEventCategory.ts` — title/description → category (until DB column)
- `components/DiscoveryMap.tsx` — filters + preview cards
- `components/MapView.tsx` — Google Maps with category markers
- `app/explore`, `/weekend`, `/categories` — discovery routes
- `/e/[slug]` → redirects to `/event/[slug]`

## Campaign Generator

The AI Campaign Composer remains in the separate **TreasureFinder Campaign Generator** repo at `/composer`.
