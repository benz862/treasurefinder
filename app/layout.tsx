import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Treasure Finder — Neighborhood Garage Sale Maps",
    template: "%s | Treasure Finder",
  },
  description:
    "Create beautiful online garage sale event pages with interactive maps, participating homes, and shareable links.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Treasure Finder",
    description: "Find it. Love it. Take it home. Garage sales. Community treasures.",
    url: "https://treasurefinder.app",
    siteName: "Treasure Finder",
    images: [{ url: "/logo.png", width: 2041, height: 1275, alt: "Treasure Finder" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
