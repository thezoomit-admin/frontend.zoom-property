"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PickedMedia {
  id: string;
  url: string;
}

interface MediaRow {
  id: string;
  name: string;
  url: string;
}

/**
 * A slim picker against the backend's own `/media-library` REST endpoints —
 * not the admin's Redux/Ant-Design one, which this app has no Redux store or
 * antd dependency to run. Same data, plain `fetch` + local state.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: PickedMedia) => void;
}) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ type: "image", limit: "60" });
    if (search.trim()) params.set("search", search.trim());
    fetch(`/api/media?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success) setItems(json.data?.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [open, search]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json?.success && json.data) {
        const media: MediaRow = { id: json.data.id, name: json.data.name, url: json.data.url };
        setItems((prev) => [media, ...prev]);
        onSelect({ id: media.id, url: media.url });
        onOpenChange(false);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose an image</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            Upload
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="grid max-h-96 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No images found.
            </p>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect({ id: item.id, url: item.url });
                  onOpenChange(false);
                }}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border border-border",
                  "hover:ring-2 hover:ring-primary",
                )}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
