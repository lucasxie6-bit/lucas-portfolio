"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { CoverArt, PROJECT_SLUGS, itemBySlug, type Item } from "@/components/records";
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
type Slot = { size: number; cx: number; op: number; z: number };
const WIDE: Record<string, Slot> = {
  "0": { size: 27.8, cx: 50, op: 1, z: 5 },
  "1": { size: 20.1, cx: 72.9, op: 0.6, z: 4 },
  "-1": { size: 20.1, cx: 27.1, op: 0.6, z: 4 },
  "2": { size: 13.9, cx: 88.9, op: 0.28, z: 3 },
  "-2": { size: 13.9, cx: 11.1, op: 0.28, z: 3 },
};
const NARROW: Record<string, Slot> = {
  "0": { size: 58, cx: 50, op: 1, z: 5 },
  "1": { size: 38, cx: 92, op: 0.5, z: 4 },
  "-1": { size: 38, cx: 8, op: 0.5, z: 4 },
  "2": { size: 0, cx: 110, op: 0, z: 3 },
  "-2": { size: 0, cx: -10, op: 0, z: 3 },
};

const NARROW_QUERY = "(max-width: 767px)";
const subscribeNarrow = (onChange: () => void) => {
  const mq = window.matchMedia(NARROW_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function CDRack({ initialSlug }: { initialSlug?: string }) {
  const [sel, setSel] = useState(() => Math.max(0, RECORDS.findIndex((r) => r.slug === initialSlug)));
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia(NARROW_QUERY).matches, () => false);
  const slots = narrow ? NARROW : WIDE;
  const n = RECORDS.length;
  const rec = RECORDS[sel];

  const pick = (i: number) => {
    setSel(i);
    window.history.replaceState(null, "", `/play/${RECORDS[i].slug}`);
  };
  const step = (d: number) => pick((sel + d + n) % n);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)] flex flex-col overflow-x-hidden">
      <TopBar className="px-6 md:px-12 pt-8 lg:pt-10 relative z-10" />

      <main className="flex-1 flex flex-col justify-center pb-12">
        <div className="relative w-full mt-8 md:mt-6" style={{ containerType: "inline-size" }}>
          <div className="relative w-full" style={{ height: `min(${slots["0"].size}cqw, 400px)` }}>
            {RECORDS.map((r, i) => {
              let off = (((i - sel) % n) + n) % n;
              if (off > 2) off -= n;
              const s = slots[String(off)];
              const size = `min(${s.size}cqw, ${Math.round((s.size / slots["0"].size) * 400)}px)`;
              return (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => (off === 0 ? undefined : pick(i))}
                  aria-label={off === 0 ? `${r.item.name}, now playing` : `Play ${r.item.name}`}
                  aria-current={off === 0 ? "true" : undefined}
                  tabIndex={s.op === 0 ? -1 : 0}
                  className={`flow-cover absolute top-1/2 border-0 p-0 ${off === 0 ? "cursor-default" : "cursor-pointer"}`}
                  style={{
                    width: size,
                    height: size,
                    left: `calc(${s.cx}% - ${size} / 2)`,
                    transform: "translateY(-50%)",
                    opacity: s.op,
                    zIndex: s.z,
                    background: r.item.bg,
                    color: r.item.fg,
                    containerType: "inline-size",
                    boxShadow: off === 0 ? "0 34px 60px -30px rgba(28,25,27,0.55)" : Math.abs(off) === 1 ? "0 20px 40px -26px rgba(28,25,27,0.45)" : "none",
                  }}
                >
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
                  {off === 0 && r.slug === "useno" && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-[5%] -top-[5%] w-[19%] aspect-square rounded-full bg-[#EE7A2E] text-[#1C191B] grid place-items-center text-center rotate-[10deg] font-bold leading-[1.05] text-[3cqw]"
                    >
                      lead
                      <br />
                      single
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div key={sel} className="rack-tracks mt-12 md:mt-14 px-6 flex flex-col items-center text-center">
          <span className="font-[family-name:var(--font-dm-mono)] text-[13px] text-[#8A847A]">
            now playing · {rec.album.kind.toLowerCase()} · {pad(sel + 1)} / {pad(n)}
          </span>
          <div className="mt-3.5 flex items-center gap-5 md:gap-9">
            <ArrowButton label="Previous" onClick={() => step(-1)} flip />
            <h1 className="m-0 md:min-w-[420px] font-[family-name:var(--font-archivo)] font-normal text-[48px] md:text-[80px] leading-[0.95] tracking-[-0.04em] lowercase">
              {rec.album.name}
            </h1>
            <ArrowButton label="Next" onClick={() => step(1)} />
          </div>
          <p className="m-0 mt-4 max-w-[560px] text-[17px] md:text-[19px] leading-[1.45] text-[#4A4541] lowercase">{rec.album.line}</p>
          {rec.album.href && (
            <Link
              href={rec.album.href}
              className="mt-6 inline-flex items-center gap-2.5 h-11 px-5 rounded-full bg-[#1C191B] text-white text-[15px] hover:bg-[#3A3533] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
              </svg>
              {rec.album.cta.replace(/^Play — /, "").toLowerCase()}
            </Link>
          )}
        </div>
      </main>
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
