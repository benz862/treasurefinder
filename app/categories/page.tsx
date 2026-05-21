import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { EVENT_CATEGORY_LIST } from "@/lib/eventCategories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Event Categories",
  description:
    "Explore garage sales, estate sales, flea markets, craft fairs, vendor markets, and community events.",
};

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-teal">Categories</p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal md:text-4xl">Browse By Event Type</h1>
          <p className="mt-2 max-w-2xl text-sm text-charcoal/60">
            TreasureFinder supports many local event types — garage sales remain the heart of the
            platform, with room to grow.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_CATEGORY_LIST.map((cat) => (
              <Link
                key={cat.key}
                href={`/explore?type=${cat.slug}`}
                className="group overflow-hidden rounded-3xl border border-teal-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                >
                  ✦
                </div>
                <h2 className="text-lg font-bold text-charcoal">{cat.label}</h2>
                <p className="mt-1 text-sm text-charcoal/60">{cat.description}</p>
                <p className="mt-2 text-xs font-medium text-teal">{cat.mood}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
