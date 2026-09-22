import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating route badge in the bottom corner during `next dev`.
  // Compile and runtime errors still surface in the full-screen overlay — this
  // only removes the always-on indicator, not the error reporting.
  devIndicators: false,

  experimental: {
    // Enables `src/app/global-not-found.tsx`. Needed because the root layout
    // sits under a dynamic segment (`app/[lang]/layout.tsx`), so a URL that
    // matches no route has no layout to render a `not-found.tsx` inside.
    globalNotFound: true,
  },

  images: {
    qualities: [75, 90],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "https", hostname: "*.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },
};

export default nextConfig;
