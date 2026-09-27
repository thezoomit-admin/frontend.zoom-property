import { Section } from "@/components/common/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getHomeAreas } from "@/server/features/areas";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

import { AreaServiceCard } from "./area-service-card";
import { AreasHeading } from "./areas-heading";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

/** The ceiling on the home grid. `/areas` paginates the rest. */
const HOME_COUNT = 10;

/**
 * Service areas on the home page.
 *
 * Up to ten cards in a five-up grid, then a link through to the full list.
 * Which areas appear is the desk's decision — the ones ticked "on home page"
 * in the panel, in their `order` — so there is no sorting here.
 */
export async function AreasSection({ className }: { className?: string } = {}) {
  const [dict, locale, shown] = await Promise.all([
    getDictionary(),
    getLocale(),
    getHomeAreas(HOME_COUNT),
  ]);
  const t = dict.areas.service;

  return (
    <Section
      id="areas"
      className={cn("relative overflow-hidden bg-background", className)}
    >
      <CmsSectionEditControl
        pageId="home"
        sectionId="areasSection"
        label="Service Areas"
        position="top-6 right-6"
      />
      <AreasOrnaments />

      <AreasHeading t={t} />

      <Stagger className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((area) => (
          <StaggerItem key={area.id}>
            <AreaServiceCard
              area={area}
              locale={locale}
              inAreaLabel={t.inArea.replace(
                "{name}",
                locale === "bn" && area.nameBn ? area.nameBn : area.name,
              )}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}



/**
 * The background of the reference design: a dot grid in the top-left, another
 * in the bottom-right, and a soft blue disc bleeding in from the top-right
 * corner.
 *
 * All three are drawn in CSS rather than shipped as artwork, and none of them
 * is content — the section reads identically with them switched off. They are
 * dropped below `lg`, where there is no margin for them to sit in.
 */
function AreasOrnaments() {
  const dots =
    "absolute hidden h-16 w-28 bg-[radial-gradient(circle,var(--color-brand-green)_1.5px,transparent_1.5px)] [background-size:14px_14px] opacity-25 lg:block";

  return (
    <div aria-hidden className="pointer-events-none">
      <span className={cn(dots, "top-10 left-0")} />
      <span className={cn(dots, "right-0 bottom-10")} />

      <span className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-green/8 blur-3xl" />
    </div>
  );
}
