"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  FolderPlus,
  ImageIcon,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

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

interface FolderRow {
  _id: string;
  name: string;
  parent?: string | null;
}

/**
 * Media picker with full folder navigation, search, and instant uploads.
 * Styled to 90% viewport width and 95% viewport height.
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
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New folder creation state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [submittingFolder, setSubmittingFolder] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  // Fetch folders and media whenever modal opens, folder changes, or search changes
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      // 1. Fetch folders for the current level (unless searching)
      const folderPromise = !search.trim()
        ? fetch(`/api/folders?parent=${currentFolderId ?? "root"}`, { signal })
            .then((r) => r.json())
            .then((res) => (res?.success && Array.isArray(res.data) ? res.data : []))
            .catch(() => [])
        : Promise.resolve([]);

      // 2. Fetch media items
      const mediaParams = new URLSearchParams({ type: "image", limit: "150" });
      if (currentFolderId) mediaParams.set("folder", currentFolderId);
      if (search.trim()) mediaParams.set("search", search.trim());

      const mediaPromise = fetch(`/api/media?${mediaParams}`, { signal })
        .then((r) => r.json())
        .then((res) => (res?.success && Array.isArray(res.data?.data) ? res.data.data : []))
        .catch(() => []);

      const [folderList, mediaList] = await Promise.all([folderPromise, mediaPromise]);

      setFolders(folderList);
      setItems(mediaList);
    } catch {
      // ignored if aborted
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, search]);

  useEffect(() => {
    if (!open) {
      // Reset navigation when modal is closed
      setCurrentFolderId(null);
      setBreadcrumbs([]);
      setSearch("");
      setIsCreatingFolder(false);
      setNewFolderName("");
      return;
    }

    const controller = new AbortController();
    void fetchData(controller.signal);
    return () => controller.abort();
  }, [open, currentFolderId, search, fetchData]);

  const handleOpenFolder = (folder: FolderRow) => {
    setBreadcrumbs((prev) => [...prev, { id: folder._id, name: folder.name }]);
    setCurrentFolderId(folder._id);
    setSearch("");
    setIsCreatingFolder(false);
  };

  const handleGoToCrumb = (index: number) => {
    if (index < 0) {
      setBreadcrumbs([]);
      setCurrentFolderId(null);
    } else {
      setBreadcrumbs((prev) => prev.slice(0, index + 1));
      setCurrentFolderId(breadcrumbs[index].id);
    }
    setSearch("");
    setIsCreatingFolder(false);
  };

  const handleGoBack = () => {
    if (breadcrumbs.length <= 1) {
      handleGoToCrumb(-1);
    } else {
      handleGoToCrumb(breadcrumbs.length - 2);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    setSubmittingFolder(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          parent: currentFolderId ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Failed to create folder");
        return;
      }
      toast.success("Folder created");
      setNewFolderName("");
      setIsCreatingFolder(false);
      void fetchData();
    } catch {
      toast.error("Failed to create folder");
    } finally {
      setSubmittingFolder(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      if (currentFolderId) {
        formData.set("folder", currentFolderId);
      }
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (json?.success && json.data) {
        const media: MediaRow = { id: json.data.id, name: json.data.name, url: json.data.url };
        setItems((prev) => [media, ...prev]);
        toast.success("Image uploaded");
        onSelect({ id: media.id, url: media.url });
        onOpenChange(false);
      } else {
        toast.error(json?.message || "Failed to upload image");
      }
    } catch {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  };

  const currentFolderName =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : "All Media";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="w-[90vw] max-w-[90vw] sm:max-w-[90vw] h-[95vh] max-h-[95vh] flex flex-col p-5 sm:p-6"
      >
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center justify-between text-lg font-semibold">
            <span>Choose an image</span>
          </DialogTitle>
        </DialogHeader>

        {/* ── Breadcrumb Bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground border border-border/50">
          <button
            type="button"
            onClick={() => handleGoToCrumb(-1)}
            className={cn(
              "flex items-center gap-1.5 font-medium transition-colors hover:text-foreground",
              currentFolderId === null ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
          >
            <FolderOpen className="size-3.5 text-primary" />
            <span>Root</span>
          </button>

          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <button
                type="button"
                onClick={() => handleGoToCrumb(idx)}
                className={cn(
                  "font-medium transition-colors hover:text-foreground max-w-[160px] truncate",
                  idx === breadcrumbs.length - 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
                title={crumb.name}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>

        {/* ── Toolbar: Search, Upload, New Folder, Back ─────────────── */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {currentFolderId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="h-9 px-2.5"
              title="Go back one folder"
            >
              <ArrowLeft className="size-4 mr-1" />
              <span>Back</span>
            </Button>
          )}

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={`Search images in ${currentFolderName}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCreatingFolder((prev) => !prev)}
            className="h-9"
          >
            <FolderPlus className="size-4 mr-1.5 text-amber-500" />
            New Folder
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="h-9"
          >
            {uploading ? (
              <Loader2 className="size-4 mr-1.5 animate-spin" />
            ) : (
              <Upload className="size-4 mr-1.5" />
            )}
            Upload Image
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

        {/* ── Inline New Folder Creator ─────────────────────────────── */}
        {isCreatingFolder && (
          <form
            onSubmit={handleCreateFolder}
            className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5"
          >
            <FolderPlus className="size-4 text-amber-600 shrink-0 ml-1" />
            <Input
              autoFocus
              placeholder="Enter folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="h-8 flex-1 text-sm bg-background"
            />
            <Button
              type="submit"
              size="sm"
              disabled={submittingFolder || !newFolderName.trim()}
              className="h-8 px-3"
            >
              {submittingFolder ? (
                <Loader2 className="size-3.5 animate-spin mr-1" />
              ) : null}
              Create
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreatingFolder(false);
                setNewFolderName("");
              }}
              className="h-8 px-2"
            >
              Cancel
            </Button>
          </form>
        )}

        {/* ── Content View: Folders + Media Grid ─────────────────────── */}
        <div className="custom-scrollbar relative flex-1 min-h-0 h-full overflow-y-auto rounded-lg border border-border/60 bg-muted/10 p-3 sm:p-4">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="text-xs">Loading media library...</span>
            </div>
          ) : folders.length === 0 && items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">No media found</p>
                <p className="text-xs text-muted-foreground">
                  {search
                    ? `No matches for "${search}"`
                    : "This folder is empty. Upload an image or create a subfolder."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="mt-1"
              >
                <Upload className="size-3.5 mr-1.5" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* ── Folder Grid (if any) ────────────────────────── */}
              {folders.length > 0 && !search.trim() && (
                <div>
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Folder className="size-3.5 text-amber-500" />
                    <span>Folders ({folders.length})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                    {folders.map((f) => (
                      <button
                        key={f._id}
                        type="button"
                        onClick={() => handleOpenFolder(f)}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-lg border border-border bg-card p-3 text-left transition-all",
                          "hover:border-primary hover:bg-primary/5 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20 group-hover:text-amber-700">
                          <Folder className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-foreground group-hover:text-primary">
                            {f.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground">Folder</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Images Grid ─────────────────────────────────── */}
              {items.length > 0 && (
                <div>
                  {folders.length > 0 && !search.trim() && (
                    <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <ImageIcon className="size-3.5 text-primary" />
                      <span>Images ({items.length})</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelect({ id: item.id, url: item.url });
                          onOpenChange(false);
                        }}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-lg border border-border bg-card transition-all",
                          "hover:border-primary hover:ring-2 hover:ring-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        )}
                        title={item.name}
                      >
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 10vw"
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-[11px] font-medium text-white">
                            {item.name}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
