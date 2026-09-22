import type { ComponentType } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns2,
  DoorOpen,
  Expand,
  FileCheck2,
  Footprints,
  HardHat,
  Heart,
  Images,
  Languages,
  Layers,
  KeyRound,
  LayoutGrid,
  Mail,
  MapPin,
  Menu,
  Moon,
  Pause,
  Phone,
  Play,
  Quote,
  Ruler,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sofa,
  Star,
  Sun,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { cn } from "@/lib/utils";

/**
 * One icon surface for the whole app.
 *
 * - UI icons come from `lucide-react` (the shadcn default, stroke based).
 * - Brand / social icons come from `react-icons/fa6` (Font Awesome 6).
 *
 * Registering them here keeps sizes, stroke weight and imports consistent, and
 * means a swap of icon set is a one-file change. Sizes are locked to the scale
 * below — do not pass raw `w-*`/`h-*` classes at call sites.
 */
export type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export const icons = {
  // Navigation & actions
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  close: X,
  menu: Menu,
  search: Search,
  filter: SlidersHorizontal,
  share: Share2,
  expand: Expand,
  grid: LayoutGrid,
  gallery: Images,
  heart: Heart,
  star: Star,
  quote: Quote,
  sparkles: Sparkles,
  shield: ShieldCheck,
  // Media
  play: Play,
  pause: Pause,
  volumeOn: Volume2,
  volumeOff: VolumeX,
  // Theme
  sun: Sun,
  moon: Moon,
  // Domain (property)
  bed: BedDouble,
  bath: Bath,
  area: Ruler,
  kitchen: UtensilsCrossed,
  balcony: DoorOpen,
  lift: ArrowUpDown,
  stairs: Footprints,
  split: Columns2,
  building: Building2,
  location: MapPin,
  calendar: CalendarDays,
  phone: Phone,
  mail: Mail,
  parking: Car,
  furnishing: Sofa,
  handover: KeyRound,
  construction: HardHat,
  approved: FileCheck2,
  layers: Layers,
  trend: TrendingUp,
  clock: Clock,
  users: Users,
  language: Languages,
  // Brands (Font Awesome 6)
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
} satisfies Record<string, IconComponent>;

export type IconName = keyof typeof icons | string;

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: { size: "sm" },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  /** Key from the registry above. */
  name?: IconName;
  /** Escape hatch: pass any icon component directly. */
  icon?: IconComponent;
  className?: string;
  /** Provide when the icon is the only content of a control. */
  label?: string;
}

export function Icon({ name, icon, size, className, label }: IconProps) {
  const Component = icon ?? (name ? icons[name as keyof typeof icons] : undefined);
  
  if (!Component) {
    if (typeof name === "string") {
      const trimmedName = name.trim();
      let faClasses = "";

      // Check if it's a full <i> tag: <i class="fa-solid fa-house"></i>
      const match = trimmedName.match(/<i[^>]*class(?:Name)?=["']([^"']+)["'][^>]*>/i);
      if (match) {
        faClasses = match[1];
      } else if (
        trimmedName.includes("fa-") || 
        trimmedName.startsWith("fas ") || 
        trimmedName.startsWith("far ") || 
        trimmedName.startsWith("fab ")
      ) {
        // Assume it's raw classes like "fa-solid fa-house"
        faClasses = trimmedName;
      }

      if (faClasses) {
        // Map iconVariants sizes to font sizes for FontAwesome
        const faSizeMap: Record<string, string> = {
          xs: "text-[14px]",
          sm: "text-[16px]",
          md: "text-[20px]",
          lg: "text-[24px]",
          xl: "text-[32px]",
        };
        const fontSizeClass = faSizeMap[size || "sm"];

        const faIcon = (
          <i
            className={cn(
              "shrink-0 leading-none",
              fontSizeClass,
              faClasses,
              className
            )}
            aria-hidden={label ? undefined : true}
          />
        );

        return label ? (
          <span role="img" aria-label={label} className="contents">
            {faIcon}
          </span>
        ) : (
          faIcon
        );
      }
    }
    return null;
  }

  const svg = (
    <Component
      className={cn(iconVariants({ size }), className)}
      aria-hidden={label ? undefined : true}
    />
  );

  return label ? (
    <span role="img" aria-label={label} className="contents">
      {svg}
    </span>
  ) : (
    svg
  );
}

export { iconVariants };
