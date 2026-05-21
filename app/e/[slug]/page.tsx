import { redirect } from "next/navigation";

interface LegacyEventRedirectProps {
  params: Promise<{ slug: string }>;
}

/** Short /e/[slug] URLs redirect to canonical /event/[slug]. */
export default async function LegacyEventRedirect({ params }: LegacyEventRedirectProps) {
  const { slug } = await params;
  redirect(`/event/${slug}`);
}
