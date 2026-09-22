import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  generateLandingMetadata,
  ProjectLandingRoute,
} from "@/components/pages/zoomalzahara/campaign-route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  if (path === "zoomalzahara") {
    return { robots: { index: false, follow: false } };
  }
  return generateLandingMetadata(path);
}

export default async function ProjectLandingPathPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  if (path === "zoomalzahara") notFound();
  return <ProjectLandingRoute path={path} />;
}
