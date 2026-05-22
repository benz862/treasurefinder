"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Compass, Grid3X3, Map, PlusCircle, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/explore", label: "Maps", icon: Map, match: "/explore" },
  { href: "/weekend", label: "Weekend", icon: Calendar },
  { href: "/pricing", label: "Organize", icon: PlusCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-teal-100 bg-cream/95 backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/explore" && pathname.startsWith("/explore"));
          return (
            <Link
              key={label}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-semibold transition ${
                active ? "text-teal" : "text-charcoal/55"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-teal" : "text-charcoal/45"}`} />
              {label}
            </Link>
          );
        })}
        <Link
          href="/auth/login"
          className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-semibold ${
            pathname.startsWith("/auth") ? "text-teal" : "text-charcoal/55"
          }`}
        >
          <User className="h-5 w-5" />
          Sign In
        </Link>
      </div>
    </nav>
  );
}
