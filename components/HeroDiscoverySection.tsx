"use client";

import Link from "next/link";
import { EVENT_CATEGORY_LIST } from "@/lib/eventCategories";
import { ArrowRight } from "lucide-react";

const FLOATING_PINS = [
  { top: "18%", left: "12%", delay: "0s", category: "garage_sale" as const },
  { top: "32%", left: "68%", delay: "0.4s", category: "flea_market" as const },
  { top: "55%", left: "22%", delay: "0.8s", category: "craft_fair" as const },
  { top: "48%", left: "78%", delay: "1.2s", category: "farmers_market" as const },
  { top: "72%", left: "52%", delay: "0.6s", category: "estate_sale" as const },
  { top: "24%", left: "42%", delay: "1s", category: "community_bazaar" as const },
];

export function HeroDiscoverySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yellow/35 via-cream to-teal/15 px-4 py-14 md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(26,107,107,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,91,0.12),transparent_45%)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <path
            d="M0 220 Q200 180 400 210 T800 200 L800 400 L0 400 Z"
            fill="rgba(26,107,107,0.06)"
          />
          <path
            d="M0 260 Q250 230 500 250 T800 240"
            fill="none"
            stroke="rgba(26,107,107,0.12)"
            strokeWidth="2"
          />
        </svg>
        {FLOATING_PINS.map((pin) => {
          const cat = EVENT_CATEGORY_LIST.find((c) => c.key === pin.category)!;
          return (
            <span
              key={pin.category}
              className="animate-marker-float absolute h-4 w-4 rounded-full shadow-lg ring-2 ring-white/80"
              style={{
                top: pin.top,
                left: pin.left,
                backgroundColor: cat.color,
                animationDelay: pin.delay,
              }}
            />
          );
        })}
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-teal shadow-sm backdrop-blur-sm">
          The weekend starts here
        </span>
        <h1 className="mt-6 text-3xl font-bold leading-tight text-charcoal md:text-5xl">
          Discover Local Treasure Hunts, Markets &amp; Community Events
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-charcoal/70">
          Explore garage sales, estate sales, flea markets, craft fairs, vendor markets, and
          community events through beautiful interactive maps and discoverable event pages.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-bold text-white shadow-md transition hover:bg-coral/90 hover:shadow-lg"
          >
            Explore Events
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full border-2 border-teal bg-white/80 px-6 py-3 font-bold text-teal backdrop-blur-sm hover:bg-teal/5"
          >
            Create Event
          </Link>
          <Link
            href="/weekend"
            className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal/15 bg-white/70 px-6 py-3 font-bold text-charcoal backdrop-blur-sm hover:bg-charcoal/5"
          >
            Browse This Weekend
          </Link>
        </div>
      </div>
    </section>
  );
}
