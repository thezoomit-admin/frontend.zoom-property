"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type AboutValue = NonNullable<ApiProjectLanding["about"]>;

export const emptyAbout: AboutValue = {
  image: null,
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  body: "",
  bodyBn: "",
  points: [],
};

export function AboutFields({
  value,
  setValue,
}: {
  value: AboutValue;
  setValue: (next: AboutValue) => void;
}) {
  const image = resolveMedia(value.image);

  return (
    <>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Photo</p>
        <ImageField
          previewUrl={image?.url}
          onChange={(media) => setValue({ ...value, image: media.id })}
        />
      </div>

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
      <TextPair
        label="Body"
        en={value.body ?? ""}
        bn={value.bodyBn ?? ""}
        onEnChange={(v) => setValue({ ...value, body: v })}
        onBnChange={(v) => setValue({ ...value, bodyBn: v })}
        multiline
        maxLength={500}
      />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Highlights</p>
        <EditableList
          items={value.points ?? []}
          onChange={(points) => setValue({ ...value, points })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "", icon: "" })}
          addLabel="Add highlight"
          renderItem={(item, _index, update) => (
            <div className="space-y-2">
              <TextPair
                label="Title"
                en={item.title ?? ""}
                bn={item.titleBn ?? ""}
                onEnChange={(v) => update({ ...item, title: v })}
                onBnChange={(v) => update({ ...item, titleBn: v })}
                maxLength={80}
              />
              <TextPair
                label="Body"
                en={item.body ?? ""}
                bn={item.bodyBn ?? ""}
                onEnChange={(v) => update({ ...item, body: v })}
                onBnChange={(v) => update({ ...item, bodyBn: v })}
                multiline
                maxLength={200}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
