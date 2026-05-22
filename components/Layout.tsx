import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-teal-100 bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo size="sm" />
          <nav className="hidden items-center gap-5 text-sm font-medium text-charcoal/80 lg:flex">
            <Link href="/explore" className="hover:text-teal">
              Explore
            </Link>
            <Link href="/categories" className="hover:text-teal">
              Categories
            </Link>
            <Link href="/explore" className="hover:text-teal">
              Maps
            </Link>
            <Link href="/weekend" className="hover:text-teal">
              This Weekend
            </Link>
            <Link href="/pricing" className="hover:text-teal">
              Organize Event
            </Link>
            <Link href="/auth/login" className="hover:text-teal">
              Sign In
            </Link>
            <Link
              href="/pricing"
              className="rounded-full bg-coral px-5 py-2.5 text-white shadow-sm hover:bg-coral/90"
            >
              Create Event
            </Link>
          </nav>
          <Link
            href="/explore"
            className="shrink-0 rounded-full border border-teal px-4 py-2 text-sm font-medium text-teal lg:hidden"
          >
            Map
          </Link>
        </div>
      </header>
      <MobileBottomNav />
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-teal-100 bg-teal text-white pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-block rounded-2xl bg-white/95 p-3 shadow-sm">
              <Logo size="md" href={null} />
            </div>
            <p className="mt-3 text-sm text-white/80">
              A modern discovery engine for local events — garage sales, markets, and community
              treasure hunts through interactive maps.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/explore" className="hover:underline">
              Explore Map
            </Link>
            <Link href="/categories" className="hover:underline">
              Categories
            </Link>
            <Link href="/weekend" className="hover:underline">
              This Weekend
            </Link>
            <Link href="/search" className="hover:underline">
              Find Sales
            </Link>
            <Link href="/#browse-state" className="hover:underline">
              Browse by State
            </Link>
            <Link href="/pricing" className="hover:underline">
              Organize Event
            </Link>
            <Link href="/auth/login" className="hover:underline">
              Sign In
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
