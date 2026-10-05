import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { RichText } from "@/components/common/rich-text";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getDictionary } from "@/i18n/dictionaries";

export async function FaqSection({
  containerClassName,
}: {
  containerClassName?: string;
} = {}) {
  const dict = await getDictionary();

  return (
    <Section
      id="faq"
      className="border-t border-border bg-background"
      containerClassName={containerClassName}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <SectionHeading
          title={dict.faq.title}
          description={dict.faq.description}
          className="text-center"
        />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {dict.content.faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="">
                  <RichText
                    html={faq.answer}
                    className="max-w-none text-sm sm:max-w-none [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-border"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}
