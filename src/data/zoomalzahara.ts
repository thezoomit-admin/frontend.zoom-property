import type { IconName } from "@/components/common/icon";

export const ZOOM_AL_ZAHARA_PATH = "/zoomalzahara";

export const ZOOM_AL_ZAHARA_FACEBOOK = "https://www.facebook.com/zoompropertyltd";

export const ZOOM_AL_ZAHARA_PHONES = {
  primary: "01711-250406",
  secondary: "01711-250407",
} as const;

const photo = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ZOOM_AL_ZAHARA_HERO = photo("photo-1600585154340-be6161a56a0c", 2400);

export const ZOOM_AL_ZAHARA_ABOUT = photo("photo-1439066615861-d1af74d74000", 1600);

export const ZOOM_AL_ZAHARA_RESIDENCE = photo("photo-1600585154340-be6161a56a0c", 1600);

export const ZOOM_AL_ZAHARA_STAT_ICONS: IconName[] = [
  "area",
  "layers",
  "building",
  "bed",
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
    src: photo("photo-1464146072230-91cabc968346"),
    alt: "Approach elevation from the road",
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
  "location",
  "area",
  "shield",
  "users",
  "approved",
  "building",
];

export const ZOOM_AL_ZAHARA_MAP_EMBED =
  "https://maps.google.com/maps?q=Basila%20Garden%20City%20Mohammadpur%20Dhaka&hl=en&z=16&output=embed";
