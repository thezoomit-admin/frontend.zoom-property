"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Renders the site-wide lead block everywhere except contact (already has
 * the full form), campaign landing pages (own enquire) and project detail
 * pages (render their own project-bound copy). Home used to be
 * excluded too, back when the hero carried its own copy of this form — the
 * hero is picture-only now, so home gets this block like every other page.
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
  const isContact = segments.includes("contact");
  const isCampaign = campaignPaths.some((path) => pathname.includes(path));
  const projectsAt = segments.indexOf("projects");
  const isProjectDetail = projectsAt !== -1 && segments.length > projectsAt + 1;

  if (isContact || isCampaign || isProjectDetail) return null;
  return <>{children}</>;
}
