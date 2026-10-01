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

  // The feature is area-specific — the first project in whichever tab is
  // active. The grid underneath is every active project, full stop — the
  // featured one included, not filtered out of it.
  const featured = useMemo(
    () => projects.find((project) => project.area === activeArea),
    [projects, activeArea],
  );

  const rest = projects;

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
        <div className="-mx-4 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:flex sm:justify-center sm:px-0">
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

        <TabsContent value={activeArea} className="flex flex-col gap-8">
          {/* ── Featured project for the selected area ─────────────────── */}
          {featured ? (
            <Link
              key={featured.id}
              href={localeHref(locale, `/projects/${featured.slug}`)}
              className="grid overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/10 sm:grid-cols-2 group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/25"
            >
              <ImageFrame
                src={featured.image}
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
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              {isBn
                ? `${activeArea}-এ এখনো কোনো প্রজেক্ট যোগ করা হয়নি।`
                : `No projects in ${activeArea} yet.`}
            </div>
          )}

          {/* ── The rest of that area's projects ────────────────────────── */}
          {/* Plain grid, not <Stagger> — that reveal is gated on scrolling
              into view, and a tab switch mounts this without a scroll event,
              so the cards could end up stuck at their pre-animation
              opacity: 0 instead of ever appearing. */}
          {rest.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
