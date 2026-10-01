import { RichText } from "@/components/common/rich-text";
import { ImageFrame } from "@/components/media/image-frame";

/**
 * The "Specs" tab on a project page: a wide hero and the desk's rich-text
 * write-up beneath it, both set from the project's Specs section in the admin.
 */
export function ProjectSpecs({
  name,
  image,
  html,
}: {
  name: string;
  image?: string;
  html?: string;
}) {
  return (
    <div className="mt-4 flex flex-col gap-6 sm:gap-8">
      {image ? (
        <div className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
          {/* Same banner shape as the Overview slider, filled edge to edge. */}
          <ImageFrame
            src={image}
            alt={`${name} specifications`}
            ratio="auto"
            rounded="none"
            sizes="100vw"
            className="aspect-1344/527"
          />
        </div>
      ) : null}

      {html ? (
        <div className="w-full lg:px-12 xl:px-24">
          <RichText html={html} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Specifications will be added soon.
        </p>
      )}
    </div>
  );
}
