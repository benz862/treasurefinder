import Link from "next/link";
import { Header, Footer } from "@/components/Layout";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-teal-100 bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto h-16 w-16 text-leaf" />
          <h1 className="mt-4 text-2xl font-bold text-charcoal">Payment Successful!</h1>
          <p className="mt-2 text-charcoal/70">
            Your plan is ready. Create your garage sale event and start adding participating homes.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-6 inline-block rounded-full bg-teal px-8 py-3 font-bold text-white hover:bg-teal/90"
          >
            Create Your Event
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
