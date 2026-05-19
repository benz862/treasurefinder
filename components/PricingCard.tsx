"use client";

import { TIERS, type TierId } from "@/lib/tiers";
import { Check } from "lucide-react";

interface PricingCardProps {
  tierId: TierId;
  onSelect?: (tierId: TierId) => void;
  loading?: boolean;
  selectedTier?: TierId | null;
}

export function PricingCard({ tierId, onSelect, loading, selectedTier }: PricingCardProps) {
  const tier = TIERS[tierId];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
        tier.highlighted
          ? "border-teal bg-white ring-2 ring-teal/20"
          : "border-teal-100 bg-white"
      }`}
    >
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-coral px-4 py-1 text-xs font-bold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-charcoal">{tier.name}</h3>
      <p className="mt-2">
        <span className="text-4xl font-bold text-teal">{tier.priceDisplay}</span>
        <span className="text-sm text-charcoal/60"> one-time</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-charcoal/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
            {feature}
          </li>
        ))}
      </ul>
      {onSelect && (
        <button
          type="button"
          onClick={() => onSelect(tierId)}
          disabled={loading && selectedTier === tierId}
          className={`mt-6 w-full rounded-full py-3 text-sm font-bold transition-colors ${
            tier.highlighted
              ? "bg-coral text-white hover:bg-coral/90"
              : "bg-teal text-white hover:bg-teal/90"
          } disabled:opacity-60`}
        >
          {loading && selectedTier === tierId ? "Redirecting..." : "Choose Plan"}
        </button>
      )}
    </div>
  );
}
