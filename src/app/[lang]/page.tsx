import { JsonLd } from "@/components/common/json-ld";
import { ContactCta } from "@/components/common/contact-cta";
import { CinematicShowcase } from "@/components/pages/home/cinematic-showcase";
import { HeroSection } from "@/components/pages/home/hero-section";
import { TestimonialsBento } from "@/components/pages/home/testimonials-bento";
import { StatsBanner } from "@/components/pages/home/stats-banner";
import { ListingsSection } from "@/components/pages/properties/listings-section";
import { ProjectsSection } from "@/components/pages/projects/projects-section";
import { AreasSection } from "@/components/pages/areas/areas-section";
import { VideoSection } from "@/components/pages/home/video-section";
import { HomeBlogSection } from "@/components/pages/home/home-blog-section";
import { showcase } from "@/data/services";
import { getDictionary } from "@/i18n/dictionaries";
import { listingsSchema } from "@/lib/seo";
// import { VideoCarouselSection } from "@/components/pages/home/video-carousel-section";

/**
 * Home page.
 *
 * A summary, not a catalogue. Each block previews a section of the site and
 * links onward to the page that owns it.
 */
export default async function Home() {
  const dict = await getDictionary();

  return (
    <>
      <JsonLd schema={listingsSchema()} />

      <HeroSection />

      {/* <ListingsSection variant="preview" limit={6} /> */}
      <AreasSection />

      <CinematicShowcase
        poster={dict.showcase.poster || showcase.poster}
        video={dict.showcase.video || showcase.video}
        dict={dict.showcase}
      />

      
     
      <ProjectsSection />
      {/* <div className="mb-8 md:mb-16 lg:mb-20"> */}
      <StatsBanner />
      {/* </div> */}
      <TestimonialsBento />
      <VideoSection />
      <div className="relative z-10 -mb-8 md:-mb-16 lg:-mb-24">
        <ContactCta tone="surface" noBackground />
      </div>
      <HomeBlogSection />
    </>
  );  
}
