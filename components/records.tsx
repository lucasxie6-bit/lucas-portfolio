// Record covers shared by the homepage grid and the CD rack pages.

const ARCHIVO = "var(--font-archivo), sans-serif";
const SERIF = "var(--font-instrument), serif";
const MONO = "var(--font-dm-mono), monospace";
export const INBOX = "lucas.xie6@gmail.com";
export const EMAIL = `mailto:${INBOX}`;

const flash = (x: string, y: string) =>
  `radial-gradient(ellipse 48% 42% at ${x} ${y}, #FFFFFF 0%, #F1DED3 18%, #C38877 44%, #3A2A2C 74%, #0F0B0D 100%)`;

const light = "rgba(255,255,255,0.18)";
const dark = "rgba(17,24,39,0.12)";
const paper = "rgba(243,244,246,0.9)";

export interface Item {
  name: string;
  kind: string;
  href: string;
  bg: string;
  fg: string;
  title: string;
  font: string;
  size: number;
  italic?: boolean;
  chipBg: string;
  chipFg: string;
  art?: "useno" | "sponty" | "alvarez" | "grove";
  disc?: string;
}

// Four-point sparkle with concave sides, as on the sponty cover.
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 43C50 46.4 53.6 50 57 50C53.6 50 50 53.6 50 57C50 53.6 46.4 50 43 50C46.4 50 50 46.4 50 43Z"
        transform="translate(50 50) scale(1.35) translate(-50 -50)"
        fill="#523A62"
      />
    </svg>
  );
}

export function CoverArt({ it }: { it: Item }) {
  if (it.art === "useno") return <UsenoMark className="w-full h-full" />;
  if (it.art === "sponty") return <Sparkle className="w-full h-full" />;
  if (it.art === "grove") {
    return (
      <span
        className="relative inline-block leading-none"
        style={{ fontFamily: "var(--font-fredoka), sans-serif", fontWeight: 700, fontStretch: "125%", letterSpacing: "-0.02em", color: "#EFE5D6" }}
      >
        <svg viewBox="-2 -2 82 101" aria-hidden="true" className="absolute" style={{ left: "30.5%", top: "-0.24em", width: "0.2em" }}>
          <path d="M0 0C40 5 80 40 78 97C35 92-3 55 0 0Z" fill="#7AAE58" />
        </svg>
        grove
      </span>
    );
  }
  if (it.art === "alvarez") {
    return (
      <span
        className="leading-none"
        style={{
          fontFamily: "var(--font-archivo-var), sans-serif",
          fontWeight: 800,
          fontStretch: "92%",
          letterSpacing: "-0.045em",
          color: "#2A2722",
        }}
      >
        alvarez
      </span>
    );
  }
  return <>{it.title}</>;
}

// The useno "U": two rounded strokes that curl in toward each other.
function UsenoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={9.3} strokeLinecap="round">
      <path d="M37.9 30.5V55C37.9 66 39.6 69.4 44.3 69.4" />
      <path d="M62.1 30.5V55C62.1 66 60.4 69.4 55.7 69.4" />
    </svg>
  );
}

export const items: Item[] = [
  { name: "useno", kind: "startup", href: "/work/useno", bg: "#1F3A5F", fg: "#FFFFFF", title: "useno", font: ARCHIVO, size: 48, chipBg: "#FFFFFF", chipFg: "#1F3A5F", art: "useno" },
  {
    name: "sponty",
    kind: "case study",
    href: "/work/sponty",
    bg: [
      "radial-gradient(at 0% 20%, #F8DCC8 0, transparent 45%)",
      "radial-gradient(at 50% 8%, #F3B6EE 0, transparent 50%)",
      "radial-gradient(at 100% 35%, #E7DFF8 0, transparent 50%)",
      "radial-gradient(at 75% 62%, #C3BBEE 0, transparent 48%)",
      "radial-gradient(at 15% 85%, #C69ACA 0, transparent 50%)",
      "radial-gradient(at 85% 100%, #9E9CBE 0, transparent 50%)",
      "#E8C4E4",
    ].join(", "),
    fg: "#FFFFFF",
    title: "",
    font: ARCHIVO,
    size: 44,
    chipBg: "rgba(255,255,255,0.5)",
    chipFg: "#523A62",
    art: "sponty",
    disc: "#E4B4E6",
  },
  { name: "camera roll", kind: "photos", href: "/play/camera-roll", bg: flash("50%", "40%"), fg: "#F3F4F6", title: "", font: MONO, size: 10, chipBg: paper, chipFg: "#111827" },
  { name: "grove", kind: "case study", href: "/work/grove", bg: "#3E2419", fg: "#EFE5D6", title: "grove", font: SERIF, size: 54, chipBg: "rgba(239,229,214,0.14)", chipFg: "#EFE5D6", art: "grove", disc: "#7AAE58" },
  { name: "spark", kind: "case study", href: "/work/spark", bg: "#F0EDE7", fg: "#3B2F6B", title: "spark", font: "var(--font-fraunces), serif", size: 62, italic: true, chipBg: "rgba(59,47,107,0.1)", chipFg: "#3B2F6B", disc: "#3B2F6B" },
  { name: "alvarez", kind: "brand", href: "/work/alvarez", bg: "#E8DEB0", fg: "#2A2722", title: "alvarez", font: SERIF, size: 46, chipBg: "rgba(42,39,34,0.1)", chipFg: "#2A2722", art: "alvarez", disc: "#2A2722" },
  { name: "about me", kind: "liner notes", href: "/about", bg: "#E7B2C4", fg: "#111827", title: "more about me\nthan you\nasked for", font: SERIF, size: 30, italic: true, chipBg: dark, chipFg: "#111827" },
  { name: "scan-o-matic", kind: "lab", href: "/play/scan-o-matic", bg: "#F5D000", fg: "#111827", title: "scan-o-\nmatic\n3000", font: ARCHIVO, size: 32, chipBg: "#FF5FB4", chipFg: "#111827" },
  { name: "friends", kind: "photos", href: "/play/camera-roll", bg: flash("35%", "55%"), fg: "#F3F4F6", title: "", font: MONO, size: 10, chipBg: paper, chipFg: "#111827" },
  { name: "underworld", kind: "lab", href: "/play/the-underworld", bg: "#83C8C4", fg: "#111827", title: "the\nunderworld", font: SERIF, size: 40, italic: true, chipBg: dark, chipFg: "#111827" },
  { name: "say hi", kind: "contact", href: EMAIL, bg: "#D9263D", fg: "#FFFFFF", title: "hi.", font: ARCHIVO, size: 84, chipBg: light, chipFg: "#FFFFFF" },
  { name: "???", kind: "unreleased", href: "/play/unreleased", bg: "#8C8A85", fg: "#F3F4F6", title: "???", font: ARCHIVO, size: 64, chipBg: light, chipFg: "#F3F4F6" },
];

// A silver CD with the record's colour as its centre label.
export const discBackground = (it: Item) => {
  const label = it.disc ?? (it.title === "" ? "#C38877" : it.bg);
  return [
    `radial-gradient(circle, #F3F4F6 0 7%, rgba(17,24,39,0.35) 7.5% 8.5%, rgba(255,255,255,0.6) 9% 10%, ${label} 10.5% 33%, rgba(17,24,39,0.15) 33.5% 34%, transparent 34.5%)`,
    "conic-gradient(from 20deg, #D7D9DE, #F5F5F7, #C8D5E6, #EDE1EF, #D3DCE4, #F7F1E3, #CFD6E2, #E9E9ED, #D7D9DE)",
  ].join(", ");
};

// The five case studies, in the order they appear on the shelf.
export const PROJECT_SLUGS = ["useno", "sponty", "spark", "grove", "alvarez"] as const;
export const itemBySlug = (slug: string) => items.find((it) => it.href === `/work/${slug}`);
