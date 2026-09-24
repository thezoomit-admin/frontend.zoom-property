import { AppContainer } from "@/components/common/app-container";
import { OrnamentDivider } from "@/components/common/ornament-divider";
import { SectionHeading } from "@/components/common/section-heading";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { InsightCard } from "@/components/pages/blog/insight-card";
import { getHomeInsights } from "@/server/features/insights";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { LOCALE_TAGS } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import Link from "next/link";

export async function HomeBlogSection() {
  const [dict, locale, latestInsights] = await Promise.all([
    getDictionary(),
    getLocale(),
    getHomeInsights(4),
  ]);
  const t = dict.blog;

  const dateFormatter = new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="bg-background pt-16 pb-2 sm:py-24">
      <AppContainer>
        {/* `homeTitle`, not `title`: the same words open the /blog page,
            and one row that changes two unrelated headings is a trap for
            whoever edits it. */}
        <SectionHeading title={t.homeTitle} align="center" />

        <OrnamentDivider className="mt-7" />

        <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {latestInsights.map((insight) => (
            <StaggerItem key={insight.id}>
              <Link href={localeHref(locale, `/blog/${insight.id}`)} className="group h-full block">
                <InsightCard
                  insight={{
                    ...insight,
                    title: locale === "bn" ? insight.titleBn : insight.title,
                    excerpt: locale === "bn" ? insight.excerptBn : insight.excerpt,
                  }}
                  readMore={t.readMore || "Read More"}
                  category={t.categories[insight.category as keyof typeof t.categories] ?? insight.category}
                  date={dateFormatter.format(new Date(insight.date))}
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </AppContainer>
    </section>
  );
}
