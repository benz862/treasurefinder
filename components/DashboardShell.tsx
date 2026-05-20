import Link from "next/link";
import { LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail?: string;
  showAdminLink?: boolean;
}

export function DashboardShell({
  children,
  userEmail,
  showAdminLink = false,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-teal-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo size="sm" href="/dashboard" />
          <div className="flex items-center gap-4 text-sm">
            {userEmail && (
              <span className="hidden text-charcoal/60 sm:inline">{userEmail}</span>
            )}
            {showAdminLink && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 font-medium text-teal hover:underline"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
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
