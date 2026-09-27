"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type ReviewsValue = NonNullable<ApiProjectLanding["reviews"]>;

export const emptyReviews: ReviewsValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", play: "", playBn: "",
  close: "", closeBn: "", items: [],
};

export function ReviewsFields({
  value,
  setValue,
}: {
  value: ReviewsValue;
  setValue: (next: ReviewsValue) => void;
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
        onBnChange={(v) => setValue({ ...value, descriptionBn: v })} multiline maxLength={300} />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Reviews</p>
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({ name: "", nameBn: "", role: "", roleBn: "", quote: "", quoteBn: "", avatar: null, poster: null, videoUrl: "" })}
          addLabel="Add review"
          renderItem={(item, _index, update) => {
            const avatar = resolveMedia(item.avatar);
            const poster = resolveMedia(item.poster);
            return (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Photo</p>
                    <ImageField previewUrl={avatar?.url} onChange={(media) => update({ ...item, avatar: media.id })} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Video poster</p>
                    <ImageField previewUrl={poster?.url} onChange={(media) => update({ ...item, poster: media.id })} />
                  </div>
                </div>
                <TextPair label="Name" en={item.name ?? ""} bn={item.nameBn ?? ""}
                  onEnChange={(v) => update({ ...item, name: v })}
                  onBnChange={(v) => update({ ...item, nameBn: v })} maxLength={60} />
                <TextPair label="Role" en={item.role ?? ""} bn={item.roleBn ?? ""}
                  onEnChange={(v) => update({ ...item, role: v })}
                  onBnChange={(v) => update({ ...item, roleBn: v })} maxLength={60} />
                <TextPair label="Quote" en={item.quote ?? ""} bn={item.quoteBn ?? ""}
                  onEnChange={(v) => update({ ...item, quote: v })}
                  onBnChange={(v) => update({ ...item, quoteBn: v })} multiline maxLength={400} />
                <div className="space-y-1.5">
                  <Label>Video URL</Label>
                  <Input value={item.videoUrl ?? ""} maxLength={500} onChange={(e) => update({ ...item, videoUrl: e.target.value })} />
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
