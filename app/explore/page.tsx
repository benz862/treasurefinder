import { Suspense } from "react";
import { Header, Footer } from "@/components/Layout";
import { ExploreMapClient } from "@/components/ExploreMapClient";
import { getMapEvents, hydrateEventCoordinates } from "@/lib/discovery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Local Events",
  description:
    "Map-first discovery for garage sales, estate sales, flea markets, craft fairs, and community events.",
};

export default async function ExplorePage() {
  const events = await hydrateEventCoordinates(await getMapEvents());

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-20 text-center text-charcoal/60">Loading map…</div>}>
          <ExploreMapClient initialEvents={events} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
