import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { MapPin, Search, Share2, Home, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow/40 via-cream to-teal/10 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
              <MapPin className="h-4 w-4" />
              Neighborhood garage sale maps made easy
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-charcoal md:text-5xl">
              Turn Your Neighborhood Garage Sale Into a Real Event
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
              Create a beautiful online map, show every participating home, preview what&apos;s
              for sale, and help shoppers plan their route before they arrive.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-coral/90"
              >
                Create Your Event
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/event/maplewood-community-garage-sale"
                className="inline-flex items-center gap-2 rounded-full border-2 border-teal px-8 py-4 text-lg font-bold text-teal hover:bg-teal/5"
              >
                View Sample Event
              </Link>
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">The old way is chaos</h2>
                <p className="mt-4 text-charcoal/70">
                  Flyers get rained on. Addresses are hard to read. Shoppers drive in circles.
                  Organizers spend hours answering &ldquo;Where is the sale?&rdquo; texts.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-teal">Treasure Finder organizes it all</h2>
                <p className="mt-4 text-charcoal/70">
                  One shareable page with every home on a map, searchable categories, photos
                  of featured items, and one-tap directions. Your neighborhood sale becomes a
                  real event shoppers can plan around.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-teal/5 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-charcoal">How It Works</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Choose a plan & pay",
                  desc: "Pick Starter, Neighborhood, or Community based on how many homes are participating.",
                },
                {
                  step: "2",
                  title: "Add homes & photos",
                  desc: "Enter addresses, categories, featured items, and upload photos for each sale.",
                },
                {
                  step: "3",
                  title: "Share your event page",
                  desc: "Publish and share the link or QR code. Shoppers browse the map and plan their route.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-teal-100 bg-white p-6 text-center shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-yellow text-lg font-bold text-charcoal">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm text-charcoal/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-charcoal">
              Everything shoppers need
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MapPin, label: "Interactive map with pins" },
                { icon: Search, label: "Filter by category" },
                { icon: Home, label: "Preview featured items" },
                { icon: Share2, label: "Share & get directions" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center rounded-2xl border border-teal-100 bg-white p-6 text-center"
                >
                  <Icon className="h-8 w-8 text-teal" />
                  <p className="mt-3 text-sm font-medium text-charcoal">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-teal px-4 py-16 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Ready to organize your sale?</h2>
            <p className="mt-4 text-white/80">
              Plans start at $19. No subscription. Pay once, publish your event, and share the map.
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-8 py-4 text-lg font-bold text-white hover:bg-coral/90"
            >
              See Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-3xl font-bold text-charcoal">FAQ</h2>
            <dl className="mt-8 space-y-6">
              {[
                {
                  q: "Do shoppers need an account?",
                  a: "No! Anyone can view your public event page, browse the map, and get directions without signing up.",
                },
                {
                  q: "How many homes can I add?",
                  a: "Depends on your plan: Starter allows 5 homes, Neighborhood allows 20, and Community allows 75.",
                },
                {
                  q: "Can I print a flyer?",
                  a: "Neighborhood and Community plans include a printable flyer with a QR code linking to your event page.",
                },
                {
                  q: "When does my event go live?",
                  a: "You control publishing. Keep it as a draft while you add homes, then publish when you're ready.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-teal-100 bg-white p-5">
                  <dt className="font-bold text-charcoal">{q}</dt>
                  <dd className="mt-2 text-sm text-charcoal/70">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
