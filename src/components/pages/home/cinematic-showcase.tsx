"use client";

import { useState } from "react";
import Image from "@/components/common/image";
import { AppContainer } from "@/components/common/app-container";
import { Eyebrow, Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { shimmerDataUrl } from "@/lib/image";
import { VideoLightbox } from "@/components/media/video-lightbox";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

export interface ShowcaseDict {
  eyebrow: string;
  title: string;
  description: string;
  play: string;
  duration: string;
  poster?: string;
  video?: string;
}

export function CinematicShowcase({
  poster,
  video,
  dict,
}: {
  poster: string;
  video: string;
  dict: ShowcaseDict;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <section
        onClick={() => setOpenModal(true)}
        className="group relative isolate min-h-[70svh] overflow-hidden bg-black sm:min-h-[80svh] cursor-pointer"
      >
        <Image
          src={poster}
          alt={dict.title}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={shimmerDataUrl()}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Two shades: a foot fade so the copy block always sits on dark, and a
            left-to-right wash so the text column reads over a bright photo
            while the right half of the frame stays visible. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/95 via-black/55 to-black/15"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-black/75 via-black/35 to-transparent"
        />

        {/* Play control sits in the upper half on phones and in the right half
            from `lg`, so it never lands on top of the title. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenModal(true);
          }}
          aria-label={`${dict.play}: ${dict.title}`}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center pb-48 sm:pb-40 lg:justify-end lg:pr-[18%] lg:pb-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        >
          <span className="relative flex size-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-500 ease-out-expo group-hover:scale-110 sm:size-24">
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-white/20"
            />
            <Icon name="play" size="lg" className="ml-1 fill-white text-white" />
          </span>
        </button>

        <AppContainer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-12 sm:pb-16 lg:top-0 lg:flex lg:items-center lg:pb-0">
          <div onClick={(e) => e.stopPropagation()} className="pointer-events-auto">
            <CmsSectionEditControl
              pageId="home"
              sectionId="showcase"
              label="Film Showcase"
              position="top-6 right-4 sm:top-8 sm:right-6"
            />
          </div>
          <div className="flex max-w-2xl flex-col gap-4">
            <Eyebrow className="flex items-center gap-2 font-semibold text-brand-green-light">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-green-light" />
              {dict.eyebrow}
            </Eyebrow>
            <Heading
              as="h2"
              size="h2"
              weight="bold"
              className="text-white lg:line-clamp-2 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]"
            >
              {dict.title}
            </Heading>
            <Text
              size="lead"
              className="max-w-xl leading-relaxed text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]"
            >
              {dict.description}
            </Text>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Icon name="play" size="xs" className="fill-white text-white" />
              {dict.play}
              <span aria-hidden className="size-1 rounded-full bg-white/50" />
              <Icon name="clock" size="xs" />
              {dict.duration}
            </span>
          </div>
        </AppContainer>
      </section>

      <VideoLightbox
        url={openModal ? video : null}
        title={dict.title}
        closeLabel="Close video"
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

