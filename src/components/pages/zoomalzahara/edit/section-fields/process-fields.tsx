"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";

export type ProcessValue = NonNullable<ApiProjectLanding["process"]>;

export const emptyProcess: ProcessValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "", steps: [],
};

export function ProcessFields({
  value,
  setValue,
}: {
  value: ProcessValue;
  setValue: (next: ProcessValue) => void;
}) {
  return (
    <>
      <TextPair label="Eyebrow" en={value.eyebrow ?? ""} bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })} maxLength={50} />
      <TextPair label="Title" en={value.title ?? ""} bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })} maxLength={100} />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Steps</p>
        <EditableList
          items={value.steps ?? []}
          onChange={(steps) => setValue({ ...value, steps })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "" })}
          addLabel="Add step"
          renderItem={(step, _index, update) => (
            <div className="space-y-2">
              <TextPair label="Title" en={step.title ?? ""} bn={step.titleBn ?? ""}
                onEnChange={(v) => update({ ...step, title: v })}
                onBnChange={(v) => update({ ...step, titleBn: v })} maxLength={80} />
              <TextPair label="Body" en={step.body ?? ""} bn={step.bodyBn ?? ""}
                onEnChange={(v) => update({ ...step, body: v })}
                onBnChange={(v) => update({ ...step, bodyBn: v })} multiline maxLength={200} />
            </div>
          )}
        />
      </div>
    </>
  );
}
