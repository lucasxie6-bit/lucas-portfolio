import { getProjectBySlug } from "@/data/projects";

export type CoverFont = "archivo" | "bungee" | "serif" | "mono";

export interface Track {
  label: string;
  href?: string;
}

export interface Album {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  bg: string;
  fg: string;
  dot: string;
  font: CoverFont;
  coverTitle: string;
  coverSize: number;
  coverItalic?: boolean;
  sticker: string;
  tracks: Track[];
  cta: string;
  href?: string;
}

const EMAIL = "mailto:lucas.xie6@gmail.com";

const flash =
  "radial-gradient(ellipse 48% 42% at 50% 40%, #FFFFFF 0%, #F1DED3 18%, #C38877 44%, #3A2A2C 74%, #0F0B0D 100%)";

const plain = (labels: string[]): Track[] => labels.map((label) => ({ label }));

function caseStudyTracks(slug: string): Track[] {
  const project = getProjectBySlug(slug);
  if (!project) return [];
  return project.sections.map((s) => ({ label: s.title, href: `/work/${slug}#${s.id}` }));
}

export const albums: Album[] = [
  {
    slug: "useno",
    name: "Useno",
    kind: "Startup",
    year: "2026",
    line: "Internship discovery and application tracking, in one place.",
    bg: "#4B4FD8",
    fg: "#FFFFFF",
    dot: "#FFFFFF",
    font: "archivo",
    coverTitle: "useno",
    coverSize: 78,
    sticker: "Lead\nsingle",
    tracks: caseStudyTracks("useno"),
    cta: "Play — see the project",
    href: "/work/useno",
  },
  {
    slug: "sponty",
    name: "Sponty",
    kind: "Case study",
    year: "2026",
    line: "Spontaneous hangouts in three taps.",
    bg: "#FF7A59",
    fg: "#1C191B",
    dot: "#1C191B",
    font: "archivo",
    coverTitle: "three\ntaps.",
    coverSize: 74,
    sticker: "New!",
    tracks: caseStudyTracks("sponty"),
    cta: "Play — read the case study",
    href: "/work/sponty",
  },
  {
    slug: "grove",
    name: "Grove",
    kind: "Case study",
    year: "2026",
    line: "Turning everyday receipts into small, doable steps toward less waste.",
    bg: "#5E8A63",
    fg: "#F6F3EC",
    dot: "#F6F3EC",
    font: "serif",
    coverTitle: "less waste,\nsmall steps",
    coverSize: 58,
    coverItalic: true,
    sticker: "Eco\nedition",
    tracks: caseStudyTracks("grove"),
    cta: "Play — read the case study",
    href: "/work/grove",
  },
  {
    slug: "spark",
    name: "Spark",
    kind: "Case study",
    year: "2026",
    line: "Earn the answer. Build the thinking.",
    bg: "#F5D547",
    fg: "#1C191B",
    dot: "#1C191B",
    font: "archivo",
    coverTitle: "EARN\nTHE\nANSWER",
    coverSize: 64,
    sticker: "Deluxe",
    tracks: caseStudyTracks("spark"),
    cta: "Play — read the case study",
    href: "/work/spark",
  },
  {
    slug: "alvarez",
    name: "Alvarez",
    kind: "Brand project",
    year: "2024",
    line: "Brand and storefront direction for an apparel label.",
    bg: "#1C191B",
    fg: "#F6F3EC",
    dot: "#F6F3EC",
    font: "serif",
    coverTitle: "Alvarez",
    coverSize: 84,
    sticker: "Vintage",
    tracks: caseStudyTracks("alvarez"),
    cta: "Play — see the project",
    href: "/work/alvarez",
  },
  {
    slug: "scan-o-matic",
    name: "Scan-O-Matic",
    kind: "Lab experiment",
    year: "2026",
    line: "A very cheap barcode scanner that lets you into my website.",
    bg: "#F5D000",
    fg: "#1C191B",
    dot: "#FF5FB4",
    font: "bungee",
    coverTitle: "SCAN-O-\nMATIC\n3000",
    coverSize: 52,
    sticker: "$4.99",
    tracks: plain(["Pull the trigger", "Beep", "Access granted", "No refunds"]),
    cta: "Play — try it",
  },
  {
    slug: "the-underworld",
    name: "The underworld",
    kind: "Lab experiment",
    year: "2026",
    line: "What happens when a pool keeps going below the fold.",
    bg: "#83C8C4",
    fg: "#1C191B",
    dot: "#1C191B",
    font: "serif",
    coverTitle: "the\nunderworld",
    coverSize: 64,
    coverItalic: true,
    sticker: "B-side",
    tracks: plain(["The pool", "The edge", "The fall", "Down here"]),
    cta: "Play — try it",
  },
  {
    slug: "camera-roll",
    name: "Camera roll",
    kind: "Photos",
    year: "2026",
    line: "Flash photos of friends, campus and things I probably should have thrown out.",
    bg: flash,
    fg: "#F6F3EC",
    dot: "#F6F3EC",
    font: "mono",
    coverTitle: "[placeholder —\nflash photo]",
    coverSize: 18,
    sticker: "Live!",
    tracks: plain(["Me, 2am", "Friends", "Kingston", "Summer", "The desk"]),
    cta: "Play — open the roll",
  },
  {
    slug: "about",
    name: "About me",
    kind: "Liner notes",
    year: "2026",
    line: "More about me than you probably asked for.",
    bg: "#E7B2C4",
    fg: "#1C191B",
    dot: "#1C191B",
    font: "serif",
    coverTitle: "liner\nnotes",
    coverSize: 74,
    coverItalic: true,
    sticker: "Bonus",
    tracks: plain(["Who I am", "What I make", "Things I like a little too much", "Currently"]),
    cta: "Play — read the liner notes",
    href: "/about",
  },
  {
    slug: "say-hi",
    name: "Say hi",
    kind: "Contact",
    year: "2026",
    line: "Open to startup opportunities and good conversations.",
    bg: "#D9263D",
    fg: "#FFFFFF",
    dot: "#FFFFFF",
    font: "archivo",
    coverTitle: "hi.",
    coverSize: 140,
    sticker: "Call\nme",
    tracks: [
      { label: "Email", href: EMAIL },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lucas-xie-630238244" },
      { label: "GitHub", href: "https://github.com/lucasxie6-bit" },
    ],
    cta: "Play — say hi",
    href: EMAIL,
  },
  {
    slug: "unreleased",
    name: "???",
    kind: "Unreleased",
    year: "TBA",
    line: "Currently in the studio.",
    bg: "#8C8A85",
    fg: "#F6F3EC",
    dot: "#F6F3EC",
    font: "archivo",
    coverTitle: "???",
    coverSize: 110,
    sticker: "Soon",
    tracks: plain(["[untitled]"]),
    cta: "Play — not yet",
  },
];

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}
