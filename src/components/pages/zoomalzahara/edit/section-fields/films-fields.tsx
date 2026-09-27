"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type FilmsValue = NonNullable<ApiProjectLanding["films"]>;

export const emptyFilms: FilmsValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", play: "", playBn: "", items: [],
};

const PROVIDERS = ["youtube", "facebook", "vimeo"] as const;

export function FilmsFields({
  value,
  setValue,
}: {
  value: FilmsValue;
  setValue: (next: FilmsValue) => void;
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
        <p className="text-sm font-medium text-foreground">Videos</p>
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({ title: "", titleBn: "", caption: "", captionBn: "", url: "", poster: null, provider: "youtube" as const })}
          addLabel="Add video"
          renderItem={(item, _index, update) => {
            const poster = resolveMedia(item.poster);
            return (
              <div className="space-y-2">
                <div className="flex gap-3">
                  <ImageField previewUrl={poster?.url} onChange={(media) => update({ ...item, poster: media.id })} />
                  <div className="flex-1 space-y-2">
                    <TextPair label="Title" en={item.title ?? ""} bn={item.titleBn ?? ""}
                      onEnChange={(v) => update({ ...item, title: v })}
                      onBnChange={(v) => update({ ...item, titleBn: v })} maxLength={100} />
                    <div className="space-y-1.5">
                      <Label>Video URL</Label>
                      <Input value={item.url ?? ""} maxLength={500} onChange={(e) => update({ ...item, url: e.target.value })} />
                    </div>
                  </div>
                </div>
                <TextPair label="Caption" en={item.caption ?? ""} bn={item.captionBn ?? ""}
                  onEnChange={(v) => update({ ...item, caption: v })}
                  onBnChange={(v) => update({ ...item, captionBn: v })} maxLength={150} />
                <div className="space-y-1.5">
                  <Label>Provider</Label>
                  <Select
                    value={item.provider ?? "youtube"}
                    onValueChange={(v) => update({ ...item, provider: v as (typeof PROVIDERS)[number] })}
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
