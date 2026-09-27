"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { TextPair } from "../field-inputs";

export type CtaValue = NonNullable<ApiProjectLanding["cta"]>;

export const emptyCta: CtaValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", primary: "", primaryBn: "",
  call: "", callBn: "", whatsapp: "", whatsappBn: "",
};

export function CtaFields({
  value,
  setValue,
}: {
  value: CtaValue;
  setValue: (next: CtaValue) => void;
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
      <TextPair label="Primary button" en={value.primary ?? ""} bn={value.primaryBn ?? ""}
        onEnChange={(v) => setValue({ ...value, primary: v })}
        onBnChange={(v) => setValue({ ...value, primaryBn: v })} maxLength={30} />
      <TextPair label="Call button" en={value.call ?? ""} bn={value.callBn ?? ""}
        onEnChange={(v) => setValue({ ...value, call: v })}
        onBnChange={(v) => setValue({ ...value, callBn: v })} maxLength={30} />
      <TextPair label="WhatsApp button" en={value.whatsapp ?? ""} bn={value.whatsappBn ?? ""}
        onEnChange={(v) => setValue({ ...value, whatsapp: v })}
        onBnChange={(v) => setValue({ ...value, whatsappBn: v })} maxLength={30} />
    </>
  );
}
