"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import {
  US_STATES,
  getCityHref,
  getPopularCitiesForRegion,
  getStateByRegion,
  getStateHref,
} from "@/lib/locations";

interface BrowseByStateProps {
  defaultRegion?: string;
}

export function BrowseByState({ defaultRegion = "OH" }: BrowseByStateProps) {
  const [selectedRegion, setSelectedRegion] = useState(defaultRegion);

  const selectedState = useMemo(
    () => getStateByRegion(selectedRegion),
    [selectedRegion]
  );

  const popularCities = useMemo(
    () => getPopularCitiesForRegion(selectedRegion),
    [selectedRegion]
  );

  if (!selectedState) return null;

  return (
    <div className="rounded-3xl border border-teal-100 bg-white p-5 sm:p-6">
      <label htmlFor="browse-state" className="block text-sm font-medium text-charcoal">
        Select a state
      </label>
      <select
        id="browse-state"
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-teal-100 bg-cream px-4 py-3.5 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
      >
        {US_STATES.map((state) => (
          <option key={state.region} value={state.region}>
            {state.name}
          </option>
        ))}
      </select>

      <Link
        href={getStateHref(selectedRegion)}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-white hover:bg-teal/90"
      >
        View all sales in {selectedState.name}
        <ChevronRight className="h-4 w-4" />
      </Link>

      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-charcoal/70">
          <MapPin className="h-4 w-4 text-teal" />
          Popular cities in {selectedState.name}
        </h3>
        {popularCities.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <Link
                key={`${selectedRegion}-${city.city}`}
                href={getCityHref(city, selectedRegion)}
                className="rounded-full border border-teal-200 bg-cream px-4 py-2 text-sm font-medium text-teal transition hover:border-teal hover:bg-teal/5"
              >
                {city.city}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-charcoal/60">
            Search by city within {selectedState.name} using the location search above.
          </p>
        )}
      </div>
    </div>
  );
}
