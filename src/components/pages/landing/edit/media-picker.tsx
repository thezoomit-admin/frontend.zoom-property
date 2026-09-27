"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
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
  name?: string;
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

export interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: PickedMedia) => void;
  initialSelected?: string | string[] | PickedMedia | PickedMedia[] | null;
  selectionMode?: "single" | "multiple";
  title?: string;
}

/**
 * Media picker with full folder navigation, search, instant uploads,
 * persistent selected image state, and visual checkmark highlighting
 * matching the admin media workflow.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  initialSelected,
  selectionMode = "single",
  title = "Select Image from Media",
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Selected item state
  const [selectedMedia, setSelectedMedia] = useState<MediaRow | null>(null);

  // New folder creation state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [submittingFolder, setSubmittingFolder] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setCurrentFolderId(null);
      setBreadcrumbs([]);
      setSearch("");
      setIsCreatingFolder(false);
      setNewFolderName("");
      setSelectedMedia(null);
    }
    onOpenChange(nextOpen);
  };

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
        .then((res) => {
          if (res?.success && Array.isArray(res.data?.data)) {
            return res.data.data.map((m: { _id?: string; id?: string; name: string; url?: string; path?: string }) => ({
              id: m._id || m.id || "",
              name: m.name,
              url: m.url || m.path || "",
            }));
          }
          return [];
        })
        .catch(() => []);

      const [folderList, mediaList] = await Promise.all([folderPromise, mediaPromise]);

      setFolders(folderList);
      setItems(mediaList);

      // Match initial selection
      if (initialSelected && mediaList.length > 0) {
        const rawTarget = Array.isArray(initialSelected)
          ? initialSelected[0]
          : initialSelected;

        if (rawTarget) {
          const target =
            typeof rawTarget === "string"
              ? rawTarget
              : (rawTarget as PickedMedia).url || (rawTarget as PickedMedia).id;

          if (target) {
            const found = mediaList.find((item: MediaRow) => {
              if (item.id === target) return true;
              if (item.url === target) return true;
              if (item.name === target) return true;
              const cleanTarget = target.split("?")[0];
              const cleanItemUrl = item.url.split("?")[0];
              if (cleanTarget === cleanItemUrl) return true;
              if (cleanTarget.endsWith(item.name) || cleanItemUrl.endsWith(target)) return true;
              return false;
            });

            if (found) {
              setSelectedMedia(found);
            }
          }
        }
      }
    } catch {
      // ignored if aborted
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, search, initialSelected]);

  useEffect(() => {
    if (!open) return;

    let ignore = false;
    const controller = new AbortController();

    Promise.resolve().then(() => {
      if (!ignore) {
        void fetchData(controller.signal);
      }
    });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [open, fetchData]);

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
      // Straight to the backend from here, not through this app's own
      // server — a Vercel Node Function in between caps the body at ~4.5MB,
      // well under a single phone photo. See /api/media/upload-token.
      const tokenRes = await fetch("/api/media/upload-token");
      const tokenJson = await tokenRes.json();
      if (!tokenJson?.success || !tokenJson.token) {
        toast.error(tokenJson?.message || "Not signed in");
        return;
      }

      const formData = new FormData();
      formData.set("file", file);
      if (currentFolderId) {
        formData.set("folder", currentFolderId);
      }
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5009/api").replace(/\/+$/, "");
      const res = await fetch(`${apiUrl}/media-library`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenJson.token}` },
        body: formData,
      });
      const json = await res.json();
      if (json?.success && json.data) {
        const media: MediaRow = {
          id: json.data.id || json.data._id,
          name: json.data.name,
          url: json.data.url || json.data.path,
        };
        setItems((prev) => [media, ...prev]);
        setSelectedMedia(media);
        toast.success("Image uploaded and selected");
      } else {
        toast.error(json?.message || "Failed to upload image");
      }
    } catch {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      onSelect({
        id: selectedMedia.id,
        url: selectedMedia.url,
        name: selectedMedia.name,
      });
      onOpenChange(false);
    }
  };

  const currentFolderName =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : "All Media";

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        data-lenis-prevent
        className="w-[95vw] sm:w-[95vw] max-w-[95vw] sm:max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-4 sm:p-6 overflow-hidden rounded-lg border border-border bg-background shadow-2xl"
      >
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center justify-between text-base sm:text-lg font-semibold">
            <span>{title}</span>
            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded bg-muted">
              {selectionMode === "multiple" ? "Multi-select" : "Single Select"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* ── Breadcrumb Bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground border border-border/50">
          <button
            type="button"
            onClick={() => handleGoToCrumb(-1)}
            className={cn(
              "flex items-center gap-1.5 font-medium transition-colors hover:text-foreground cursor-pointer",
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
                  "font-medium transition-colors hover:text-foreground max-w-[160px] truncate cursor-pointer",
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
              className="h-9 pl-8 pr-8 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                          "group flex items-center gap-2.5 rounded-lg border border-border bg-card p-3 text-left transition-all cursor-pointer",
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
                  <div className="grid grid-cols-2 gap-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                    {items.map((item) => {
                      const isSelected = selectedMedia?.id === item.id || selectedMedia?.url === item.url;

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMedia(item)}
                          onDoubleClick={() => {
                            onSelect({ id: item.id, url: item.url, name: item.name });
                            onOpenChange(false);
                          }}
                          className={cn(
                            "group relative aspect-square overflow-hidden rounded-lg border bg-card text-left transition-all duration-150 cursor-pointer select-none",
                            isSelected
                              ? "border-primary ring-2 ring-primary ring-offset-1 shadow-md bg-primary/5"
                              : "border-border hover:border-primary/60 hover:shadow-xs"
                          )}
                          title={`${item.name} • Double-click to set`}
                        >
                          {/* Checkmark indicator for selected state */}
                          {isSelected && (
                            <div className="absolute top-2 left-2 z-20 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md animate-in zoom-in-75 duration-150">
                              <Check className="size-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Copy URL button on hover */}
                          <button
                            type="button"
                            onClick={(e) => void handleCopyUrl(e, item.url)}
                            className="absolute top-2 right-2 z-20 flex size-6.5 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 shadow-sm cursor-pointer"
                            title="Copy URL"
                          >
                            <Copy className="size-3.5" />
                          </button>

                          <Image
                            src={item.url}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 12vw"
                            className={cn(
                              "object-cover transition-transform duration-200 group-hover:scale-105",
                              isSelected ? "scale-[1.02]" : ""
                            )}
                          />

                          {/* Image name overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1.5 pt-4 opacity-95 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-[11px] font-medium text-white text-center">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Bottom Action / Confirmation Bar (matching admin standard) ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-3.5 mt-auto">
          <div className="flex items-center gap-2 min-w-0 text-xs text-muted-foreground">
            {selectedMedia ? (
              <div className="flex items-center gap-2 truncate">
                <div className="relative size-7 shrink-0 overflow-hidden rounded border border-border">
                  <Image
                    src={selectedMedia.url}
                    alt=""
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[350px]">
                  {selectedMedia.name}
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium shrink-0">
                  Selected
                </span>
              </div>
            ) : (
              <span className="italic">No image selected. Click an image to choose.</span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedMedia}
              onClick={handleConfirmSelection}
              className="min-w-[100px]"
            >
              Set Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
