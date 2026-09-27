import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/i18n/dictionaries";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

/**
 * Who we are, and why the company exists.
 *
 * An asymmetric split rather than another card grid: this is the one section
 * on the page that is prose, and prose in a grid of equal boxes reads as a
 * feature list. The text column is narrower than the images so the paragraphs
 * hold a comfortable measure instead of running the full width.
 *
 * The two photographs overlap deliberately — a single flat image beside a
 * column of text is the layout every agency site uses, and the offset is what
 * stops this page opening the way the last one did.
 */
export async function StorySection() {
  const dict = await getDictionary();
  const t = dict.about.story;

  return (
    <Section className="relative overflow-hidden border-b border-border bg-background">
      <CmsSectionEditControl
        pageId="about"
        sectionId="story"
        label="Story Section"
        position="top-6 right-6"
      />
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <div className="flex flex-col gap-5">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-primary">
              {t.eyebrow}
            </span>

            <Heading as="h2" size="h2" className="max-w-xl text-balance">
              {t.title}
            </Heading>

            <Text size="lead" className="max-w-xl text-foreground/80">
              {t.lead}
            </Text>

            <div className="flex flex-col gap-4 border-l-2 border-primary/25 pl-5">
              <Text size="sm" className="max-w-xl text-muted-foreground">
                {t.bodyOne}
              </Text>
              <Text size="sm" className="max-w-xl text-muted-foreground">
                {t.bodyTwo}
              </Text>
            </div>

            <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Icon name="approved" size="xs" />
              {t.badge}
            </span>
          </div>
        </Reveal>

        {/* The offset pair. Hidden below `sm` as a single frame: two overlapping
            images on a phone is a stack of crops, not a composition. */}
        <Reveal delay={0.1}>
          <div className="relative">
            <ImageFrame
              src={t.imageOne}
              alt=""
              ratio="4/3"
              rounded="2xl"
              sizes="half"
              className="shadow-lg"
            />

            <div
              aria-hidden
              className="absolute -bottom-8 -left-6 hidden w-44 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block lg:-left-10 lg:w-56"
            >
              <ImageFrame
                src={t.imageTwo}
                alt=""
                ratio="square"
                rounded="none"
                sizes="thumb"
              />
            </div>

            <span
              aria-hidden
              className="absolute -right-10 -top-10 -z-10 size-48 rounded-full bg-primary/8 blur-3xl"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default StorySection;
