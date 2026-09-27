import { AppContainer } from "@/components/common/app-container";
import { Counter } from "@/components/motion/counter";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { getDictionary } from "@/i18n/dictionaries";
import { toLatinDigits } from "@/lib/format";
import Image from "next/image";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

export interface StatsBannerProps {
  backgroundImage?: string;
  className?: string;
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";

function resolveBackgroundImage(src: string) {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("/")) {
    return src;
  }

  const serverUrl = (
    process.env.NEXT_PUBLIC_IMAGE_ACCESS_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    "http://localhost:5008"
  ).replace(/\/+$/, "");

  return `${serverUrl}/${src.replace(/^\/+/, "")}`;
}

export async function StatsBanner({
  backgroundImage,
  className = "",
}: StatsBannerProps = {}) {
  const dict = await getDictionary();
  const banner = dict.statsBanner;

  const bgImage = banner?.backgroundImage || backgroundImage || DEFAULT_BG;
  const resolvedBgImage = resolveBackgroundImage(bgImage);

  /**
   * One stat, read from the panel.
   *
   * The value arrives as whatever somebody typed, so it is folded to ASCII
   * digits before parsing — otherwise a number entered in Bangla numerals
   * parses to NaN and the banner silently shows the built-in figure instead of
   * the one that was just saved.
   *
   * `suffix` uses `??` rather than `||`: an empty suffix is a real choice (a
   * plain "32" with nothing after it), and `||` would overwrite it.
   */
  const statFrom = (
    value: unknown,
    suffix: string | undefined,
    label: string | undefined,
    fallback: { value: number; suffix: string; label: string },
  ): StatItem => ({
    value:
      value === undefined
        ? fallback.value
        : parseInt(toLatinDigits(String(value)), 10) || fallback.value,
    suffix: suffix ?? fallback.suffix,
    label: label || fallback.label,
  });

  const stats: StatItem[] = [
    statFrom(banner?.stat1Value, banner?.stat1Suffix, banner?.stat1Label, {
      value: 8,
      suffix: "k+",
      label: "Projects completed",
    }),
    statFrom(banner?.stat2Value, banner?.stat2Suffix, banner?.stat2Label, {
      value: 3,
      suffix: "k+",
      label: "Global customers",
    }),
    statFrom(banner?.stat3Value, banner?.stat3Suffix, banner?.stat3Label, {
      value: 20,
      suffix: "+",
      label: "Years of experience",
    }),
    statFrom(banner?.stat4Value, banner?.stat4Suffix, banner?.stat4Label, {
      value: 95,
      suffix: "+",
      label: "Team engineers",
    }),
  ];

  return (
    <section
      className={`relative flex min-h-48 w-full items-center overflow-hidden bg-stone-800 py-10 sm:block sm:min-h-0 sm:py-16 lg:py-20 ${className}`}
    >
      <CmsSectionEditControl
        pageId="home"
        sectionId="statsBanner"
        label="Stats Banner"
        position="top-6 right-6"
      />
      <Image
        aria-hidden
        alt=""
        src={resolvedBgImage}
        fill
        sizes="100vw"
        className="absolute inset-0 h-full w-full scale-[1.7] object-cover object-center sm:scale-100"
      />
      {/* Mobile has one light contrast layer only, so the image fills and
          remains visible edge-to-edge. */}
      <div aria-hidden className="absolute inset-0 bg-black/40 sm:bg-black/55" />
      <div aria-hidden className="absolute inset-0 hidden bg-linear-to-b from-black/80 via-transparent to-black/80 sm:block" />

      {/* Foreground Stats Content Layer (z-20) */}
      <AppContainer size="lg" className="relative z-20">
        <Stagger className="grid grid-cols-2 gap-y-6 gap-x-6 sm:gap-8 md:grid-cols-4 md:gap-8">
          {stats.map((item, index) => (
            <StaggerItem
              key={index}
              className="group flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-baseline justify-center font-serif text-3xl font-light tracking-tight text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-105 sm:text-4xl md:text-5xl lg:text-6xl">
                <Counter
                  to={item.value}
                  suffix={item.suffix}
                  duration={2}
                  className="font-serif text-white"
                />
              </div>
              <p className="mt-2 text-xs font-medium tracking-wide text-white/85 drop-shadow-md sm:text-sm">
                {item.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </AppContainer>
    </section>
  );
}
