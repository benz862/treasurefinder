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
      const matched =
        structured.region &&
        data.results.find((result: { address_components?: Array<{ long_name: string; short_name: string; types: string[] }> }) =>
          resultMatchesRegion(result, structured.region)
        );

      const chosen = matched || data.results[0];

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
}
