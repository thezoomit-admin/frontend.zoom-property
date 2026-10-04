import { RichText } from "@/components/common/rich-text";
import type { IProjectDescription } from "@/data/projects";
import type { Locale } from "@/i18n/config";

/**
 * The "Specs" tab: titled, localized specification rows.
 */
export function ProjectSpecs({
  name,
  sections,
  legacyHtml,
  locale,
}: {
  name: string;
  sections?: IProjectDescription[];
  legacyHtml?: string;
  locale: Locale;
}) {
  const hasSections = Boolean(sections?.length);

  return (
    <div className="mt-4 flex flex-col gap-6 sm:gap-8">
      {hasSections ? (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {sections?.map((section, index) => {
            const title =
              locale === "bn" ? section.titleBn || section.title : section.title;
            const description =
              locale === "bn"
                ? section.descriptionBn || section.description
                : section.description;

            return (
              <section
                key={`${section.title}-${index}`}
                className="grid gap-3 border-b border-black py-6 last:border-b-0 sm:gap-6 sm:py-8 lg:grid-cols-[minmax(10rem,0.28fr)_minmax(0,1fr)] lg:gap-10"
              >
                <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {title}
                </h2>
                <RichText
                  html={description}
                  className="text-sm leading-7 text-foreground/80 sm:text-base"
                />
              </section>
            );
          })}
        </div>
      ) : legacyHtml ? (
        <div className="w-full lg:px-12 xl:px-24">
          <RichText html={legacyHtml} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
          <p className="font-medium text-foreground">Specifications coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Details for {name} will be added here.
          </p>
        </div>
      )}
    </div>
  );
}
