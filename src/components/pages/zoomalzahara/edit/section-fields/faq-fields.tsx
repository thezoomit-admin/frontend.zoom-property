"use client";

import { HelpCircle, MessagesSquare } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";

export type FaqValue = NonNullable<ApiProjectLanding["faq"]>;

export const emptyFaq: FaqValue = { eyebrow: "", eyebrowBn: "", title: "", titleBn: "", items: [] };

export function FaqFields({
  value,
  setValue,
}: {
  value: FaqValue;
  setValue: (next: FaqValue) => void;
}) {
  return (
    <div className="space-y-6">
      <FormSectionCard
        title="FAQ Section Header"
        description="Introduction to the frequently asked questions regarding ownership, approvals, and legalities."
        icon={HelpCircle}
      >
        <TextPair
          label="Section Eyebrow"
          description="Badge tag above FAQ title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Common Questions Answered"
          placeholderBn="যেমন: সাধারণ জিজ্ঞাসা"
          maxLength={50}
        />
        <TextPair
          label="FAQ Section Title"
          description="Main title of the FAQ section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Frequently Asked Questions"
          placeholderBn="যেমন: বহুল জিজ্ঞাসিত প্রশ্নাবলী"
          maxLength={100}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Questions & Answers Accordion"
        description="Interactive Q&A items answering buyer concerns."
        icon={MessagesSquare}
      >
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({ question: "", questionBn: "", answer: "", answerBn: "" })}
          addLabel="Add Question & Answer"
          renderItem={(item, _index, update) => (
            <div className="space-y-3">
              <TextPair
                label="Question"
                description="Buyer's inquiry (e.g. RAJUK Approval, Handover Guarantee)"
                en={item.question ?? ""}
                bn={item.questionBn ?? ""}
                onEnChange={(v) => update({ ...item, question: v })}
                onBnChange={(v) => update({ ...item, questionBn: v })}
                placeholderEn="e.g., Is the project approved by RAJUK and relevant authorities?"
                placeholderBn="যেমন: প্রকল্পটি কি রাজউক অনুমোদিত?"
                maxLength={150}
              />
              <TextPair
                label="Answer"
                description="Clear detailed resolution"
                en={item.answer ?? ""}
                bn={item.answerBn ?? ""}
                onEnChange={(v) => update({ ...item, answer: v })}
                onBnChange={(v) => update({ ...item, answerBn: v })}
                placeholderEn="e.g., Yes, Zoom Al Zahara holds full RAJUK approval with registered land mutation and clearance certificates."
                placeholderBn="যেমন: হ্যাঁ, প্রকল্পটি সম্পূর্ণভাবে রাজউক অনুমোদিত এবং সকল কাগজপত্র হালনাগাদ রয়েছে।"
                multiline
                maxLength={500}
              />
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
