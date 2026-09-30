import { Section } from "@/components/common/section";
import { InteractiveProjects } from "./interactive-projects";
import { ProjectsByArea } from "./projects-by-area";
import { getProjects } from "@/server/features/projects";
import { getAreas } from "@/server/features/areas";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function ProjectsSection({
  variant = "home",
  limit,
  initialStage,
  initialSearch,
  initialPage,
}: {
  variant?: "home" | "full";
  limit?: number;
  initialStage?: string;
  initialSearch?: string;
  initialPage?: number;
} = {}) {
  const isFull = variant === "full";
  const [dict, locale, projects, areas] = await Promise.all([
    getDictionary(),
    getLocale(),
    getProjects(limit ?? 100),
    isFull ? Promise.resolve([]) : getAreas(60),
  ]);

  return (
    <Section id="projects" className="relative bg-background">
      {isFull ? (
        <InteractiveProjects
          projects={projects}
          locale={locale}
          initialStage={initialStage}
          initialSearch={initialSearch}
          initialPage={initialPage}
        />
      ) : (
        <ProjectsByArea
          projects={projects}
          areas={areas}
          locale={locale}
          titleTemplate={dict.projects.homeTitle}
        />
      )}
    </Section>
  );
}
