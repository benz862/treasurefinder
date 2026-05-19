import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  homeCount?: number;
  showActions?: boolean;
}

export function EventCard({ event, homeCount = 0, showActions = false }: EventCardProps) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-charcoal">{event.title}</h3>
          <p className="mt-1 text-sm text-charcoal/60">
            {formatDate(event.event_date)} · {event.city}, {event.region}
          </p>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-charcoal/70">
        <span className="rounded-full bg-yellow/30 px-3 py-1">
          {homeCount} / {event.max_homes} homes
        </span>
        <span className="rounded-full bg-teal/10 px-3 py-1 capitalize">{event.tier}</span>
        <StatusBadge status={event.payment_status} variant="payment" />
      </div>
      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/events/${event.id}/edit`}
            className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
          >
            Edit
          </Link>
          <Link
            href={`/dashboard/events/${event.id}/homes`}
            className="rounded-full border border-teal-200 px-4 py-2 text-sm font-medium text-teal hover:bg-teal/5"
          >
            Manage Homes
          </Link>
          {event.status === "published" && (
            <Link
              href={`/event/${event.slug}`}
              className="rounded-full border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal hover:bg-charcoal/5"
            >
              View Public Page
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
