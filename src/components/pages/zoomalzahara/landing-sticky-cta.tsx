import { Icon } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/contact";

/** Compact mobile bar — same buttons as the page, pinned for the last tap. */
export function LandingStickyCta({
  phone,
  whatsapp,
  bookLabel,
  callLabel,
  whatsappLabel,
  showBook = true,
}: {
  phone: string;
  whatsapp: string;
  bookLabel: string;
  callLabel: string;
  whatsappLabel: string;
  showBook?: boolean;
}) {
  if (!phone && !whatsapp && !showBook) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        {phone ? (
          <Button asChild variant="outline" className="h-10 min-w-0 flex-1">
            <a href={telHref(phone)}>
              <Icon name="phone" size="xs" />
              {callLabel}
            </a>
          </Button>
        ) : null}
        {whatsapp ? (
          <Button asChild variant="outline" className="h-10 min-w-0 flex-1">
            <a href={whatsappHref(whatsapp)}>
              <Icon name="whatsapp" size="xs" />
              {whatsappLabel}
            </a>
          </Button>
        ) : null}
        {showBook && bookLabel ? (
          <Button asChild className="h-10 min-w-0 flex-1">
            <a href="#enquire">{bookLabel}</a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
