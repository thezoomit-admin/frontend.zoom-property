import { Heading } from "@/components/common/heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";

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
    <div className="flex flex-col gap-12 px-4 py-6 sm:px-6 md:gap-16 lg:gap-20 lg:px-[90px]">
      {features.map((feature, index) => {
        const title = locale === "bn" ? feature.titleBn || feature.title : feature.title;
        const description = locale === "bn" ? feature.descriptionBn || feature.description : feature.description;
        const delay = Math.min(index * 0.08, 0.4);
        const hasImage = Boolean(feature.image);
        const imageLeft = index % 2 === 0;

        return (
          <Reveal key={index} delay={delay}>
            <section className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10 lg:gap-20 xl:gap-24">
              {hasImage && (
                <div className={`${imageLeft ? "md:order-1" : "md:order-2"}`}>
                  <ImageFrame
                    src={feature.image!}
                    alt={title}
                    ratio="auto"
                    rounded="2xl"
                    sizes="half"
                    unoptimized
                    className="h-full w-full object-cover shadow-none"
                    imageClassName="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className={`${imageLeft ? "md:order-2" : "md:order-1"} flex flex-col justify-center`}>
                <Heading as="h2" size="h4" className="text-[clamp(2rem,3vw,3.5rem)] leading-[0.98] tracking-[-0.05em] text-foreground">
                  {title}
                </Heading>
                {description && (
                  <div
                    className="mt-4 max-w-xl text-base leading-8 text-muted-foreground prose prose-sm prose-p:my-2"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}
              </div>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}
