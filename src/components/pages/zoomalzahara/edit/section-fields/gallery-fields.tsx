"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
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
    <>
      <TextPair
        label="Eyebrow"
        en={value.eyebrow ?? ""}
        bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
        maxLength={50}
      />
      <TextPair
        label="Title"
        en={value.title ?? ""}
        bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })}
        maxLength={100}
      />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Photos</p>
        <EditableList
          items={value.shots ?? []}
          onChange={(shots) => setValue({ ...value, shots })}
          makeItem={() => ({ label: "", labelBn: "", image: null })}
          addLabel="Add photo"
          renderItem={(shot, _index, update) => {
            const image = resolveMedia(shot.image);
            return (
              <div className="flex gap-3">
                <ImageField
                  previewUrl={image?.url}
                  onChange={(media) => update({ ...shot, image: media.id })}
                />
                <div className="flex-1">
                  <TextPair
                    label="Caption"
                    en={shot.label ?? ""}
                    bn={shot.labelBn ?? ""}
                    onEnChange={(v) => update({ ...shot, label: v })}
                    onBnChange={(v) => update({ ...shot, labelBn: v })}
                    maxLength={60}
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
