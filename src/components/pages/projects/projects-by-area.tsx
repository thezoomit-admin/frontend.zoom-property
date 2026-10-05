"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Area } from "@/data/areas";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";

import { ProjectCard } from "./project-card";

/**
 * Home page projects, grouped by area.
 *
 * The tabs are the service areas the desk maintains in the panel — not
 * derived from whichever projects exist — so the list here always matches
 * `/areas`. Picking one shows that area's first project as a large feature
 * (image, name, a line of copy, Learn More) with the rest of that area's
 * projects in a grid underneath. However many that is: no pagination here,
 * the full catalogue already has its own filters.
 */
export function ProjectsByArea({
  projects,
  areas,
  locale = "en",
  titleTemplate,
}: {
  projects: Project[];
  /** The service-area list from the panel — the source of truth for the tabs. */
  areas: Area[];
  locale?: Locale;
  /** The heading, with `{area}` swapped for whichever tab is active. */
  titleTemplate?: string;
}) {
  const isBn = locale === "bn";

  // Falls back to whatever the projects themselves carry only if the areas
  // API is unreachable — the tab list should never just go blank.
  const tabAreas = useMemo(() => {
    if (areas.length > 0) {
      return areas.map((area) => ({
        name: area.name,
        label: isBn && area.nameBn ? area.nameBn : area.name,
      }));
    }
    const seen = new Set<string>();
    const list: { name: string; label: string }[] = [];
    for (const project of projects) {
      if (project.area && !seen.has(project.area)) {
        seen.add(project.area);
        list.push({ name: project.area, label: project.area });
      }
    }
    return list;
  }, [areas, projects, isBn]);

  const [activeArea, setActiveArea] = useState(tabAreas[0]?.name ?? "");

  // Keep both the feature and the cards underneath in step with the selected
  // area, so changing tabs never leaves projects from another area visible.
  const areaProjects = useMemo(
    () => projects.filter((project) => project.area === activeArea),
    [projects, activeArea],
  );
  const featured = areaProjects[0];

  if (tabAreas.length === 0) return null;

  const fallbackTemplate = isBn ? "{area}-এ আমাদের প্রজেক্ট" : "Our projects in {area}";
  const headingText = (titleTemplate || fallbackTemplate).replace("{area}", activeArea);

  return (
    <div className="relative flex flex-col gap-8">
      <CmsSectionEditControl
        pageId="home"
        sectionId="projectsSection"
        label="Audited Projects"
        position="top-0 right-0"
      />

      {/* Reflects the selected area rather than a fixed line — picking a
          different tab changes what this claims, so it has to change with it. */}
      <SectionHeading align="center" title={headingText} />

      <Tabs value={activeArea} onValueChange={setActiveArea} className="gap-8">
        {/* Scrolls on its own on narrow screens — twenty areas do not fit a
            phone width, and wrapping them would push the content below the
            fold before anyone gets to it. */}
        <div className="-mx-4 overflow-x-auto border-b border-border px-4 scrollbar-none sm:mx-0 sm:flex sm:justify-center sm:px-0">
          <TabsList variant="line" className="h-auto w-max gap-6">
            {tabAreas.map((area) => (
              <TabsTrigger
                key={area.name}
                value={area.name}
                className="rounded-none px-1 pb-3 text-sm font-semibold whitespace-nowrap text-muted-foreground after:bg-primary data-active:text-primary"
              >
                {area.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeArea}>
          <div className="flex flex-col gap-8 lg:px-[60px]">
          {/* ── Featured project for the selected area ─────────────────── */}
          {featured ? (
            <Link
              key={featured.id}
              href={localeHref(locale, `/projects/${featured.slug}`)}
              className="grid overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/10 sm:grid-cols-2 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25"
            >
              <ImageFrame
                src={featured.images[0] || featured.image}
                alt={`${featured.name}, ${featured.area}`}
                ratio="4/3"
                rounded="none"
                sizes="half"
              />
              <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {featured.area}
                </span>
                <Heading as="h3" size="h4">
                  {locale === "bn" && featured.nameBn ? featured.nameBn : featured.name}
                </Heading>
                {featured.description[0] ? (
                  <div
                    className="line-clamp-3 text-sm text-muted-foreground prose prose-sm prose-p:my-0"
                    dangerouslySetInnerHTML={{
                      __html: locale === "bn" && featured.descriptionBn?.[0]
                        ? featured.descriptionBn[0]
                        : featured.description[0]
                    }}
                  />
                ) : null}
                <div
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90"
                >
                  {isBn ? "বিস্তারিত দেখুন" : "Learn More"}
                  <Icon
                    name="arrowRight"
                    size="xs"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ) : (
            <div className="mx-auto flex min-h-64 w-full max-w-2xl flex-col items-center justify-center rounded-2xl border border-primary/15 bg-linear-to-br from-primary/[0.06] via-background to-muted/40 px-6 py-12 text-center shadow-sm">
              <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <Icon name="upcoming" size="lg" />
              </span>
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                {isBn ? "শীঘ্রই আসছে" : "Upcoming"}
              </span>
              <Heading as="h3" size="h5" className="mt-4">
                {isBn ? "নতুন প্রজেক্ট আসছে" : "Projects coming soon"}
              </Heading>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {isBn
                  ? `${activeArea}-এ নতুন প্রজেক্টের আপডেট শিগগিরই এখানে জানানো হবে।`
                  : `We're preparing new projects in ${activeArea}. Check back soon for updates.`}
              </p>
            </div>
          )}

          {/* ── The rest of that area's projects ────────────────────────── */}
          {/* Plain grid, not <Stagger> — that reveal is gated on scrolling
              into view, and a tab switch mounts this without a scroll event,
              so the cards could end up stuck at their pre-animation
              opacity: 0 instead of ever appearing. */}
          {areaProjects.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {areaProjects.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
