import "server-only";

import type { Project } from "@/data/projects";

import { gallery, isoDate, mediaUrl, paragraphs } from "../../base-api";
import type { ApiProject } from "./types";

/**
 * An API project to the `Project` the cards consume.
 *
 * `progress` is never mapped from anything the desk typed - the API computes
 * it from the ticked milestones, which is why a project cannot claim 60% while
 * its programme adds up to 40.
 */
export const toProject = (p: ApiProject): Project => ({
  id: p._id,
  slug: p.slug,
  name: p.name,
  nameBn: p.nameBn,
  area: p.area?.name || "",
  subAreaRefId: p.subArea?._id,
  city: p.city || "Dhaka",
  progress: p.progress ?? 0,
  handover: p.handover || "",
  units: p.units ?? 0,
  unitsLeft: p.unitsLeft ?? 0,
  sizeRange: p.sizeRange || "",
  startingPrice: p.startingPrice ?? 0,
  image: mediaUrl(p.coverImage),
  images: gallery(p.coverImage, p.images),
  description: paragraphs(p.description),
  descriptionBn: paragraphs(p.descriptionBn),
  video: {
    title: p.video?.title || "",
    titleBn: p.video?.titleBn || "",
    youtubeUrl: p.video?.youtubeUrl || "",
    // No still of its own falls back to the cover, so the player always has a
    // frame to show before anyone presses play.
    poster: mediaUrl(p.video?.poster) || mediaUrl(p.coverImage),
    duration: p.video?.duration || "",
  },
  status: (p.stage as Project["status"]) || "Planning",
  lastInspected: isoDate(p.lastInspected),
  cctvStreamActive: Boolean(p.cctvStreamActive),
  mapUrl: p.mapUrl || "",
  isFooter: Boolean(p.isFooter),
  rajukPermitNo: p.rajukPermitNo || "",
  milestones: (p.milestones ?? []).map((m) => ({
    label: m.label,
    percent: m.percent,
    completed: m.completed,
  })),
  agent: p.agent
    ? {
        id: p.agent._id,
        name: p.agent.name,
        nameBn: p.agent.nameBn,
        role: p.agent.role,
        roleBn: p.agent.roleBn,
        phone: p.agent.phone,
        image: mediaUrl(p.agent.image),
        rating: p.agent.rating,
        deals: p.agent.deals,
        respondsIn: p.agent.respondsIn,
        languages: p.agent.languages,
      }
    : undefined,
});
