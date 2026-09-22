import type { Metadata } from "next";

import {
  generateLandingMetadata,
  ProjectLandingRoute,
} from "@/components/pages/zoomalzahara/campaign-route";

export async function generateMetadata(): Promise<Metadata> {
  return generateLandingMetadata("zoomalzahara");
}

export default function ZoomAlZaharaPage() {
  return <ProjectLandingRoute path="zoomalzahara" />;
}
