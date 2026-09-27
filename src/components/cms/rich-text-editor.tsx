"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Code,
  Eye,
  Heading2,
  Heading3,
  Italic,
  Languages,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Quote,
  RemoveFormatting,
  Underline,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { translateToBangla, translateToEnglish } from "@/lib/translate";

interface RichTextEditorProps {
  label: string;
  description?: string;
  en: string;
  bn: string;
  onEnChange: (val: string) => void;
  onBnChange: (val: string) => void;
}

export function RichTextEditorPair({
  label,
  description,
  en,
  bn,
  onEnChange,
  onBnChange,
}: RichTextEditorProps) {
  const [translatingToBn, setTranslatingToBn] = useState(false);
  const [translatingToEn, setTranslatingToEn] = useState(false);

  const handleTranslateEnToBn = async () => {
    if (!en || !en.trim()) {
      toast.info("অনুবাদ করার জন্য আগে ইংরেজিতে টেক্সট লিখুন");
      return;
    }

    setTranslatingToBn(true);
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = en;
      const plainText = tempDiv.innerText || tempDiv.textContent || "";
      
      const translated = await translateToBangla(plainText);
      if (translated) {
        const formatted = translated
          .split("\n\n")
          .filter(Boolean)
          .map((p) => `<p>${p.trim()}</p>`)
          .join("");
        onBnChange(formatted || `<p>${translated}</p>`);
        toast.success("বাংলায় রূপান্তর করা হয়েছে!");
      }
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslatingToBn(false);
    }
  };

  const handleTranslateBnToEn = async () => {
    if (!bn || !bn.trim()) {
      toast.info("অনুবাদ করার জন্য আগে বাংলায় টেক্সট লিখুন");
      return;
    }

    setTranslatingToEn(true);
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = bn;
      const plainText = tempDiv.innerText || tempDiv.textContent || "";
      
      const translated = await translateToEnglish(plainText);
      if (translated) {
        const formatted = translated
          .split("\n\n")
          .filter(Boolean)
          .map((p) => `<p>${p.trim()}</p>`)
          .join("");
        onEnChange(formatted || `<p>${translated}</p>`);
        toast.success("English-এ রূপান্তর করা হয়েছে!");
      }
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslatingToEn(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
        <div>
          <Label className="text-xs font-semibold text-foreground">{label}</Label>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* EN -> BN */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslateEnToBn}
            disabled={translatingToBn || !en.trim()}
            className="h-6.5 px-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-35"
            title="Auto-translate rich content from English to Bangla"
          >
            {translatingToBn ? (
              <Loader2 className="size-3 animate-spin text-current shrink-0" />
            ) : (
              <Languages className="size-3 text-current shrink-0" />
            )}
            <span>{translatingToBn ? "রূপান্তর..." : "বাংলা করুন (EN→BN)"}</span>
          </Button>

          {/* BN -> EN */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslateBnToEn}
            disabled={translatingToEn || !bn.trim()}
            className="h-6.5 px-2 text-[10px] font-bold text-blue-700 dark:text-blue-400 border-blue-500/40 bg-blue-500/10 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-35"
            title="Auto-translate rich content from Bangla to English"
          >
            {translatingToEn ? (
              <Loader2 className="size-3 animate-spin text-current shrink-0" />
            ) : (
              <Languages className="size-3 text-current shrink-0" />
            )}
            <span>{translatingToEn ? "Translating..." : "English (BN→EN)"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Column */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-blue-500" />
            English Content
          </span>
          <SingleRichEditor value={en} onChange={onEnChange} placeholder="Type English content with rich formatting..." />
        </div>

        {/* Bangla Column */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            বাংলা কনটেন্ট (Bengali Content)
          </span>
          <SingleRichEditor value={bn} onChange={onBnChange} placeholder="বাংলায় কনটেন্ট লিখুন বা ফরমেট করুন..." />
        </div>
      </div>
    </div>
  );
}

function SingleRichEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [htmlMode, setHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  // Synchronize incoming value into contentEditable when not typing
  useEffect(() => {
    if (editorRef.current && !htmlMode && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, htmlMode]);

  const exec = (command: string, arg?: string) => {
    if (htmlMode) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const currentHtml = editorRef.current.innerHTML;
    onChange(currentHtml === "<br>" || currentHtml === "<p><br></p>" ? "" : currentHtml);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  const addLink = () => {
    const url = prompt("Enter link URL (e.g. https://example.com):");
    if (url) {
      exec("createLink", url);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background shadow-xs overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/40 text-muted-foreground">
        <button
          type="button"
          onClick={() => exec("bold")}
          title="Bold (Ctrl+B)"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          title="Italic (Ctrl+I)"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Italic className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          title="Underline (Ctrl+U)"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Underline className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => exec("formatBlock", "<h2>")}
          title="Heading 2"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-xs font-bold"
        >
          <Heading2 className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<h3>")}
          title="Heading 3"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-xs font-bold"
        >
          <Heading3 className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<p>")}
          title="Paragraph"
          className="px-1.5 h-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-xs font-medium"
        >
          P
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          title="Bullet List"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <List className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          title="Numbered List"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ListOrdered className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("formatBlock", "<blockquote>")}
          title="Quote"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Quote className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button
          type="button"
          onClick={addLink}
          title="Insert Link"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <LinkIcon className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          title="Clear Formatting"
          className="size-7 flex items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <RemoveFormatting className="size-3.5" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setHtmlMode(!htmlMode)}
          title={htmlMode ? "Switch to Visual Editor" : "View HTML Source"}
          className={cn(
            "h-7 px-2 flex items-center gap-1 rounded text-xs transition-colors cursor-pointer",
            htmlMode ? "bg-primary text-white" : "hover:bg-muted hover:text-foreground"
          )}
        >
          {htmlMode ? <Eye className="size-3" /> : <Code className="size-3" />}
          <span>{htmlMode ? "Visual" : "HTML"}</span>
        </button>
      </div>

      {/* Editor Body */}
      {htmlMode ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Enter HTML code directly...</p>"
          className="h-48 font-mono text-xs border-0 rounded-none focus-visible:ring-0 resize-y p-3"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onBlur={handleContentChange}
          data-placeholder={placeholder}
          className="text-editor min-h-[160px] max-h-[300px] overflow-y-auto p-3 text-xs sm:text-sm focus:outline-none bg-background focus:ring-1 focus:ring-primary/20"
        />
      )}
    </div>
  );
}
