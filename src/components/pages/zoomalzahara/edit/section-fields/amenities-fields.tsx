"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { IconInputField, TextPair } from "../field-inputs";

export type AmenitiesValue = NonNullable<ApiProjectLanding["amenities"]>;

export const emptyAmenities: AmenitiesValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", items: [],
};

export function AmenitiesFields({
  value,
  setValue,
}: {
  value: AmenitiesValue;
  setValue: (next: AmenitiesValue) => void;
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
        <p className="text-sm font-medium text-foreground">Nearby places</p>
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "", icon: "", mapUrl: "", distance: "", distanceBn: "" })}
          addLabel="Add place"
          renderItem={(item, _index, update) => (
            <div className="space-y-2">
              <TextPair label="Name" en={item.title ?? ""} bn={item.titleBn ?? ""}
                onEnChange={(v) => update({ ...item, title: v })}
                onBnChange={(v) => update({ ...item, titleBn: v })} maxLength={60} />
              <TextPair label="Note" en={item.body ?? ""} bn={item.bodyBn ?? ""}
                onEnChange={(v) => update({ ...item, body: v })}
                onBnChange={(v) => update({ ...item, bodyBn: v })} maxLength={150} />
              <TextPair label="Distance" en={item.distance ?? ""} bn={item.distanceBn ?? ""}
                onEnChange={(v) => update({ ...item, distance: v })}
                onBnChange={(v) => update({ ...item, distanceBn: v })} maxLength={30} />
              <IconInputField
                label="Place Icon (আইকন)"
                description="FontAwesome class or name"
                value={item.icon ?? ""}
                onChange={(icon) => update({ ...item, icon })}
                placeholder="e.g., fa-solid fa-hospital, fa-solid fa-school, check..."
              />
              <div className="space-y-1.5">
                <Label>Google Maps URL</Label>
                <Input value={item.mapUrl ?? ""} maxLength={500} onChange={(e) => update({ ...item, mapUrl: e.target.value })} />
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
}
