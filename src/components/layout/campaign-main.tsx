"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function CampaignMain({
  campaignPath,
  children,
}: {
  campaignPath: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const campaign = pathname.includes(campaignPath);

  return (
    <main
      id="top"
      className={cn(
        "flex-1 pt-13.5 sm:pt-17.5 lg:pb-0",
        campaign ? "pb-0" : "pb-18",
      )}
    >
      {children}
    </main>
  );
}
