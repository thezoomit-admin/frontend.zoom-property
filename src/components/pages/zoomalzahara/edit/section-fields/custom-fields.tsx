"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { TextPair } from "../field-inputs";

export type CustomValue = NonNullable<ApiProjectLanding["custom"]>;

export const emptyCustom: CustomValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "", body: "", bodyBn: "",
};

export function CustomFields({
  value,
  setValue,
}: {
  value: CustomValue;
  setValue: (next: CustomValue) => void;
}) {
  return (
    <>
      <TextPair label="Eyebrow" en={value.eyebrow ?? ""} bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })} maxLength={50} />
      <TextPair label="Title" en={value.title ?? ""} bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })} maxLength={100} />
      <TextPair label="Body (HTML)" en={value.body ?? ""} bn={value.bodyBn ?? ""}
        onEnChange={(v) => setValue({ ...value, body: v })}
        onBnChange={(v) => setValue({ ...value, bodyBn: v })} multiline maxLength={2000} />
    </>
  );
}
