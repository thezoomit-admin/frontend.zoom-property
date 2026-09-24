import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/common/section";
import { PageHeader } from "@/components/layout/page-header";
import { BlogCategoryView } from "@/components/pages/blog/blog-category-view";
import { getInsights } from "@/server/features/insights";
import { pageBanners } from "@/data/page-banners";
import { LOCALES, type Locale } from "@/i18n/config";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary } from "@/i18n/dictionaries";
import { BLOG_CATEGORIES, getCategoryConfig } from "@/lib/blog-categories";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    BLOG_CATEGORIES.map((cat) => ({
      lang,
      category: cat.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; category: string }>;
}): Promise<Metadata> {
  const { lang, category } = await params;
  const dict = await getDictionary();
  const config = getCategoryConfig(category) ?? BLOG_CATEGORIES[0];
  const categoryTitle = dict.blog.sections[config.titleKey] ?? config.category;
  const categoryDesc =
    dict.blog.sections[`${config.titleKey}Desc` as keyof typeof dict.blog.sections] ??
    dict.blog.metaDescription;

  return {
    title: `${categoryTitle} | ${dict.blog.metaTitle}`,
    description: categoryDesc,
    alternates: localeAlternates(lang, `/blog/category/${config.slug}`),
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale; category: string }>;
}) {
  const [{ lang, category }, insights, dict] = await Promise.all([
    params,
    getInsights(60),
    getDictionary(),
  ]);
  const t = dict.blog;
  const config = getCategoryConfig(category);

  if (!config) {
    notFound();
  }

  const categoryTitle = t.sections[config.titleKey] ?? config.category;
  const categoryDesc =
    t.sections[`${config.titleKey}Desc` as keyof typeof t.sections] ?? t.description;

  return (
    <>
      <PageHeader
        eyebrow={t.browsingCategory ?? "BROWSING CATEGORY"}
        title={categoryTitle}
        description={categoryDesc}
        image={dict.blog.backgroundImage || pageBanners.blog}
      />

      <Section className="bg-background pt-10 sm:pt-14 pb-20">
        <BlogCategoryView
          currentCategorySlug={config.slug}
          locale={lang}
          insights={insights}
          t={t}
        />
      </Section>
    </>
  );
}
