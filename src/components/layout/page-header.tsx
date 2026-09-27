import Image from "@/components/common/image";

import { AppContainer } from "@/components/common/app-container";
import { Heading } from "@/components/common/heading";
import { Text } from "@/components/common/text";
import { Reveal } from "@/components/motion/reveal";
import { shimmerDataUrl } from "@/lib/image";
import { ReactNode } from "react";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  children,
  cmsPageId,
  cmsSectionId,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Page-specific photograph. */
  image: string;
  children?: ReactNode;
  cmsPageId?: string;
  cmsSectionId?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[42svh] items-end overflow-hidden bg-primary pb-12 pt-28 sm:min-h-[46svh] sm:pb-16 sm:pt-32">
      {cmsPageId && (
        <CmsSectionEditControl
          pageId={cmsPageId}
          sectionId={cmsSectionId || cmsPageId}
          label="Banner"
          position="top-24 sm:top-28 right-4 sm:right-8"
        />
      )}
      {/* Full-bleed photo. `object-cover` fills without distortion; centred
          crop keeps the subject in frame at every viewport. */}
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={shimmerDataUrl()}
        className="-z-10 object-cover object-center"
      />

      {/* Primary ground behind the type: solid on the left, clear on the right
          so the photograph shows. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-primary via-primary/80 to-primary/20"
      />
      {/* Light foot shade so the last line of copy never sits on a bright
          patch of photo on small screens, where the copy spans the width. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-primary/60 via-transparent to-transparent"
      />

      <AppContainer>
        <Reveal>
          <div className="flex max-w-2xl flex-col gap-4">
            {eyebrow ? (
              <span className="flex items-center gap-2 font-heading text-eyebrow font-semibold uppercase text-brand-green-light">
                <span aria-hidden className="size-1.5 rounded-full bg-brand-green-light" />
                {eyebrow}
              </span>
            ) : null}

            <Heading
              as="h1"
              size="h1"
              weight="bold"
              // Two lines at most on large screens so a long title from the
              // panel cannot push the banner taller than its design.
              className="text-white lg:line-clamp-2"
            >
              {title}
            </Heading>

            {description ? (
              <Text size="lead" className="max-w-xl text-white/95 leading-relaxed">
                {description}
              </Text>
            ) : null}

            {children}
          </div>
        </Reveal>
      </AppContainer>
    </section>
  );
}
