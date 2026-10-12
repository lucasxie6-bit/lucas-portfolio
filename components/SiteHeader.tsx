"use client";

import Link from "next/link";

export const NAV = [
  { label: "Work", slug: "useno" },
  { label: "Lab", slug: "scan-o-matic" },
  { label: "About", slug: "about" },
];
export const CONTACT = { label: "Contact", slug: "say-hi" };

interface SiteHeaderProps {
  current: string;
  onNav?: (slug: string) => void;
}

export default function SiteHeader({ current, onNav }: SiteHeaderProps) {
  const item = (label: string, slug: string, className = "") =>
    onNav ? (
      <button type="button" onClick={() => onNav(slug)} className={`lowercase cursor-pointer hover:underline underline-offset-4 ${className}`}>
        {label}
      </button>
    ) : (
      <Link href={`/play/${slug}`} className={`hover:underline underline-offset-4 ${className}`}>
        {label}
      </Link>
    );

  return (
    <header className="relative font-[family-name:var(--font-courier)] text-[#1C191B] text-[15px] md:text-base lowercase">
      <div className="h-3.5 bg-[#2E3E43]" />
      <div className="relative grid grid-cols-[1fr_auto] md:grid-cols-[67%_1fr] items-center gap-x-6 px-4 md:pl-[25%] pt-3.5 pb-5">
        <Link href="/" className="justify-self-start hover:underline underline-offset-4">
          <span aria-hidden="true" className="mr-2 text-[#1C191B]">•</span>
          {current}
        </Link>
        <nav aria-label="Primary" className="flex items-center justify-between gap-6 md:gap-10">
          <span className="hidden md:inline">
            {NAV.map((n, i) => (
              <span key={n.slug}>
                {item(n.label, n.slug)}
                {i < NAV.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
          {item(CONTACT.label, CONTACT.slug, "ml-auto")}
        </nav>
      </div>
      <div aria-hidden="true" className="absolute right-0 bottom-0 h-2 w-[280px] max-w-[40%] bg-[#C9D3D6]" />
    </header>
  );
}
