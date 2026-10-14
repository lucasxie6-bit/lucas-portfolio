"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const BG = "#2A2722";
const SHOTS = [
  { src: "/alvarez/gallery/hoodie-black.jpg", alt: "Black hoodie with the circle print", ratio: 322 / 372 },
  { src: "/alvarez/gallery/references-01.jpg", alt: "References for the streetwear direction: Aloha, Paul Frank, a red boxing glove and surf", ratio: 382 / 372 },
  { src: "/alvarez/gallery/hoodie-white.jpg", alt: "White hoodie with the circle print", ratio: 322 / 372 },
  { src: "/alvarez/gallery/references-02.jpg", alt: "References for the retail direction: a leopard with a cassette, stamps, magazines and a racing helmet", ratio: 2000 / 1600 },
];

// The gallery as a sideways reel of mockups and moodboards, running off the right edge of the dark panel.
// Arrows step one picture at a time, and a fade on the right shows there's more until the end.
export default function AlvarezReel() {
  const ref = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEnds({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Step to the next picture whose left edge is past the current position, or back to the previous one.
  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const lefts = [...el.children].map((c) => (c as HTMLElement).offsetLeft - el.offsetLeft);
    const at = el.scrollLeft;
    const target = dir > 0 ? lefts.find((l) => l > at + 4) : [...lefts].reverse().find((l) => l < at - 4);
    el.scrollTo({ left: target ?? (dir > 0 ? el.scrollWidth : 0), behavior: "smooth" });
  };

  const arrow = (dir: 1 | -1, disabled: boolean) => (
    <button
      type="button"
      onClick={() => step(dir)}
      disabled={disabled}
      aria-label={dir > 0 ? "Next picture" : "Previous picture"}
      className="grid size-9 cursor-pointer place-items-center rounded-full border transition-opacity disabled:cursor-default disabled:opacity-30 hover:enabled:bg-white/10"
      style={{ borderColor: "rgba(242,234,211,0.35)", color: "#F2EAD3", background: "transparent" }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {dir > 0 ? <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" /> : <path d="M11 7H3M6.5 3.5L3 7l3.5 3.5" />}
      </svg>
    </button>
  );

  return (
    <>
      <div className="relative mt-6 -mr-6 md:-mr-10">
        <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pr-6 md:pr-10">
          {SHOTS.map((shot) => (
            <div
              key={shot.src}
              className="relative h-[260px] md:h-[340px] shrink-0 snap-start overflow-hidden rounded-[14px] bg-white"
              style={{ aspectRatio: shot.ratio }}
            >
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="(max-width: 768px) 70vw, 430px" />
            </div>
          ))}
        </div>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 transition-opacity duration-300 ${ends.end ? "opacity-0" : "opacity-100"}`}
          style={{ background: `linear-gradient(to right, rgba(42,39,34,0), ${BG})` }}
        />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="m-0 text-[13px]" style={{ color: "#A49B88" }}>
          Two directions and the references behind them
        </p>
        <div className="flex shrink-0 gap-2">
          {arrow(-1, ends.start)}
          {arrow(1, ends.end)}
        </div>
      </div>
    </>
  );
}
