/**
 * Simple Maps helpers for landing amenities.
 * Never put raw Maps URLs into dir origin/destination — Google rejects that.
 */

export type LatLng = { lat: number; lng: number };

function isValid(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

function trim(v: unknown): string {
  return String(v ?? "").trim();
}

function looksLikeUrl(s: string): boolean {
  return /^https?:\/\//i.test(s) || /google\.com\/maps/i.test(s);
}

/**
 * Prefer real place coords (!3d!4d / !8m2!3d!4d) over camera @lat,lng
 * — @ is often the map viewport, not the pin.
 */
export function parseMapsCoords(raw: string): LatLng | null {
  const url = trim(raw);
  if (!url) return null;

  const decoded = (() => {
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  })();

  // Place pin: !8m2!3dLAT!4dLNG or !3dLAT!4dLNG
  const pin = decoded.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pin) {
    const lat = Number(pin[1]);
    const lng = Number(pin[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  // Embed: !2dLNG!3dLAT
  const embed = decoded.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
  if (embed) {
    const lng = Number(embed[1]);
    const lat = Number(embed[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  // Camera center fallback: @lat,lng
  const at = decoded.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (at) {
    const lat = Number(at[1]);
    const lng = Number(at[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  const query = decoded.match(
    /(?:[?&#](?:q|ll|center)=)(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/i,
  );
  if (query) {
    const lat = Number(query[1]);
    const lng = Number(query[2]);
    if (isValid(lat, lng)) return { lat, lng };
  }

  return null;
}

/**
 * Turn a Maps URL or plain address into something Google Directions accepts
 * (lat,lng OR a place name — never a full URL string).
 */
export function mapsQuery(raw: string, fallback = ""): string {
  const value = trim(raw);
  const fb = trim(fallback);
  if (!value) return fb;

  if (!looksLikeUrl(value)) return value;

  const coords = parseMapsCoords(value);
  if (coords) return `${coords.lat},${coords.lng}`;

  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();

  const apiQuery = decoded.match(/[?&]query=([^&]+)/i);
  if (apiQuery?.[1]) {
    const q = apiQuery[1].replace(/\+/g, " ").trim();
    if (q && !looksLikeUrl(q)) return q;
  }

  const q = decoded.match(/[?&]q=([^&]+)/i);
  if (q?.[1] && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+/.test(q[1])) {
    const text = q[1].replace(/\+/g, " ").trim();
    if (text && !looksLikeUrl(text)) return text;
  }

  // /maps/place/Mohammadpur+Bus+Stand/
  const place = decoded.match(/\/maps\/place\/([^/@]+)/i);
  if (place?.[1]) {
    const name = place[1].replace(/\+/g, " ").trim();
    if (name) return name;
  }

  const search = decoded.match(/\/maps\/search\/([^/@?]+)/i);
  if (search?.[1]) {
    const name = search[1].replace(/\+/g, " ").trim();
    if (name) return name;
  }

  return fb && !looksLikeUrl(fb) ? fb : "";
}

function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function formatDistance(meters: number, bn = false): string {
  if (!Number.isFinite(meters) || meters < 0) return "";
  const toBn = (n: string) =>
    bn ? n.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]!) : n;

  if (meters < 1000) {
    const m = Math.max(1, Math.round(meters));
    return bn ? `${toBn(String(m))} মি` : `${m} m`;
  }
  const km = meters / 1000;
  const fixed = km >= 10 ? km.toFixed(0) : km.toFixed(1);
  return bn ? `${toBn(fixed)} কিমি` : `${fixed} km`;
}

function safeLabel(...candidates: string[]): string {
  for (const c of candidates) {
    const v = trim(c);
    if (!v || looksLikeUrl(v)) continue;
    return v;
  }
  return "";
}

export type AmenityMapsResult = {
  href: string;
  distance: string;
};

/**
 * Pin click → Google directions (project → place).
 * Uses coords when available; otherwise place names extracted from URLs.
 */
export function resolveAmenityMaps(input: {
  projectMapUrl?: string;
  projectAddress?: string;
  placeMapUrl?: string;
  placeName?: string;
  manualDistance?: string;
  bn?: boolean;
}): AmenityMapsResult {
  const projectMap = trim(input.projectMapUrl);
  const projectAddress = trim(input.projectAddress);
  const placeMap = trim(input.placeMapUrl);
  const placeName = trim(input.placeName);
  const manual = trim(input.manualDistance);
  const bn = Boolean(input.bn);

  if (!placeMap && !placeName) return { href: "", distance: "" };

  const originCoords = parseMapsCoords(projectMap) || parseMapsCoords(projectAddress);
  const placeCoords = parseMapsCoords(placeMap);

  const originLabel = safeLabel(
    originCoords ? `${originCoords.lat},${originCoords.lng}` : "",
    mapsQuery(projectMap, projectAddress),
    mapsQuery(projectAddress),
    projectAddress,
  );

  const destLabel = safeLabel(
    placeCoords ? `${placeCoords.lat},${placeCoords.lng}` : "",
    mapsQuery(placeMap, placeName),
    placeName,
  );

  let href = "";
  if (originLabel && destLabel) {
    href = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originLabel)}&destination=${encodeURIComponent(destLabel)}&travelmode=driving`;
  } else if (destLabel) {
    href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destLabel)}`;
  }

  const distance =
    manual ||
    (originCoords && placeCoords
      ? formatDistance(distanceMeters(originCoords, placeCoords), bn)
      : "") ||
    "";

  return { href, distance };
}
