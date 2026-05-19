import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { DiscoverySearchForm } from "@/components/DiscoverySearchForm";
import { BrowseByState } from "@/components/BrowseByState";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import {
  getFeaturedEvents,
  getUpcomingEvents,
  getWeekendEvents,
} from "@/lib/discovery";
import { DISCOVERY_CATEGORIES } from "@/lib/locations";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [weekendEvents, featuredEvents, upcomingEvents] = await Promise.all([
    getWeekendEvents(6),
    getFeaturedEvents(6),
    getUpcomingEvents(6),
  ]);

  const showcaseEvents =
    featuredEvents.length > 0
      ? featuredEvents
      : weekendEvents.length > 0
        ? weekendEvents
        : upcomingEvents;

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow/40 via-cream to-teal/10 px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              <Sparkles className="h-4 w-4" />
              Treasure hunting meets local discovery
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-charcoal md:text-5xl">
              Find Garage Sales, Estate Sales &amp; Hidden Treasures Near You
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-charcoal/70">
              Discover neighborhood sales, estate sales, community events, tools, antiques,
              collectibles, and hidden gems happening this weekend.
            </p>
            <div className="mx-auto mt-8 max-w-3xl text-left">
              <DiscoverySearchForm />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full border-2 border-teal px-6 py-3 font-bold text-teal hover:bg-teal/5"
              >
                <Search className="h-5 w-5" />
                Browse All Sales
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-white hover:bg-coral/90"
              >
                Create Event
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Featured This Weekend</h2>
                <p className="mt-1 text-sm text-charcoal/60">
                  Upcoming sales, popular events, and featured neighborhood hunts.
                </p>
              </div>
              <Link href="/search?date=weekend" className="text-sm font-medium text-teal hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showcaseEvents.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-white p-10 text-center">
                  <p className="text-lg font-medium text-charcoal">Sales are coming soon</p>
                  <p className="mt-2 text-sm text-charcoal/60">
                    Explore the sample event below or create the first sale in your area.
                  </p>
                  <Link
                    href="/event/maplewood-community-garage-sale"
                    className="mt-6 inline-flex rounded-full bg-teal px-6 py-3 text-sm font-bold text-white"
                  >
                    View Sample Event
                  </Link>
                </div>
              ) : (
                showcaseEvents.map((event) => (
                  <PublicDiscoveryEventCard key={event.id} event={event} />
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-teal/5 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-charcoal">Browse By Category</h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Hunt for tools, antiques, furniture, estate sales, and more.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DISCOVERY_CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={`/search?category=${encodeURIComponent(category.value)}`}
                  className="rounded-2xl border border-teal-100 bg-white px-5 py-4 text-left font-medium text-charcoal transition hover:border-teal hover:bg-teal/5"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="browse-state" className="px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-charcoal">Browse By State</h2>
            <p className="mt-1 text-sm text-charcoal/60">
              Choose any state to see popular cities and browse garage sales nearby.
            </p>
            <div className="mt-6 max-w-2xl">
              <BrowseByState />
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-6xl rounded-3xl border border-teal-100 bg-white p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">Organizing a neighborhood sale?</h2>
                <p className="mt-4 text-charcoal/70">
                  Create a shareable event page, invite participating homes, approve listings, and
                  publish an interactive map shoppers can browse before they arrive.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: MapPin, label: "Interactive maps" },
                  { icon: Search, label: "Category browsing" },
                  { icon: Sparkles, label: "Invite homeowners" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-teal-100 bg-cream px-4 py-5 text-center"
                  >
                    <Icon className="mx-auto h-6 w-6 text-teal" />
                    <p className="mt-2 text-sm font-medium text-charcoal">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-coral px-6 py-3 font-bold text-white hover:bg-coral/90"
              >
                See Pricing
              </Link>
              <Link
                href="/event/maplewood-community-garage-sale"
                className="rounded-full border border-teal px-6 py-3 font-medium text-teal hover:bg-teal/5"
              >
                View Sample Event
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
