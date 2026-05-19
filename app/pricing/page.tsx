"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/Layout";
import { PricingCard } from "@/components/PricingCard";
import { TIER_LIST, type TierId } from "@/lib/tiers";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectTier(tierId: TierId) {
    setLoading(true);
    setSelectedTier(tierId);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = `/auth/signup?redirect=/pricing&tier=${tierId}`;
        return;
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
      setSelectedTier(null);
    }
  }

  return (
    <>
      <Header />
      <main className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-charcoal">Simple, One-Time Pricing</h1>
          <p className="mt-4 text-lg text-charcoal/70">
            Pay once for your event. No subscriptions. Choose the plan that fits your neighborhood.
          </p>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-coral/10 px-4 py-3 text-center text-sm text-coral">
            {error}
          </p>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {TIER_LIST.map((tier) => (
            <PricingCard
              key={tier.id}
              tierId={tier.id}
              onSelect={handleSelectTier}
              loading={loading}
              selectedTier={selectedTier}
            />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-charcoal/60">
          Already paid?{" "}
          <Link href="/dashboard" className="text-teal underline">
            Go to your dashboard
          </Link>{" "}
          to create your event.
        </p>
      </main>
      <Footer />
    </>
  );
}
