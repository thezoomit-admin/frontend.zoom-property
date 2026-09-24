import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ConsultantCard } from "@/components/pages/properties/consultant-card";
import { PropertyBanner } from "@/components/pages/properties/property-banner";
import { PropertyCard } from "@/components/pages/properties/property-card";
import { PropertyDetails } from "@/components/pages/properties/property-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  propertyBySlug,
  similarProperties,
} from "@/data/properties";
import { localeAlternates } from "@/i18n/alternates";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { getProperties, getPropertyBySlug } from "@/server/features/properties";
import { telHref } from "@/lib/contact";
import { formatArea, formatBdt, formatKatha, formatRent } from "@/lib/format";
import { FormatBdt } from "@/components/ui/format-bdt";
import { absoluteUrl, breadcrumbSchema, propertySchema } from "@/lib/seo";
import { ContactCta } from "@/components/common/contact-cta";

/** Prebuild listing details so card clicks hit a warm page. */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const list = await getProperties(100);
  return LOCALES.flatMap((lang) =>
    list.map((property) => ({ lang, slug: property.slug })),
  );
}

/**
 * One listing.
 *
 * Detail routes are prerendered at build (see generateStaticParams) and
 * refreshed via the properties cache tag when the desk edits a listing.
 *
 * The page answers, in order, the questions a buyer here actually asks — what
 * does it cost, what does it look like, how big is it, are the papers clean,
 * and who do I call. The advisor rail is sticky on desktop because the answer
 * to the last one should never be a scroll away, and drops under the content on
 * tablet and narrower, where a 320px column beside the specs is worse than none.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const property = (await getPropertyBySlug(slug)) ?? propertyBySlug(slug);

  if (!property) return {};

  const price =
    property.purpose === "rent"
      ? formatRent(property.price)
      : formatBdt(property.price);

  return {
    title: `${property.title}, ${property.area}`,
    description: `${property.beds ? `${property.beds} bed · ` : ""}${property.baths} bath · ${formatArea(property.size)} in ${property.area}, ${property.city}. ${price}.`,
    alternates: localeAlternates(lang, `/properties/${slug}`),
    openGraph: {
      type: "website",
      title: `${property.title}, ${property.area}`,
      images: property.images,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const [fetchedProperty, dict] = await Promise.all([
    getPropertyBySlug(slug),
    getDictionary(),
  ]);
  const property = fetchedProperty ?? propertyBySlug(slug);

  if (!property) notFound();

  const t = dict.property;
  const displayTitle = lang === "bn" && property.titleBn ? property.titleBn : property.title;
  const displayArea = lang === "bn" && property.areaBn ? property.areaBn : property.area;

  const agent = property.agent;
  const similar = similarProperties(property);
  const isSold = property.status === "sold";
  const isRent = property.purpose === "rent";
  const path = `/${lang}/properties/${slug}`;

  const facts: { icon: IconName; label: string; value: string }[] = [
    ...(property.beds > 0
      ? [{ icon: "bed" as const, label: t.beds, value: String(property.beds) }]
      : []),
    { icon: "bath", label: t.baths, value: String(property.baths) },
    { icon: "area", label: t.size, value: formatArea(property.size) },
    ...(property.katha
      ? [
          {
            icon: "location" as const,
            label: t.land,
            value: formatKatha(property.katha),
          },
        ]
      : []),
    ...(property.floor
      ? [{ icon: "building" as const, label: t.floor, value: property.floor }]
      : []),
    { icon: "furnishing", label: t.furnishing, value: property.furnishing },
    { icon: "handover", label: t.handover, value: property.handover },
  ];

  const crumbs = [
    { name: t.home, href: localeHref(lang, "/") },
    { name: t.all, href: localeHref(lang, "/properties") },
  ];

  return (
    <>
      <JsonLd schema={propertySchema(property, path)} />
      <JsonLd
        schema={breadcrumbSchema([
          ...crumbs.map((crumb) => ({
            name: crumb.name,
            url: absoluteUrl(crumb.href),
          })),
          { name: property.title, url: absoluteUrl(path) },
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
                {displayTitle}
              </li>
            </ol>
          </nav>
        </Reveal>

        <Reveal delay={0.08} className="mt-6">
          <PropertyBanner
            images={property.images}
            alt={`${displayTitle}, ${displayArea}`}
            title={
              <Heading as="h1" size="h3" className="text-white">
                {displayTitle}
              </Heading>
            }
            subtitle={`${displayArea}, ${property.city}`}
            price={
              isSold
                ? t.sold
                : isRent
                  ? <><FormatBdt value={property.price} />/mo</>
                  : <FormatBdt value={property.price} />
            }
            priceNote={
              isSold
                ? undefined
                : <><FormatBdt value={property.price} exact />{isRent ? ` · ${t.perMonth}` : ""}</>
            }
            badges={
              <>
                <Badge className="bg-primary text-primary-foreground">
                  {isSold ? t.sold : isRent ? t.forRent : t.forSale}
                </Badge>

                {property.badge ? (
                  <Badge className="border border-white/25 bg-black/45 text-white backdrop-blur-md">
                    {property.badge}
                  </Badge>
                ) : null}

                {property.rajukApproved ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                    <Icon name="approved" size="xs" />
                    {t.rajuk}
                  </span>
                ) : null}

                {property.hasVirtualTour ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    <Icon name="gallery" size="xs" />
                    {t.tour}
                  </span>
                ) : null}
              </>
            }
            labels={{
              fullscreen: t.fullscreen,
              openGallery: t.openGallery,
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

            {property.amenities.length > 0 ? (
              <section className="flex flex-col gap-4">
                <Heading as="h2" size="h4">
                  {t.amenities}
                </Heading>

                <ul className="grid gap-2 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-foreground"
                    >
                      <Icon name="check" size="xs" className="text-primary" />
                      {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <PropertyDetails
              property={property}
              locale={lang}
              dict={{
                about: t.about,
                neighbourhood: t.neighbourhood,
                papers: t.papers,
                pricePerSqft: t.pricePerSqft,
                rentalYield: t.rentalYield,
                security: t.security,
                metro: t.metro,
                listingsHere: t.listingsHere,
                rajukYes: t.rajukYes,
                rajukNo: t.rajukNo,
                handover: t.handover,
                furnishing: t.furnishing,
              }}
            />
          </div>

          {agent ? (
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <ConsultantCard agent={agent} locale={lang} />
            </aside>
          ) : null}
        </div>
      </Section>

      {property.mapUrl ? (
        <Section className="border-t border-border">
          <Heading as="h2" size="h3" className="mb-8">
            {t.neighbourhood}
          </Heading>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
            <iframe
              src={property.mapUrl.includes("/embed") ? property.mapUrl : (
                property.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) 
                  ? `https://maps.google.com/maps?q=${property.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[1]},${property.mapUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)?.[2]}&hl=${lang}&z=14&output=embed`
                  : property.mapUrl.match(/\/place\/([^/]+)/)
                    ? `https://maps.google.com/maps?q=${property.mapUrl.match(/\/place\/([^/]+)/)?.[1]}&hl=${lang}&z=14&output=embed`
                    : property.mapUrl
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

      {similar.length > 0 ? (
        <Section className="border-t border-border bg-muted/30">
          <Heading as="h2" size="h3">
            {t.similar}
          </Heading>

          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <StaggerItem key={item.id}>
                <PropertyCard property={item} locale={lang} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ) : null}
       <div className="mb-8 md:mb-12 lg:mb-20">
        <ContactCta  tone="surface"/>
      </div>

    </>
  );
}
