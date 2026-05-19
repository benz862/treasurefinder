"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components/Layout";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-teal-100 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-charcoal">Organizer Login</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Sign in to manage your garage sale events.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-charcoal">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-teal-100 px-4 py-3 text-charcoal focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
          <p className="mt-1 text-xs text-charcoal/50">At least 6 characters.</p>
        </div>
        {error && <p className="text-sm text-coral">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-teal py-3 font-bold text-white hover:bg-teal/90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal/60">
        Don&apos;t have an account?{" "}
        <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-teal underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Suspense fallback={<div className="text-charcoal/60">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
