"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type ElevationValue = NonNullable<ApiProjectLanding["elevation"]>;

export const emptyElevation: ElevationValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", preview: "", previewBn: "",
  close: "", closeBn: "", views: [],
};

export function ElevationFields({
  value,
  setValue,
}: {
  value: ElevationValue;
  setValue: (next: ElevationValue) => void;
}) {
  return (
    <>
      <TextPair label="Eyebrow" en={value.eyebrow ?? ""} bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })} maxLength={50} />
      <TextPair label="Title" en={value.title ?? ""} bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })} maxLength={100} />
      <TextPair label="Description" en={value.description ?? ""} bn={value.descriptionBn ?? ""}
        onEnChange={(v) => setValue({ ...value, description: v })}
        onBnChange={(v) => setValue({ ...value, descriptionBn: v })} multiline maxLength={400} />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Views</p>
        <EditableList
          items={value.views ?? []}
          onChange={(views) => setValue({ ...value, views })}
          makeItem={() => ({ label: "", labelBn: "", hint: "", hintBn: "", image: null })}
          addLabel="Add view"
          renderItem={(view, _index, update) => {
            const image = resolveMedia(view.image);
            return (
              <div className="flex gap-3">
                <ImageField previewUrl={image?.url} onChange={(media) => update({ ...view, image: media.id })} />
                <div className="flex-1 space-y-2">
                  <TextPair label="Label" en={view.label ?? ""} bn={view.labelBn ?? ""}
                    onEnChange={(v) => update({ ...view, label: v })}
                    onBnChange={(v) => update({ ...view, labelBn: v })} maxLength={60} />
                  <TextPair label="Hint" en={view.hint ?? ""} bn={view.hintBn ?? ""}
                    onEnChange={(v) => update({ ...view, hint: v })}
                    onBnChange={(v) => update({ ...view, hintBn: v })} maxLength={100} />
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
