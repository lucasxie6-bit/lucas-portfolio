"use client";

import Image from "next/image";
import { useState } from "react";
import type { CarouselSlide } from "@/data/projects";

interface PrototypeCarouselProps {
  slides: CarouselSlide[];
}

export default function PrototypeCarousel({ slides }: PrototypeCarouselProps) {
  const [index, setIndex] = useState(0);

  if (slides.length === 0) return null;

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-stone-50 ring-1 ring-stone-200/60 px-6 py-10 sm:py-12">
      <div className="group relative mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] aspect-[9/19.5] rounded-2xl overflow-hidden bg-white ring-1 ring-stone-200 shadow-sm">
        <Image
          src={slides[index].src}
          alt={slides[index].alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, 360px"
          priority={index === 0}
          unoptimized
        />

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous screen"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 ring-1 ring-stone-200/80 text-stone-600 hover:text-stone-900 hover:bg-white transition-all duration-200 backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next screen"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 ring-1 ring-stone-200/80 text-stone-600 hover:text-stone-900 hover:bg-white transition-all duration-200 backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        {slides.length > 1 && (
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to screen ${i + 1}`}
                aria-current={i === index}
                className="p-1.5 cursor-pointer"
              >
                <span
                  className={`block w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    i === index ? "bg-stone-700" : "bg-stone-300"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {slides[index].caption && (
        <p className="text-center text-xs text-stone-400 tracking-wide">
          {slides[index].caption}
        </p>
      )}
    </div>
  );
}
