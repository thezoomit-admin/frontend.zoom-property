/**
 * Under-construction developments with live progress transparency.
 * Surpasses BTI & D-Premium Homes by showing milestone breakdown,
 * inspection stamps, and live CCTV feed verification status.
 */

export interface ConstructionMilestone {
  label: string;
  percent: number;
  completed: boolean;
}

export interface Agent {
  id: string;
  name: string;
  nameBn?: string;
  role: string;
  roleBn?: string;
  phone: string;
  image?: string;
  rating?: number;
  deals?: number;
  respondsIn?: number;
  languages?: string[];
}

export interface Project {
  id: string;
  /** URL segment for `/projects/[slug]`. */
  slug: string;
  name: string;
  nameBn?: string;
  area: string;
  /** The sub-area's own id, when the project has one — lets an area detail
   * page group a single bulk fetch by sub-area instead of firing one request
   * per sub-area. */
  subAreaRefId?: string;
  city: string;
  /** Completion, 0–100. */
  progress: number;
  handover: string;
  units: number;
  unitsLeft: number;
  sizeRange: string;
  startingPrice: number;
  /** Card image, and the first frame of the detail page's banner. */
  image: string;
  /**
   * The rest of the set: site photographs and the developer's renders, in the
   * order the banner shows them. `image` is repeated as the first entry so the
   * card and the banner always open on the same frame.
   */
  images: string[];
  /** The long write-up on the project page, one string per paragraph. */
  description: string[];
  descriptionBn?: string[];
  /**
   * The site walkthrough. Filmed on the visit that produced `lastInspected`,
   * so the footage and the percentages above it describe the same day.
   */
  video: {
    title: string;
    titleBn: string;
    youtubeUrl: string;
    poster: string;
    duration: string;
  };
  /** Build stage, as the panel names it. */
  status: "Planning" | "Processing" | "Completed";
  isFooter?: boolean;
  mapUrl?: string;
  lastInspected: string;
  cctvStreamActive: boolean;
  rajukPermitNo: string;
  milestones: ConstructionMilestone[];
  agent?: Agent;
}

const photo = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projects: Project[] = [
  {
    id: "the-quay",
    slug: "the-quay-residences-gulshan-lakefront",
    name: "The Quay Residences",
    area: "Gulshan 2 (Lakefront)",
    city: "Dhaka",
    progress: 84,
    handover: "Jun 2027",
    units: 24,
    unitsLeft: 4,
    sizeRange: "3,200 – 4,400 sq ft",
    startingPrice: 48_000_000,
    image: photo("photo-1545324418-cc1a3fa10c00"),
    images: [
      photo("photo-1545324418-cc1a3fa10c00"),
      photo("photo-1600607687920-4e2a09cf159d"),
      photo("photo-1600566753190-17f0baa2a6c3"),
      photo("photo-1512917774080-9991f1c4c750"),
      photo("photo-1523217582562-09d0def993a6"),
    ],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5983460988937!2d90.41285091536341!3d23.79731309289659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70b80fcbf27%3A0xc3466f28bbaefda!2sBaridhara%20Diplomatic%20Zone%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1689253456789!5m2!1sen!2sbd",
    description: [
      "Twenty-four apartments on the Gulshan 2 lakefront, of which four are still unsold. Every floor plate is a single residence between 3,200 and 4,400 square feet, so there is one front door per level and no shared landing — the arrangement buyers at this end of the market ask for first and the one most towers on this lake cannot offer.",
      "The building is in finishing. The piling went 110 feet and is signed off, the structure and the basement are complete, MEP and fire systems are at 85 per cent, and the interior marble and glazing is a little over half done. That is the honest position as of the September 2026 inspection, not a projection: the percentages here move when a surveyor has been on site, not when a sales target slips.",
      "Handover is June 2027 and the payment schedule is tied to the milestones above rather than to calendar dates — nothing falls due for a stage that has not been reached. The RAJUK permit is RAJUK/EM/2023/1842 and a copy goes to any buyer who asks, before a booking, along with the approved plan set.",
    ],
    video: {
      title: "Finishing stage walkthrough — September 2026",
      titleBn: "ফিনিশিং পর্যায়ের ওয়াকথ্রু — সেপ্টেম্বর ২০২৬",
      youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
      poster: photo("photo-1545324418-cc1a3fa10c00", 1200),
      duration: "04:18",
    },
    status: "Processing",
    lastInspected: "Sep 2026",
    cctvStreamActive: true,
    rajukPermitNo: "RAJUK/EM/2023/1842",
    milestones: [
      { label: "Deep Piling (110 ft)", percent: 100, completed: true },
      { label: "Basement & Structure", percent: 100, completed: true },
      { label: "MEP & Fire Systems", percent: 85, completed: false },
      { label: "Interior Marble & Glass", percent: 55, completed: false },
    ],
  },
  {
    id: "aurora-heights",
    slug: "aurora-heights-diplomatic-baridhara",
    name: "Aurora Heights Diplomatic",
    area: "Baridhara Diplomatic",
    city: "Dhaka",
    progress: 62,
    handover: "Dec 2027",
    units: 18,
    unitsLeft: 6,
    sizeRange: "3,800 – 5,600 sq ft",
    startingPrice: 62_000_000,
    image: photo("photo-1600596542815-ffad4c1539a9"),
    images: [
      photo("photo-1600596542815-ffad4c1539a9"),
      photo("photo-1600585154340-be6161a56a0c"),
      photo("photo-1600210492493-0946911123ea"),
      photo("photo-1518770660439-4636190af475"),
      photo("photo-1541339907198-e08756dedf3f"),
    ],
    description: [
      "Eighteen residences inside the Baridhara diplomatic zone, 3,800 to 5,600 square feet, six of them still available. The plan puts two apartments per floor at the lower levels and one at the top four, which is where the largest units and the terraces are.",
      "The frame is up to the fourteenth storey and the curtain wall glazing is 40 per cent installed; the smart automation fit-out has only just started at 15 per cent. Piling and the raft are complete and signed off. Structure work of this kind is where a development either keeps its handover date or quietly loses it, which is why the stage is inspected monthly and photographed rather than reported.",
      "Handover is December 2027. The address is inside the diplomatic cordon, so security, road access and utility reliability are all a step above the rest of Baridhara — the reason resale and rental demand here stays firm through the cycles that soften everywhere else in the city.",
    ],
    video: {
      title: "Structure and glazing inspection — August 2026",
      titleBn: "স্ট্রাকচার ও গ্লেজিং পরিদর্শন — আগস্ট ২০২৬",
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      poster: photo("photo-1600596542815-ffad4c1539a9", 1200),
      duration: "03:45",
    },
    status: "Processing",
    lastInspected: "Aug 2026",
    cctvStreamActive: true,
    rajukPermitNo: "RAJUK/DP/2024/0912",
    milestones: [
      { label: "Deep Piling & Raft", percent: 100, completed: true },
      { label: "14-Storey RCC Frame", percent: 80, completed: false },
      { label: "Curtain Wall Glazing", percent: 40, completed: false },
      { label: "Smart Automation Fitout", percent: 15, completed: false },
    ],
  },
  {
    id: "aster-green",
    slug: "aster-green-eco-suites-bashundhara",
    name: "Aster Green Eco-Suites",
    area: "Bashundhara Block I",
    city: "Dhaka",
    progress: 32,
    handover: "Dec 2028",
    units: 56,
    unitsLeft: 31,
    sizeRange: "1,850 – 2,400 sq ft",
    startingPrice: 16_500_000,
    image: photo("photo-1517245386807-bb43f82c33c4"),
    images: [
      photo("photo-1517245386807-bb43f82c33c4"),
      photo("photo-1580489944761-15a19d654956"),
      photo("photo-1600047509807-ba8f99d2cdde"),
      photo("photo-1502005229762-cf1b2da7c5d6"),
      photo("photo-1560448204-e02f11c3d0e2"),
    ],
    description: [
      "Fifty-six apartments in Bashundhara Block I, from 1,850 to 2,400 square feet, with thirty-one still available. It is the entry point into a new building in this part of the city: the starting price is a little over a crore and a half, and the sizes are aimed at families moving out of an older three-bedroom rather than at investors.",
      "The project is at the earliest stage on this list. Soil treatment and piling are 95 per cent done, the substructure and raft are 20 per cent in, and nothing above ground has started. Buying now means the longest wait and the lowest price — and, more usefully, the ability to specify the finishing schedule before it is fixed.",
      "Handover is December 2028 under permit RAJUK/BS/2024/3104. Block I is the quieter, later-planned end of Bashundhara with wider internal roads and no through traffic, and the site is on the live CCTV feed, so progress can be checked without waiting for the monthly report.",
    ],
    video: {
      title: "Piling and soil treatment — September 2026",
      titleBn: "পাইলিং ও মাটি পরীক্ষা — সেপ্টেম্বর ২০২৬",
      youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      poster: photo("photo-1517245386807-bb43f82c33c4", 1200),
      duration: "05:02",
    },
    status: "Planning",
    lastInspected: "Sep 2026",
    cctvStreamActive: true,
    rajukPermitNo: "RAJUK/BS/2024/3104",
    milestones: [
      { label: "Soil Treatment & Piling", percent: 95, completed: false },
      { label: "Substructure & Raft", percent: 20, completed: false },
      { label: "Superstructure Frame", percent: 0, completed: false },
      { label: "Finishing & Landscaping", percent: 0, completed: false },
    ],
  },
];

/** One project by its slug — the URL segment, not the id. */
export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

/** The rest of the portfolio, for the row at the foot of a project page. */
export function otherProjects(project: Project) {
  return projects.filter((other) => other.id !== project.id);
}
