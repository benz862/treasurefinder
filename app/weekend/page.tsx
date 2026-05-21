import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import { getWeekendEvents } from "@/lib/discovery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "This Weekend — Local Events",
  description: "Discover garage sales, markets, and community events happening this weekend.",
};

export default async function WeekendPage() {
  const events = await getWeekendEvents(24);

  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-teal">This Weekend</p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal md:text-4xl">
            What&apos;s Happening This Weekend
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
            Spontaneous weekend discovery — treasure hunts, markets, and community events near you.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-teal-200 bg-white p-10 text-center">
                <p className="font-medium text-charcoal">No published events this weekend yet.</p>
                <Link href="/explore" className="mt-4 inline-block text-sm font-bold text-teal hover:underline">
                  Explore the map →
                </Link>
              </div>
            ) : (
              events.map((event) => <PublicDiscoveryEventCard key={event.id} event={event} />)
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
