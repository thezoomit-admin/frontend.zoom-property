import type { Metadata } from "next";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { Text } from "@/components/common/text";
import { PageHeader } from "@/components/layout/page-header";

import { LandownerBlocks } from "@/components/pages/landowners/landowner-blocks";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { pageBanners } from "@/data/page-banners";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeAlternates } from "@/i18n/alternates";
import { ContactCta } from "@/components/common/contact-cta";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.landowners.metaTitle,
    description: dict.landowners.metaDescription,
    alternates: localeAlternates(locale, "/landowners"),
  };
}

export default async function LandownersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [dict, query] = await Promise.all([getDictionary(), searchParams]);
  const t = dict.landowners;

  // `?page=abc` is a URL somebody edited; treat it as the first page rather
  // than passing NaN down.
  const page = Number.parseInt(query.page ?? "1", 10);

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        image={dict.landowner.backgroundImage || pageBanners.landowners}
        cmsPageId="landowners"
        cmsSectionId="landowners"
      />

      {/* Written in the panel. Removes itself when nothing is published. */}
      <LandownerBlocks page={Number.isNaN(page) ? 1 : page} />

      {/* The four contract terms, as cards. */}
      <Section className="border-t border-border bg-muted/30">
        <SectionHeading
          title={t.benefitsTitle}
        />

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(t.benefitsList ?? []).map((benefit, index) => (
            <StaggerItem
              key={benefit.title || index}
              className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name={benefit.icon as IconName} size="md" />
              </span>
              <Heading as="h3" size="h6">
                {benefit.title}
              </Heading>
              <Text size="sm" className="text-muted-foreground">
                {benefit.body}
              </Text>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
        <div >
          <ContactCta tone="surface" />
        </div>


    </>
  );
}

