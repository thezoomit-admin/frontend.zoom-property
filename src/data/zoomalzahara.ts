import type { IconName } from "@/components/common/icon";

export const ZOOM_AL_ZAHARA_PATH = "/zoomalzahara";

export const ZOOM_AL_ZAHARA_FACEBOOK = "https://www.facebook.com/zoompropertyltd";

export const ZOOM_AL_ZAHARA_PHONES = {
  primary: "01711-250406",
  secondary: "01711-250407",
} as const;

const photo = (id: string, w = 1920) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90`;

export const ZOOM_AL_ZAHARA_HERO = photo("photo-1600585154340-be6161a56a0c", 2400);

export const ZOOM_AL_ZAHARA_ABOUT = photo("photo-1439066615861-d1af74d74000", 1920);

export const ZOOM_AL_ZAHARA_RESIDENCE = photo("photo-1600585154340-be6161a56a0c", 1920);

export const ZOOM_AL_ZAHARA_STAT_ICONS: IconName[] = [
  "fa-solid fa-ruler-combined",
  "fa-solid fa-layer-group",
  "fa-solid fa-building",
  "fa-solid fa-bed",
];

export const ZOOM_AL_ZAHARA_ABOUT_ICONS: IconName[] = [
  "fa-solid fa-handshake",
  "fa-solid fa-clone",
  '<i class="fa-solid fa-water"></i>',
];

export const ZOOM_AL_ZAHARA_ELEVATIONS = [
  {
    src: photo("photo-1545324418-cc1a3fa10c00"),
    alt: "Front elevation of the G+9 block",
  },
  {
    src: photo("photo-1487958449943-2429e8be8625"),
    alt: "Lake elevation of Zoom Al-Zahra",
  },
  {
    src: photo("photo-1600596542815-ffad4c1539a9"),
    alt: "Approach elevation from the road",
  },
  {
    src: photo("photo-1613490493576-7fde63acd811"),
    alt: "Side elevation of the block",
  },
  {
    src: photo("photo-1479839672679-a46483c0e7c8"),
    alt: "Street massing of the G+9",
  },
  {
    src: photo("photo-1486325212027-8081e485255e"),
    alt: "Dusk facade of Zoom Al-Zahra",
  },
] as const;

const face = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=90`;

export const ZOOM_AL_ZAHARA_REVIEWS = [
  {
    image: face("photo-1507003211169-0a1dd7228f2d"),
    poster: photo("photo-1545324418-cc1a3fa10c00", 900),
    video: "https://www.facebook.com/reel/1633768221804628",
  },
  {
    image: face("photo-1580489944761-15a19d654956"),
    poster: photo("photo-1439066615861-d1af74d74000", 900),
    video: "https://www.facebook.com/reel/1410572034383190",
  },
  {
    image: face("photo-1560250097-0b93528c311a"),
    poster: photo("photo-1487958449943-2429e8be8625", 900),
    video: "https://www.facebook.com/reel/1751522772664278",
  },
  {
    image: face("photo-1573496359142-b8d87734a5a2"),
    poster: photo("photo-1600596542815-ffad4c1539a9", 900),
    video: "https://www.facebook.com/reel/29210395125215493",
  },
] as const;

export const ZOOM_AL_ZAHARA_FILMS = [
  {
    provider: "facebook" as const,
    url: "https://www.facebook.com/reel/1633768221804628",
  },
  {
    provider: "facebook" as const,
    url: "https://www.facebook.com/reel/29210395125215493",
  },
  {
    provider: "facebook" as const,
    url: "https://www.facebook.com/reel/1410572034383190",
  },
  {
    provider: "facebook" as const,
    url: "https://www.facebook.com/reel/1751522772664278",
  },
];

export const ZOOM_AL_ZAHARA_GALLERY = [
  {
    src: photo("photo-1600607687939-ce8a6c25118c"),
    alt: "Drawing and dining in one line",
  },
  {
    src: photo("photo-1600566753086-00f18fb6b3ea"),
    alt: "Kitchen of the 4-bed plan",
  },
  {
    src: photo("photo-1600210492486-724fe5c67fb0"),
    alt: "Bedroom with balcony light",
  },
  {
    src: photo("photo-1600585154526-990dced4db0d"),
    alt: "Living room toward the lake",
  },
  {
    src: photo("photo-1582407947304-fd86f028f716"),
    alt: "Approach road to the plot",
  },
  {
    src: photo("photo-1560448204-e02f11c3d0e2"),
    alt: "Bathroom with daylight",
  },
] as const;

export const ZOOM_AL_ZAHARA_AMENITY_ICONS: IconName[] = [
  "fa-solid fa-water",
  "fa-solid fa-road",
  "fa-solid fa-hospital",
  "fa-solid fa-school",
  "fa-solid fa-basket-shopping",
  '<i class="fa-solid fa-mosque"></i>',
];

export const ZOOM_AL_ZAHARA_MAP_EMBED =
  "https://maps.google.com/maps?q=Basila%20Garden%20City%20Mohammadpur%20Dhaka&hl=en&z=16&output=embed";
