"use client";

import { useEditor } from "@/hooks/use-editor";
import type { LandingSectionKey } from "@/server/features/project-landing/types";
import { SectionEditControl } from "./section-edit-control";

/**
 * Stand-in for a section that isn't rendering its normal content — either
 * it's toggled off (`sections.<key>.visible: false`) or has never had any
 * content entered. A public visitor gets nothing (this resolves to `null`
 * exactly like `SectionEditControl` does for them); a logged-in editor with
 * Live CMS on gets a small dashed banner instead of just losing the ability
 * to ever open — and re-enable — that section from the frontend.
 */
export function HiddenSectionNotice<T extends Record<string, unknown>>({
  section,
  title,
  value,
  empty,
  Fields,
  visible = false,
}: {
  section: LandingSectionKey;
  title: string;
  value: T | undefined;
  empty: T;
  Fields: (props: { value: T; setValue: (next: T) => void }) => React.ReactNode;
  /** Current `sections.<key>.visible` flag. Defaults to false since this
   * component only ever renders in place of a section that failed its
   * content/visibility check. */
  visible?: boolean;
}) {
  const { isEditor, isLiveEdit } = useEditor();
  if (!isEditor || !isLiveEdit) return null;

  return (
    <div className="mx-auto my-3 flex w-full max-w-7xl items-center justify-between gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 sm:px-6">
      <p className="text-xs text-muted-foreground">
        <strong className="font-semibold text-foreground">{title}</strong> is
        currently hidden from visitors or has no content yet.
      </p>
      <SectionEditControl
        section={section}
        title={title}
        value={value}
        empty={empty}
        Fields={Fields}
        floating={false}
        visible={visible}
      />
    </div>
  );
}
