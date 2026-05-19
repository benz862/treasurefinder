import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/Layout";
import { DiscoverySearchForm } from "@/components/DiscoverySearchForm";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { searchPublishedEvents } from "@/lib/discovery";
import { resolveLocationSlug, type LocationPage } from "@/lib/locations";

interface PageProps {
  params: Promise<{ location: string }>;
}

function getLocationCopy(location: LocationPage) {
  if (location.type === "state") {
    return {
      title: `Garage Sales in ${location.name}`,
      description: `Discover garage sales, yard sales, estate sales, and community events happening in ${location.name}. Browse maps, dates, and participating homes.`,
      eyebrow: `${location.name} treasure hunting`,
    };
  }

  return {
    title: `Garage Sales in ${location.name}`,
    description: `Find garage sales, estate sales, and neighborhood events in ${location.name}. Browse upcoming sales, maps, and featured items.`,
    eyebrow: location.name,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location: slug } = await params;
  const location = resolveLocationSlug(slug);
  if (!location) return { title: "Location Not Found" };

  const copy = getLocationCopy(location);
  return {
    title: `${copy.title} | Treasure Finder`,
    description: copy.description,
    openGraph: {
      title: copy.title,
      description: copy.description,
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { location: slug } = await params;
  const location = resolveLocationSlug(slug);
  if (!location) notFound();

  const filters =
    location.type === "state"
      ? { region: location.region }
      : { city: location.city, region: location.region };

  const events = await searchPublishedEvents(filters);
  const copy = getLocationCopy(location);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <section className="bg-gradient-to-br from-yellow/30 via-cream to-teal/10 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-wide text-teal">{copy.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold text-charcoal md:text-4xl">{copy.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-charcoal/70">{copy.description}</p>
            <div className="mt-8 max-w-3xl">
              <DiscoverySearchForm
                initialLocation={location.type === "city" ? location.city : ""}
                initialRegion={location.region}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-charcoal">
              {events.length} upcoming event{events.length === 1 ? "" : "s"}
            </h2>
            <Link href="/search" className="text-sm font-medium text-teal hover:underline">
              Search all locations
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-white p-10 text-center">
                <p className="text-lg font-medium text-charcoal">No published events yet</p>
                <p className="mt-2 text-sm text-charcoal/60">
                  Check back soon or explore sales in a nearby city.
                </p>
                <Link
                  href="/pricing"
                  className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-bold text-white"
                >
                  Create an Event
                </Link>
              </div>
            ) : (
              events.map((event) => <PublicDiscoveryEventCard key={event.id} event={event} />)
            )}
          </div>
        </section>

        <section className="border-t border-teal-100 bg-teal px-4 py-12 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold">Planning a neighborhood sale in {location.name}?</h2>
            <p className="mt-3 text-white/80">
              Create a map-based event, invite participating homes, and help treasure hunters find
              you.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex rounded-full bg-coral px-8 py-3 font-bold text-white hover:bg-coral/90"
            >
              Create Your Event
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
