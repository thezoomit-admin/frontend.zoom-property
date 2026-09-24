"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { isLandingPath } from "@/lib/landing";

/**
 * Picks the footer client-side, from footers the server already rendered.
 *
 * The server can't tell a campaign landing page from any other route without
 * `headers()`, and `headers()` would make every page dynamic just to answer
 * a question this component can answer for free from `usePathname()`. Both
 * `normal` and every row in `landings` are rendered up front — cheap, since
 * `LandingFooter` is just markup over a few strings — and only one is kept.
 */
export function SiteFooterSwitch({
  normal,
  landings,
}: {
  normal: ReactNode;
  landings: { href: string; node: ReactNode }[];
}) {
  const pathname = usePathname() || "";
  const match = landings.find((row) => isLandingPath(pathname, row.href));
  return <>{match ? match.node : normal}</>;
}
