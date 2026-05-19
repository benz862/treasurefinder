import Link from "next/link";
import { MapPin } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-teal-100 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-white">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-charcoal">Treasure Finder</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-charcoal/80 md:flex">
          <Link href="/pricing" className="hover:text-teal">
            Pricing
          </Link>
          <Link href="/event/maplewood-community-garage-sale" className="hover:text-teal">
            Sample Event
          </Link>
          <Link href="/auth/login" className="hover:text-teal">
            Log In
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-coral px-5 py-2.5 text-white shadow-sm hover:bg-coral/90"
          >
            Create Your Event
          </Link>
        </nav>
        <Link
          href="/pricing"
          className="rounded-full bg-coral px-4 py-2 text-sm font-medium text-white md:hidden"
        >
          Create Event
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-teal-100 bg-teal text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-bold">Treasure Finder</p>
            <p className="mt-1 text-sm text-white/80">
              Turn neighborhood garage sales into organized, map-based events.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="/event/maplewood-community-garage-sale" className="hover:underline">
              Sample Event
            </Link>
            <Link href="/auth/login" className="hover:underline">
              Organizer Login
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Treasure Finder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
