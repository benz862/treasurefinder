export async function geocodeAddress(address: string): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
      return {
        latitude: data.results[0].geometry.location.lat,
        longitude: data.results[0].geometry.location.lng,
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
