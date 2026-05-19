"use client";

import { useEffect, useRef, useState } from "react";
import type { MapPin } from "@/lib/maps";

interface MapViewProps {
  pins: MapPin[];
  center?: { lat: number; lng: number };
  onPinClick?: (pinId: string) => void;
  selectedPinId?: string | null;
  className?: string;
}

export function MapView({
  pins,
  center,
  onPinClick,
  selectedPinId,
  className = "h-[400px] w-full rounded-2xl",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError("Google Maps API key not configured");
      return;
    }

    if (window.google?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError("Failed to load Google Maps");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || !window.google?.maps) return;

    const defaultCenter = center ||
      (pins.length > 0
        ? { lat: pins[0].lat, lng: pins[0].lng }
        : { lat: 40.7128, lng: -74.006 });

    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
        ],
      });
    } else {
      googleMapRef.current.setCenter(defaultCenter);
    }

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    pins.forEach((pin) => {
      const marker = new google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map: googleMapRef.current!,
        title: pin.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: selectedPinId === pin.id ? 12 : 9,
          fillColor: selectedPinId === pin.id ? "#FF6B5B" : "#1A6B6B",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      });

      marker.addListener("click", () => onPinClick?.(pin.id));
      markersRef.current.push(marker);
      bounds.extend({ lat: pin.lat, lng: pin.lng });
    });

    if (pins.length > 1) {
      googleMapRef.current.fitBounds(bounds, 48);
    } else if (pins.length === 1) {
      googleMapRef.current.setZoom(15);
    }
  }, [loaded, pins, center, onPinClick, selectedPinId]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-teal/5 p-6 text-center`}>
        <div>
          <p className="font-medium text-charcoal">Map unavailable</p>
          <p className="mt-1 text-sm text-charcoal/60">{error}</p>
          {pins.length > 0 && (
            <ul className="mt-4 space-y-1 text-left text-sm text-charcoal/70">
              {pins.map((pin) => (
                <li key={pin.id}>📍 {pin.address}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!loaded && (
        <div className="flex h-full items-center justify-center rounded-2xl bg-teal/5">
          <p className="text-sm text-charcoal/60">Loading map...</p>
        </div>
      )}
      <div ref={mapRef} className={`h-full w-full rounded-2xl ${!loaded ? "hidden" : ""}`} />
    </div>
  );
}
