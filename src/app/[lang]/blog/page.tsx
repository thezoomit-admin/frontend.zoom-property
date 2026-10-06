import type { Metadata } from "next";

import { Section } from "@/components/common/section";
import { ContactCta } from "@/components/common/contact-cta";
import { PageHeader } from "@/components/layout/page-header";
import { BlogFeed } from "@/components/pages/blog/blog-feed";
import { getPaginatedInsights } from "@/server/features/insights";
import { getBlogCategories } from "@/server/features/insights/service";
import { pageBanners } from "@/data/page-banners";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.blog.metaTitle,
    description: dict.blog.metaDescription,
    alternates: localeAlternates(locale, "/blog"),
  };
}

interface BlogPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams?.page;
  const page = typeof pageParam === "string" ? Number(pageParam) : 1;
  const categoryParam = resolvedSearchParams?.category;
  const category = typeof categoryParam === "string" ? categoryParam : "All";
  const searchParam = resolvedSearchParams?.search;
  const search = typeof searchParam === "string" ? searchParam : "";

  const [dict, locale, { insights, meta }, categories] = await Promise.all([
    getDictionary(),
    getLocale(),
    getPaginatedInsights({ category, search, page, limit: 9 }),
    getBlogCategories(),
  ]);
  const t = dict.blog;
  const totalPages = meta?.totalPage || 1;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        image={dict.blog.backgroundImage || pageBanners.blog}
        cmsPageId="blog"
        cmsSectionId="blog"
      />

      <Section className="bg-background pt-10 sm:pt-14 pb-20">
        <BlogFeed
          insights={insights}
          backendCategories={categories}
          totalPages={totalPages}
          locale={locale}
          t={t}
        />
      </Section>
      <div className="-mt-8 md:-mt-16">
        <ContactCta />
      </div>
    </>
  );
}
