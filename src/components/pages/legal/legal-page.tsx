import { Heading } from "@/components/common/heading";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalContent {
  backgroundImage?: string;
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Terms and Privacy, on one component.
 *
 * The two pages are the same document with different words in it, so they
 * share a layout rather than each getting a hand-built one that drifts.
 *
 * A numbered single column, not cards and not an accordion: this is read
 * linearly by someone checking a specific clause, and every clause has to be
 * visible to a browser's find-in-page. An accordion hides half the document
 * from Ctrl+F, which is the one thing a legal page must not do.
 *
 * The measure is held near 70 characters. Long prose set to full container
 * width is the difference between a page somebody reads and one they skim.
 */
export function LegalPage({
  content,
  fallbackImage,
  cmsSectionId,
}: {
  content: LegalContent;
  fallbackImage: string;
  cmsSectionId?: string;
}) {
  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        image={content.backgroundImage || fallbackImage}
        cmsPageId={cmsSectionId ? "legal" : undefined}
        cmsSectionId={cmsSectionId}
      />

      <Section className="bg-background">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Reveal>
            <Text
              size="xs"
              className="font-medium uppercase tracking-wide text-muted-foreground"
            >
              {content.updated}
            </Text>
          </Reveal>

          <ol className="flex list-none flex-col gap-10">
            {content.sections.map((section, index) => (
              <Reveal key={section.title} delay={Math.min(index, 6) * 0.04}>
                <li className="flex flex-col gap-3">
                  <Heading as="h2" size="h5" className="flex items-baseline gap-3">
                    {/* The number is decorative: the heading text is what a
                        screen reader should announce, and "01" read aloud
                        before every heading is noise. */}
                    <span
                      aria-hidden
                      className="font-heading text-sm font-bold text-primary"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </Heading>
                  <Text
                    as="div"
                    className="text-editor leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>
    </>
  );
}

export default LegalPage;
