"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { TextPair } from "../field-inputs";

export type EnquireValue = NonNullable<ApiProjectLanding["enquire"]>;

export const emptyEnquire: EnquireValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", phoneLabel: "", phoneLabelBn: "",
  whatsappLabel: "", whatsappLabelBn: "",
};

/** The nested `form` sub-object (field labels/placeholders/button text) is
 * boilerplate UI copy, not project content — left at its dictionary default
 * rather than added here, so this stays about the one thing an editor
 * actually changes per project: the pitch above the form. */
export function EnquireFields({
  value,
  setValue,
}: {
  value: EnquireValue;
  setValue: (next: EnquireValue) => void;
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
      <TextPair label="Phone button label" en={value.phoneLabel ?? ""} bn={value.phoneLabelBn ?? ""}
        onEnChange={(v) => setValue({ ...value, phoneLabel: v })}
        onBnChange={(v) => setValue({ ...value, phoneLabelBn: v })} maxLength={30} />
      <TextPair label="WhatsApp button label" en={value.whatsappLabel ?? ""} bn={value.whatsappLabelBn ?? ""}
        onEnChange={(v) => setValue({ ...value, whatsappLabel: v })}
        onBnChange={(v) => setValue({ ...value, whatsappLabelBn: v })} maxLength={30} />
    </>
  );
}
