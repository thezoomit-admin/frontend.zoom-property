import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { EditorProvider } from "./editor-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";
import { ThemeProvider } from "./theme-provider";

/** Single mount point for every app-wide provider. Used by the root layout. */
export function Providers({
  isEditor = false,
  children,
}: {
  isEditor?: boolean;
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <EditorProvider isEditor={isEditor}>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <Toaster position="top-right" richColors />
        </EditorProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
