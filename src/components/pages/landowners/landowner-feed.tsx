"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { LandownerBlock } from "@/server/features/landowners";

const ANCHOR = "landowner-blocks";

export interface LandownerFeedProps {
  blocks: LandownerBlock[];
  total: number;
  totalPages: number;
  current: number;
  from: number;
  isBn: boolean;
  t: {
    showing: string;
    page: string;
    prev: string;
    next: string;
  };
  basePath: string;
}

export function LandownerFeed({
  blocks,
  total,
  totalPages,
  current,
  from,
  isBn,
  t,
  basePath,
}: LandownerFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const href = (target: number) =>
    target <= 1 ? `${basePath}#${ANCHOR}` : `${basePath}?page=${target}#${ANCHOR}`;

  const goToPage = (e: React.MouseEvent<HTMLAnchorElement>, target: number) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams.toString());
    if (target <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(target));
    }

    startTransition(() => {
      router.push(`${pathname}?${nextParams.toString()}#${ANCHOR}`, { scroll: true });
    });
  };

  return (
    <Section id={ANCHOR} className="border-t border-border bg-background scroll-mt-24">
      <div
        className={cn(
          "flex flex-col gap-16 lg:gap-24 transition-opacity duration-200",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        {blocks.map((block, index) => {
          const flipped = (from - 1 + index) % 2 === 1;

          return (
            <Reveal key={block.id}>
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                {block.image ? (
                  <div className={cn(flipped && "lg:order-2")}>
                    <ImageFrame
                      src={block.image}
                      alt={isBn ? block.titleBn : block.title}
                      ratio="4/3"
                      rounded="2xl"
                      sizes="half"
                      className="shadow-lg"
                    />
                  </div>
                ) : null}

                <div
                  className={cn(
                    "flex flex-col gap-4",
                    flipped && "lg:order-1",
                    !block.image && "lg:col-span-2",
                  )}
                >
                  <Heading as="h2" size="h2" className="text-balance">
                    {isBn ? block.titleBn : block.title}
                  </Heading>

                  <RichText html={isBn ? block.descriptionBn : block.description} />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {totalPages > 1 ? (
        <Reveal
          delay={0.1}
          // The background class for pagination background has been added here (bg-muted/10 or bg-muted/20)
          className="mt-14 flex flex-col items-center justify-between gap-4 border border-border bg-muted/20 rounded-xl p-6 sm:flex-row"
        >
          <Text size="sm" className="font-medium">
            {t.showing
              .replace("{from}", String(from))
              .replace("{to}", String(from + blocks.length - 1))
              .replace("{total}", String(total))}
          </Text>

          <nav
            className="flex items-center gap-2"
            aria-label={t.page.replace("{page}", String(current))}
          >
            <Step
              href={href(current - 1)}
              label={t.prev}
              icon="chevronLeft"
              disabled={current === 1 || isPending}
              onClick={(e) => goToPage(e, current - 1)}
            />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <a
                key={number}
                href={href(number)}
                onClick={(e) => goToPage(e, number)}
                aria-current={number === current ? "page" : undefined}
                aria-label={t.page.replace("{page}", String(number))}
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                  number === current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                {number}
              </a>
            ))}

            <Step
              href={href(current + 1)}
              label={t.next}
              icon="chevronRight"
              disabled={current === totalPages || isPending}
              onClick={(e) => goToPage(e, current + 1)}
            />
          </nav>
        </Reveal>
      ) : null}
    </Section>
  );
}

function Step({
  href,
  label,
  icon,
  disabled,
  onClick,
}: {
  href: string;
  label: string;
  icon: "chevronLeft" | "chevronRight";
  disabled: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const shared =
    "flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors";

  if (disabled) {
    return (
      <span aria-hidden className={cn(shared, "opacity-40 bg-card/50")}>
        <Icon name={icon} size="xs" />
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      aria-label={label}
      className={cn(shared, "bg-card hover:border-primary/40 hover:text-primary")}
    >
      <Icon name={icon} size="xs" />
    </a>
  );
}
