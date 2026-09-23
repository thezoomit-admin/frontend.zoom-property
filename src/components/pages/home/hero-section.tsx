import { AppContainer } from "@/components/common/app-container";
import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { HeroBackdrop } from "@/components/pages/home/hero-backdrop";
import { HeroLeadForm } from "@/components/pages/home/hero-lead-form";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/i18n/dictionaries";

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
    <section className="relative z-10 flex min-h-[80svh] items-end overflow-x-clip overflow-y-visible sm:min-h-[84svh]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Parallax speed={0.18} zoom className="absolute inset-0 size-full">
          <HeroBackdrop images={images} fallbackImages={HERO_IMAGES} />
        </Parallax>

        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/40"
        />
      </div>

      <AppContainer className="relative z-10 w-full pb-20 pt-16 sm:pb-24 sm:pt-20">
        {/* Left = copy, right = lead form (side-by-side from md up). */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-12 lg:gap-14">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <Reveal>
              <Badge className="w-fit gap-1.5 px-3 py-1 text-xs font-semibold">
                <Icon name="approved" size="xs" />
                {dict.hero.badge}
              </Badge>
            </Reveal>

            <Heading as="h1" size="h1" className="text-white">
              {dict.hero.title}
            </Heading>

            <Reveal delay={0.12}>
              <Text size="lead" className="max-w-xl leading-relaxed text-white/80 lg:max-w-2xl">
                {dict.hero.lead}
              </Text>
            </Reveal>
          </div>

          <Reveal
            delay={0.2}
            className="w-full shrink-0 md:w-[32rem] lg:w-[34rem]"
          >
            <HeroLeadForm
              dict={dict.contact.form}
              title={dict.contact.formTitle}
            />
          </Reveal>
        </div>
      </AppContainer>
    </section>
  );
}
