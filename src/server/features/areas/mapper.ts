import "server-only";

import type { Area } from "@/data/areas";

import { mediaUrl } from "../../base-api";
import type { ApiArea } from "./types";

/**
 * An API area to the `Area` the cards consume.
 *
 * The market figures are held rather than computed, and the desk may not have
 * entered them yet, so each tolerates being missing. A card reading "—"
 * is honest; one reading "৳0" is not.
 */
export const toArea = (a: ApiArea): Area => ({
  id: a.slug || a._id,
  refId: a._id,
  name: a.name,
  nameBn: a.nameBn || a.name,
  city: a.city || "Dhaka",
  tagline: a.tagline || "",
  taglineBn: a.taglineBn || a.tagline || "",
  listings: a.listings ?? 0,
  medianPrice: a.medianPrice ?? 0,
  pricePerSqft: a.pricePerSqft ?? 0,
  rentalYield: a.rentalYield || "—",
  image: mediaUrl(a.image),
  note: a.note || "",
  securityTier: a.securityTier || "",
  metroConnectivity: a.metroConnectivity,
});
