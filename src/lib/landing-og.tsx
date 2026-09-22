import { ImageResponse } from "next/og";

import { isLocale, type Locale } from "@/i18n/config";
import { getLandingByPath } from "@/server/features/project-landing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function landingOgResponse(path: string, lang: string) {
  const locale: Locale = isLocale(lang) && lang === "bn" ? "bn" : "en";
  const landing = await getLandingByPath(path, locale);
  const title = landing?.hero.title || landing?.projectName || "Zoom Property";
  const location = landing?.hero.location || "";
  const badge = landing?.hero.badge || "";
  const phones = [landing?.phone, landing?.phoneAlt].filter(Boolean).join("  ·  ");
  const stats = (landing?.hero.stats || []).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1b2318",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#4b802d",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              ZOOM PROPERTY
            </div>
          </div>
          {badge ? (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#99ff99",
                fontWeight: 600,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 28 ? 56 : 72,
              lineHeight: 1.05,
              letterSpacing: -2,
              fontWeight: 800,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {location ? (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#d4ddd0",
                maxWidth: 920,
              }}
            >
              {location}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #495045",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#e8eee6" }}>
            {stats.length
              ? stats.map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} style={{ display: "flex" }}>
                    {[stat.value, stat.label].filter(Boolean).join(" ")}
                  </div>
                ))
              : null}
          </div>
          {phones ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: "#99ff99",
              }}
            >
              {phones}
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
