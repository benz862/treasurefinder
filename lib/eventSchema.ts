import { inferEventCategory } from "@/lib/inferEventCategory";
import { getCategoryByKey } from "@/lib/eventCategories";
import { getSiteUrl } from "@/lib/utils";
import type { EventWithHomes } from "@/types/database";

export function buildEventJsonLd(event: EventWithHomes) {
  const category = getCategoryByKey(inferEventCategory(event));
  const url = `${getSiteUrl()}/event/${event.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description || `${category.label} in ${event.city}, ${event.region}`,
    startDate: `${event.event_date}T${event.start_time}`,
    endDate: `${event.event_end_date || event.event_date}T${event.end_time}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.city,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.main_address,
        addressLocality: event.city,
        addressRegion: event.region,
        addressCountry: event.country,
      },
      ...(event.latitude != null && event.longitude != null
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: event.latitude,
              longitude: event.longitude,
            },
          }
        : {}),
    },
    image: event.banner_image_url ? `${getSiteUrl()}${event.banner_image_url}` : undefined,
    url,
  };
}
