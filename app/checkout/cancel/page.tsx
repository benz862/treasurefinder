import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-sm">
          <XCircle className="mx-auto h-16 w-16 text-coral" />
          <h1 className="mt-4 text-2xl font-bold text-charcoal">Checkout Cancelled</h1>
          <p className="mt-2 text-charcoal/70">
            No worries — you can try again whenever you&apos;re ready.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-full bg-teal px-8 py-3 font-bold text-white hover:bg-teal/90"
          >
            Back to Pricing
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
