import "server-only";

import type { Locale } from "@/i18n/config";
import { landingHref } from "@/lib/landing";
import { isFacebookVideo, youtubeThumbnail, parseVideoId } from "@/lib/video";

import { mediaUrl } from "../../base-api";
import { LANDING_SECTIONS } from "./types";
import type {
  ApiLandingChrome,
  ApiProjectLanding,
  LandingChrome,
  LandingSectionKey,
  LandingShot,
  LandingView,
} from "./types";

const UI = {
  preview: { en: "Preview photo", bn: "ছবি দেখুন" },
  close: { en: "Close", bn: "বন্ধ করুন" },
  open: { en: "Open photo", bn: "ছবি খুলুন" },
  play: { en: "Play", bn: "চালান" },
  call: { en: "Call", bn: "কল" },
  whatsapp: { en: "WhatsApp", bn: "হোয়াটসঅ্যাপ" },
  mapOpen: { en: "Open in Maps", bn: "ম্যাপে খুলুন" },
  book: { en: "Book", bn: "বুক" },
  name: { en: "Full name", bn: "পূর্ণ নাম" },
  namePlaceholder: { en: "Your name", bn: "আপনার নাম" },
  phone: { en: "Phone", bn: "ফোন" },
  email: { en: "Email", bn: "ইমেইল" },
  plan: { en: "Project", bn: "প্রকল্প" },
  message: { en: "Message", bn: "বার্তা" },
  messagePlaceholder: {
    en: "Anything we should know?",
    bn: "আর কিছু জানাতে চাইলে লিখুন",
  },
  submit: { en: "Send request", bn: "অনুরোধ পাঠান" },
  submitting: { en: "Sending…", bn: "পাঠানো হচ্ছে…" },
  privacy: {
    en: "Your details stay with this project desk.",
    bn: "আপনার তথ্য শুধু এই প্রকল্পের ডেস্কে থাকবে।",
  },
  successTitle: { en: "Request received", bn: "অনুরোধ গৃহীত হয়েছে" },
  successBody: {
    en: "The desk will call you shortly.",
    bn: "ডেস্ক শিগগিরই আপনাকে কল করবে।",
  },
} as const;

type UiKey = keyof typeof UI;

function pick(locale: Locale, en?: string | null, bn?: string | null) {
  const preferred = locale === "bn" ? bn : en;
  const fallback = locale === "bn" ? en : bn;
  return String(preferred || fallback || "").trim();
}

function ui(
  locale: Locale,
  key: UiKey,
  en?: string | null,
  bn?: string | null,
) {
  return pick(locale, en, bn) || pick(locale, UI[key].en, UI[key].bn);
}

function visible(
  sections: ApiProjectLanding["sections"],
  key: LandingSectionKey,
) {
  return sections?.[key]?.visible !== false;
}

function shot(
  locale: Locale,
  image: unknown,
  labelEn?: string,
  labelBn?: string,
  hintEn?: string,
  hintBn?: string,
): LandingShot | null {
  const src = mediaUrl(image as never);
  if (!src) return null;
  const label = pick(locale, labelEn, labelBn);
  return {
    src,
    alt: label,
    label,
    hint: pick(locale, hintEn, hintBn),
  };
}

export function toLandingView(
  row: ApiProjectLanding,
  locale: Locale,
): LandingView {
  const hero = row.hero || {};
  const about = row.about || {};
  const residences = row.residences || {};
  const unit = residences.unit || {};
  const elevation = row.elevation || {};
  const films = row.films || {};
  const amenities = row.amenities || {};
  const gallery = row.gallery || {};
  const location = row.location || {};
  const process = row.process || {};
  const cta = row.cta || {};
  const reviews = row.reviews || {};
  const faq = row.faq || {};
  const enquire = row.enquire || {};
  const form = enquire.form || {};

  const title = pick(locale, hero.title, hero.titleBn);
  const projectName =
    title || pick(locale, row.project?.name, row.project?.nameBn);
  const phone = String(row.phonePrimary || "").trim();
  const phoneAlt = String(row.phoneSecondary || "").trim();
  const whatsapp = String(row.whatsapp || phone).trim();

  const residenceImages = (residences.images || [])
    .map((image, index) =>
      shot(locale, image, unit.name, unit.nameBn) ||
      (mediaUrl(image as never)
        ? {
            src: mediaUrl(image as never),
            alt: `${projectName} ${index + 1}`,
            label: pick(locale, unit.name, unit.nameBn),
          }
        : null),
    )
    .filter((item): item is LandingShot => Boolean(item?.src));

  const elevationViews = (elevation.views || [])
    .map((view) =>
      shot(locale, view.image, view.label, view.labelBn, view.hint, view.hintBn),
    )
    .filter((item): item is LandingShot => Boolean(item));

  const galleryShots = (gallery.shots || [])
    .map((item) => shot(locale, item.image, item.label, item.labelBn))
    .filter((item): item is LandingShot => Boolean(item));

  return {
    path: row.path,
    href: landingHref(row.path),
    phone,
    phoneAlt,
    whatsapp,
    facebookUrl: String(row.facebookUrl || "").trim(),
    metaTitle: pick(locale, row.metaTitle, row.metaTitleBn) || projectName,
    metaDescription:
      pick(locale, row.metaDescription, row.metaDescriptionBn) ||
      pick(locale, hero.lead, hero.leadBn),
    navEnquire: ui(locale, "book", row.navEnquire, row.navEnquireBn),
    source: String(enquire.source || projectName).trim(),
    projectName,
    sections: Object.fromEntries(
      LANDING_SECTIONS.map((key) => [key, visible(row.sections, key)]),
    ) as Record<LandingSectionKey, boolean>,
    hero: {
      image: mediaUrl(hero.image as never),
      badge: pick(locale, hero.badge, hero.badgeBn),
      handover: pick(locale, hero.handover, hero.handoverBn),
      eyebrow: pick(locale, hero.eyebrow, hero.eyebrowBn),
      title,
      lead: pick(locale, hero.lead, hero.leadBn),
      location: pick(locale, hero.location, hero.locationBn),
      ctaPrimary: pick(locale, hero.ctaPrimary, hero.ctaPrimaryBn),
      ctaSecondary: pick(locale, hero.ctaSecondary, hero.ctaSecondaryBn),
      stats: (hero.stats || [])
        .map((stat) => ({
          value: pick(locale, stat.value, stat.valueBn),
          label: pick(locale, stat.label, stat.labelBn),
          icon: String(stat.icon || "").trim(),
        }))
        .filter((stat) => stat.value || stat.label),
    },
    about: {
      image: mediaUrl(about.image as never),
      eyebrow: pick(locale, about.eyebrow, about.eyebrowBn),
      title: pick(locale, about.title, about.titleBn),
      body: pick(locale, about.body, about.bodyBn),
      points: (about.points || [])
        .map((point) => ({
          title: pick(locale, point.title, point.titleBn),
          body: pick(locale, point.body, point.bodyBn),
          icon: String(point.icon || "").trim(),
        }))
        .filter((point) => point.title || point.body),
    },
    residences: {
      images: residenceImages,
      eyebrow: pick(locale, residences.eyebrow, residences.eyebrowBn),
      title: pick(locale, residences.title, residences.titleBn),
      description: pick(locale, residences.description, residences.descriptionBn),
      featured: pick(locale, residences.featured, residences.featuredBn),
      cta: pick(locale, residences.cta, residences.ctaBn),
      preview: ui(locale, "preview", residences.preview, residences.previewBn),
      close: ui(locale, "close", residences.close, residences.closeBn),
      unit: {
        name: pick(locale, unit.name, unit.nameBn),
        beds: pick(locale, unit.beds, unit.bedsBn),
        baths: pick(locale, unit.baths, unit.bathsBn),
        size: pick(locale, unit.size, unit.sizeBn),
        price: pick(locale, unit.price, unit.priceBn),
        note: pick(locale, unit.note, unit.noteBn),
      },
      highlights: (residences.highlights || [])
        .map((item) => ({
          label: pick(locale, item.label, item.labelBn),
          value: pick(locale, item.value, item.valueBn),
          icon: String(item.icon || "").trim(),
        }))
        .filter((item) => item.label || item.value),
    },
    elevation: {
      eyebrow: pick(locale, elevation.eyebrow, elevation.eyebrowBn),
      title: pick(locale, elevation.title, elevation.titleBn),
      description: pick(locale, elevation.description, elevation.descriptionBn),
      preview: ui(locale, "preview", elevation.preview, elevation.previewBn),
      close: ui(locale, "close", elevation.close, elevation.closeBn),
      views: elevationViews,
    },
    films: {
      eyebrow: pick(locale, films.eyebrow, films.eyebrowBn),
      title: pick(locale, films.title, films.titleBn),
      description: pick(locale, films.description, films.descriptionBn),
      play: ui(locale, "play", films.play, films.playBn),
      items: (films.items || [])
        .map((item) => {
          const url = String(item.url || "").trim();
          if (!url) return null;
          const provider: "facebook" | "youtube" =
            item.provider || (isFacebookVideo(url) ? "facebook" : "youtube");
          const poster =
            mediaUrl(item.poster as never) ||
            (provider === "youtube"
              ? youtubeThumbnail(parseVideoId(url, "youtube"))
              : "");
          return {
            title: pick(locale, item.title, item.titleBn) || projectName,
            caption: pick(locale, item.caption, item.captionBn),
            url,
            poster,
            provider,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    },
    amenities: {
      eyebrow: pick(locale, amenities.eyebrow, amenities.eyebrowBn),
      title: pick(locale, amenities.title, amenities.titleBn),
      description: pick(locale, amenities.description, amenities.descriptionBn),
      items: (amenities.items || [])
        .map((item) => ({
          title: pick(locale, item.title, item.titleBn),
          body: pick(locale, item.body, item.bodyBn),
          icon: String(item.icon || "").trim(),
        }))
        .filter((item) => item.title || item.body),
    },
    gallery: {
      eyebrow: pick(locale, gallery.eyebrow, gallery.eyebrowBn),
      title: pick(locale, gallery.title, gallery.titleBn),
      open: ui(locale, "open", gallery.open, gallery.openBn),
      close: ui(locale, "close", gallery.close, gallery.closeBn),
      shots: galleryShots,
    },
    location: {
      eyebrow: pick(locale, location.eyebrow, location.eyebrowBn),
      title: pick(locale, location.title, location.titleBn),
      description: pick(locale, location.description, location.descriptionBn),
      mapOpen: ui(locale, "mapOpen", location.mapOpen, location.mapOpenBn),
      mapHint: pick(locale, location.mapHint, location.mapHintBn),
      mapEmbedUrl: String(location.mapEmbedUrl || "").trim(),
      mapLinkUrl: String(location.mapLinkUrl || "").trim(),
      facts: (location.facts || [])
        .map((fact) => ({
          label: pick(locale, fact.label, fact.labelBn),
          value: pick(locale, fact.value, fact.valueBn),
        }))
        .filter((fact) => fact.label || fact.value),
    },
    process: {
      eyebrow: pick(locale, process.eyebrow, process.eyebrowBn),
      title: pick(locale, process.title, process.titleBn),
      steps: (process.steps || [])
        .map((step) => ({
          title: pick(locale, step.title, step.titleBn),
          body: pick(locale, step.body, step.bodyBn),
        }))
        .filter((step) => step.title || step.body),
    },
    cta: {
      eyebrow: pick(locale, cta.eyebrow, cta.eyebrowBn),
      title: pick(locale, cta.title, cta.titleBn),
      description: pick(locale, cta.description, cta.descriptionBn),
      primary: pick(locale, cta.primary, cta.primaryBn),
      call: ui(locale, "call", cta.call, cta.callBn),
      whatsapp: ui(locale, "whatsapp", cta.whatsapp, cta.whatsappBn),
    },
    reviews: {
      eyebrow: pick(locale, reviews.eyebrow, reviews.eyebrowBn),
      title: pick(locale, reviews.title, reviews.titleBn),
      description: pick(locale, reviews.description, reviews.descriptionBn),
      play: ui(locale, "play", reviews.play, reviews.playBn),
      close: ui(locale, "close", reviews.close, reviews.closeBn),
      items: (reviews.items || [])
        .map((item) => ({
          name: pick(locale, item.name, item.nameBn),
          role: pick(locale, item.role, item.roleBn),
          quote: pick(locale, item.quote, item.quoteBn),
          avatar: mediaUrl(item.avatar as never),
          poster: mediaUrl(item.poster as never),
          videoUrl: String(item.videoUrl || "").trim(),
        }))
        .filter(
          (item) => item.name || item.quote || item.videoUrl || item.poster,
        ),
    },
    faq: {
      eyebrow: pick(locale, faq.eyebrow, faq.eyebrowBn),
      title: pick(locale, faq.title, faq.titleBn),
      description: pick(locale, faq.description, faq.descriptionBn),
      items: (faq.items || [])
        .map((item) => ({
          question: pick(locale, item.question, item.questionBn),
          answer: pick(locale, item.answer, item.answerBn),
        }))
        .filter((item) => item.question || item.answer),
    },
    enquire: {
      eyebrow: pick(locale, enquire.eyebrow, enquire.eyebrowBn),
      title: pick(locale, enquire.title, enquire.titleBn),
      description: pick(locale, enquire.description, enquire.descriptionBn),
      phoneLabel: ui(locale, "call", enquire.phoneLabel, enquire.phoneLabelBn),
      whatsappLabel: ui(
        locale,
        "whatsapp",
        enquire.whatsappLabel,
        enquire.whatsappLabelBn,
      ),
      form: {
        name: ui(locale, "name", form.name, form.nameBn),
        namePlaceholder: ui(
          locale,
          "namePlaceholder",
          form.namePlaceholder,
          form.namePlaceholderBn,
        ),
        phone: ui(locale, "phone", form.phone, form.phoneBn),
        email: ui(locale, "email", form.email, form.emailBn),
        plan: ui(locale, "plan", form.plan, form.planBn),
        message: ui(locale, "message", form.message, form.messageBn),
        messagePlaceholder: ui(
          locale,
          "messagePlaceholder",
          form.messagePlaceholder,
          form.messagePlaceholderBn,
        ),
        submit: ui(locale, "submit", form.submit, form.submitBn),
        submitting: ui(locale, "submitting", form.submitting, form.submittingBn),
        privacy: ui(locale, "privacy", form.privacy, form.privacyBn),
        successTitle: ui(
          locale,
          "successTitle",
          form.successTitle,
          form.successTitleBn,
        ),
        successBody: ui(
          locale,
          "successBody",
          form.successBody,
          form.successBodyBn,
        ),
      },
    },
  };
}

export function toLandingChrome(
  row: ApiLandingChrome,
  locale: Locale,
): LandingChrome {
  return {
    path: row.path,
    href: landingHref(row.path),
    phone: String(row.phonePrimary || "").trim(),
    phoneAlt: String(row.phoneSecondary || "").trim(),
    whatsapp: String(row.whatsapp || row.phonePrimary || "").trim(),
    facebookUrl: String(row.facebookUrl || "").trim(),
    name: pick(locale, row.hero?.title, row.hero?.titleBn),
    location: pick(locale, row.hero?.location, row.hero?.locationBn),
    ctaLabel: ui(
      locale,
      "book",
      row.navEnquire || row.cta?.primary,
      row.navEnquireBn || row.cta?.primaryBn,
    ),
    phoneLabel: ui(
      locale,
      "call",
      row.enquire?.phoneLabel,
      row.enquire?.phoneLabelBn,
    ),
    whatsappLabel: ui(
      locale,
      "whatsapp",
      row.enquire?.whatsappLabel,
      row.enquire?.whatsappLabelBn,
    ),
  };
}
