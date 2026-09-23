import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { SmoothScrollProvider } from "./smooth-scroll-provider";
import { ThemeProvider } from "./theme-provider";

/** Single mount point for every app-wide provider. Used by the root layout. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
