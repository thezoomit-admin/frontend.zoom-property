import { ImageResponse } from "next/og";

import { ZOOM_AL_ZAHARA_PHONES } from "@/data/zoomalzahara";
import { isLocale } from "@/i18n/config";

export const alt = "Zoom Al-Zahra — Basila Garden City, Mohammadpur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const bn = isLocale(lang) && lang === "bn";

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
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#99ff99",
              fontWeight: 600,
            }}
          >
            {bn ? "ল্যান্ড শেয়ার · বুকিং চালু" : "Land share · booking open"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: -2,
              fontWeight: 800,
              maxWidth: 980,
            }}
          >
            Zoom Al-Zahra
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#d4ddd0",
              maxWidth: 920,
            }}
          >
            {bn
              ? "বাসিলা গার্ডেন সিটি, মোহাম্মদপুর · জি+৯ · ৪.২৯ কাঠা"
              : "Basila Garden City, Mohammadpur · G+9 · 4.29 katha"}
          </div>
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
            <div style={{ display: "flex" }}>{bn ? "১৮টি বাড়ি" : "18 homes"}</div>
            <div style={{ display: "flex" }}>{bn ? "৪ বেড" : "4 bed"}</div>
            <div style={{ display: "flex" }}>{bn ? "৫৮ ফুট হ্রদ" : "58 ft lake"}</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#99ff99" }}>
            {`${ZOOM_AL_ZAHARA_PHONES.primary}  ·  ${ZOOM_AL_ZAHARA_PHONES.secondary}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
