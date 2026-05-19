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

declare global {
  interface Window {
    gm_authFailure?: () => void;
    __treasureFinderMapsReady?: () => void;
  }
}

function mapsApiReady() {
  return Boolean(window.google?.maps?.Map);
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
      setError("Google Maps API key not configured.");
      return;
    }

    if (mapsApiReady()) {
      setLoaded(true);
      return;
    }

    const setMapsError = (message: string) => {
      googleMapRef.current = null;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      setError(message);
    };

    window.gm_authFailure = () => {
      setMapsError(
        "Google Maps authentication failed. Enable billing, turn on Maps JavaScript API, and allow https://treasurefinder.app/* and https://www.treasurefinder.app/* in your API key restrictions."
      );
    };

    const onWindowError = (event: ErrorEvent) => {
      const message = event.message ?? "";
      if (message.includes("BillingNotEnabledMapError")) {
        setMapsError(
          "Google Maps billing is not enabled. Link a billing account in Google Cloud Console for the project that owns this API key."
        );
      } else if (message.includes("ApiNotActivatedMapError")) {
        setMapsError(
          "Maps JavaScript API is not enabled. In Google Cloud Console, enable Maps JavaScript API for the project that owns this API key."
        );
      }
    };

    window.addEventListener("error", onWindowError);

    window.__treasureFinderMapsReady = () => {
      if (mapsApiReady()) {
        setLoaded(true);
      }
    };

    const existing = document.querySelector('script[data-treasurefinder-maps="true"]');
    if (existing) {
      const interval = window.setInterval(() => {
        if (mapsApiReady()) {
          window.clearInterval(interval);
          setLoaded(true);
        }
      }, 100);

      return () => {
        window.clearInterval(interval);
        window.removeEventListener("error", onWindowError);
        delete window.gm_authFailure;
        delete window.__treasureFinderMapsReady;
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__treasureFinderMapsReady`;
    script.async = true;
    script.defer = true;
    script.dataset.treasurefinderMaps = "true";
    script.onerror = () => setError("Failed to load Google Maps.");
    document.head.appendChild(script);

    return () => {
      window.removeEventListener("error", onWindowError);
      delete window.gm_authFailure;
      delete window.__treasureFinderMapsReady;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || !mapsApiReady()) return;

    try {
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
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
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
    } catch {
      setError(
        "Google Maps failed to initialize. Confirm billing is enabled and Maps JavaScript API is turned on."
      );
    }
  }, [loaded, pins, center, onPinClick, selectedPinId]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-teal/5 p-6 text-center`}
        aria-live="polite"
      >
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
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-teal/5">
          <p className="text-sm text-charcoal/60">Loading map...</p>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full rounded-2xl" />
    </div>
  );
}
