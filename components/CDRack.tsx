"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { CoverArt, PROJECT_SLUGS, discBackground, itemBySlug, type Item } from "@/components/records";
import { getAlbumBySlug, type Album } from "@/data/albums";

interface Rec {
  slug: string;
  item: Item;
  album: Album;
}

const RECORDS: Rec[] = PROJECT_SLUGS.map((slug) => ({
  slug,
  item: itemBySlug(slug)!,
  album: getAlbumBySlug(slug)!,
}));

// Where each cover sits relative to the picked one: size and centre as a share of the stage width.
// `dim` washes the cover toward the cream background (covers stay opaque, so they never show through each other);
// `op` is only 0 for covers parked off-stage.
type Slot = { size: number; cx: number; dim: number; op: number; z: number };
const MAX_PX = 340;
const WIDE: Record<string, Slot> = {
  "0": { size: 23.6, cx: 50, dim: 0, op: 1, z: 5 },
  "1": { size: 17.1, cx: 72.9, dim: 0.4, op: 1, z: 4 },
  "-1": { size: 17.1, cx: 27.1, dim: 0.4, op: 1, z: 4 },
  "2": { size: 11.8, cx: 88.9, dim: 0.72, op: 1, z: 3 },
  "-2": { size: 11.8, cx: 11.1, dim: 0.72, op: 1, z: 3 },
};
// On phones the outer covers wait just off-screen at full side size, so they slide in instead of growing from a dot.
const NARROW: Record<string, Slot> = {
  "0": { size: 50, cx: 50, dim: 0, op: 1, z: 5 },
  "1": { size: 33, cx: 90, dim: 0.5, op: 1, z: 4 },
  "-1": { size: 33, cx: 10, dim: 0.5, op: 1, z: 4 },
  "2": { size: 33, cx: 130, dim: 0.5, op: 0, z: 3 },
  "-2": { size: 33, cx: -30, dim: 0.5, op: 0, z: 3 },
};

const NARROW_QUERY = "(max-width: 767px)";
const subscribeNarrow = (onChange: () => void) => {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const EASE = "cubic-bezier(0.45, 0, 0.2, 1)";
const DURATION = 950;

const pad = (n: number) => String(n).padStart(2, "0");

// Where record i sits relative to the picked one, wrapped into -2..2.
const offsetOf = (i: number, sel: number, n: number) => {
  const off = (((i - sel) % n) + n) % n;
  return off > 2 ? off - n : off;
};

// Slots past the edges are off-stage and invisible, used while a cover wraps around.
const slotAt = (slots: Record<string, Slot>, off: number): Slot => {
  if (Math.abs(off) <= 2) return slots[String(off)];
  const edge = slots[String(Math.sign(off) * 2)];
  const inner = slots[String(Math.sign(off))];
  return { ...edge, cx: edge.cx + (edge.cx - inner.cx), op: 0, z: 2 };
};

// Every cover is laid out at the centre size and moved with transforms only, so nothing re-lays out mid-slide.
const transformFor = (s: Slot, base: number) =>
  `translate(-50%, -50%) translateX(${(s.cx - 50).toFixed(2)}cqw) scale(${(s.size / base).toFixed(4)})`;

export default function CDRack({ initialSlug }: { initialSlug?: string }) {
  const [nav, setNav] = useState(() => {
    const start = Math.max(0, RECORDS.findIndex((r) => r.slug === initialSlug));
    return { sel: start, from: start };
  });
  const { sel, from } = nav;
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW_QUERY).matches, () => false);
  const slots = narrow ? NARROW : WIDE;
  const base = slots["0"].size;
  const n = RECORDS.length;
  const rec = RECORDS[sel];
  const coverRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // On arrival the covers start in their own slots, faded and slightly low, then rise into place together.
  const [phase, setPhase] = useState<"stacked" | "fanning" | "idle">("stacked");
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("fanning"));
    });
    const done = window.setTimeout(() => setPhase("idle"), DURATION + 400);
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(done);
    };
  }, []);
  const wrapAnims = useRef<Animation[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  // How far the row moved on the last pick (-2..2); covers that moved any other way wrapped around the ends.
  const shift = offsetOf(sel, from, n);
  const wrapped = (i: number) => shift !== 0 && offsetOf(i, sel, n) !== offsetOf(i, from, n) - shift;

  // A wrapping cover keeps sliding off its edge, fades out, then slides in from the other edge.
  useLayoutEffect(() => {
    wrapAnims.current.forEach((a) => a.cancel());
    wrapAnims.current = [];
    if (shift === 0 || window.matchMedia(REDUCED_QUERY).matches) return;
    RECORDS.forEach((_, i) => {
      const el = coverRefs.current[i];
      if (!el || !wrapped(i)) return;
      const before = offsetOf(i, from, n);
      const after = offsetOf(i, sel, n);
      const a = slotAt(slots, before);
      const b = slotAt(slots, before - shift);
      const c = slotAt(slots, after + shift);
      const d = slotAt(slots, after);
      const anim = el.animate(
        [
          { transform: transformFor(a, base), opacity: a.op, easing: "cubic-bezier(0.45, 0, 0.7, 0.4)" },
          { transform: transformFor(b, base), opacity: 0, offset: 0.45 },
          { transform: transformFor(c, base), opacity: 0, offset: 0.45, easing: EASE },
          { transform: transformFor(d, base), opacity: d.op },
        ],
        { duration: DURATION },
      );
      wrapAnims.current.push(anim);
    });
    // Only replay when the pick changes, not when the layout flips between wide and narrow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav]);

  const pick = (i: number) => {
    setNav({ sel: i, from: sel });
    window.history.replaceState(null, "", `/play/${RECORDS[i].slug}`);
  };
  const step = (d: number) => pick((sel + d + n) % n);
  const stepRef = useRef(step);
  useLayoutEffect(() => {
    stepRef.current = step;
  });

  // Trackpad swipes step once per gesture; drags follow the finger, then settle onto the next cover.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let acc = 0;
    let locked = false;
    let idle = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        locked = false;
        acc = 0;
      }, 160);
      if (locked) return;
      acc += e.deltaX;
      if (Math.abs(acc) > 30) {
        stepRef.current(acc > 0 ? 1 : -1);
        locked = true;
        acc = 0;
      }
    };

    let startX: number | null = null;
    let dx = 0;
    const onDown = (e: PointerEvent) => {
      startX = e.clientX;
      dx = 0;
      el.style.transition = "none";
    };
    const onMove = (e: PointerEvent) => {
      if (startX === null) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 6) el.style.transform = `translateX(${dx * 0.6}px)`;
    };
    const onUp = () => {
      if (startX === null) return;
      startX = null;
      el.style.transition = `transform ${DURATION}ms ${EASE}`;
      el.style.transform = "";
      if (Math.abs(dx) > 50) stepRef.current(dx < 0 ? 1 : -1);
    };
    // A drag shouldn't also count as a click on the cover under the pointer.
    const onClick = (e: MouseEvent) => {
      if (Math.abs(dx) > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
      dx = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.clearTimeout(idle);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("click", onClick, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)] flex flex-col overflow-x-hidden">
      <TopBar className="px-6 md:px-12 pt-8 lg:pt-10 relative z-10" />

      <main className="flex-1 flex flex-col justify-center pb-12">
        <div className="relative w-full mt-8 md:mt-6" style={{ containerType: "inline-size" }}>
          <div
            ref={stageRef}
            className="relative w-full touch-pan-y select-none"
            style={{ height: `min(${base}cqw, ${MAX_PX}px)` }}
          >
            {RECORDS.map((r, i) => {
              const off = offsetOf(i, sel, n);
              const slot = slots[String(off)];
              const s = phase === "stacked" ? { ...slot, op: 0 } : slot;
              const size = `min(${base}cqw, ${MAX_PX}px)`;
              return (
                <button
                  key={r.slug}
                  ref={(el) => {
                    coverRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => (off === 0 ? undefined : pick(i))}
                  aria-label={off === 0 ? `${r.item.name}, now playing` : `Play ${r.item.name}`}
                  aria-current={off === 0 ? "true" : undefined}
                  tabIndex={s.op === 0 ? -1 : 0}
                  className={`flow-cover group absolute left-1/2 top-1/2 border-0 bg-transparent p-0 ${off === 0 ? "cursor-default" : "cursor-pointer"}`}
                  style={{
                    width: size,
                    height: size,
                    transform: phase === "stacked" ? `${transformFor(s, base)} translateY(5%)` : transformFor(s, base),
                    transition: wrapped(i) ? "none" : undefined,
                    transitionDelay: phase === "fanning" ? `${Math.abs(off) * 40}ms` : undefined,
                    opacity: s.op,
                    zIndex: s.z,
                    color: r.item.fg,
                    containerType: "inline-size",
                    boxShadow: off === 0 ? "0 34px 60px -30px rgba(28,25,27,0.55)" : Math.abs(off) === 1 ? "0 20px 40px -26px rgba(28,25,27,0.45)" : "none",
                  }}
                >
                  {/* The CD tucked behind the sleeve; hovering the cover in the middle slides it out and spins it. */}
                  <span
                    aria-hidden="true"
                    className={`flow-cd absolute inset-[5%] rounded-full ${off === 0 ? "group-hover:translate-x-[46%]" : ""}`}
                  >
                    <span className="flow-cd-spin absolute inset-0 rounded-full" style={{ background: discBackground(r.item) }} />
                  </span>
                  <span aria-hidden="true" className="absolute inset-0" style={{ background: r.item.bg }} />
                  <span aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-[4%] bg-black/10" />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 40%)" }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center text-center p-[10%] leading-[0.92] whitespace-pre-line"
                    style={{
                      fontFamily: r.item.font,
                      fontSize: `${((r.item.size / 248) * 100).toFixed(2)}cqw`,
                      fontStyle: r.item.italic ? "italic" : "normal",
                    }}
                  >
                    <CoverArt it={r.item} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="flow-dim absolute inset-0 bg-[#F4F1EA] pointer-events-none"
                    style={{ opacity: s.dim }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 md:mt-14 px-6 flex flex-col items-center text-center">
          <h1 className="sr-only">{rec.album.name}</h1>
          <Crossfade index={sel}>
            {RECORDS.map((r, i) => (
              <span key={r.slug} className="font-[family-name:var(--font-dm-mono)] text-[13px] text-[#8A847A]">
                now playing · {r.album.kind.toLowerCase()} · {pad(i + 1)} / {pad(n)}
              </span>
            ))}
          </Crossfade>
          <div className="mt-3.5 flex items-center gap-5 md:gap-9">
            <ArrowButton label="Previous" onClick={() => step(-1)} flip />
            <Crossfade index={sel} className="md:min-w-[420px]">
              {RECORDS.map((r) => (
                <span
                  key={r.slug}
                  className="font-[family-name:var(--font-archivo)] text-[48px] md:text-[80px] leading-[0.95] tracking-[-0.04em] lowercase"
                >
                  {r.album.name}
                </span>
              ))}
            </Crossfade>
            <ArrowButton label="Next" onClick={() => step(1)} />
          </div>
          <Crossfade index={sel} className="mt-4">
            {RECORDS.map((r) => (
              <div key={r.slug} className="flex flex-col items-center">
                <p className="m-0 max-w-[560px] md:max-w-none md:whitespace-nowrap text-[17px] md:text-[19px] leading-[1.45] text-[#4A4541] lowercase">{r.album.line}</p>
                {r.album.href && (
                  <Link
                    href={r.album.href}
                    className="mt-6 inline-flex items-center gap-2.5 h-11 px-5 rounded-full bg-[#1C191B] text-white text-[15px] hover:bg-[#3A3533] transition-colors"
                  >
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
                    </svg>
                    {r.album.cta.replace(/^Play — /, "").toLowerCase()}
                  </Link>
                )}
              </div>
            ))}
          </Crossfade>
        </div>
      </main>
    </div>
  );
}

// Stacks every version in one grid cell and fades between them, so text never blinks out.
function Crossfade({ index, className = "", children }: { index: number; className?: string; children: React.ReactNode[] }) {
  return (
    <div className={`grid justify-items-center ${className}`}>
      {children.map((child, i) => (
        <div
          key={i}
          aria-hidden={i !== index}
          inert={i !== index}
          className={`crossfade [grid-area:1/1] ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function ArrowButton({ label, onClick, flip = false }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid place-items-center w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-full border border-[#CFC9BE] text-[#1C191B] hover:bg-[#1C191B] hover:text-[#F4F1EA] hover:border-[#1C191B] transition-colors cursor-pointer"
    >
      <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={flip ? "rotate-180" : ""}>
        <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
      </svg>
    </button>
  );
}
