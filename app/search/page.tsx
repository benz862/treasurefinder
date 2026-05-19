import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { DiscoverySearchForm } from "@/components/DiscoverySearchForm";
import { BrowseByState } from "@/components/BrowseByState";
import { SearchResults } from "@/components/SearchResults";
import { geocodeAddress } from "@/lib/maps";
import {
  getThisWeekendRange,
  searchPublishedEvents,
  type DiscoveryFilters,
} from "@/lib/discovery";
import { DISCOVERY_CATEGORIES, normalizeRegionInput } from "@/lib/locations";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    region?: string;
    category?: string;
    date?: string;
    distance?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search Garage Sales & Estate Sales | Treasure Finder",
  description:
    "Search garage sales, yard sales, and community events by city, ZIP code, category, and date.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const location = params.location?.trim() || "";
  const region = params.region?.trim() || "";
  const category = params.category?.trim() || "";
  const date = params.date || "upcoming";
  const distance = params.distance || "";

  const filters: DiscoveryFilters = {
    category: category || undefined,
    upcomingOnly: date !== "all",
  };

  if (location) {
    if (/^\d{5}(-\d{4})?$/.test(location)) {
      filters.zip = location;
    } else {
      filters.query = location;
      filters.city = location;
    }
  }

  if (region) {
    filters.region = region;
  }

  if (date === "weekend") {
    const weekend = getThisWeekendRange();
    filters.dateFrom = weekend.from;
    filters.dateTo = weekend.to;
    filters.upcomingOnly = false;
  }

  if (distance && location) {
    const geoQuery = region ? `${location}, ${region}` : location;
    const coords = await geocodeAddress(geoQuery);
    if (coords) {
      filters.latitude = coords.latitude;
      filters.longitude = coords.longitude;
      filters.radiusMiles = Number(distance);
    }
  }

  const events = await searchPublishedEvents(filters);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <section className="border-b border-teal-100 bg-gradient-to-br from-yellow/30 via-cream to-teal/10 px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold text-charcoal">Find Sales Near You</h1>
            <p className="mt-2 max-w-2xl text-charcoal/70">
              Search neighborhood garage sales, estate sales, and community events by location,
              category, and date.
            </p>
            <div className="mt-6">
              <DiscoverySearchForm
                initialLocation={location}
                initialRegion={region}
                initialCategory={category}
              />
            </div>
          </div>
        </section>

        <SearchResults
          events={events}
          initialFilters={{ location, region, category, date, distance }}
        />

        <section className="border-t border-teal-100 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold text-charcoal">Browse by Category</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {DISCOVERY_CATEGORIES.map((item) => (
                <Link
                  key={item.label}
                  href={`/search?category=${encodeURIComponent(item.value)}`}
                  className="rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal hover:bg-teal/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <h2 className="mt-8 text-xl font-bold text-charcoal">Browse by State</h2>
            <div className="mt-4 max-w-2xl">
              <BrowseByState defaultRegion={normalizeRegionInput(region)} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
