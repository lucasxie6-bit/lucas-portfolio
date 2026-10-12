"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export type Photo = { src: string; alt: string; ratio: number };

// Three copies side by side; we stay in the middle one and jump a full copy whenever we drift into the outer ones.
const COPIES = 3;
const SPEED = 28; // px per second
const RESUME_AFTER = 1500; // ms after the last touch, wheel or drag

export default function PhotoStrip({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Width of one copy, measured between the first photo of copy 1 and copy 2 so the gap is included.
    const period = () => {
      const items = el.children;
      return (items[photos.length] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
    };
    let pos = period();
    el.scrollLeft = pos;

    const wrap = () => {
      const p = period();
      if (el.scrollLeft < p * 0.5) el.scrollLeft += p;
      else if (el.scrollLeft > p * 1.5) el.scrollLeft -= p;
    };

    let pausedUntil = 0;
    const hold = () => {
      pausedUntil = performance.now() + RESUME_AFTER;
    };

    // Mouse drag, so it can be swiped without a trackpad.
    let dragX: number | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragX = e.clientX;
      el.style.cursor = "grabbing";
      hold();
    };
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return;
      el.scrollLeft -= e.clientX - dragX;
      dragX = e.clientX;
      hold();
    };
    const onUp = () => {
      dragX = null;
      el.style.cursor = "";
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (reduced || now < pausedUntil || dragX !== null) {
        pos = el.scrollLeft;
      } else {
        pos += (SPEED * dt) / 1000;
        el.scrollLeft = pos;
      }
      const before = el.scrollLeft;
      wrap();
      pos += el.scrollLeft - before;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    el.addEventListener("wheel", hold, { passive: true });
    el.addEventListener("touchstart", hold, { passive: true });
    el.addEventListener("touchmove", hold, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("wheel", hold);
      el.removeEventListener("touchstart", hold);
      el.removeEventListener("touchmove", hold);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [photos.length]);

  return (
    <div
      ref={ref}
      className="flex gap-3 overflow-x-auto pb-2 cursor-grab select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {Array.from({ length: COPIES }, (_, copy) =>
        photos.map((photo) => (
          <div
            key={`${copy}-${photo.src}`}
            aria-hidden={copy !== 1}
            className="relative h-[170px] md:h-[200px] shrink-0 overflow-hidden rounded-xl bg-[#E8E3D9]"
            style={{ aspectRatio: photo.ratio }}
          >
            <Image
              src={photo.src}
              alt={copy === 1 ? photo.alt : ""}
              fill
              draggable={false}
              className="object-cover pointer-events-none"
              sizes="360px"
            />
          </div>
        )),
      )}
    </div>
  );
}
