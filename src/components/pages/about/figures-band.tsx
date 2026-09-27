import { Heading } from "@/components/common/heading";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { Counter } from "@/components/motion/counter";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getDictionary } from "@/i18n/dictionaries";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

/**
 * The figures, on the charcoal.
 *
 * A full-bleed dark band rather than the white card grid the rest of the site
 * uses for statistics. Two reasons: this page is otherwise four light sections
 * in a row and needs somewhere for the eye to stop, and the guideline's
 * secondary is the ground its own reversed logo sits on — so the one dark
 * band on the page is the one place the brand is at full strength.
 *
 * The numerals are separated by hairlines rather than boxed, because a border
 * around each figure on a dark ground reads as a table of unrelated values.
 */
export async function FiguresBand() {
  const dict = await getDictionary();

  return (
    <Section className="relative bg-footer text-footer-foreground">
      <CmsSectionEditControl
        pageId="about"
        sectionId="figures"
        label="Key Figures"
        position="top-6 right-6"
      />
      <div className="flex flex-col gap-3">
        <Heading as="h2" size="h3" className="max-w-2xl text-footer-foreground">
          {dict.about.figuresTitle}
        </Heading>
        <Text size="sm" className="max-w-xl text-footer-foreground/75">
          {dict.about.figuresLead}
        </Text>
      </div>

      <Stagger className="mt-10 grid grid-cols-2 gap-y-10 border-t border-footer-foreground/15 pt-10 lg:grid-cols-4 lg:gap-y-0">
        {dict.about.stats?.map((stat, index) => (
          <StaggerItem
            key={index}
            /* The rule sits between figures, never before the first in a row —
               which is why it is reset at each breakpoint's column count. */
            className="flex flex-col gap-2 px-2 sm:px-6 [&:nth-child(odd)]:border-l-0 lg:[&:nth-child(odd)]:border-l lg:[&:first-child]:border-l-0 border-l border-footer-foreground/15 first:border-l-0"
          >
            <span className="font-heading text-4xl font-extrabold text-brand-green-light sm:text-5xl">
              <Counter
                to={Number(stat.value)}
                compact={stat.compact === "true"}
                suffix={stat.suffix || ""}
              />
            </span>
            <Text
              size="sm"
              className="font-medium text-footer-foreground/75"
            >
              {stat.label}
            </Text>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export default FiguresBand;
