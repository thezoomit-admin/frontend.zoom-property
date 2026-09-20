"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const detailPath = /^\/(?:bn|en)\/(properties|projects)\/([^/?#]+)$/;

function track(event: string, params?: Record<string, unknown>) {
  window.fbq?.("track", event, params);
}

/**
 * SPA route tracking only. The base Pixel snippet lives in the locale layout
 * so the first PageView fires from a real script tag, not a client bundle.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const isInitialPageLoad = previousPathname.current === null;
    previousPathname.current = pathname;

    if (isInitialPageLoad) return;

    track("PageView");

    const match = pathname.match(detailPath);
    if (!match) return;

    const [, type, slug] = match;
    track("ViewContent", {
      content_ids: [slug],
      content_type: type === "properties" ? "property" : "project",
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        track("Contact");
      } else if (/^\/(?:bn|en)\/contact(?:[/?#]|$)/.test(href)) {
        track("Lead");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
