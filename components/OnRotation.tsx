"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

const ARCHIVO = "var(--font-archivo), sans-serif";
const SERIF = "var(--font-instrument), serif";
const MONO = "var(--font-dm-mono), monospace";
const EMAIL = "mailto:lucas.xie6@gmail.com";

const flash = (x: string, y: string) =>
  `radial-gradient(ellipse 48% 42% at ${x} ${y}, #FFFFFF 0%, #F1DED3 18%, #C38877 44%, #3A2A2C 74%, #0F0B0D 100%)`;

const light = "rgba(255,255,255,0.18)";
const dark = "rgba(28,25,27,0.12)";
const paper = "rgba(244,241,234,0.9)";

interface Item {
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

function CoverArt({ it }: { it: Item }) {
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

const items: Item[] = [
  { name: "useno", kind: "case study", href: "/work/useno", bg: "#1F3A5F", fg: "#FFFFFF", title: "useno", font: ARCHIVO, size: 48, chipBg: "#F3F0E8", chipFg: "#1F3A5F", art: "useno" },
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
  { name: "camera roll", kind: "photos", href: "/play/camera-roll", bg: flash("50%", "40%"), fg: "#F4F1EA", title: "", font: MONO, size: 10, chipBg: paper, chipFg: "#1C191B" },
  { name: "grove", kind: "case study", href: "/work/grove", bg: "#3E2419", fg: "#EFE5D6", title: "grove", font: SERIF, size: 54, chipBg: "rgba(239,229,214,0.14)", chipFg: "#EFE5D6", art: "grove", disc: "#7AAE58" },
  { name: "spark", kind: "case study", href: "/work/spark", bg: "#F0EDE7", fg: "#3B2F6B", title: "spark", font: "var(--font-fraunces), serif", size: 62, italic: true, chipBg: "rgba(59,47,107,0.1)", chipFg: "#3B2F6B", disc: "#3B2F6B" },
  { name: "alvarez", kind: "brand", href: "/work/alvarez", bg: "#E8DEB0", fg: "#2A2722", title: "alvarez", font: SERIF, size: 46, chipBg: "rgba(42,39,34,0.1)", chipFg: "#2A2722", art: "alvarez", disc: "#2A2722" },
  { name: "about me", kind: "liner notes", href: "/play/about", bg: "#E7B2C4", fg: "#1C191B", title: "more about me\nthan you\nasked for", font: SERIF, size: 30, italic: true, chipBg: dark, chipFg: "#1C191B" },
  { name: "scan-o-matic", kind: "lab", href: "/play/scan-o-matic", bg: "#F5D000", fg: "#1C191B", title: "scan-o-\nmatic\n3000", font: ARCHIVO, size: 32, chipBg: "#FF5FB4", chipFg: "#1C191B" },
  { name: "friends", kind: "photos", href: "/play/camera-roll", bg: flash("35%", "55%"), fg: "#F4F1EA", title: "", font: MONO, size: 10, chipBg: paper, chipFg: "#1C191B" },
  { name: "underworld", kind: "lab", href: "/play/the-underworld", bg: "#83C8C4", fg: "#1C191B", title: "the\nunderworld", font: SERIF, size: 40, italic: true, chipBg: dark, chipFg: "#1C191B" },
  { name: "say hi", kind: "contact", href: EMAIL, bg: "#D9263D", fg: "#FFFFFF", title: "hi.", font: ARCHIVO, size: 84, chipBg: light, chipFg: "#FFFFFF" },
  { name: "???", kind: "unreleased", href: "/play/unreleased", bg: "#8C8A85", fg: "#F4F1EA", title: "???", font: ARCHIVO, size: 64, chipBg: light, chipFg: "#F4F1EA" },
];

const pad = (n: number) => String(n).padStart(2, "0");

// Grid order: item indices, with null for an empty sleeve.
const SLOTS: (number | null)[] = [0, null, 1, null, 4, null, 3, null, 5];
const SHOWN = SLOTS.filter((s): s is number => s !== null);

// A silver CD with the record's colour as its centre label.
const discBackground = (it: Item) => {
  const label = it.disc ?? (it.title === "" ? "#C38877" : it.bg);
  return [
    `radial-gradient(circle, #F4F1EA 0 7%, rgba(28,25,27,0.35) 7.5% 8.5%, rgba(255,255,255,0.6) 9% 10%, ${label} 10.5% 33%, rgba(28,25,27,0.15) 33.5% 34%, transparent 34.5%)`,
    "conic-gradient(from 20deg, #D7D9DE, #F5F5F7, #C8D5E6, #EDE1EF, #D3DCE4, #F7F1E3, #CFD6E2, #E9E9ED, #D7D9DE)",
  ].join(", ");
};

function A({ href, className, style, children, ...rest }: React.ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} style={style} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style} {...rest}>
      {children}
    </Link>
  );
}

// Fixed per-record track lengths (2:30–3:59) so the player has something to count against.
const durationOf = (i: number) => 150 + ((i * 47) % 90);
const clock = (s: number) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;

const LYRICS = ["hi, i'm lucas.", "i design apps\nand websites.", "from first sketch\nto shipped.", "here are a few.", "♪"];
const LINE_SECS = 1.5;
const lyricColor = (offset: number) =>
  offset === 0 ? "#1C191B" : Math.abs(offset) === 1 ? "#C9C2B6" : Math.abs(offset) === 2 ? "#DDD7CC" : "#E6E1D7";

function Lyrics({ active, onSeek }: { active: number; onSeek: (line: number) => void }) {
  return (
    <div className="flex flex-col gap-6 lg:gap-8 text-[30px] lg:text-[36px] font-bold leading-[1.12] tracking-[-0.03em]">
      {LYRICS.map((line, i) => (
        <button
          key={line}
          type="button"
          onClick={() => onSeek(i)}
          aria-current={i === active ? "true" : undefined}
          className="text-left whitespace-pre-line cursor-pointer transition-colors duration-500 hover:!text-[#1C191B]"
          style={{ color: lyricColor(i - active) }}
        >
          {i === 0 ? <h1 className="m-0 font-[inherit] text-[length:inherit]">{line}</h1> : line}
        </button>
      ))}
    </div>
  );
}

interface PlayerProps {
  sel: number;
  playing: boolean;
  elapsed: number;
  onToggle: () => void;
  onSeek: (seconds: number) => void;
}

function Player({ sel, playing, elapsed, onToggle, onSeek }: PlayerProps) {
  const now = items[sel];
  const duration = durationOf(sel);
  const pct = Math.min(100, (elapsed / duration) * 100);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.round(((e.clientX - r.left) / r.width) * duration));
  };

  const bars = waveform(sel);
  const shown = clock(Math.min(elapsed, duration));

  return (
    <section aria-label="Now playing" className="flex items-center gap-4">
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={onToggle}
        className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-[#1C191B] text-white hover:scale-105 transition-transform cursor-pointer"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="3.2" height="12" rx="0.8" />
            <rect x="9.8" y="2" width="3.2" height="12" rx="0.8" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="translate-x-px">
            <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-baseline gap-2.5">
          <A
            href={now.href}
            className="text-[16px] leading-none truncate"
            style={{ fontFamily: "var(--font-archivo-var), sans-serif", fontWeight: 600, fontStretch: "68%", letterSpacing: "-0.035em" }}
          >
            {now.name}
          </A>
          <span className="text-[13px] text-[#8A847A] truncate">{now.kind}</span>
          <span className="ml-auto text-[12px] tabular-nums whitespace-nowrap">
            {shown} <span className="text-[#8A847A]">/ {clock(duration)}</span>
          </span>
        </div>

        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={elapsed}
          aria-valuetext={`${shown} of ${clock(duration)}`}
          onClick={seek}
          className="flex items-center gap-[2px] h-6 cursor-pointer"
        >
          {bars.map((h, i) => (
            <span
              key={i}
              className="flex-1 min-w-[2px] rounded-full transition-colors duration-300"
              style={{ height: `${Math.round(h * 100)}%`, background: (i + 0.5) / bars.length <= pct / 100 ? "#1C191B" : "#DDD7CC" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// A made-up but stable waveform per record: a slow swell times a faster ripple.
const BAR_COUNT = 96;
function waveform(seed: number) {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const swell = 0.55 + 0.45 * Math.sin(i * 0.09 + seed * 1.7);
    const ripple = Math.abs(Math.sin(i * 0.63 + seed * 2.3)) * 0.6 + Math.abs(Math.sin(i * 1.71 + seed)) * 0.4;
    const fadeIn = Math.min(1, (i + 1) / 6);
    return Math.max(0.12, Math.min(1, swell * (0.35 + 0.65 * ripple) * fadeIn));
  });
}

const REDUCED_MOTION_QUERY = () => window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeReducedMotion = (onChange: () => void) => {
  const mq = REDUCED_MOTION_QUERY();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export default function OnRotation() {
  const [sel, setSel] = useState(0);
  // Autoplays, unless the visitor has asked their system to reduce motion; a press on play/pause takes over from there.
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => REDUCED_MOTION_QUERY().matches, () => false);
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reducedMotion;
  const [elapsed, setElapsed] = useState(0);
  const [prevSel, setPrevSel] = useState(sel);
  const duration = durationOf(sel);

  if (prevSel !== sel) {
    setPrevSel(sel);
    setElapsed(0);
  } else if (elapsed >= duration) {
    setSel(SHOWN[(SHOWN.indexOf(sel) + 1) % SHOWN.length]);
  }

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed((e) => e + 0.5), 500);
    return () => clearInterval(id);
  }, [playing]);

  const activeLine = Math.floor(elapsed / LINE_SECS) % LYRICS.length;

  return (
    <div className="rot bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)] lg:h-screen lg:overflow-hidden lg:flex">
      <aside className="box-border flex flex-col px-6 pt-8 pb-10 lg:w-[600px] lg:shrink-0 lg:h-full lg:p-12">
        <div className="flex items-center justify-between text-[15px]">
          <A
            href="/"
            className="text-[22px] leading-none"
            style={{ fontFamily: "var(--font-archivo-var), sans-serif", fontWeight: 600, fontStretch: "68%", letterSpacing: "-0.035em", wordSpacing: "0.08em" }}
          >
            lucas xie
          </A>
          <nav aria-label="Primary" className="flex items-center gap-7">
            <A href="/play/useno" className="hover:!text-[#8A847A]">
              work
            </A>
            <A href="/play/about" className="hover:!text-[#8A847A]">
              about
            </A>
            <a
              href={EMAIL}
              className="inline-flex items-center gap-2 h-8 pl-3.5 pr-1.5 rounded-full bg-[#1C191B] !text-white hover:bg-[#3A3533] transition-colors"
            >
              say hi
              <span className="grid place-items-center w-5 h-5 rounded-full bg-[#F4F1EA] text-[#1C191B]">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 7L7 3M3.5 3H7V6.5" />
                </svg>
              </span>
            </a>
          </nav>
        </div>

        <div className="my-16 lg:my-auto">
          <Lyrics
            active={activeLine}
            onSeek={(line) => {
              setElapsed(line * LINE_SECS);
              setUserPlaying(true);
            }}
          />
        </div>

        <Player
          sel={sel}
          playing={playing}
          elapsed={elapsed}
          onToggle={() => setUserPlaying(!playing)}
          onSeek={setElapsed}
        />
      </aside>

      <main className="relative px-6 pb-16 lg:px-0 lg:pb-0 lg:ml-6 lg:mr-10 lg:flex-1 lg:min-w-0 lg:h-full">
        <div className="lg:h-full lg:overflow-y-auto lg:py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {SLOTS.map((slot, pos) => {
              if (slot === null) {
                return <Blank key={`blank-${pos}`} variant={SLOTS.slice(0, pos).filter((s) => s === null).length} />;
              }
              const i = slot;
              const it = items[i];
              // Discs slide out to the right, except in the last column where there's no room.
              const slideLeft = pos % 3 === 2;
              return (
              <div key={it.name} className={`cd-slot relative aspect-square ${slideLeft ? "cd-left" : ""}`}>
              <span aria-hidden="true" className="cd absolute inset-[6%] rounded-full">
                <span className="cd-spin absolute inset-0 rounded-full" style={{ background: discBackground(it) }} />
              </span>
              <A
                href={it.href}
                aria-label={`${it.name}, ${it.kind}`}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                className="sq block aspect-square relative overflow-hidden rounded-md"
                style={{ background: it.bg, color: it.fg, containerType: "inline-size" }}
              >
                <span
                  className="chip absolute right-3.5 top-3.5 text-xs px-2.5 py-[5px] rounded"
                  style={{ background: it.chipBg, color: it.chipFg }}
                >
                  {it.name}
                </span>
                <span
                  className="absolute inset-0 flex items-center justify-center text-center p-6 box-border leading-[0.92] whitespace-pre-line"
                  style={{
                    fontFamily: it.font,
                    fontSize: `min(${it.size}px, ${((it.size / 248) * 100).toFixed(2)}cqw)`,
                    fontStyle: it.italic ? "italic" : "normal",
                  }}
                >
                  <CoverArt it={it} />
                </span>
                <span className="absolute left-3.5 bottom-3 text-xs opacity-80">{it.kind}</span>
              </A>
              </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

const SILVER =
  "conic-gradient(from 20deg, #D7D9DE, #F5F5F7, #C8D5E6, #EDE1EF, #D3DCE4, #F7F1E3, #CFD6E2, #E9E9ED, #D7D9DE)";

// Empty sleeves: each one a different kind of nothing.
function Blank({ variant }: { variant: number }) {
  const base = "relative aspect-square rounded-md overflow-hidden";
  switch (variant % 4) {
    case 0:
      // Empty jewel case: frosted plastic, a hub where the disc would clip in.
      return (
        <div
          aria-hidden="true"
          className={`${base} border border-[#D8D2C6]`}
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 38%, rgba(255,255,255,0) 52%, rgba(255,255,255,0.35) 80%, rgba(255,255,255,0) 100%), #ECE8E0",
          }}
        >
          <span className="absolute left-0 top-0 bottom-0 w-[7%] bg-[#DDD7CB] border-r border-white/70" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[64%] aspect-square rounded-full border border-[#D3CCBF]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[16%] aspect-square rounded-full border-2 border-[#CFC8BA] bg-[#E4DFD5]" />
        </div>
      );
    case 1:
      // Unlabelled CD-R sitting on its paper.
      return (
        <div aria-hidden="true" className={`${base} bg-[#EFEBE3]`}>
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full shadow-[0_6px_14px_-8px_rgba(28,25,27,0.4)]"
            style={{
              background: `radial-gradient(circle, #EFEBE3 0 7%, rgba(28,25,27,0.3) 7.5% 8.5%, #F8F6F1 9% 33%, rgba(28,25,27,0.12) 33.5% 34%, transparent 34.5%), ${SILVER}`,
            }}
          />
        </div>
      );
    case 2:
      // Kraft paper sleeve with a die-cut window and nothing behind it.
      return (
        <div
          aria-hidden="true"
          className={base}
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0 1px, transparent 2px) 0 0 / 9px 9px, radial-gradient(circle at 70% 60%, rgba(60,40,20,0.12) 0 1px, transparent 2px) 0 0 / 13px 13px, #C9A87C",
          }}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] aspect-square rounded-full bg-[#F4F1EA] shadow-[inset_0_2px_5px_rgba(60,40,20,0.35)]" />
          <span className="absolute left-0 right-0 bottom-[10%] h-px bg-[rgba(60,40,20,0.18)]" />
        </div>
      );
    default:
      // Still in the shrink wrap.
      return (
        <div
          aria-hidden="true"
          className={`${base} bg-[#F7F5F0] border border-[#E2DDD2]`}
          style={{
            backgroundImage:
              "linear-gradient(115deg, transparent 0 28%, rgba(255,255,255,0.95) 31%, transparent 36% 58%, rgba(255,255,255,0.7) 60%, transparent 63%), linear-gradient(180deg, rgba(28,25,27,0.03), rgba(28,25,27,0.07))",
          }}
        >
          <span className="absolute right-[8%] top-[8%] w-[22%] h-[7%] rounded-[2px] bg-[rgba(28,25,27,0.06)]" />
          <span className="absolute left-[6%] right-[6%] top-[3%] h-px bg-white/90" />
        </div>
      );
  }
}
