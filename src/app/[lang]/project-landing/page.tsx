import type { Metadata } from "next";

import {
  generateLandingMetadata,
  ProjectLandingRoute,
} from "@/components/pages/landing/campaign-route";

export async function generateMetadata(): Promise<Metadata> {
  return generateLandingMetadata("project-landing");
}

export default function ProjectLandingPage() {
  return <ProjectLandingRoute path="project-landing" />;
}
