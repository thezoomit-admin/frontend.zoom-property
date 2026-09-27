import { landingOgResponse } from "@/lib/landing-og";

export const alt = "Project landing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return landingOgResponse("zoomalzahara", lang);
}
