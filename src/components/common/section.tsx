import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { AppContainer, type AppContainerProps } from "./app-container";

/** Vertical rhythm: page sections never hand-roll their own padding. */
const sectionVariants = cva("relative w-full", {
  variants: {
    spacing: {
      none: "",
      sm: "py-12 sm:py-16",
      md: "py-12 sm:py-20 lg:py-24",
      lg: "py-24 sm:py-28 lg:py-36",
    },
    tone: {
      default: "",
      muted: "bg-muted/40",
      card: "bg-card",
      inverse: "bg-foreground text-background",
    },
  },
  defaultVariants: { spacing: "md", tone: "default" },
});

export interface SectionProps
  extends ComponentPropsWithoutRef<"section">,
    VariantProps<typeof sectionVariants> {
  /** Wrap children in an <AppContainer />. Pass `false` for full-bleed sections. */
  container?: false | AppContainerProps["size"];
  containerClassName?: string;
  children?: ReactNode;
}

export function Section({
  spacing,
  tone,
  container = "xl",
  containerClassName,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, tone }), className)}
      {...props}
    >
      {container === false ? (
        children
      ) : (
        <AppContainer size={container} className={cn("relative", containerClassName)}>
          {children}
        </AppContainer>
      )}
    </section>
  );
}

export { sectionVariants };
