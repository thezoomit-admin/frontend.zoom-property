"use client";

import { Image as ImageIcon, Images } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type GalleryValue = NonNullable<ApiProjectLanding["gallery"]>;

export const emptyGallery: GalleryValue = {
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  open: "",
  openBn: "",
  close: "",
  closeBn: "",
  shots: [],
};

export function GalleryFields({
  value,
  setValue,
}: {
  value: GalleryValue;
  setValue: (next: GalleryValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Section Header ───────────────────────────────────────────── */}
      <FormSectionCard
        title="Project Gallery Section Header"
        description="Headings, subtitles, and interactive button text for the image gallery lightbox."
        icon={Images}
      >
        <TextPair
          label="Gallery Eyebrow"
          description="Small tag above the gallery title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Visual Walkthrough & Lifestyle"
          placeholderBn="যেমন: প্রকল্পের চিত্রশালা ও লাইফস্টাইল"
          maxLength={50}
        />

        <TextPair
          label="Gallery Main Title"
          description="Main title of the gallery showcase"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Immerse in Architectural Grandeur"
          placeholderBn="যেমন: আধুনিক স্থাপত্যের চোখ জুড়ানো দৃশ্যসমূহ"
          maxLength={100}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Open Lightbox Button"
            description="Button label to open full gallery"
            en={value.open ?? ""}
            bn={value.openBn ?? ""}
            onEnChange={(v) => setValue({ ...value, open: v })}
            onBnChange={(v) => setValue({ ...value, openBn: v })}
            placeholderEn="e.g., View Full Gallery"
            placeholderBn="যেমন: সম্পূর্ণ গ্যালারি দেখুন"
            maxLength={30}
          />
          <TextPair
            label="Close Lightbox Button"
            description="Button label to exit gallery modal"
            en={value.close ?? ""}
            bn={value.closeBn ?? ""}
            onEnChange={(v) => setValue({ ...value, close: v })}
            onBnChange={(v) => setValue({ ...value, closeBn: v })}
            placeholderEn="e.g., Close Gallery"
            placeholderBn="যেমন: বন্ধ করুন"
            maxLength={30}
          />
        </div>
      </FormSectionCard>

      {/* ── Gallery Photos List ───────────────────────────────────────── */}
      <FormSectionCard
        title="Gallery Photos & Captions"
        description="Collection of architectural, interior, and amenity photographs with bilingual captions."
        icon={ImageIcon}
      >
        <EditableList
          items={value.shots ?? []}
          onChange={(shots) => setValue({ ...value, shots })}
          makeItem={() => ({ label: "", labelBn: "", image: null })}
          addLabel="Add Photo to Gallery"
          renderItem={(shot, _index, update) => {
            const image = resolveMedia(shot.image);
            return (
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="space-y-1 shrink-0">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Gallery Image
                  </label>
                  <ImageField
                    previewUrl={image?.url}
                    onChange={(media) => update({ ...shot, image: media.id })}
                  />
                </div>
                <div className="flex-1 w-full">
                  <TextPair
                    label="Photo Caption / Description"
                    description="Displayed beneath image in lightbox"
                    en={shot.label ?? ""}
                    bn={shot.labelBn ?? ""}
                    onEnChange={(v) => update({ ...shot, label: v })}
                    onBnChange={(v) => update({ ...shot, labelBn: v })}
                    placeholderEn="e.g., Luxurious Double Height Grand Lobby"
                    placeholderBn="যেমন: দৃষ্টিনন্দন ডাবল হাইট গ্র্যান্ড লবি"
                    maxLength={60}
                  />
                </div>
              </div>
            );
          }}
        />
      </FormSectionCard>
    </div>
  );
}
