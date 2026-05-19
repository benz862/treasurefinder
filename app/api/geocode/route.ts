import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/maps";

export async function POST(request: Request) {
  const body = await request.json();
  const { address, city, region, zip, country } = body;

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  const result = await geocodeAddress({
    address,
    city: typeof city === "string" ? city : undefined,
    region: typeof region === "string" ? region : undefined,
    zip: typeof zip === "string" ? zip : undefined,
    country: typeof country === "string" ? country : undefined,
  });

  return NextResponse.json(result || { latitude: null, longitude: null });
}
