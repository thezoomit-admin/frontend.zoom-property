"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";

export type LocationValue = NonNullable<ApiProjectLanding["location"]>;

export const emptyLocation: LocationValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", mapOpen: "", mapOpenBn: "",
  mapHint: "", mapHintBn: "", mapEmbedUrl: "", mapLinkUrl: "", facts: [],
};

export function LocationFields({
  value,
  setValue,
}: {
  value: LocationValue;
  setValue: (next: LocationValue) => void;
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
      <TextPair label="Map hint" en={value.mapHint ?? ""} bn={value.mapHintBn ?? ""}
        onEnChange={(v) => setValue({ ...value, mapHint: v })}
        onBnChange={(v) => setValue({ ...value, mapHintBn: v })} maxLength={100} />

      <div className="space-y-1.5">
        <Label>Map embed URL</Label>
        <Input value={value.mapEmbedUrl ?? ""} maxLength={1000} onChange={(e) => setValue({ ...value, mapEmbedUrl: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>"Open in Maps" link</Label>
        <Input value={value.mapLinkUrl ?? ""} maxLength={1000} onChange={(e) => setValue({ ...value, mapLinkUrl: e.target.value })} />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Facts</p>
        <EditableList
          items={value.facts ?? []}
          onChange={(facts) => setValue({ ...value, facts })}
          makeItem={() => ({ label: "", labelBn: "", value: "", valueBn: "" })}
          addLabel="Add fact"
          renderItem={(item, _index, update) => (
            <div className="grid grid-cols-2 gap-2">
              <TextPair label="Label" en={item.label ?? ""} bn={item.labelBn ?? ""}
                onEnChange={(v) => update({ ...item, label: v })}
                onBnChange={(v) => update({ ...item, labelBn: v })} maxLength={40} />
              <TextPair label="Value" en={item.value ?? ""} bn={item.valueBn ?? ""}
                onEnChange={(v) => update({ ...item, value: v })}
                onBnChange={(v) => update({ ...item, valueBn: v })} maxLength={40} />
            </div>
          )}
        />
      </div>
    </>
  );
}
