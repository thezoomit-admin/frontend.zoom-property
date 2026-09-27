"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";
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
}: {
  section: LandingSectionKey;
  title: string;
  value: T | undefined;
  empty: T;
  Fields: (props: { value: T; setValue: (next: T) => void }) => React.ReactNode;
  position?: string;
}) {
  const { isEditor, projectId } = useEditor();
  const [open, setOpen] = useState(false);

  if (!isEditor || !projectId) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={`absolute ${position} z-20 bg-background/90 backdrop-blur-sm`}
        onClick={() => setOpen(true)}
        aria-label={`Edit ${title}`}
      >
        <Pencil className="size-3.5" />
      </Button>

      {open ? (
        <SectionEditModal
          open={open}
          onOpenChange={setOpen}
          title={title}
          projectId={projectId}
          section={section}
          initialValue={value ?? empty}
        >
          {(v, setV) => <Fields value={v} setValue={setV} />}
        </SectionEditModal>
      ) : null}
    </>
  );
}
