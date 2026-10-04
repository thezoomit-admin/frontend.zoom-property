import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/motion/reveal";
import { VideoEmbed } from "@/components/media/video-embed";
import { ProjectShowcase } from "@/components/pages/projects/project-showcase";
import { ProjectFeatures } from "@/components/pages/projects/project-features";
import { ProjectSpecs } from "@/components/pages/projects/project-specs";
import { RelatedProjects } from "@/components/pages/projects/related-projects";
import { ConsultantCard } from "@/components/pages/properties/consultant-card";
import { AreaFacts } from "@/components/pages/properties/area-facts";
import { ContactCta } from "@/components/common/contact-cta";

import { localeAlternates } from "@/i18n/alternates";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { getProjectBySlug, getProjects } from "@/server/features/projects";
import { formatBdt } from "@/lib/format";
import { FormatBdt } from "@/components/ui/format-bdt";
import { getMapEmbedUrl } from "@/lib/utils";
import { absoluteUrl, breadcrumbSchema, projectSchema } from "@/lib/seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Prebuild every project detail so card clicks hit a warm page — no loading UI. */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const list = await getProjects(100);
  return LOCALES.flatMap((lang) =>
    list.map((project) => ({ lang, slug: project.slug })),
  );
}

/**
 * One development.
 *
 * A finished property is bought on what it is; a project is bought on whether
 * it will be finished, on time, under a permit that exists. So the page is
 * ordered against that doubt: the stage and the inspection date sit directly
 * under the banner, above the write-up and above the price, and the advisor
 * rail stays on screen the whole way down.
 *
 * It shares the banner, the advisor card and the neighbourhood block with the
 * property pages. Same decision at a different stage — the parts that answer
 * "where is it and who do I call" should not be two implementations that drift.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const found = await getProjectBySlug(slug);

  if (!found) return {};
  const { project } = found;

  return {
    title: `${project.name}, ${project.area}`,
    description: `${project.status} · ${project.progress}% complete · handover ${project.handover}. ${project.sizeRange} in ${project.area}, ${project.city}, from ${formatBdt(project.startingPrice)}.`,
    alternates: localeAlternates(lang, `/projects/${slug}`),
    openGraph: {
      type: "website",
      title: `${project.name}, ${project.area}`,
      images: project.images,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const [found, dict] = await Promise.all([
    getProjectBySlug(slug),
    getDictionary(),
  ]);

  if (!found) notFound();

  const { project } = found;
  const t = dict.projectDetail;

  const agent = project.agent;
  const path = `/projects/${slug}`;

  const sold = project.units - project.unitsLeft;
  const bookedPercent = Math.round((sold / project.units) * 100);

  const facts: { icon: IconName; label: string; value: React.ReactNode }[] = [
    { icon: "trend", label: t.startingFrom, value: <FormatBdt value={project.startingPrice} /> },
    { icon: "area", label: t.sizes, value: project.sizeRange },
    {
      icon: "building",
      label: t.units,
      value: t.unitsLeft
        .replace("{left}", String(project.unitsLeft))
        .replace("{total}", String(project.units)),
    },
    {
      icon: "check",
      label: t.booked.replace("{percent}", String(bookedPercent)),
      value: `${sold}/${project.units}`,
    },
    { icon: "construction", label: t.status, value: project.status },
    { icon: "handover", label: t.handover, value: project.handover },
  ];

  const crumbs = [
    { name: t.home, href: localeHref(lang, "/") },
    { name: t.all, href: localeHref(lang, "/projects") },
  ];

  return (
    <>
      <JsonLd schema={projectSchema(project, path)} />
      <JsonLd
        schema={breadcrumbSchema([
          ...crumbs.map((crumb) => ({
            name: crumb.name,
            url: absoluteUrl(crumb.href),
          })),
          { name: project.name, url: absoluteUrl(path) },
        ])}
      />

      {/* Specs shows only its own hero and write-up; everything else on the page belongs to Overview. */}
      <Tabs defaultValue="overview" className="w-full gap-0">
        <Section spacing="none" className="bg-background pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl text-primary font-bold tracking-tight ">
                {project.name}
              </h3>

            </div>
            <TabsList className="h-10! rounded-full border border-border bg-muted/60 p-1">
              {[
                { value: "overview", label: "Overview" },
                { value: "specs", label: "Specs" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Section>

        <TabsContent value="overview" className="mt-0 outline-none">
          <Section
            spacing="none"
            className="bg-background pb-12 sm:pb-20 lg:pb-24"
          >
            <Reveal delay={0.08}>
              <ProjectShowcase
                images={project.images}
                alt={`${project.name}, ${project.area}`}
              />
            </Reveal>

            {project.description?.length ? (
              <div className="mt-12">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-12 xl:gap-16">
                  <div className="space-y-5 text-lg leading-8 text-foreground/80">
                    {project.description.slice(0, 3).map((paragraph, index) => (
                      <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {facts.slice(0, 4).map(({ label, value, icon }) => (
                      <div key={label} className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
                        <div className="mb-2 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background text-primary">
                            <Icon name={icon} size="xs" />
                          </span>
                          {label}
                        </div>
                        <div className="text-base font-medium text-foreground">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className={`mt-12 grid gap-10 ${agent ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-1"}`}>
              <div className="flex flex-col gap-10">
                <ProjectFeatures features={project.features} locale={lang} />

                <AreaFacts
                  areaName={project.area}
                  dict={{
                    heading: t.neighbourhood,
                    pricePerSqft: t.pricePerSqft,
                    rentalYield: t.rentalYield,
                    security: t.security,
                    metro: t.metro,
                    listingsHere: t.listingsHere,
                  }}
                />
              </div>

              {agent && (
                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <ConsultantCard agent={agent} locale={lang} />
                </aside>
              )}
            </div>
          </Section>

          <Section className="border-t border-border bg-footer pt-8 pb-8 sm:pt-10 sm:pb-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-heading text-xs font-bold tracking-wider text-footer-foreground/60 uppercase">
                  {t.videoLabel}
                </span>

                <Heading as="h2" size="h4" className="text-footer-foreground">
                  {lang === "bn" ? project.video.titleBn : project.video.title}
                </Heading>
              </div>

              <VideoEmbed
                url={project.video.youtubeUrl}
                title={lang === "bn" ? project.video.titleBn : project.video.title}
                poster={project.video.poster}
                ratio="auto"
                className="aspect-[21/6] overflow-hidden rounded-xl"
              />
            </div>
          </Section>

          {project.mapUrl ? (
            <Section className="border-t border-border">
              <Heading as="h2" size="h3" className="mb-8">
                {t.neighbourhood}
              </Heading>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
                <iframe
                  src={getMapEmbedUrl(project.mapUrl, lang)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Section>
          ) : null}

          <Suspense fallback={null}>
            <RelatedProjects
              excludeSlug={project.slug}
              locale={lang}
              title={t.others}
            />
          </Suspense>

          <ContactCta tone="surface" />
        </TabsContent>

        <TabsContent value="specs" className="mt-0 outline-none">
          <Section
            spacing="none"
            className="bg-background pb-12 sm:pb-20 lg:pb-24"
          >
            <ProjectSpecs
              name={project.name}
              sections={project.specs?.descriptions}
              legacyHtml={project.specs?.description || undefined}
              locale={lang}
            />
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
