import { CallChime } from "@/components/layout/call-chime";
import { Icon } from "@/components/common/icon";
import { getDictionary } from "@/i18n/dictionaries";
import { dockLinks } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

/**
 * The three ways to reach a person, parked on the right edge of every page.
 *
 * A property site is read the whole way down and the decision to call happens
 * anywhere in it — usually two screens away from the header and four from the
 * footer. This keeps the phone, WhatsApp and email one click from wherever that
 * happens, without a chat bubble that opens over the page uninvited.
 *
 * Icons only, with the channel name on `aria-label` and `title`: the strip is
 * three of the most recognisable glyphs there are, and a printed word next to
 * each turned a quiet edge tab into a panel. Screen readers still hear the full
 * name, and a mouse held still gets it as a tooltip.
 *
 * Every cell is primary with a white icon — one brand strip, not three muted
 * glyphs — except WhatsApp, which wears its own green so it reads as the app
 * people already know, and keeps it on hover. The primary cells darken
 * slightly on hover so the press still has a response.
 *
 * The call cell rings. Three cells that all sit still make the most valuable
 * one no easier to find than the other two, so the handset rocks — for about
 * a second in every four, on one shared cycle, and never while a pointer is
 * on it. Continuous movement would read as an advert; a beat of it every few
 * seconds reads as a phone.
 *
 * `CallChime` gives that first minute a sound as well, once per tab. It is the
 * only client code in here.
 *
 * Plain `<a href>` — `tel:`, `https://wa.me/…`, `mailto:` — so the phone dials,
 * WhatsApp opens, and the mail client gets the address. No state, no client
 * bundle: it is a server component.
 *
 * It is vertically centred rather than bottom-anchored: `ScrollToTop` already
 * owns the bottom-right corner, and two floating controls fighting for the same
 * 60 pixels is how a page ends up with a button nobody can press.
 */
export async function ContactDock() {
  const dict = await getDictionary();
  const links = dockLinks(dict.contact.dock);

  // Nothing to reach us on, nothing to draw. A tab with no cells in it is a
  // white sliver stuck to the edge of every page.
  if (!links.length) return null;

  // Only the first cell rings, and only when it is a telephone. Two ringing
  // icons is noise, and a ringing envelope is nonsense.
  const ringAt = links.findIndex((link) => link.href.startsWith("tel:"));

  // Icons come from the CMS as a keyword, a FontAwesome class or a whole
  // `<i>` tag, so match on either the icon or the wa.me link.
  const isWhatsapp = (link?: (typeof links)[number]) =>
    !!link && /whatsapp|wa\.me/i.test(`${link.icon} ${link.href}`);

  // WhatsApp gets its own green, rounded tile — the colour people already know
  // from their phone — and keeps it on hover. Everything else stays on the
  // primary strip.
  const tileClass = (link?: (typeof links)[number]) =>
    isWhatsapp(link) ? "rounded-lg bg-[#25D366]" : undefined;

  return (
    <nav
      aria-label={dict.nav.contact}
      // Flush to the edge, so the border runs top, left and bottom — there is
      // no right edge to draw, it is off the screen. Primary fill on the strip
      // itself so rounded corners never flash the page behind.
      className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-l-lg border border-r-0 border-primary bg-primary shadow-[-8px_0_28px_-14px] shadow-foreground/40 lg:flex"
    >
      <CallChime />

      {links.map((link, index) => {
        const ring = index === ringAt;
        // Anything that leaves the site opens in its own tab; `tel:` and
        // `mailto:` hand off to an app and must not.
        const external = /^https?:/i.test(link.href);
        const whatsapp = isWhatsapp(link);
        const tile = tileClass(link);
        // Hairline between cells, except either side of a rounded tile — a
        // line cutting into its corners looks like a seam.
        const next = links[index + 1];
        const divider = next && !tile && !tileClass(next);

        return (
          <a
            key={link.href}
            href={link.href}
            aria-label={link.label || undefined}
            title={link.label || undefined}
            {...(external ? { target: "_blank", rel: "noreferrer" } : undefined)}
            className={cn(
              "group relative flex size-12 items-center justify-center text-white transition-colors focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-white",
              tile ?? "bg-primary hover:bg-primary/90",
              divider && "border-b border-white/25",
            )}
          >
            <span
              className={cn(
                "relative z-10",
                ring &&
                  "animate-(--animate-phone-ring) group-hover:animate-none motion-reduce:animate-none",
              )}
            >
              <Icon
                name={link.icon}
                size={whatsapp ? "lg" : "md"}
                className="text-white"
              />
            </span>
          </a>
        );
      })}
    </nav>
  );
}
