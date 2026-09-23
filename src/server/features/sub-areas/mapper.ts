import "server-only";

import { mediaUrl } from "../../base-api";
import type { ApiSubArea } from "./types";

export interface SubArea {
  id: string;
  refId: string;
  name: string;
  nameBn: string;
  tagline: string;
  taglineBn: string;
  note: string;
  noteBn: string;
  image: string;
  projectCount: number;
  areaSlug?: string;
  areaName?: string;
  areaNameBn?: string;
}

export const toSubArea = (s: ApiSubArea): SubArea => {
  const area =
    s.area && typeof s.area === "object" ? s.area : undefined;
  return {
    id: s.slug || s._id,
    refId: s._id,
    name: s.name,
    nameBn: s.nameBn || s.name,
    tagline: s.tagline || "",
    taglineBn: s.taglineBn || s.tagline || "",
    note: s.note || "",
    noteBn: s.noteBn || s.note || "",
    image: mediaUrl(s.image),
    projectCount: s.projectCount ?? 0,
    areaSlug: area?.slug,
    areaName: area?.name,
    areaNameBn: area?.nameBn,
  };
};
