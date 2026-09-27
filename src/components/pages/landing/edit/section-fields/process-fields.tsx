"use client";

import { CheckSquare, ListOrdered } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";

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
    <div className="space-y-6">
      <FormSectionCard
        title="Purchase & Handover Steps Overview"
        description="Headlines guiding buyers through the acquisition and handover journey."
        icon={ListOrdered}
      >
        <TextPair
          label="Section Eyebrow"
          description="Badge tag above process title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Simple, Transparent Acquisition"
          placeholderBn="যেমন: সহজ ও স্বচ্ছ বুকিং প্রক্রিয়া"
          maxLength={50}
        />
        <TextPair
          label="Section Title"
          description="Main title of the step-by-step process"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., How to Own Your Luxury Apartment"
          placeholderBn="যেমন: আপনার অ্যাপার্টমেন্ট যেভাবে বুঝে পাবেন"
          maxLength={100}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Sequential Steps"
        description="Step-by-step milestones (e.g., 01 Consultation, 02 Unit Selection, 03 Agreement, 04 Handover)."
        icon={CheckSquare}
      >
        <EditableList
          items={value.steps ?? []}
          onChange={(steps) => setValue({ ...value, steps })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "" })}
          addLabel="Add Process Step"
          renderItem={(step, _index, update) => (
            <div className="space-y-3">
              <TextPair
                label="Step Title"
                description="E.g., 01. Schedule a Private Consultation"
                en={step.title ?? ""}
                bn={step.titleBn ?? ""}
                onEnChange={(v) => update({ ...step, title: v })}
                onBnChange={(v) => update({ ...step, titleBn: v })}
                placeholderEn="e.g., 01. Schedule a Visit"
                placeholderBn="যেমন: ০১. প্রকল্প পরিদর্শন"
                maxLength={80}
              />
              <TextPair
                label="Step Description"
                description="Brief explanation of what happens during this stage"
                en={step.body ?? ""}
                bn={step.bodyBn ?? ""}
                onEnChange={(v) => update({ ...step, body: v })}
                onBnChange={(v) => update({ ...step, bodyBn: v })}
                placeholderEn="e.g., Meet our property advisor at the site to view layouts and finish options."
                placeholderBn="যেমন: সাইট পরিদর্শন করুন এবং আপনার পছন্দসই ইউনিট নির্ধারণ করুন।"
                multiline
                maxLength={200}
              />
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
