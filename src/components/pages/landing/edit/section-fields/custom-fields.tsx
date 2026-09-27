"use client";

import { FileText } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { FormSectionCard, TextPair } from "../field-inputs";

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
    <div className="space-y-6">
      <FormSectionCard
        title="Custom Rich Content Section"
        description="Free-form editorial or supplementary project description displayed near the bottom of the page."
        icon={FileText}
      >
        <TextPair
          label="Section Eyebrow"
          description="Badge tag above title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Additional Information"
          placeholderBn="যেমন: অতিরিক্ত তথ্য"
          maxLength={50}
        />
        <TextPair
          label="Custom Section Title"
          description="Heading of the custom section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Special Architectural Features & Terms"
          placeholderBn="যেমন: বিশেষ সুবিধাসমূহ ও নির্দেশনাবলী"
          maxLength={100}
        />
        <TextPair
          label="Custom Content Body (HTML / Rich Text)"
          description="Extended article or terms description"
          en={value.body ?? ""}
          bn={value.bodyBn ?? ""}
          onEnChange={(v) => setValue({ ...value, body: v })}
          onBnChange={(v) => setValue({ ...value, bodyBn: v })}
          placeholderEn="e.g., Enter detailed content or rich description here..."
          placeholderBn="যেমন: বিস্তারিত বিবরণ বা বিশেষ শর্তাবলী এখানে লিখুন..."
          multiline
          maxLength={2000}
        />
      </FormSectionCard>
    </div>
  );
}
