import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/common/section";
import { PageHeader } from "@/components/layout/page-header";
import { AreaDetailView } from "@/components/pages/areas/area-detail-view";
import { pageBanners } from "@/data/page-banners";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getAreaBySlug } from "@/server/features/areas";
import { getProjects } from "@/server/features/projects";
import { getSubAreasByArea } from "@/server/features/sub-areas";

type Params = { lang: string; slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [dict, locale, area] = await Promise.all([
    getDictionary(),
    getLocale(),
    getAreaBySlug(slug),
  ]);
  if (!area) return { title: dict.areas.metaTitle };

  const name =
    locale === "bn" && area.nameBn ? area.nameBn : area.name;
  return {
    title: `${name} | ${dict.areas.metaTitle}`,
    description:
      (locale === "bn" && area.taglineBn
        ? area.taglineBn
        : area.tagline) || dict.areas.metaDescription,
    alternates: localeAlternates(locale, `/areas/${slug}`),
  };
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [dict, locale, area] = await Promise.all([
    getDictionary(),
    getLocale(),
    getAreaBySlug(slug),
  ]);

  if (!area) notFound();

  const subAreas = await getSubAreasByArea(area.refId || area.id, 80);

  const projectsBySubArea: Record<string, Awaited<ReturnType<typeof getProjects>>> =
    {};
  await Promise.all(
    subAreas.map(async (sub) => {
      const rows = await getProjects({
        subArea: sub.refId,
        limit: 40,
        sort: "order",
      });
      projectsBySubArea[sub.refId] = rows;
    }),
  );

  const form = dict.contact.form;
  const detail = (dict.areas as { detail?: Record<string, string> }).detail || {};

  return (
    <>
      <PageHeader
        eyebrow={detail.eyebrow || dict.areas.badge}
        title={locale === "bn" && area.nameBn ? area.nameBn : area.name}
        description={
          locale === "bn" && area.taglineBn ? area.taglineBn : area.tagline
        }
        image={
          area.image ||
          dict.areas.backgroundImage ||
          pageBanners.areas
        }
      />
      <Section spacing="md">
        <AreaDetailView
          area={area}
          subAreas={subAreas}
          projectsBySubArea={projectsBySubArea}
          locale={locale}
          copy={{
            eyebrow: detail.eyebrow || dict.areas.badge,
            subAreasTitle: detail.subAreasTitle || "Sub-areas",
            subAreasLead: detail.subAreasLead || "",
            projectsHeading: detail.projectsHeading || "Projects",
            projectsEmpty: detail.projectsEmpty || "No projects yet.",
            projectCount: detail.projectCount || "{count} projects",
            leadTitle: detail.leadTitle || form.name,
            leadBody: detail.leadBody || "",
            leadSubmit: detail.leadSubmit || form.submit,
            leadSubmitting: detail.leadSubmitting || form.submitting,
            leadSuccess: detail.leadSuccess || form.successTitle,
            backToAreas: detail.backToAreas || dict.areas.viewServiceAreas,
            close: detail.close || "Close",
            colNo: detail.colNo || "#",
            colSubArea: detail.colSubArea || "Sub-area",
            colTagline: detail.colTagline || "Note",
            colProjects: detail.colProjects || "Projects",
            colAction: detail.colAction || "Action",
            viewProjects: detail.viewProjects || "View projects",
            name: form.name,
            namePlaceholder: form.namePlaceholder,
            phone: form.phone,
            email: form.email,
            message: form.message,
            messagePlaceholder: form.messagePlaceholder,
          }}
        />
      </Section>
    </>
  );
}
