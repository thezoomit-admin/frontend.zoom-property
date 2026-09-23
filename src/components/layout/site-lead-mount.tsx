"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the site-wide lead block everywhere except home, contact
 * (already has the full form), and campaign landing pages (own enquire).
 */
export function SiteLeadMount({
  campaignPaths = [],
  children,
}: {
  campaignPaths?: string[];
  children: ReactNode;
}) {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);
  // /en or /bn → home
  const isHome = segments.length <= 1;
  const isContact = segments.includes("contact");
  const isCampaign = campaignPaths.some((path) => pathname.includes(path));

  if (isHome || isContact || isCampaign) return null;
  return <>{children}</>;
}
