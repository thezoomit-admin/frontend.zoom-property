"use client";

import { HelpCircle, PhoneCall } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { FormSectionCard, TextPair } from "../field-inputs";

export type EnquireValue = NonNullable<ApiProjectLanding["enquire"]>;

export const emptyEnquire: EnquireValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", phoneLabel: "", phoneLabelBn: "",
  whatsappLabel: "", whatsappLabelBn: "",
};

export function EnquireFields({
  value,
  setValue,
}: {
  value: EnquireValue;
  setValue: (next: EnquireValue) => void;
}) {
  return (
    <div className="space-y-6">
      <FormSectionCard
        title="Enquiry Header & Pitch"
        description="The invitation heading and description displayed above the contact and lead capture form."
        icon={HelpCircle}
      >
        <TextPair
          label="Eyebrow Subtitle"
          description="Small badge above the form title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Request Exclusive Access"
          placeholderBn="যেমন: যোগাযোগের তথ্য"
          maxLength={50}
        />
        <TextPair
          label="Form Title"
          description="Main headline inviting leads or inquiries"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Schedule a Private Consultation"
          placeholderBn="যেমন: বিস্তারিত জানতে যোগাযোগ করুন"
          maxLength={100}
        />
        <TextPair
          label="Introductory Description"
          description="Short reassurance text explaining the quick callback process"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Leave your contact information and our dedicated property specialist will contact you within 24 hours."
          placeholderBn="যেমন: আপনার তথ্য দিন, আমাদের প্রতিনিধি দ্রুততম সময়ে আপনার সাথে যোগাযোগ করবেন।"
          multiline
          maxLength={300}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Direct Action / Call & WhatsApp Button Labels"
        description="Custom button text for one-tap calling and direct WhatsApp messaging."
        icon={PhoneCall}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Phone Call Button Label"
            description="Text shown next to phone icon"
            en={value.phoneLabel ?? ""}
            bn={value.phoneLabelBn ?? ""}
            onEnChange={(v) => setValue({ ...value, phoneLabel: v })}
            onBnChange={(v) => setValue({ ...value, phoneLabelBn: v })}
            placeholderEn="e.g., Call Direct"
            placeholderBn="যেমন: সরাসরি কল করুন"
            maxLength={30}
          />
          <TextPair
            label="WhatsApp Button Label"
            description="Text shown next to WhatsApp icon"
            en={value.whatsappLabel ?? ""}
            bn={value.whatsappLabelBn ?? ""}
            onEnChange={(v) => setValue({ ...value, whatsappLabel: v })}
            onBnChange={(v) => setValue({ ...value, whatsappLabelBn: v })}
            placeholderEn="e.g., Chat on WhatsApp"
            placeholderBn="যেমন: হোয়াটসঅ্যাপে চ্যাট করুন"
            maxLength={30}
          />
        </div>
      </FormSectionCard>
    </div>
  );
}
