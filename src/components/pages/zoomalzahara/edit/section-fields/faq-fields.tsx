"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";

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
    <>
      <TextPair
        label="Eyebrow"
        en={value.eyebrow ?? ""}
        bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
        maxLength={50}
      />
      <TextPair
        label="Title"
        en={value.title ?? ""}
        bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })}
        maxLength={100}
      />

      <EditableList
        items={value.items ?? []}
        onChange={(items) => setValue({ ...value, items })}
        makeItem={() => ({ question: "", questionBn: "", answer: "", answerBn: "" })}
        addLabel="Add question"
        renderItem={(item, _index, update) => (
          <div className="space-y-2">
            <TextPair
              label="Question"
              en={item.question ?? ""}
              bn={item.questionBn ?? ""}
              onEnChange={(v) => update({ ...item, question: v })}
              onBnChange={(v) => update({ ...item, questionBn: v })}
              maxLength={150}
            />
            <TextPair
              label="Answer"
              en={item.answer ?? ""}
              bn={item.answerBn ?? ""}
              onEnChange={(v) => update({ ...item, answer: v })}
              onBnChange={(v) => update({ ...item, answerBn: v })}
              multiline
              maxLength={500}
            />
          </div>
        )}
      />
    </>
  );
}
