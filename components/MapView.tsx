"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EVENT_HQ_PIN_ID,
  formatGeocodeQuery,
  pickGeocodeResult,
  US_MAP_CENTER,
  US_MAP_ZOOM,
  type GeocodeEventTarget,
  type GeocodeInput,
  type MapPin,
} from "@/lib/maps";

interface MapHeadquarters extends GeocodeInput {
  title?: string;
  displayAddress?: string;
}

interface GeocodeHomeTarget extends GeocodeInput {
  id: string;
  title?: string;
}

interface MapViewProps {
  pins: MapPin[];
  headquarters?: MapHeadquarters;
  geocodeHomes?: GeocodeHomeTarget[];
  geocodeEvents?: GeocodeEventTarget[];
  center?: { lat: number; lng: number };
  /** Keep the full US view with pins visible; do not zoom to a single sale. */
  nationwideView?: boolean;
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
  return Boolean(window.google?.maps?.Map && window.google?.maps?.Geocoder);
}

function pinMarkerStyle(pin: MapPin, selectedPinId?: string | null) {
  const isHQ = pin.id === EVENT_HQ_PIN_ID;
  const isSelected = selectedPinId === pin.id;
  const isDiscovery = Boolean(pin.href);

  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: isHQ ? 11 : isSelected ? 12 : 9,
    fillColor: isHQ
      ? "#FFD93D"
      : isDiscovery
        ? "#3B82F6"
        : isSelected
          ? "#FF6B5B"
          : "#1A6B6B",
    fillOpacity: 1,
    strokeColor: isHQ ? "#2D3436" : "#FFFFFF",
    strokeWeight: 2,
  };
}

function clientGeocode(input: GeocodeInput): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    const query = formatGeocodeQuery(input);
    const country = (input.country?.trim() || "US").toLowerCase();

    geocoder.geocode(
      {
        address: query,
        componentRestrictions: { country },
      },
      (results, status) => {
        if (status !== "OK" || !results?.length) {
          resolve(null);
          return;
        }

        const chosen = pickGeocodeResult(results, input.region);
        if (!chosen) {
          resolve(null);
          return;
        }

        resolve({
          lat: chosen.geometry.location.lat(),
          lng: chosen.geometry.location.lng(),
        });
      }
    );
  });
}

function pinsSignature(pins: MapPin[]) {
  return pins.map((pin) => `${pin.id}:${pin.lat}:${pin.lng}`).join("|");
}

function applyMapCamera(
  map: google.maps.Map,
  pins: MapPin[],
  selectedPinId?: string | null,
  center?: { lat: number; lng: number },
  nationwideView?: boolean
) {
  const bounds = new google.maps.LatLngBounds();
  pins.forEach((pin) => bounds.extend({ lat: pin.lat, lng: pin.lng }));

  const selectedPin = selectedPinId
    ? pins.find((pin) => pin.id === selectedPinId)
    : undefined;

  if (selectedPin) {
    map.setCenter({ lat: selectedPin.lat, lng: selectedPin.lng });
    map.setZoom(16);
    return;
  }

  if (nationwideView) {
    map.setCenter(US_MAP_CENTER);
    map.setZoom(US_MAP_ZOOM);
    return;
  }

  const hqPin = pins.find((pin) => pin.id === EVENT_HQ_PIN_ID);

  if (hqPin && pins.length === 1) {
    map.setCenter({ lat: hqPin.lat, lng: hqPin.lng });
    map.setZoom(15);
    return;
  }

  if (pins.length > 1) {
    map.fitBounds(bounds, 56);
    const zoom = map.getZoom();
    if (zoom != null && zoom > US_MAP_ZOOM) {
      map.setZoom(US_MAP_ZOOM);
    }
    return;
  }

  if (pins.length === 1) {
    map.setCenter({ lat: pins[0].lat, lng: pins[0].lng });
    map.setZoom(15);
    return;
  }

  if (center) {
    map.setCenter(center);
    map.setZoom(US_MAP_ZOOM);
  }
}

export function MapView({
  pins,
  headquarters,
  geocodeHomes = [],
  geocodeEvents = [],
  center,
  nationwideView = false,
  onPinClick,
  selectedPinId,
  className = "h-[400px] w-full rounded-2xl",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const onPinClickRef = useRef(onPinClick);
  const lastCameraKeyRef = useRef("");
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [resolvedPins, setResolvedPins] = useState<MapPin[]>(pins);

  const geocodeKey = useMemo(
    () =>
      JSON.stringify({
        headquarters,
        homes: geocodeHomes.map((home) => ({
          id: home.id,
          address: home.address,
          city: home.city,
          region: home.region,
          zip: home.zip,
        })),
        events: geocodeEvents.map((event) => ({
          id: event.id,
          slug: event.slug,
          address: event.address,
          city: event.city,
          region: event.region,
        })),
      }),
    [headquarters, geocodeHomes, geocodeEvents]
  );

  useEffect(() => {
    onPinClickRef.current = onPinClick;
  }, [onPinClick]);

  useEffect(() => {
    setResolvedPins(pins);
  }, [pins]);

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
      markersRef.current.forEach((marker) => marker.setMap(null));
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

      const timeout = window.setTimeout(() => {
        window.clearInterval(interval);
        if (mapsApiReady()) {
          setLoaded(true);
        }
      }, 5000);

      return () => {
        window.clearInterval(interval);
        window.clearTimeout(timeout);
        window.removeEventListener("error", onWindowError);
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__treasureFinderMapsReady`;
    script.async = true;
    script.defer = true;
    script.dataset.treasurefinderMaps = "true";
    script.onerror = () => setError("Failed to load Google Maps.");
    document.head.appendChild(script);

    return () => {
      window.removeEventListener("error", onWindowError);
      delete window.gm_authFailure;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !mapsApiReady()) return;

    let cancelled = false;

    async function resolvePins() {
      const nextPins = [...pins];
      const hasHQ = nextPins.some((pin) => pin.id === EVENT_HQ_PIN_ID);

      if (!hasHQ && headquarters?.address?.trim()) {
        const geo = await clientGeocode(headquarters);
        if (geo && !cancelled) {
          nextPins.unshift({
            id: EVENT_HQ_PIN_ID,
            lat: geo.lat,
            lng: geo.lng,
            title: headquarters.title || "Main event location",
            address: headquarters.displayAddress || headquarters.address,
          });
        }
      }

      for (const home of geocodeHomes) {
        if (!home.address?.trim() || nextPins.some((pin) => pin.id === home.id)) continue;

        const geo = await clientGeocode(home);
        if (!geo || cancelled) continue;

        nextPins.push({
          id: home.id,
          lat: geo.lat,
          lng: geo.lng,
          title: home.title || "Garage Sale",
          address: home.address,
        });
      }

      for (const event of geocodeEvents) {
        if (!event.address?.trim() || nextPins.some((pin) => pin.id === event.id)) continue;

        const geo = await clientGeocode(event);
        if (!geo || cancelled) continue;

        nextPins.push({
          id: event.id,
          lat: geo.lat,
          lng: geo.lng,
          title: event.title,
          address: event.displayAddress || event.address,
          href: `/event/${event.slug}`,
        });
      }

      if (!cancelled) {
        setResolvedPins((current) =>
          pinsSignature(nextPins) === pinsSignature(current) ? current : nextPins
        );
      }
    }

    void resolvePins();

    return () => {
      cancelled = true;
    };
  }, [loaded, pins, geocodeKey, headquarters, geocodeHomes, geocodeEvents]);

  useEffect(() => {
    if (!loaded || !mapRef.current || !mapsApiReady()) return;

    try {
      const initialCenter = center || US_MAP_CENTER;

      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: nationwideView ? US_MAP_CENTER : initialCenter,
          zoom: US_MAP_ZOOM,
          minZoom: 4,
          maxZoom: 18,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: "greedy",
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        });
      }

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      resolvedPins.forEach((pin) => {
        const marker = new google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: googleMapRef.current!,
          title: pin.title,
          icon: pinMarkerStyle(pin, selectedPinId),
          optimized: true,
        });

        if (pin.href) {
          marker.addListener("click", () => window.location.assign(pin.href!));
        } else if (pin.id !== EVENT_HQ_PIN_ID) {
          marker.addListener("click", () => onPinClickRef.current?.(pin.id));
        }

        markersRef.current.push(marker);
      });

      const cameraKey = `${pinsSignature(resolvedPins)}:${selectedPinId ?? ""}:${center?.lat ?? ""}:${center?.lng ?? ""}:${nationwideView}`;
      if (cameraKey !== lastCameraKeyRef.current) {
        lastCameraKeyRef.current = cameraKey;
        applyMapCamera(
          googleMapRef.current,
          resolvedPins,
          selectedPinId,
          center,
          nationwideView
        );
      }

      google.maps.event.trigger(googleMapRef.current, "resize");
    } catch {
      setError(
        "Google Maps failed to initialize. Confirm billing is enabled and Maps JavaScript API is turned on."
      );
    }
  }, [loaded, resolvedPins, center, selectedPinId, nationwideView]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-teal/5 p-6 text-center`}
        aria-live="polite"
      >
        <div>
          <p className="font-medium text-charcoal">Map unavailable</p>
          <p className="mt-1 text-sm text-charcoal/60">{error}</p>
          {resolvedPins.length > 0 && (
            <ul className="mt-4 space-y-1 text-left text-sm text-charcoal/70">
              {resolvedPins.map((pin) => (
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
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-teal/5">
          <p className="text-sm text-charcoal/60">Loading map...</p>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full rounded-2xl" />
    </div>
  );
}
