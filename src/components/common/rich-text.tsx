import { cn } from "@/lib/utils";

/**
 * Renders HTML from the admin TinyMCE editor.
 *
 * Markup is admin-authored only (never visitor input). Styles come from
 * `text-editor.css` plus any inline styles TinyMCE saved — we do not re-skin
 * headings/paragraphs here so the public page matches what was edited.
 */
export function RichText({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  if (!html || !html.trim()) return null;

  return (
    <div
      className={cn("text-editor w-full max-w-none overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default RichText;
