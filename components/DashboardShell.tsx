import Link from "next/link";
import { MapPin, LogOut } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-teal-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="font-bold text-charcoal">Treasure Finder</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {userEmail && (
              <span className="hidden text-charcoal/60 sm:inline">{userEmail}</span>
            )}
            <Link href="/" className="text-teal hover:underline">
              Home
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-1 text-charcoal/60 hover:text-charcoal"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
