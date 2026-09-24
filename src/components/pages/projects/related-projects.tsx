import { Heading } from "@/components/common/heading";
import { Section } from "@/components/common/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProjectCard } from "@/components/pages/projects/project-card";
import type { Locale } from "@/i18n/config";
import { getProjects } from "@/server/features/projects";

/** Related projects strip — streamed after the main detail paints. */
export async function RelatedProjects({
  excludeSlug,
  locale,
  title,
}: {
  excludeSlug: string;
  locale: Locale;
  title: string;
}) {
  const list = await getProjects(12);
  const others = list.filter((item) => item.slug !== excludeSlug).slice(0, 3);
  if (others.length === 0) return null;

  return (
    <Section className="border-t border-border bg-muted/30">
      <Heading as="h2" size="h3">
        {title}
      </Heading>

      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((item) => (
          <StaggerItem key={item.id}>
            <ProjectCard project={item} locale={locale} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
