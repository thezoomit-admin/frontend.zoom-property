import type { Metadata } from "next";


import {
  generateLandingMetadata,
  ProjectLandingRoute,
} from "@/components/pages/landing/campaign-route";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string }>;
}): Promise<Metadata> {
  const { path } = await params;
  return generateLandingMetadata(path);
}

export default async function ProjectLandingPathPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return <ProjectLandingRoute path={path} />;
}
