"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
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

// Where record i sits relative to the picked one, wrapped so there are always covers on both sides.
const offsetOf = (i: number, sel: number, n: number) => {
  const off = (((i - sel) % n) + n) % n;
  return off > n / 2 ? off - n : off;
};

// "Startup, internship discovery and application tracking, in one place"
const describe = (album: Album) => `${album.kind}, ${album.line.charAt(0).toLowerCase()}${album.line.slice(1).replace(/\.$/, "")}`;

export default function CDRack({ initialSlug }: { initialSlug?: string }) {
  const router = useRouter();
  const [nav, setNav] = useState(() => {
    const start = Math.max(0, RECORDS.findIndex((r) => r.slug === initialSlug));
    return { sel: start, from: start };
  });
  const { sel, from } = nav;
  const n = RECORDS.length;
  // How far the row moved on the last pick; a cover that moved any other way wrapped round the far edge.
  const shift = offsetOf(sel, from, n);
  const wrapped = (i: number) => offsetOf(i, sel, n) !== offsetOf(i, from, n) - shift;
  const rec = RECORDS[sel];
  const stripRef = useRef<HTMLDivElement>(null);

  const pick = (i: number) => {
    const next = ((i % n) + n) % n;
    if (next === sel) return;
    setNav({ sel: next, from: sel });
    window.history.replaceState(null, "", `/play/${RECORDS[next].slug}`);
  };
  const pickRef = useRef(pick);
  const selRef = useRef(sel);
  useLayoutEffect(() => {
    pickRef.current = pick;
    selRef.current = sel;
  });

  // Arrow keys step along the strip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowRight") pickRef.current(selRef.current + 1);
      if (e.key === "ArrowLeft") pickRef.current(selRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Trackpad swipes step once per gesture; drags follow the finger, then settle onto the next cover.
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    // Any scroll, sideways or up/down, steps the strip: one step per flick, and a held scroll keeps stepping.
    let acc = 0;
    let lockedUntil = 0;
    let idle = 0;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      // Up/down only steps when the page itself has nothing to scroll.
      const pageScrolls = document.documentElement.scrollHeight > window.innerHeight + 1;
      if (!sideways && pageScrolls) return;
      e.preventDefault();
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        locked = false;
        acc = 0;
      }, 120);
      if (locked && performance.now() < lockedUntil) return;
      acc += sideways ? e.deltaX : e.deltaY;
      if (Math.abs(acc) > 24) {
        pickRef.current(selRef.current + (acc > 0 ? 1 : -1));
        locked = true;
        lockedUntil = performance.now() + 520;
        acc = 0;
      }
    };

    let startX: number | null = null;
    let dx = 0;
    const onDown = (e: PointerEvent) => {
      startX = e.clientX;
      dx = 0;
      el.style.setProperty("--drag", "0px");
      el.dataset.dragging = "";
    };
    const onMove = (e: PointerEvent) => {
      if (startX === null) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 6) el.style.setProperty("--drag", `${dx * 0.8}px`);
    };
    const onUp = () => {
      if (startX === null) return;
      startX = null;
      delete el.dataset.dragging;
      el.style.setProperty("--drag", "0px");
      if (Math.abs(dx) > 50) pickRef.current(selRef.current + (dx < 0 ? 1 : -1));
    };
    // A drag shouldn't also count as a click on the cover under the pointer.
    const onClick = (e: MouseEvent) => {
      if (Math.abs(dx) > 6) {
        e.stopPropagation();
        e.preventDefault();
      }
      dx = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("click", onClick, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.clearTimeout(idle);
      window.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("click", onClick, true);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="film min-h-svh bg-white text-[#111827] font-[family-name:var(--font-dm-sans)] flex flex-col overflow-x-hidden">
      <SiteHeader className="h-[64px] md:h-[80px] px-6 md:px-8" />

      <main className="flex-1 flex flex-col">
        <h1 className="sr-only">{rec.album.name}</h1>

        {/* The strip: covers in a row, the picked one centred */}
        <div className="flex-1 flex items-center py-8 md:py-10">
          <div
            ref={stripRef}
            className="film-strip relative w-full touch-pan-y select-none"
            style={{ height: "var(--s)" }}
          >
            {RECORDS.map((r, i) => {
              const off = offsetOf(i, sel, n);
              const current = off === 0;
              return (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => (current ? r.album.href && router.push(r.album.href) : pick(i))}
                  aria-label={current ? `Open ${r.album.name}` : `Show ${r.album.name}`}
                  aria-current={current ? "true" : undefined}
                  tabIndex={Math.abs(off) > 1 ? -1 : 0}
                  className="film-cover absolute top-0 border-0 bg-transparent p-0 cursor-pointer"
                  data-current={current ? "" : undefined}
                  style={{
                    ["--o" as string]: off,
                    ["--k" as string]: off > 0 ? 0.5 : -0.5,
                    transition: wrapped(i) ? "none" : undefined,
                    zIndex: current ? 2 : 1,
                    color: r.item.fg,
                    containerType: "inline-size",
                  }}
                >
                  {/* The CD tucked in the sleeve; the picked record's slides out and spins. */}
                  <span aria-hidden="true" className="film-cd absolute inset-[5%] rounded-full">
                    <span className="film-cd-spin absolute inset-0 rounded-full" style={{ background: discBackground(r.item) }} />
                  </span>
                  <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[6px]" style={{ background: r.item.bg }}>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-center p-[10%] leading-[0.92] whitespace-pre-line"
                      style={{
                        fontFamily: r.item.font,
                        fontSize: `${((r.item.size / 248) * 100).toFixed(2)}cqw`,
                        fontStyle: r.item.italic ? "italic" : "normal",
                      }}
                    >
                      <CoverArt it={r.item} />
                    </span>
                    {/* The featured record wears a small gold star on its sleeve */}
                    {r.album.featured && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="absolute top-[5%] left-[5%]"
                        style={{ width: "max(7cqw, 16px)", height: "max(7cqw, 16px)" }}
                        fill="#D6A04A"
                      >
                        <path d="M12 2.5l2.6 6.1 6.6.6-5 4.4 1.5 6.5L12 16.7 6.3 20.1l1.5-6.5-5-4.4 6.6-.6z" />
                      </svg>
                    )}
                    {/* A faint play button: the cover in the middle opens its case study */}
                    <span
                      className="film-open absolute bottom-[4%] right-[4%] grid place-items-center rounded-full backdrop-blur-sm"
                      style={{ width: "max(8cqw, 26px)", height: "max(8cqw, 26px)", background: "rgba(255,255,255,0.6)", color: "#111827" }}
                    >
                      <svg width="34%" height="34%" viewBox="0 0 10 10" fill="currentColor" style={{ marginLeft: "6%" }}>
                        <path d="M2.6 1.6C2.6 1.05 3.2.7 3.68.98l5.1 2.98c.47.28.47.96 0 1.24l-5.1 2.98C3.2 8.46 2.6 8.1 2.6 7.56z" />
                      </svg>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 md:px-8 pb-10 md:pb-16">
          {/* One segment per project */}
          <div className="flex gap-2">
            {RECORDS.map((r, i) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => pick(i)}
                aria-label={`Show ${r.album.name}`}
                aria-current={i === sel ? "true" : undefined}
                className="group flex-1 h-6 -my-2.5 border-0 bg-transparent p-0 cursor-pointer"
              >
                <span
                  className={`block h-[2px] rounded-full transition-colors duration-500 ${
                    i === sel ? "bg-[#111827]" : "bg-[#E5E7EB] group-hover:bg-[#C9CED6]"
                  }`}
                />
              </button>
            ))}
          </div>

          <Crossfade index={sel} className="mt-8 md:mt-12">
            {RECORDS.map((r) => (
              <div
                key={r.slug}
                className="grid gap-y-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-8"
              >
                <p className="m-0 flex items-start gap-1.5 text-[28px] md:text-[32px] font-semibold leading-none tracking-[-0.05em]">
                  {r.album.name.toLowerCase()}
                  {r.album.featured && (
                    // A quiet star on the one to see first
                    <svg aria-label="Featured" role="img" viewBox="0 0 24 24" className="mt-0.5 size-3.5 shrink-0" fill="#D6A04A">
                      <path d="M12 2.5l2.6 6.1 6.6.6-5 4.4 1.5 6.5L12 16.7 6.3 20.1l1.5-6.5-5-4.4 6.6-.6z" />
                    </svg>
                  )}
                </p>
                <p className="m-0 text-[14px] md:text-[16px] leading-snug text-[#4B5563]">{describe(r.album)}</p>
                {r.album.href && (
                  <Link
                    href={r.album.href}
                    className="mt-2 md:mt-0 justify-self-start md:justify-self-end text-[15px] md:text-[16px] underline decoration-1 underline-offset-[6px] hover:opacity-70 transition-opacity"
                  >
                    View case study
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
    <div className={`grid ${className}`}>
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
