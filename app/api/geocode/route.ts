import { NextResponse } from "next/server";
import { geocodeAddress } from "@/lib/maps";

export async function POST(request: Request) {
  const { address } = await request.json();

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }

  const result = await geocodeAddress(address);
  return NextResponse.json(result || { latitude: null, longitude: null });
}
