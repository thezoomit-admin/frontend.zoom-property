import { Heading } from "@/components/common/heading";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";

const eyebrowClass =
  "font-heading text-xs font-bold uppercase tracking-widest text-primary";
const eyebrowFooterClass =
  "font-heading text-xs font-bold tracking-widest text-footer-foreground/70 uppercase";

export interface ProjectFeature {
  eyebrow?: string;
  eyebrowBn?: string;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  image?: string;
}

export function ProjectFeatures({
  features,
  locale = "en",
}: {
  features?: ProjectFeature[];
  locale?: string;
}) {
  if (!features || features.length === 0) return null;

  return (
    <div className="flex flex-col gap-14 py-6 md:gap-20">
      {features.map((feature, index) => {
        const layoutType = index % 5;
        const eyebrow = locale === "bn" ? feature.eyebrowBn || feature.eyebrow : feature.eyebrow;
        const title = locale === "bn" ? feature.titleBn || feature.title : feature.title;
        const description = locale === "bn" ? feature.descriptionBn || feature.description : feature.description;
        const delay = Math.min(index * 0.08, 0.4);
        const hasImage = Boolean(feature.image);

        if (layoutType === 0) {
          // Layout 0: text above, image centered, text below
          return (
            <Reveal key={index} delay={delay}>
              <section className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
                  <Heading as="h2" size="h4">
                    {title}
                  </Heading>
                </div>

                {hasImage && (
                  <ImageFrame
                    src={feature.image!}
                    alt={title}
                    ratio="4/3"
                    rounded="2xl"
                    sizes="half"
                    unoptimized
                    className="w-full"
                  />
                )}

                {description && (
                  <div
                    className="text-sm prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </section>
            </Reveal>
          );
        }

        if (layoutType === 1) {
          // Layout 1: classic split
          return (
            <Reveal key={index} delay={delay}>
              <section className="grid gap-6 sm:gap-8 md:grid-cols-2 md:items-center">
                {hasImage && (
                  <ImageFrame
                    src={feature.image!}
                    alt={title}
                    ratio="4/3"
                    rounded="2xl"
                    sizes="half"
                  />
                )}
                <div className="flex flex-col gap-3">
                  {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
                  <Heading as="h2" size="h4">
                    {title}
                  </Heading>
                  {description && (
                    <div
                      className="text-sm max-w-sm text-muted-foreground prose prose-sm prose-p:my-1"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  )}
                </div>
              </section>
            </Reveal>
          );
        }

        if (layoutType === 2) {
          // Layout 2: full-bleed footer-color band, image flush
          return (
            <Reveal key={index} delay={delay}>
              <section className="relative left-1/2 w-screen -translate-x-1/2 bg-footer text-footer-foreground">
                <div className="mx-auto grid max-w-7xl md:grid-cols-2 md:items-center">
                  <div className="flex flex-col gap-3 p-8 sm:p-10 xl:p-16">
                    {eyebrow && <span className={eyebrowFooterClass}>{eyebrow}</span>}
                    <Heading as="h2" size="h4" className="text-footer-foreground">
                      {title}
                    </Heading>
                    {description && (
                      <div
                        className="text-sm max-w-sm text-footer-foreground/80 prose prose-sm prose-invert prose-p:my-1"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </div>
                  {hasImage && (
                    <div className="p-8 sm:p-10 xl:p-16">
                      <ImageFrame
                        src={feature.image!}
                        alt={title}
                        ratio="4/3"
                        rounded="xl"
                        sizes="half"
                      />
                    </div>
                  )}
                </div>
              </section>
            </Reveal>
          );
        }

        if (layoutType === 3) {
          // Layout 3: centered, image below the text
          return (
            <Reveal key={index} delay={delay}>
              <section className="flex flex-col items-center gap-6 text-center">
                <div className="flex max-w-md flex-col items-center gap-2">
                  {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
                  <Heading as="h2" size="h4">
                    {title}
                  </Heading>
                  {description && (
                    <div
                      className="text-sm prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  )}
                </div>
                {hasImage && (
                  <ImageFrame
                    src={feature.image!}
                    alt={title}
                    ratio="3/2"
                    rounded="2xl"
                    sizes="half"
                    className="w-full max-w-xl"
                  />
                )}
              </section>
            </Reveal>
          );
        }

        // Layout 4: split reverse (modern architecture style)
        return (
          <Reveal key={index} delay={delay}>
            <section className="relative left-1/2 w-screen -translate-x-1/2 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-10 md:flex-row md:items-center xl:px-16">
                <div className="flex-1 space-y-4 md:order-2 text-center md:text-left">
                  {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
                  <Heading as="h2" size="h4">
                    {title}
                  </Heading>
                  {description && (
                    <div
                      className="mx-auto max-w-md md:mx-0 text-sm prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  )}
                </div>
                {hasImage && (
                  <div className="flex-1 md:order-1">
                    <ImageFrame
                      src={feature.image!}
                      alt={title}
                      ratio="portrait"
                      rounded="2xl"
                      sizes="half"
                      unoptimized
                      className="w-full shadow-2xl md:max-w-md md:ml-auto"
                    />
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}
