import type { ApiMedia } from "../../base-api";

export const LANDING_SECTIONS = [
  "hero",
  "about",
  "residences",
  "elevation",
  "films",
  "amenities",
  "gallery",
  "location",
  "process",
  "cta",
  "reviews",
  "faq",
  "enquire",
] as const;

export type LandingSectionKey = (typeof LANDING_SECTIONS)[number];

export interface ApiLandingFlag {
  visible?: boolean;
}

export interface ApiLandingStat {
  value?: string;
  valueBn?: string;
  label?: string;
  labelBn?: string;
  icon?: string;
}

export interface ApiLandingPoint {
  title?: string;
  titleBn?: string;
  body?: string;
  bodyBn?: string;
  icon?: string;
}

export interface ApiLandingHighlight {
  label?: string;
  labelBn?: string;
  value?: string;
  valueBn?: string;
  icon?: string;
}

export interface ApiLandingView {
  label?: string;
  labelBn?: string;
  hint?: string;
  hintBn?: string;
  image?: ApiMedia | string | null;
}

export interface ApiLandingFilm {
  title?: string;
  titleBn?: string;
  caption?: string;
  captionBn?: string;
  url?: string;
  poster?: ApiMedia | string | null;
  provider?: "facebook" | "youtube";
}

export interface ApiLandingShot {
  label?: string;
  labelBn?: string;
  image?: ApiMedia | string | null;
}

export interface ApiLandingFact {
  label?: string;
  labelBn?: string;
  value?: string;
  valueBn?: string;
}

export interface ApiLandingStep {
  title?: string;
  titleBn?: string;
  body?: string;
  bodyBn?: string;
}

export interface ApiLandingReview {
  name?: string;
  nameBn?: string;
  role?: string;
  roleBn?: string;
  quote?: string;
  quoteBn?: string;
  avatar?: ApiMedia | string | null;
  poster?: ApiMedia | string | null;
  videoUrl?: string;
}

export interface ApiLandingFaq {
  question?: string;
  questionBn?: string;
  answer?: string;
  answerBn?: string;
}

export interface ApiProjectLanding {
  _id?: string;
  path: string;
  isActive?: boolean;
  facebookUrl?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  whatsapp?: string;
  metaTitle?: string;
  metaTitleBn?: string;
  metaDescription?: string;
  metaDescriptionBn?: string;
  navEnquire?: string;
  navEnquireBn?: string;
  sections?: Partial<Record<LandingSectionKey, ApiLandingFlag>>;
  hero?: {
    image?: ApiMedia | string | null;
    badge?: string;
    badgeBn?: string;
    handover?: string;
    handoverBn?: string;
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    lead?: string;
    leadBn?: string;
    location?: string;
    locationBn?: string;
    ctaPrimary?: string;
    ctaPrimaryBn?: string;
    ctaSecondary?: string;
    ctaSecondaryBn?: string;
    stats?: ApiLandingStat[];
  };
  about?: {
    image?: ApiMedia | string | null;
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    body?: string;
    bodyBn?: string;
    points?: ApiLandingPoint[];
  };
  residences?: {
    images?: Array<ApiMedia | string | null>;
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    featured?: string;
    featuredBn?: string;
    cta?: string;
    ctaBn?: string;
    preview?: string;
    previewBn?: string;
    close?: string;
    closeBn?: string;
    unit?: {
      name?: string;
      nameBn?: string;
      beds?: string;
      bedsBn?: string;
      baths?: string;
      bathsBn?: string;
      size?: string;
      sizeBn?: string;
      price?: string;
      priceBn?: string;
      note?: string;
      noteBn?: string;
    };
    highlights?: ApiLandingHighlight[];
  };
  elevation?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    preview?: string;
    previewBn?: string;
    close?: string;
    closeBn?: string;
    views?: ApiLandingView[];
  };
  films?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    play?: string;
    playBn?: string;
    items?: ApiLandingFilm[];
  };
  amenities?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    items?: ApiLandingPoint[];
  };
  gallery?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    open?: string;
    openBn?: string;
    close?: string;
    closeBn?: string;
    shots?: ApiLandingShot[];
  };
  location?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    mapOpen?: string;
    mapOpenBn?: string;
    mapHint?: string;
    mapHintBn?: string;
    mapEmbedUrl?: string;
    mapLinkUrl?: string;
    facts?: ApiLandingFact[];
  };
  process?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    steps?: ApiLandingStep[];
  };
  cta?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    primary?: string;
    primaryBn?: string;
    call?: string;
    callBn?: string;
    whatsapp?: string;
    whatsappBn?: string;
  };
  reviews?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    play?: string;
    playBn?: string;
    close?: string;
    closeBn?: string;
    items?: ApiLandingReview[];
  };
  faq?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    items?: ApiLandingFaq[];
  };
  enquire?: {
    eyebrow?: string;
    eyebrowBn?: string;
    title?: string;
    titleBn?: string;
    description?: string;
    descriptionBn?: string;
    phoneLabel?: string;
    phoneLabelBn?: string;
    whatsappLabel?: string;
    whatsappLabelBn?: string;
    source?: string;
    form?: {
      name?: string;
      nameBn?: string;
      namePlaceholder?: string;
      namePlaceholderBn?: string;
      phone?: string;
      phoneBn?: string;
      email?: string;
      emailBn?: string;
      plan?: string;
      planBn?: string;
      message?: string;
      messageBn?: string;
      messagePlaceholder?: string;
      messagePlaceholderBn?: string;
      submit?: string;
      submitBn?: string;
      submitting?: string;
      submittingBn?: string;
      privacy?: string;
      privacyBn?: string;
      successTitle?: string;
      successTitleBn?: string;
      successBody?: string;
      successBodyBn?: string;
    };
  };
  project?: { _id?: string; name?: string; nameBn?: string; slug?: string };
}

export interface ApiLandingChrome {
  path: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  whatsapp?: string;
  facebookUrl?: string;
  navEnquire?: string;
  navEnquireBn?: string;
  hero?: {
    title?: string;
    titleBn?: string;
    location?: string;
    locationBn?: string;
  };
  cta?: {
    primary?: string;
    primaryBn?: string;
  };
  enquire?: {
    phoneLabel?: string;
    phoneLabelBn?: string;
    whatsappLabel?: string;
    whatsappLabelBn?: string;
  };
}

export interface LandingShot {
  src: string;
  alt: string;
  label?: string;
  hint?: string;
}

export interface LandingView {
  path: string;
  href: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
  facebookUrl: string;
  metaTitle: string;
  metaDescription: string;
  navEnquire: string;
  source: string;
  projectName: string;
  sections: Record<LandingSectionKey, boolean>;
  hero: {
    image: string;
    badge: string;
    handover: string;
    eyebrow: string;
    title: string;
    lead: string;
    location: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: string; label: string; icon: string }[];
  };
  about: {
    image: string;
    eyebrow: string;
    title: string;
    body: string;
    points: { title: string; body: string; icon: string }[];
  };
  residences: {
    images: LandingShot[];
    eyebrow: string;
    title: string;
    description: string;
    featured: string;
    cta: string;
    preview: string;
    close: string;
    unit: {
      name: string;
      beds: string;
      baths: string;
      size: string;
      price: string;
      note: string;
    };
    highlights: { label: string; value: string; icon: string }[];
  };
  elevation: {
    eyebrow: string;
    title: string;
    description: string;
    preview: string;
    close: string;
    views: LandingShot[];
  };
  films: {
    eyebrow: string;
    title: string;
    description: string;
    play: string;
    items: {
      title: string;
      caption: string;
      url: string;
      poster: string;
      provider: "facebook" | "youtube";
    }[];
  };
  amenities: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; body: string; icon: string }[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    open: string;
    close: string;
    shots: LandingShot[];
  };
  location: {
    eyebrow: string;
    title: string;
    description: string;
    mapOpen: string;
    mapHint: string;
    mapEmbedUrl: string;
    mapLinkUrl: string;
    facts: { label: string; value: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    steps: { title: string; body: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primary: string;
    call: string;
    whatsapp: string;
  };
  reviews: {
    eyebrow: string;
    title: string;
    description: string;
    play: string;
    close: string;
    items: {
      name: string;
      role: string;
      quote: string;
      avatar: string;
      poster: string;
      videoUrl: string;
    }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    description: string;
    items: { question: string; answer: string }[];
  };
  enquire: {
    eyebrow: string;
    title: string;
    description: string;
    phoneLabel: string;
    whatsappLabel: string;
    form: {
      name: string;
      namePlaceholder: string;
      phone: string;
      email: string;
      plan: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      privacy: string;
      successTitle: string;
      successBody: string;
    };
  };
}

export interface LandingChrome {
  path: string;
  href: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
  facebookUrl: string;
  name: string;
  location: string;
  ctaLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
}
