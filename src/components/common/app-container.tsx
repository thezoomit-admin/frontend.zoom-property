import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * AppContainer and MainContainer:
 * Standard container wrapper with flexible max-width presets (sm, md, lg, xl, 2xl, full).
 * Also attaches .app-container and .main-container classes for global styling & overrides.
 */
const containerVariants = cva(
  "app-container main-container mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-[100px] xl:max-w-[1440px] xl:px-[100px] 2xl:max-w-[1600px]",
  {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      "2xl": "max-w-[1440px]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "xl" },
});

export interface AppContainerProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof containerVariants> {
  as?: ElementType;
}

export function AppContainer({
  as: Tag = "div",
  size,
  className,
  children,
  ...props
}: AppContainerProps) {
  return (
    <Tag className={cn(containerVariants({ size }), className)} {...props}>
      {children}
    </Tag>
  );
}

export type ContainerProps = AppContainerProps;
export { AppContainer as MainContainer, AppContainer as Container, containerVariants };
export default AppContainer;
