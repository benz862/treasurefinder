import Link from "next/link";
import { Header, Footer } from "@/components/Layout";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-charcoal">Page Not Found</h1>
        <p className="mt-4 text-charcoal/70">
          The page you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-teal px-6 py-3 font-medium text-white hover:bg-teal/90"
        >
          Go Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
