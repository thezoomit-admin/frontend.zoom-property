import { Icon } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { telHref, whatsappHref } from "@/lib/contact";

interface ConsultantCardProps {
  agent: Agent;
  locale?: Locale;
}

export function ConsultantCard({ agent, locale = "en" }: ConsultantCardProps) {
  const isBn = locale === "bn";
  const name = isBn && agent.nameBn ? agent.nameBn : agent.name;
  const role = isBn && agent.roleBn ? agent.roleBn : agent.role;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
      <Text
        size="sm"
        className="font-bold text-foreground mb-4 uppercase tracking-wider text-xs"
      >
        {isBn ? "আপনার পরামর্শক" : "Your Consultant"}
      </Text>

      <div className="flex items-center gap-4 mb-4">
        <ImageFrame
          src={agent.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80"}
          alt={name}
          ratio="square"
          sizes="64px"
          className="size-16 rounded-full object-cover shrink-0 ring-2 ring-primary/10"
        />
        <div className="flex flex-col">
          <Text size="base" className="font-bold text-foreground leading-tight">
            {name}
          </Text>
          <Text size="sm" className="text-muted-foreground mb-1">
            {role}
          </Text>
          {agent.rating && agent.deals ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon name="star" size="xs" className="text-amber-500 fill-amber-500" />
              <span>
                {agent.rating} · {isBn ? `${agent.deals}টি ডিল সম্পন্ন` : `${agent.deals} deals completed`}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <Text size="sm" className="text-muted-foreground mb-5 leading-relaxed">
        {isBn
          ? "পারমিট, পরিদর্শনের ছবি, বা এই সপ্তাহে সাইট ভিজিটের কথা জিজ্ঞেস করুন।"
          : "Ask about permits, inspection photos, or scheduling a site visit this week."}
      </Text>

      <div className="flex flex-col gap-2.5">
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 shadow-sm"
        >
          <a href={telHref(agent.phone)}>
            <Icon name="phone" size="sm" className="mr-2" />
            {isBn ? "কল করুন" : "Call"}
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="w-full font-bold h-11 border-[#25D366]/50 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-xs"
        >
          <a
            href={whatsappHref(agent.phone)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size="sm" className="mr-2" />
            {isBn ? "হোয়াটসঅ্যাপে মেসেজ" : "WhatsApp"}
          </a>
        </Button>
      </div>
    </div>
  );
}
