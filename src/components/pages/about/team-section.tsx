import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getAgents } from "@/server/features/agents";
import { getLocale } from "@/i18n/dictionaries";
import { telHref } from "@/lib/contact";

/**
 * Our Team.
 *
 * Reuses the same Agent records the desk already manages (Team → Agents in
 * the panel, toggled Active/Inactive there) — just the portrait, the name
 * and the phone number, not the deals/rating/patch card used elsewhere. A
 * member switched to Inactive drops out on the next request; nothing here
 * needs its own edit screen.
 */
export async function TeamSection() {
  const [team, locale] = await Promise.all([getAgents(), getLocale()]);
  const isBn = locale === "bn";

  if (team.length === 0) return null;

  return (
    <Section className="relative bg-background">
      <SectionHeading
        align="center"
        title={isBn ? "আমাদের টিম" : "Our Team"}
        description={
          isBn
            ? "যাদের সাথে আপনি সরাসরি কথা বলবেন।"
            : "The people you actually speak to."
        }
      />

      <Stagger className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {team.map((member) => {
          const name = isBn && member.nameBn ? member.nameBn : member.name;
          return (
            <StaggerItem key={member.id}>
              <div className="flex flex-col items-center gap-3 text-center">
                <ImageFrame
                  src={member.image}
                  alt={name}
                  ratio="square"
                  rounded="xl"
                  sizes="quarter"
                  className="w-full shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)]"
                />
                <div className="flex flex-col gap-1">
                  <Heading as="h2" size="h4" weight="bold">
                    {name}
                  </Heading>
                  {member.phone ? (
                    <a
                      href={telHref(member.phone)}
                      className="flex items-center text-primary justify-center gap-1.5 text-[12px]  font-semibold"
                    >
                    {member.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
