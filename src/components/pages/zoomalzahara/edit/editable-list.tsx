"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Add/remove for a repeatable array field — `about.points`, `hero.stats`,
 * `gallery.shots`, `films.items`, and every other section's item list share this.
 */
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
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-muted/10">
          No items added yet. Click below to add the first item.
        </div>
      ) : (
        items.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
          >
            {/* Item number badge & delete button */}
            <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                Item #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                title="Remove this item"
              >
                <Trash2 className="size-3.5 mr-1" />
                Remove
              </Button>
            </div>

            {renderItem(item, index, (next) => {
              const copy = items.slice();
              copy[index] = next;
              onChange(copy);
            })}
          </div>
        ))
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, makeItem()])}
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary py-4 font-medium"
      >
        <Plus className="size-4 mr-1.5" />
        {addLabel}
      </Button>
    </div>
  );
}
