import type { Metadata } from "next";
import { Header, Footer } from "@/components/Layout";
import { ListingEditor } from "@/components/ListingEditor";

interface PageProps {
  params: Promise<{ token: string }>;
}

export const metadata: Metadata = {
  title: "Your Garage Sale Listing | Treasure Finder",
  description: "Update your garage sale listing for your neighborhood event.",
};

export default async function ListingPage({ params }: PageProps) {
  const { token } = await params;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <ListingEditor token={token} />
      </main>
      <Footer />
    </>
  );
}
