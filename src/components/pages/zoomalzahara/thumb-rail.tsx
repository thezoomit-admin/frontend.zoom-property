import { Children, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * One-line thumbnail strip on small screens — swipe to the rest.
 * From `sm` it becomes an even grid so every thumb stays in view.
 */
export function ThumbRail({
  children,
  className,
  itemClassName,
  columns = 4,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  columns?: 4 | 6;
}) {
  const grid =
    columns === 6
      ? "sm:grid sm:grid-cols-6 sm:overflow-visible sm:snap-none"
      : "sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none";

  return (
    <ul
      className={cn(
        "az-thumb-scroll mt-3 flex gap-2 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-1",
        grid,
        className,
      )}
    >
      {Children.map(children, (child) => (
        <li
          className={cn(
            "w-[31%] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:snap-normal",
            itemClassName,
          )}
        >
          {child}
        </li>
      ))}
    </ul>
  );
}
