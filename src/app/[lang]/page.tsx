import { JsonLd } from "@/components/common/json-ld";
import { HeroSection } from "@/components/pages/home/hero-section";
import { ProjectsSection } from "@/components/pages/projects/projects-section";
import { VideoSection } from "@/components/pages/home/video-section";
import { listingsSchema } from "@/lib/seo";

/**
 * Home page.
 *
 * A summary, not a catalogue. Each block previews a section of the site and
 * links onward to the page that owns it.
 */
export default async function Home() {
  return (
    <>
      <JsonLd schema={listingsSchema()} />

      <HeroSection />

      <ProjectsSection />
      {/* <StatsBanner /> */}
      <VideoSection />
    </>
  );
}
