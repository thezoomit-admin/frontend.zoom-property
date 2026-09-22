import { landingOgResponse } from "@/lib/landing-og";

export const alt = "Project landing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string; path: string }>;
}) {
  const { lang, path } = await params;
  return landingOgResponse(path, lang);
}
