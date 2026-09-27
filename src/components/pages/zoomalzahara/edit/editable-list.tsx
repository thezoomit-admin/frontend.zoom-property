"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Add/remove for a repeatable array field — `about.points`, `faq.items`,
 * `gallery.shots`, and every other section's item list share this. */
export function EditableList<T>({
  items,
  onChange,
  makeItem,
  renderItem,
  addLabel = "Add item",
}: {
  items: T[];
  onChange: (next: T[]) => void;
  makeItem: () => T;
  renderItem: (item: T, index: number, update: (next: T) => void) => ReactNode;
  addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-border p-3 pr-10"
        >
          {renderItem(item, index, (next) => {
            const copy = items.slice();
            copy[index] = next;
            onChange(copy);
          })}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, makeItem()])}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}
