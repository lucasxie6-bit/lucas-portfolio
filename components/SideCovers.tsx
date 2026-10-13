"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

export type Cover = { src: string };

// Half the width of the page's content column; the covers live outside it.
const CONTENT_HALF = 430;
const GUTTER = 28;

// A composed column of covers for each margin, evenly spread from the top of the page to the bottom.
// top: share of the page height; x: 0 hugs the content, 1 sits at the outer edge; size in px; tilt in degrees.
type Slot = { top: number; x: number; size: number; tilt: number };
const LEFT: Slot[] = [
  { top: 0.02, x: 0.55, size: 172, tilt: -4 },
  { top: 0.135, x: 0.1, size: 108, tilt: 3 },
  { top: 0.24, x: 0.62, size: 136, tilt: 2 },
  { top: 0.355, x: 0.18, size: 156, tilt: -3 },
  { top: 0.47, x: 0.7, size: 100, tilt: 4 },
  { top: 0.565, x: 0.22, size: 180, tilt: -2 },
  { top: 0.685, x: 0.64, size: 120, tilt: 3 },
  { top: 0.79, x: 0.12, size: 144, tilt: -4 },
  { top: 0.9, x: 0.58, size: 112, tilt: 2 },
];
const RIGHT: Slot[] = [
  { top: 0.06, x: 0.18, size: 132, tilt: 3 },
  { top: 0.165, x: 0.62, size: 176, tilt: -2 },
  { top: 0.29, x: 0.12, size: 104, tilt: 4 },
  { top: 0.39, x: 0.56, size: 150, tilt: -3 },
  { top: 0.505, x: 0.16, size: 124, tilt: 2 },
  { top: 0.6, x: 0.66, size: 108, tilt: -4 },
  { top: 0.7, x: 0.2, size: 168, tilt: 3 },
  { top: 0.82, x: 0.6, size: 128, tilt: -2 },
  { top: 0.915, x: 0.14, size: 100, tilt: 4 },
];

type Spot = { left: number; top: number; size: number; tilt: number; dur: number; cover: Cover };

// Place one margin's covers. Sizes shrink a little on narrow margins so every cover stays on screen.
function layout(covers: Cover[], width: number, height: number, side: "left" | "right"): Spot[] {
  const margin = width / 2 - CONTENT_HALF - GUTTER * 2;
  if (margin < 100) return [];
  const slots = side === "left" ? LEFT : RIGHT;
  return slots.slice(0, covers.length).map((slot, k) => {
    const size = Math.round(Math.min(slot.size, margin * 0.9));
    const offset = GUTTER + slot.x * (margin - size);
    return {
      left: side === "left" ? width / 2 - CONTENT_HALF - offset - size : width / 2 + CONTENT_HALF + offset,
      top: Math.min(height - size, slot.top * height),
      size,
      tilt: slot.tilt,
      dur: 9 + (k % 4) * 1.3,
      cover: covers[k],
    };
  });
}

// Album covers composed down both margins on wide screens, slowly drifting.
export default function SideCovers({ covers }: { covers: Cover[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Left takes every other cover and right the rest, so the two sides never show the same one.
  const left = box ? layout(covers.filter((_, i) => i % 2 === 0), box.w, box.h, "left") : [];
  const right = box ? layout(covers.filter((_, i) => i % 2 === 1), box.w, box.h, "right") : [];

  return (
    <div ref={ref} aria-hidden="true" className="hidden xl:block absolute inset-0 pointer-events-none">
      {[...left, ...right].map((spot, k) => (
        <div
          key={spot.cover.src}
          className="side-cover absolute"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.size,
            height: spot.size,
            ["--tilt" as string]: `${spot.tilt}deg`,
            animationDuration: `${spot.dur}s`,
            animationDelay: `${-k * 1.3}s`,
          }}
        >
          <Image src={spot.cover.src} alt="" fill className="object-cover" sizes="180px" />
        </div>
      ))}
    </div>
  );
}
