import { Parallax } from "@/components/motion/parallax";
import { HeroBackdrop } from "@/components/pages/home/hero-backdrop";
import { getDictionary } from "@/i18n/dictionaries";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`;

/**
 * The backdrop rotation, as it ships.
 *
 * Four addresses rather than four angles on one building: the hero is the
 * first claim the site makes about what it sells, and a penthouse, a lakefront
 * block and a lit facade at dusk make that claim wider than four views of the
 * same villa.
 *
 * The desk can replace the set from the panel; this is what shows until it
 * does, and what shows if the API cannot be reached.
 */
const HERO_IMAGES = [
  photo("photo-1600596542815-ffad4c1539a9"),
  photo("photo-1600607687939-ce8a6c25118c"),
  photo("photo-1613977257363-707ba9348227"),
  photo("photo-1512917774080-9991f1c4c750"),
];

export async function HeroSection() {
  const dict = await getDictionary();

  const cmsImages = (dict.hero.backgroundImages ?? []).filter(
    (url): url is string => typeof url === "string" && url.trim().length > 0,
  );
  const images = cmsImages.length > 0 ? cmsImages : HERO_IMAGES;

  return (
    <section className="relative z-10 min-h-svh overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Parallax speed={0.18} zoom className="absolute inset-0 size-full">
          <HeroBackdrop images={images} fallbackImages={HERO_IMAGES} />
        </Parallax>
      </div>

      <CmsSectionEditControl
        pageId="home"
        sectionId="hero"
        label="Hero Section"
        position="top-4 right-4 sm:top-6 sm:right-6"
      />
    </section>
  );
}
