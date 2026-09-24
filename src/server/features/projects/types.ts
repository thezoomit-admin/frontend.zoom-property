import "server-only";

import type { ApiMedia } from "../../base-api";

export interface ApiAgent {
  _id: string;
  name: string;
  nameBn?: string;
  role: string;
  roleBn?: string;
  phone: string;
  image?: ApiMedia;
  rating?: number;
  deals?: number;
  respondsIn?: number;
  languages?: string[];
}

/** A project as `/projects/public` returns it. */
export interface ApiProject {
  _id: string;
  slug: string;
  name: string;
  nameBn?: string;
  area?: { name?: string } | null;
  subArea?: { _id?: string; name?: string; nameBn?: string; slug?: string } | null;
  city?: string;
  progress?: number;
  /** "Planning" | "Processing" | "Completed", as the panel names it. */
  stage?: string;
  handover?: string;
  units?: number;
  unitsLeft?: number;
  sizeRange?: string;
  startingPrice?: number;
  coverImage?: ApiMedia;
  images?: ApiMedia[];
  description?: string[];
  descriptionBn?: string[];
  video?: {
    title?: string;
    titleBn?: string;
    youtubeUrl?: string;
    poster?: ApiMedia;
    duration?: string;
  } | null;
  lastInspected?: string;
  cctvStreamActive?: boolean;
  mapUrl?: string;
  isFooter?: boolean;
  rajukPermitNo?: string;
  milestones?: { label: string; percent: number; completed: boolean }[];
  agent?: ApiAgent;
}

/** What `/projects/public/:slug` answers with: the project and its units. */
export interface ApiProjectDetail {
  project: ApiProject;
  listings?: { slug: string }[];
}
