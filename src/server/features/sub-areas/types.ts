import "server-only";

import type { ApiMedia } from "../../base-api";

export interface ApiSubArea {
  _id: string;
  slug?: string;
  name: string;
  nameBn?: string;
  tagline?: string;
  taglineBn?: string;
  note?: string;
  noteBn?: string;
  image?: ApiMedia;
  projectCount?: number;
  area?:
    | string
    | {
        _id: string;
        name?: string;
        nameBn?: string;
        slug?: string;
        city?: string;
      };
}
