import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { JsonLd } from "@/components/common/json-ld";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { Reveal } from "@/components/motion/reveal";
import { VideoEmbed } from "@/components/media/video-embed";
import { ProjectProgress } from "@/components/pages/projects/project-progress";
import { ProjectShowcase } from "@/components/pages/projects/project-showcase";
import { RelatedProjects } from "@/components/pages/projects/related-projects";
import { ConsultantCard } from "@/components/pages/properties/consultant-card";
import { AreaFacts } from "@/components/pages/properties/area-facts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactCta } from "@/components/common/contact-cta";

import { localeAlternates } from "@/i18n/alternates";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { getProjectBySlug, getProjects } from "@/server/features/projects";
import { telHref } from "@/lib/contact";
import { formatBdt } from "@/lib/format";
import { FormatBdt } from "@/components/ui/format-bdt";
import { absoluteUrl, breadcrumbSchema, projectSchema } from "@/lib/seo";

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
  const path = `/${lang}/projects/${slug}`;

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

      <Section className="bg-background pt-16 sm:pt-20">
        <Reveal className="flex flex-col gap-6">
          <nav aria-label={t.all}>
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {crumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link href={crumb.href} className="hover:text-primary">
                    {crumb.name}
                  </Link>
                  <Icon name="chevronRight" size="xs" />
                </li>
              ))}
              <li className="truncate font-medium text-foreground">
                {project.name}
              </li>
            </ol>
          </nav>
        </Reveal>

        <Reveal delay={0.08} className="mt-6">
          <ProjectShowcase
            images={project.images}
            alt={`${project.name}, ${project.area}`}
            title={
              <Heading as="h1" size="h3" className="text-white">
                {project.name}
              </Heading>
            }
            subtitle={`${project.area}, ${project.city}`}
            price={<FormatBdt value={project.startingPrice} />}
            priceNote={`${project.progress}% ${t.complete} · ${t.handover} ${project.handover}`}
            badges={
              <>
                <Badge className="gap-1.5 bg-primary text-primary-foreground">
                  <Icon name="construction" size="xs" />
                  {project.status}
                </Badge>

                {project.cctvStreamActive ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-brand-green-light/40 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-brand-green-light backdrop-blur-md">
                    <span className="size-1.5 animate-pulse rounded-full bg-brand-green-light motion-reduce:animate-none" />
                    {t.liveCctv}
                  </span>
                ) : null}

                <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  <Icon name="approved" size="xs" />
                  {t.lastInspected}: {project.lastInspected}
                </span>
              </>
            }
            labels={{
              fullscreen: t.fullscreen,
              priceLabel: t.priceLabel,
            }}
            action={
              <Button asChild size="lg" className="shrink-0">
                <a href={telHref(dict.contact.details.phone)}>
                  <Icon name="phone" size="xs" />
                  {t.call}
                </a>
              </Button>
            }
          />
        </Reveal>

        <div className={`mt-12 grid gap-10 ${agent ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-1"}`}>
          <div className="flex flex-col gap-10">
            <section className="flex flex-col gap-4">
              <Heading as="h2" size="h4">
                {t.overview}
              </Heading>

              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4"
                  >
                    <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Icon name={fact.icon} size="xs" className="text-primary" />
                      {fact.label}
                    </dt>
                    <dd className="font-heading text-sm font-bold text-foreground">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <ProjectProgress
              project={project}
              dict={{
                heading: t.progressHeading,
                lead: t.progressLead,
                complete: t.complete,
                handover: t.handover,
                lastInspected: t.lastInspected,
                permit: t.permit,
                liveCctv: t.liveCctv,
                done: t.done,
                inProgress: t.inProgress,
                notStarted: t.notStarted,
              }}
            />

            <section className="flex flex-col gap-4">
              <Heading as="h2" size="h4">
                {t.about}
              </Heading>

              {project.description && project.description.length > 0 && (
                <RichText
                  html={(lang === "bn" && project.descriptionBn?.length
                    ? project.descriptionBn
                    : project.description
                  ).join("")}
                  className="max-w-2xl [&_img]:rounded-lg"
                />
              )}
            </section>

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

      <Section className="border-t border-border bg-foreground pt-14 pb-14 sm:pt-16 sm:pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-xs font-bold tracking-wider text-white/60 uppercase">
              {t.videoLabel}
            </span>

            <Heading as="h2" size="h3" className="text-white">
              {lang === "bn" ? project.video.titleBn : project.video.title}
            </Heading>

            <Text className="max-w-2xl text-white/70">{t.videoLead}</Text>
          </div>

          <VideoEmbed
            url={project.video.youtubeUrl}
            title={lang === "bn" ? project.video.titleBn : project.video.title}
            poster={project.video.poster}
            className="overflow-hidden rounded-lg"
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
              src={project.mapUrl.includes("/embed") ? project.mapUrl : (
                project.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
                  ? `https://maps.google.com/maps?q=${project.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[1]},${project.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[2]}&hl=${lang}&z=14&output=embed`
                  : project.mapUrl.match(/\/place\/([^/]+)/)
                    ? `https://maps.google.com/maps?q=${project.mapUrl.match(/\/place\/([^/]+)/)?.[1]}&hl=${lang}&z=14&output=embed`
                    : project.mapUrl
              )}
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
    </>
  );
}
