import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { HeroDiscoverySection } from "@/components/HeroDiscoverySection";
import { DiscoveryMap } from "@/components/DiscoveryMap";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { BrowseByState } from "@/components/BrowseByState";
import { EVENT_CATEGORY_LIST } from "@/lib/eventCategories";
import {
  getFeaturedEvents,
  getMapEvents,
  getUpcomingEvents,
  getWeekendEvents,
  hydrateEventCoordinates,
} from "@/lib/discovery";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [weekendEvents, featuredEvents, upcomingEvents, mapEventsRaw] = await Promise.all([
    getWeekendEvents(6),
    getFeaturedEvents(6),
    getUpcomingEvents(6),
    getMapEvents(),
  ]);

  const mapEvents = await hydrateEventCoordinates(mapEventsRaw);
  const communityEvents = upcomingEvents.filter((event) =>
    `${event.title} ${event.description ?? ""}`.toLowerCase().match(/community|bazaar|church|charity/),
  );
  const treasureHunts = featuredEvents.filter((event) => event.homeCount > 0);

  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <HeroDiscoverySection />

        <section className="border-y border-teal-100 bg-white px-4 py-10 md:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Live Event Map</h2>
                <p className="mt-1 max-w-2xl text-sm text-charcoal/60">
                  Color-coded markers show active events nationwide. Filter by type, click a pin
                  for a preview, then visit the full event page.
                </p>
              </div>
              <Link href="/explore" className="text-sm font-bold text-teal hover:underline">
                Full explore view →
              </Link>
            </div>
            <div className="mt-6">
              <DiscoveryMap events={mapEvents} showCategoryFilters previewOnClick />
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Trending This Weekend</h2>
                <p className="mt-1 text-sm text-charcoal/60">
                  Garage sales, flea markets, estate sales, and craft fairs happening now.
                </p>
              </div>
              <Link href="/weekend" className="text-sm font-medium text-teal hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {weekendEvents.map((event) => (
                <PublicDiscoveryEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-teal/5 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Browse By Category</h2>
                <p className="mt-1 text-sm text-charcoal/60">
                  Each event type has its own color, mood, and discovery identity.
                </p>
              </div>
              <Link href="/categories" className="text-sm font-bold text-teal hover:underline">
                All categories →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {EVENT_CATEGORY_LIST.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/explore?type=${cat.slug}`}
                  className="group overflow-hidden rounded-3xl border border-teal-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="relative flex h-28 items-end p-4"
                    style={{
                      background: `linear-gradient(160deg, ${cat.color} 0%, ${cat.color}99 55%, rgba(26,107,107,0.15) 100%)`,
                    }}
                  >
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {cat.mood}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-charcoal group-hover:text-teal">{cat.label}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-charcoal/60">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {treasureHunts.length > 0 && (
          <section className="px-4 py-14">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal">Featured Treasure Hunts</h2>
                  <p className="mt-1 text-sm text-charcoal/60">
                    Multi-home neighborhood sales built for route planning and discovery.
                  </p>
                </div>
                <Link href="/explore?type=garage-sales" className="text-sm font-bold text-teal hover:underline">
                  Hunt on the map →
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {treasureHunts.map((event) => (
                  <PublicDiscoveryEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-br from-purple-50/80 via-cream to-teal/5 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Upcoming Community Events</h2>
                <p className="mt-1 text-sm text-charcoal/60">
                  Warm, family-oriented bazaars, charity sales, and neighborhood gatherings.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(communityEvents.length > 0 ? communityEvents : upcomingEvents.slice(0, 3)).map(
                (event) => (
                  <PublicDiscoveryEventCard key={event.id} event={event} />
                ),
              )}
            </div>
          </div>
        </section>

        <section id="browse-state" className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-charcoal">Browse By State or Province</h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Regional discovery for long-tail local search — states, cities, and event types.
            </p>
            <div className="mt-6 max-w-2xl">
              <BrowseByState />
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal to-teal/85 p-8 text-white md:p-12">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Promote Your Local Event Like a Pro</h2>
                <p className="mt-4 text-white/85">
                  Create a cinematic event page, publish an interactive map, and help your community
                  discover what&apos;s happening nearby.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-white hover:bg-coral/90"
                >
                  Create Event
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/event/maplewood-community-garage-sale"
                  className="rounded-full border border-white/40 px-6 py-3 font-medium text-white hover:bg-white/10"
                >
                  View Sample Event
                </Link>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: MapPin, label: "Interactive maps" },
                { icon: Sparkles, label: "Category discovery" },
                { icon: ArrowRight, label: "Shareable event pages" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-5 text-center backdrop-blur-sm"
                >
                  <Icon className="mx-auto h-6 w-6" />
                  <p className="mt-2 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
