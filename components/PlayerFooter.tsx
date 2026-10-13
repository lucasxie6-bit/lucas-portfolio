"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EMAIL, INBOX } from "@/components/records";

export type FooterLink = { label: string; href: string };

// A small now-playing bar pinned to the bottom of the page. The thin line along its bottom edge tracks scroll progress.
export default function PlayerFooter({ links, className = "" }: { links: FooterLink[]; className?: string }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(INBOX);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = EMAIL;
    }
  };

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className={`sticky bottom-3 z-20 px-3 ${className}`}>
      <div className="relative max-w-[780px] mx-auto overflow-hidden rounded-lg bg-[#111827] text-white pl-2 pr-3 py-2 flex items-center gap-3 shadow-[0_12px_28px_-16px_rgba(17,24,39,0.7)]">
        {/* Now playing */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lx-icon.svg" alt="" width={28} height={28} className="size-7 shrink-0" />
          <div className="min-w-0 leading-tight">
            <p className="text-[12px] font-bold truncate">thanks for listening</p>
            <p className="text-[11px] text-white/50">lucas xie</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to top"
            className="hidden sm:grid place-items-center size-6 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <SkipIcon flip />
          </button>
          <a
            href={EMAIL}
            className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#F3F4F6] text-[#111827] text-[12px] font-bold hover:bg-white transition-colors"
          >
            <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
            </svg>
            say hi
          </a>
          <Link
            href="/play/useno"
            aria-label="See the work"
            className="hidden sm:grid place-items-center size-6 text-white/60 hover:text-white transition-colors"
          >
            <SkipIcon />
          </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center justify-end gap-4 flex-1">
          <button
            type="button"
            onClick={copyEmail}
            title="Copy email address"
            className="text-[12px] text-white/70 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            <span aria-live="polite">{copied ? "copied ✓" : INBOX}</span>
          </button>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-white/70 hover:text-white transition-colors whitespace-nowrap"
            >
              {link.label} ↗
            </a>
          ))}
        </div>

        <div
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10"
        >
          <div className="h-full bg-white/70" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </footer>
  );
}

function SkipIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={flip ? "rotate-180" : ""}>
      <path d="M2 2.8v10.4a.6.6 0 0 0 .92.5L10 9.2V13a1 1 0 0 0 2 0V3a1 1 0 0 0-2 0v3.8L2.92 2.3A.6.6 0 0 0 2 2.8Z" />
    </svg>
  );
}
