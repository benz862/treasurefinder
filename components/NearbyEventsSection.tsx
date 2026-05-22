import Link from "next/link";
import { PublicDiscoveryEventCard } from "@/components/PublicDiscoveryEventCard";
import type { DiscoveryEvent } from "@/lib/discovery";

interface NearbyEventsSectionProps {
  events: DiscoveryEvent[];
  currentSlug: string;
  city: string;
}

export function NearbyEventsSection({ events, currentSlug, city }: NearbyEventsSectionProps) {
  const nearby = events.filter((event) => event.slug !== currentSlug).slice(0, 3);
  if (!nearby.length) return null;

  return (
    <section className="mt-14 border-t border-teal-100 pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">More Events Nearby</h2>
          <p className="mt-1 text-sm text-charcoal/60">
            Keep exploring — more happenings around {city} and beyond.
          </p>
        </div>
        <Link href="/explore" className="text-sm font-bold text-teal hover:underline">
          Explore map →
        </Link>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {nearby.map((event) => (
          <PublicDiscoveryEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
