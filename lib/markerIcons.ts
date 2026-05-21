import type { EventCategoryConfig } from "@/lib/eventCategories";

export const MARKER_ICON_PATHS: Record<EventCategoryConfig["markerIcon"], string> = {
  garage: "M4 10 L12 4 L20 10 V20 H4 Z M9 20 V14 H15 V20",
  home: "M3 12 L12 4 L21 12 V20 H15 V14 H9 V20 H3 Z",
  tent: "M4 20 L12 6 L20 20 Z M12 6 L8 14 H16 Z",
  palette: "M12 3 C7 3 3 7 3 12 C3 16 6 19 10 19 H14 C18 19 21 16 21 12 C21 7 17 3 12 3 Z M8 11 A1.5 1.5 0 1 0 8 14 A1.5 1.5 0 1 0 8 11 Z M12 8 A1.5 1.5 0 1 0 12 11 A1.5 1.5 0 1 0 12 8 Z M16 11 A1.5 1.5 0 1 0 16 14 A1.5 1.5 0 1 0 16 11 Z",
  storefront: "M3 8 L12 3 L21 8 V20 H3 Z M7 12 H10 V16 H7 Z M14 12 H17 V16 H14 Z",
  heart: "M12 21 C12 21 3 14 3 8.5 C3 5.5 5.5 3 8.5 3 C10.2 3 12 4.2 12 4.2 C12 4.2 13.8 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14 12 21 12 21 Z",
  leaf: "M12 3 C8 3 4 7 4 12 C4 17 8 21 12 21 C16 21 20 17 20 12 C20 7 16 3 12 3 Z M12 7 V17 M8 10 C10 8 14 8 16 10",
};

export function buildMarkerSvgDataUrl(
  color: string,
  icon: EventCategoryConfig["markerIcon"],
): string {
  const path = MARKER_ICON_PATHS[icon];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <path d="M18 0 C8 0 2 8 2 16 C2 28 18 44 18 44 C18 44 34 28 34 16 C34 8 28 0 18 0 Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    <g transform="translate(6,5) scale(1)">
      <path d="${path}" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
