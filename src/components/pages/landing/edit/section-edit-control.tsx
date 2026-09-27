"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";
import type { LandingSectionKey } from "@/server/features/project-landing/types";
import { SectionEditModal } from "./section-edit-modal";

/**
 * One section's whole editing surface: gated visibility, the pencil trigger,
 * and the modal — parameterized by that section's own field component and
 * value type so this file doesn't grow a branch per section.
 *
 * Absent for a logged-out request from the first render: `useEditor()`
 * reads a value that was `false`/`null` before this component's own code
 * ever ran (computed server-side, in `ProjectLandingRoute`), so there is no
 * client-side flash of a button that then disappears — an anonymous visitor
 * never has it to begin with.
 */
export function SectionEditControl<T extends Record<string, unknown>>({
  section,
  title,
  value,
  empty,
  Fields,
  /** Two buttons can land in the same positioned ancestor (Lifestyle holds
   * both Gallery and Amenities) — offset the second one rather than stack
   * them. */
  position = "top-4 right-4",
  /** False for a section with no visible content to float over — e.g. a
   * currently-hidden section's placeholder banner — so the button lays out
   * inline instead of absolutely over empty space. */
  floating = true,
  /** Current `sections.<key>.visible` flag, so the modal's show/hide switch
   * reflects reality. Omit for sections with no such flag (e.g. "publishing"). */
  visible,
}: {
  section: LandingSectionKey;
  title: string;
  value: T | undefined;
  empty: T;
  Fields: (props: { value: T; setValue: (next: T) => void }) => React.ReactNode;
  position?: string;
  floating?: boolean;
  visible?: boolean;
}) {
  const { isEditor, isLiveEdit, projectId } = useEditor();
  const [open, setOpen] = useState(false);

  if (!isEditor || !isLiveEdit || !projectId) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          floating ? `absolute ${position} z-30` : "relative",
          `font-medium text-xs bg-background/95 backdrop-blur-md shadow-md border-primary/40 text-foreground hover:bg-primary hover:text-white transition-all duration-200 group flex items-center gap-1.5 rounded-full px-3 h-8 ring-1 ring-primary/20 hover:ring-primary/40 cursor-pointer`
        )}
        onClick={() => setOpen(true)}
        aria-label={`Edit ${title}`}
      >
        <Pencil className="size-3.5 text-primary group-hover:text-white transition-colors" />
        <span>Edit {title}</span>
      </Button>

      {open ? (
        <SectionEditModal
          open={open}
          onOpenChange={setOpen}
          title={title}
          projectId={projectId}
          section={section}
          initialValue={value ?? empty}
          initialVisible={visible}
        >
          {(v, setV) => <Fields value={v} setValue={setV} />}
        </SectionEditModal>
      ) : null}
    </>
  );
}
