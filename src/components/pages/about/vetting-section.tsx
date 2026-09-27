import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/i18n/dictionaries";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

export async function VettingSection() {
  const dict = await getDictionary();
  const { vetting } = dict.pages;

  return (
    <Section className="relative border-t border-border bg-background">
      <CmsSectionEditControl
        pageId="about"
        sectionId="vetting"
        label="Vetting Section"
        position="top-6 right-6"
      />
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-8">
          <SectionHeading
            title={vetting.title}
            className="lg:flex-col lg:items-start"
          />
          {/* Decorative, so no alt text: the photograph illustrates the
              checks beside it and says nothing a reader would otherwise miss.
              Hidden on narrow screens, where the list is the whole point and
              a picture above it only pushes the checks off the fold. */}
          <Reveal delay={0.2} className="mt-auto hidden lg:block">
            <ImageFrame
              src={vetting.image}
              alt=""
              ratio="4/3"
              rounded="2xl"
              sizes="half"
              className="border border-border"
            />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ol className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {vetting.checks.map((check, index) => (
              <li key={check} className="flex items-start gap-4 p-5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="check" size="xs" />
                </span>
                <span className="flex-1 text-sm text-foreground">{check}</span>
                <span className="font-heading text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
