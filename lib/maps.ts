/** Geographic center of the contiguous United States (discovery/browse default). */
export const US_MAP_CENTER = { lat: 39.8283, lng: -98.5795 };

export const US_MAP_ZOOM = 5;

export type GeocodeInput = {
  address: string;
  city?: string;
  region?: string;
  zip?: string;
  country?: string;
};

export function formatGeocodeQuery(input: GeocodeInput) {
  const street = input.address.trim();
  const parts = [street];

  if (input.city?.trim()) parts.push(input.city.trim());
  if (input.region?.trim()) parts.push(input.region.trim());
  if (input.zip?.trim()) parts.push(input.zip.trim());

  const country = input.country?.trim() || "US";
  if (country !== "US") {
    parts.push(country);
  }

  return parts.join(", ");
}

function resultMatchesRegion(
  result: { address_components?: Array<{ long_name: string; short_name: string; types: string[] }> },
  region?: string
) {
  if (!region) return true;

  const expected = region.trim().toUpperCase();
  const state = result.address_components?.find((component) =>
    component.types.includes("administrative_area_level_1")
  );

  if (!state) return false;

  return (
    state.short_name?.toUpperCase() === expected ||
    state.long_name?.toLowerCase() === expected.toLowerCase()
  );
}

export function pickGeocodeResult<
  T extends {
    address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
  },
>(results: T[], region?: string) {
  if (!results.length) return null;
  if (!region) return results[0];

  return results.find((result) => resultMatchesRegion(result, region)) || results[0];
}

export async function geocodeAddress(
  input: string | GeocodeInput
): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const structured = typeof input === "string" ? { address: input } : input;
  const query = formatGeocodeQuery(structured);
  const country = structured.country?.trim() || "US";

  const params = new URLSearchParams({
    address: query,
    key: apiKey,
    region: "us",
  });

  if (country) {
    params.set("components", `country:${country}`);
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.results?.length) {
      const chosen = pickGeocodeResult(
        data.results as Array<{
          address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
          geometry: { location: { lat: number; lng: number } };
        }>,
        structured.region
      );

      if (!chosen?.geometry) return null;

      return {
        latitude: chosen.geometry.location.lat,
        longitude: chosen.geometry.location.lng,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  address: string;
  /** Discovery/browse pins: navigate to the event page when clicked. */
  href?: string;
}

export type GeocodeEventTarget = GeocodeInput & {
  id: string;
  slug: string;
  title: string;
  displayAddress?: string;
};

export function buildDiscoveryMapPins(
  events: Array<{
    id: string;
    slug: string;
    title: string;
    city: string;
    region: string;
    main_address: string;
    latitude: number | null;
    longitude: number | null;
  }>
): { pins: MapPin[]; geocodeEvents: GeocodeEventTarget[] } {
  const pins: MapPin[] = [];
  const geocodeEvents: GeocodeEventTarget[] = [];

  for (const event of events) {
    const displayAddress = `${event.city}, ${event.region}`;
    const href = `/event/${event.slug}`;

    if (event.latitude != null && event.longitude != null) {
      pins.push({
        id: event.id,
        lat: Number(event.latitude),
        lng: Number(event.longitude),
        title: event.title,
        address: displayAddress,
        href,
      });
      continue;
    }

    if (!event.main_address?.trim()) continue;

    geocodeEvents.push({
      id: event.id,
      slug: event.slug,
      title: event.title,
      address: event.main_address,
      city: event.city,
      region: event.region,
      displayAddress,
    });
  }

  return { pins, geocodeEvents };
}

export const EVENT_HQ_PIN_ID = "__event_hq__";

export function buildEventMapPins(options: {
  event: {
    id: string;
    title: string;
    main_address: string;
    latitude: number | null;
    longitude: number | null;
  };
  homes: Array<{
    id: string;
    seller_name: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  }>;
}) {
  const pins: MapPin[] = [];

  if (options.event.latitude != null && options.event.longitude != null) {
    pins.push({
      id: EVENT_HQ_PIN_ID,
      lat: Number(options.event.latitude),
      lng: Number(options.event.longitude),
      title: "Main event location",
      address: options.event.main_address,
    });
  }

  for (const home of options.homes) {
    if (home.latitude == null || home.longitude == null || !home.address) continue;

    const lat = Number(home.latitude);
    const lng = Number(home.longitude);

    pins.push({
      id: home.id,
      lat,
      lng,
      title: home.seller_name || "Garage Sale",
      address: home.address,
    });
  }

  return pins;
}
