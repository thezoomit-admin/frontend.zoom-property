import { Icon } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/data/people";
import { telHref, whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

export interface AdvisorCardDict {
  heading: string;
  note: string;
  call: string;
  whatsapp: string;
  /** "Replies in ~{minutes} min". */
  respondsIn: string;
  /** "{count} deals closed". */
  deals: string;
}

/**
 * The person to call, in a rail beside the listing.
 *
 * Shared by the property and the project pages: the two are the same decision
 * at different stages, and a buyer who has read either one is asking the same
 * question. One component means the answer never drifts between them.
 *
 * The face, the rating and the reply time are all here because they are what
 * makes a stranger dial: a name and a number alone read as a switchboard.
 */
export function AdvisorCard({
  agent,
  dict,
  phone,
  whatsapp,
  className,
}: {
  agent: Agent;
  dict: AdvisorCardDict;
  /** The desk number, from the CMS — not the advisor's own line. */
  phone: string;
  whatsapp: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <span className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {dict.heading}
      </span>

      <div className="flex items-center gap-4">
        <div className="size-16 shrink-0">
          <ImageFrame
            src={agent.image}
            alt={agent.name}
            ratio="square"
            rounded="full"
            sizes="64px"
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate font-heading text-base font-bold text-foreground">
            {agent.name}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {agent.role}
          </span>
          <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="star" size="xs" className="text-brand" />
            {agent.rating} · {dict.deals.replace("{count}", String(agent.deals))}
          </span>
        </div>
      </div>

      <Text size="sm" className="text-muted-foreground">
        {dict.note}
      </Text>

      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <a href={telHref(phone)}>
            <Icon name="phone" size="xs" />
            {dict.call}
          </a>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full border-[#25D366]/50 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-xs font-bold"
        >
          <a
            href={whatsappHref(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size="xs" />
            {dict.whatsapp}
          </a>
        </Button>
      </div>

      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon name="clock" size="xs" />
        {dict.respondsIn.replace("{minutes}", String(agent.respondsIn))}
      </span>
    </div>
  );
}
