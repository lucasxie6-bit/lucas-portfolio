import Image from "next/image";
import type { Tab } from "@/app/page";
import HeroAnimation from "@/components/HeroAnimation";

const navLinks: { label: string; tab: Tab }[] = [
  { label: "Work", tab: "work" },
  { label: "About", tab: "about" },
  { label: "Contact", tab: "contact" },
];

interface HeroProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Hero({ activeTab, onTabChange }: HeroProps) {
  return (
    <header className="relative overflow-hidden pt-40 pb-0">
      {/* <HeroAnimation /> */}
      <div className="px-8 md:px-16 lg:px-24 font-[family-name:var(--font-inter)]">
        <div className="mb-2 md:mb-3">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-medium text-stone-800 leading-[1.1] tracking-wide lowercase">
            lucas xie
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-400 mb-1 md:mb-2">
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 md:w-4 md:h-4">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Toronto
          </span>
          <span className="text-stone-300" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 md:w-4 md:h-4">
              <path d="M22 10v6M2 10l10-6 10 6-10 6z" />
              <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
            </svg>
            Commerce / Queen&apos;s University
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm leading-relaxed mb-5 md:mb-6 tracking-wide text-stone-500">
          Helping early-stage ideas find traction and grow.
        </p>

        {/* Tab nav */}
        <nav aria-label="Page sections">
          <ul className="flex items-center gap-1.5 md:gap-2">
            {navLinks.map((l) => {
              const isActive = activeTab === l.tab;
              return (
                <li key={l.tab}>
                  <button
                    onClick={() => onTabChange(l.tab)}
                    className={`text-sm md:text-base px-4 md:px-5 py-1.5 md:py-2 rounded-full transition-all duration-200 tracking-wide cursor-pointer ${
                      isActive
                        ? "bg-[#9C7B5A]/80 text-white"
                        : "text-stone-400 hover:text-stone-600 hover:bg-stone-200/60"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="px-8 md:px-16 lg:px-24 mt-5">
        <div className="h-px bg-stone-300/50" />
      </div>
    </header>
  );
}

