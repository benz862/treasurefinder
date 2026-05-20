"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

interface DiscoverySearchFormProps {
  initialLocation?: string;
  initialRegion?: string;
  initialItem?: string;
  initialCategory?: string;
  compact?: boolean;
}

export function DiscoverySearchForm({
  initialLocation = "",
  initialRegion = "",
  initialItem = "",
  initialCategory = "",
  compact = false,
}: DiscoverySearchFormProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [region, setRegion] = useState(initialRegion);
  const [item, setItem] = useState(initialItem);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (item.trim()) params.set("item", item.trim());
    if (location.trim()) params.set("location", location.trim());
    if (region.trim()) params.set("region", region.trim());
    if (initialCategory) params.set("category", initialCategory);

    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex flex-col gap-3"
          : "rounded-3xl border border-teal-100 bg-white p-4 shadow-lg sm:p-5"
      }
    >
      <div className={compact ? "flex flex-col gap-3 sm:flex-row" : "space-y-3"}>
        <div className={compact ? "flex-1" : undefined}>
          {!compact && (
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/60">
              What are you hunting for?
            </label>
          )}
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. vintage vinyl, LEGO, power tools"
            className="w-full rounded-2xl border border-teal-100 px-4 py-3.5 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
          {!compact && (
            <p className="mt-1 text-xs text-charcoal/50">
              Search listings nationwide — leave location blank to see matches anywhere.
            </p>
          )}
        </div>
        <div className={compact ? "flex flex-col gap-3 sm:flex-row sm:flex-[2]" : "grid gap-3 sm:grid-cols-2"}>
          <div>
            {!compact && (
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/60">
                City or ZIP (optional)
              </label>
            )}
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or ZIP code"
              className="w-full rounded-2xl border border-teal-100 px-4 py-3.5 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>
          <div>
            {!compact && (
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-charcoal/60">
                State / Province (optional)
              </label>
            )}
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="State or province"
              className="w-full rounded-2xl border border-teal-100 px-4 py-3.5 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={
          compact
            ? "inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-3.5 font-bold text-white hover:bg-coral/90"
            : "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-3.5 font-bold text-white hover:bg-coral/90 sm:w-auto"
        }
      >
        <Search className="h-5 w-5" />
        {item.trim() ? "Find Treasures" : "Find Sales"}
      </button>
    </form>
  );
}
