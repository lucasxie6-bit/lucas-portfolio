"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { CoverArt, discBackground, items } from "@/components/records";

const pad = (n: number) => String(n).padStart(2, "0");

// Grid order: item indices, with null for an empty sleeve.
const SLOTS: (number | null)[] = [0, null, 1, null, 4, null, 3, null, 5];
const SHOWN = SLOTS.filter((s): s is number => s !== null);

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
const LINE_SECS = 1.4;
// Where the current lyric sits in its box, from the top: a little above the middle.
const LYRIC_ANCHOR = 0.4;
// Lyrics roll upward like a lyrics view: the current line sits in the middle, its neighbours fade out above and below.
// Pointing at the lyrics holds the current line; clicking a faded one jumps to it. Letting go carries on from the
// line after whichever one was held.
function Lyrics({ active, onHold, onRelease }: { active: number; onHold: (line: number) => void; onRelease: () => void }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [shift, setShift] = useState(0);

  // Keep the active line centred, and re-centre whenever the box or the text reflows (window resizes, fonts load).
  useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const centre = () => {
      const line = lineRefs.current[active];
      if (line) setShift(view.clientHeight * LYRIC_ANCHOR - (line.offsetTop + line.offsetHeight / 2));
    };
    centre();
    const ro = new ResizeObserver(centre);
    ro.observe(view);
    lineRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [active]);

  return (
    <div
      ref={viewRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHold(active)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onRelease()}
      onBlur={(e) => !viewRef.current?.contains(e.relatedTarget as Node | null) && onRelease()}
      className="lyrics-view relative h-full overflow-hidden"
    >
      <div
        className="lyrics-track flex flex-col gap-16 side:gap-[clamp(40px,8vh,88px)] font-extrabold leading-[1.04] tracking-[-0.045em] text-[clamp(32px,9.5vw,56px)] side:text-[clamp(28px,9cqw,68px)]"
        style={{ transform: `translate3d(0, ${shift}px, 0)` }}
      >
        {LYRICS.map((line, i) => (
          <button
            key={line}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            type="button"
            data-lyric
            onClick={() => onHold(i)}
            // Only keyboard focus holds a line; a focus left behind by a click must not re-freeze it later.
            onFocus={(e) => e.currentTarget.matches(":focus-visible") && onHold(i)}
            aria-current={i === active ? "true" : undefined}
            className="lyric-line text-left whitespace-pre-line cursor-pointer"
            style={{ color: i === active ? "#1C191B" : "#E4DFD6" }}
          >
            {i === 0 ? <h1 className="m-0 font-[inherit] text-[length:inherit]">{line}</h1> : line}
          </button>
        ))}
      </div>
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

// A slim now-playing strip: pause, title and artist, length, and a thin progress line underneath.
function Player({ sel, playing, elapsed, onToggle, onSeek }: PlayerProps) {
  const now = items[sel];
  const duration = durationOf(sel);
  const pct = Math.min(100, (elapsed / duration) * 100);
  const shown = clock(Math.min(elapsed, duration));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.round(((e.clientX - r.left) / r.width) * duration));
  };

  return (
    <section aria-label="Now playing">
      <div className="flex items-center gap-3 text-[13px]">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={onToggle}
          className="grid place-items-center size-8 -ml-2 shrink-0 rounded-full text-[#1C191B] hover:bg-[#E6E1D8] transition-colors cursor-pointer"
        >
          {playing ? (
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2" width="3.4" height="12" rx="0.8" />
              <rect x="9.6" y="2" width="3.4" height="12" rx="0.8" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="translate-x-px">
              <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
            </svg>
          )}
        </button>
        <p className="m-0 min-w-0 truncate">
          <A href={now.href} className="text-[#1C191B]">
            {now.name}
          </A>
          <span className="text-[#8A847A]"> — lucas xie</span>
        </p>
        <span className="ml-auto font-[family-name:var(--font-dm-mono)] text-[11px] tabular-nums text-[#8A847A] whitespace-nowrap">
          {clock(duration)}
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
        className="group relative mt-2 h-3 flex items-center cursor-pointer"
      >
        <div className="relative w-full h-[2px] rounded-full bg-[#DDD7CC] group-hover:h-[3px] transition-[height]">
          <div className="absolute inset-y-0 left-0 rounded-full bg-[#1C191B] transition-[width] duration-500 ease-linear" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </section>
  );
}

// On phones: a dark pill pinned to the bottom of the screen with the cover, title, a waveform and a big pause button.
function MiniPlayer({ sel, playing, elapsed, onToggle, onSeek }: PlayerProps) {
  const now = items[sel];
  const duration = durationOf(sel);
  const pct = Math.min(100, (elapsed / duration) * 100);
  const bars = waveform(sel);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.round(((e.clientX - r.left) / r.width) * duration));
  };

  return (
    <section aria-label="Now playing" className="flex items-center gap-3 rounded-full bg-[#1C191B] p-1.5 pr-1.5 text-[#F4F1EA] shadow-[0_14px_34px_-14px_rgba(28,25,27,0.7)]">
      <A href={now.href} aria-label={`${now.name}, ${now.kind}`} className="relative size-11 shrink-0 overflow-hidden rounded-full" style={{ background: now.bg, color: now.fg, containerType: "inline-size" }}>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-center leading-[0.92] whitespace-pre-line"
          style={{ fontFamily: now.font, fontSize: `${((now.size / 248) * 100).toFixed(2)}cqw`, fontStyle: now.italic ? "italic" : "normal" }}
        >
          <CoverArt it={now} />
        </span>
      </A>
      <div className="min-w-0 shrink-0 max-w-[30%] leading-tight">
        <p className="m-0 truncate text-[14px] font-bold">{now.name}</p>
        <p className="m-0 truncate text-[12px] text-[#F4F1EA]/55">lucas xie</p>
      </div>
      <div
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={elapsed}
        aria-valuetext={`${clock(Math.min(elapsed, duration))} of ${clock(duration)}`}
        onClick={seek}
        className="flex-1 min-w-0 flex items-center gap-px h-7 overflow-hidden cursor-pointer"
      >
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 min-w-0 rounded-full transition-colors duration-300"
            style={{ height: `${Math.round(h * 100)}%`, background: (i + 0.5) / bars.length <= pct / 100 ? "#F4F1EA" : "rgba(244,241,234,0.28)" }}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={onToggle}
        className="grid place-items-center size-11 shrink-0 rounded-full bg-[#F4F1EA] text-[#1C191B] cursor-pointer"
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="3.4" height="12" rx="0.8" />
            <rect x="9.6" y="2" width="3.4" height="12" rx="0.8" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="translate-x-px">
            <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
          </svg>
        )}
      </button>
    </section>
  );
}

// A made-up but stable waveform per record: a slow swell times a faster ripple.
function waveform(seed: number, count = 56) {
  return Array.from({ length: count }, (_, i) => {
    const swell = 0.55 + 0.45 * Math.sin(i * 0.16 + seed * 1.7);
    const ripple = Math.abs(Math.sin(i * 0.9 + seed * 2.3)) * 0.6 + Math.abs(Math.sin(i * 2.1 + seed)) * 0.4;
    return Math.max(0.15, Math.min(1, swell * (0.35 + 0.65 * ripple)));
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

  // The lyric line being pointed at or tapped; while set, the lyrics wait on it.
  const [held, setHeld] = useState<number | null>(null);

  useEffect(() => {
    if (!playing || held !== null) return;
    const id = setInterval(() => setElapsed((e) => Math.round((e + 0.2) * 10) / 10), 200);
    return () => clearInterval(id);
  }, [playing, held]);

  const activeLine = held ?? Math.floor(elapsed / LINE_SECS) % LYRICS.length;

  // Let go: pick up from the line after the held one, keeping the song's position in its lyric loop.
  const release = () => {
    if (held === null) return;
    const loop = LINE_SECS * LYRICS.length;
    const start = elapsed - (elapsed % loop);
    setElapsed(Math.min(start + (held + 1) * LINE_SECS, duration - 0.2));
    setHeld(null);
  };

  // On touch screens a tap holds a line; the next tap anywhere outside the lyrics lets go.
  const releaseRef = useRef(release);
  useEffect(() => {
    releaseRef.current = release;
  });
  useEffect(() => {
    if (held === null) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !(e.target as Element).closest?.("[data-lyric]")) releaseRef.current();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [held]);

  return (
    <div className="rot min-h-screen overflow-x-clip bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)] side:flex side:items-start">
      <aside className="@container box-border flex flex-col px-6 pt-6 pb-8 sm:px-10 side:flex-1 side:min-w-0 side:sticky side:top-0 side:h-screen side:pt-8 side:pb-10 xl:side:px-12 xl:side:pb-12">
        <TopBar />

        <div className="my-6 h-[clamp(300px,52vh,460px)] side:my-8 side:h-auto side:flex-1 side:min-h-0">
          <Lyrics
            active={activeLine}
            onHold={(line) => {
              setHeld(line);
              setUserPlaying(true);
            }}
            onRelease={release}
          />
        </div>

        {/* On phones the player is a dark pill pinned to the bottom of the screen; beside the covers it sits quietly
            at the foot of the sidebar. */}
        <div className="fixed inset-x-3 bottom-3 z-30 side:hidden">
          <MiniPlayer sel={sel} playing={playing} elapsed={elapsed} onToggle={() => setUserPlaying(!playing)} onSeek={setElapsed} />
        </div>
        <div className="hidden side:block">
          <Player sel={sel} playing={playing} elapsed={elapsed} onToggle={() => setUserPlaying(!playing)} onSeek={setElapsed} />
        </div>
      </aside>

      {/* Side by side, the covers start level with the header and the sidebar takes whatever width is left. Wide windows
          get three columns sized by width; squarer ones get bigger covers, two across and three down, sized to fill the
          height. See .home-grid in globals.css. */}
      <main
        className="relative px-6 pb-28 sm:px-10 side:flex-none side:pb-8 side:py-8 side:pl-0 side:pr-8"
      >
        <div>
          <div className="home-grid">
            {SLOTS.map((slot, pos) => {
              if (slot === null) {
                // Two columns show the five records plus the first blank (3 rows of 2); three columns show all nine.
                return (
                  <div key={`blank-${pos}`} className={pos === SLOTS.indexOf(null) ? "contents" : "extra-blank"}>
                    <Blank variant={SLOTS.slice(0, pos).filter((s) => s === null).length} />
                  </div>
                );
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
