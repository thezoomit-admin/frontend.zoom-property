"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

interface MetaPixelProps {
  pixelId?: string;
}

const detailPath = /^\/(?:bn|en)\/(properties|projects)\/([^/?#]+)$/;

export function MetaPixel({ pixelId }: MetaPixelProps) {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!pixelId) return;

    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const trackCurrentPage = () => {
      if (!window.fbq) {
        retryTimer = setTimeout(trackCurrentPage, 50);
        return;
      }
// main tracking push here
      const isInitialPageLoad = previousPathname.current === null;
      previousPathname.current = pathname;

      const match = pathname.match(detailPath);
      if (match) {
        const [, type, slug] = match;
        window.fbq("track", "ViewContent", {
          content_ids: [slug],
          content_type: type === "properties" ? "property" : "project",
        });
      }

      if (!isInitialPageLoad) {
        window.fbq("track", "PageView");
      }
    };

    trackCurrentPage();
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [pathname, pixelId]);

  useEffect(() => {
    if (!pixelId) return;

    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("tel:") || href.startsWith("mailto:")) {
        window.fbq?.("track", "Contact");
      } else if (/^\/(?:bn|en)\/contact(?:[/?#]|$)/.test(href)) {
        window.fbq?.("track", "Lead");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pixelId]);

  if (!pixelId) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
