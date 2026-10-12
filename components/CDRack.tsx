"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { albums, type Album, type CoverFont, type Track } from "@/data/albums";
import SiteHeader from "@/components/SiteHeader";

const FONT: Record<CoverFont, string> = {
  archivo: "var(--font-archivo), sans-serif",
  bungee: "var(--font-bungee), sans-serif",
  serif: "var(--font-instrument), serif",
  mono: "var(--font-dm-mono), monospace",
};

const MONO = "font-[family-name:var(--font-dm-mono)]";
const ARCHIVO = "font-[family-name:var(--font-archivo)]";
const SERIF = "font-[family-name:var(--font-instrument)]";
const MUTED = "text-[#736D63]";

// Cover art is drawn for a 420px case; express sizes as a share of the case width.
const cq = (px: number) => `${((px / 420) * 100).toFixed(2)}cqw`;

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

function SmartLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={className} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function CDRack({ initialSlug }: { initialSlug?: string }) {
  const [sel, setSel] = useState(() => Math.max(0, albums.findIndex((a) => a.slug === initialSlug)));
  const featureRef = useRef<HTMLElement>(null);
  const album = albums[sel];

  const pick = (i: number) => {
    setSel(i);
    window.history.replaceState(null, "", `/play/${albums[i].slug}`);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      featureRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1C191B] font-[family-name:var(--font-dm-sans)] flex flex-col overflow-x-hidden">
      <SiteHeader current={album.name} onNav={(slug) => pick(albums.findIndex((a) => a.slug === slug))} />

      <section
        ref={featureRef}
        aria-label="Now playing"
        className="scroll-mt-4 px-6 md:px-16 mt-12 lg:mt-12 lg:h-[470px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center"
      >
        <div className="lg:col-span-5 flex justify-center pt-4 lg:pt-0">
          <CDCase key={sel} album={album} />
        </div>
        <NowPlaying key={`np-${sel}`} album={album} />
      </section>

      <div
        className={`px-6 md:px-16 mt-12 lg:mt-[34px] flex justify-between gap-4 ${MONO} text-[11px] tracking-[0.12em] lowercase ${MUTED}`}
      >
        <span>The rack — pick a spine</span>
        <span>{albums.length} in stock — more pressing</span>
      </div>

      <div className="px-6 md:px-16 mt-2 lg:mt-4">
        <div className="h-[268px] lg:h-[236px] flex items-end gap-1.5 px-[18px] overflow-x-auto lg:overflow-visible">
          {albums.map((a, i) => (
            <Spine key={a.name} album={a} index={i} selected={i === sel} onPick={() => pick(i)} />
          ))}
          <div className="hidden lg:flex flex-1 self-stretch items-end justify-end pb-[14px]" aria-hidden="true">
            <div className="w-6 h-40 bg-[#1C191B]" />
            <span className={`${SERIF} italic text-[22px] ml-[18px] mb-[60px] whitespace-nowrap`}>← flip through</span>
          </div>
        </div>
      </div>
      <div className="mx-4 md:mx-10 h-[14px] bg-[#1C191B]" />
      <div className="mx-4 md:mx-10 h-2 bg-[#B9B1A3] mb-4" />
    </div>
  );
}

function CDCase({ album }: { album: Album }) {
  return (
    <div
      className="rack-case relative w-[min(420px,78vw)] aspect-square shadow-[0_30px_50px_-24px_rgba(28,25,27,0.55)]"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-center box-border"
        style={{ background: album.bg, color: album.fg, padding: `${cq(36)} ${cq(30)} ${cq(30)} ${cq(52)}` }}
      >
        <span
          className="leading-[0.92] whitespace-pre-line"
          style={{
            fontFamily: FONT[album.font],
            fontSize: cq(album.coverSize),
            fontStyle: album.coverItalic ? "italic" : "normal",
          }}
        >
          {album.coverTitle}
        </span>
      </div>
      <div
        className="absolute left-0 top-0 bottom-0 bg-[rgba(28,25,27,0.28)] border-r border-white/45"
        style={{ width: cq(22) }}
      />
      <div
        className="absolute inset-0 box-border border-2 border-white/55"
        style={{
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.14) 78%, rgba(255,255,255,0) 100%)",
        }}
      />
      <span
        className={`absolute ${MONO} text-[10px] tracking-[0.1em] lowercase opacity-80`}
        style={{ left: cq(34), bottom: cq(16), color: album.fg }}
      >
        Lucas Xie — {album.year}
      </span>
      <div
        className="absolute rounded-full bg-[#FF7A1A] text-[#1C191B] border-2 border-[#1C191B] flex items-center justify-center text-center rotate-12 leading-none whitespace-pre-line font-[family-name:var(--font-bungee)]"
        style={{ right: cq(-22), top: cq(-22), width: cq(92), height: cq(92), fontSize: cq(13) }}
      >
        {album.sticker}
      </div>
    </div>
  );
}

function NowPlaying({ album }: { album: Album }) {
  return (
    <div className="rack-tracks lg:col-start-7 lg:col-span-6 flex flex-col gap-[18px] lowercase">
      <span className={`${MONO} text-xs tracking-[0.12em] lowercase`}>Now playing — {album.kind}</span>
      <h1 className={`m-0 ${ARCHIVO} font-normal text-5xl md:text-[72px] leading-[0.9] tracking-[-0.02em] lowercase`}>
        {album.name}
      </h1>
      <p className={`m-0 ${SERIF} italic text-[22px] md:text-[26px] leading-[1.2] max-w-[560px]`}>{album.line}</p>
      <ol className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-x-8 text-[15px]">
        {album.tracks.map((t, i) => (
          <TrackRow key={t.label} track={t} n={i + 1} />
        ))}
      </ol>
      {album.href ? (
        <SmartLink
          href={album.href}
          className={`self-start inline-flex items-center gap-2.5 h-12 px-[22px] bg-[#1C191B] text-[#F6F3EC] no-underline ${MONO} text-[13px] tracking-[0.08em] lowercase hover:bg-[#D9263D] transition-colors`}
        >
          <span aria-hidden="true">▶</span> {album.cta}
        </SmartLink>
      ) : (
        <span
          aria-disabled="true"
          className={`self-start inline-flex items-center gap-2.5 h-12 px-[22px] bg-[#1C191B] text-[#F6F3EC] opacity-45 ${MONO} text-[13px] tracking-[0.08em] lowercase cursor-not-allowed`}
        >
          <span aria-hidden="true">▶</span> {album.cta}
        </span>
      )}
    </div>
  );
}

function TrackRow({ track, n }: { track: Track; n: number }) {
  const num = String(n).padStart(2, "0");
  return (
    <li className="flex gap-3 py-2 border-t border-[#DCD6CB]">
      <span className={`${MONO} text-xs ${MUTED} pt-0.5`}>{num}</span>
      {track.href ? (
        <SmartLink href={track.href} className="hover:text-[#D9263D] transition-colors">
          {track.label}
        </SmartLink>
      ) : (
        <span>{track.label}</span>
      )}
    </li>
  );
}

function Spine({
  album,
  index,
  selected,
  onPick,
}: {
  album: Album;
  index: number;
  selected: boolean;
  onPick: () => void;
}) {
  const spineFont = album.font === "mono" ? FONT.archivo : FONT[album.font];
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={`Pull out ${album.name}`}
      aria-pressed={selected}
      className="rack-spine relative w-[58px] h-[218px] shrink-0 border-0 p-0 cursor-pointer shadow-[inset_-6px_0_0_rgba(0,0,0,0.12),inset_2px_0_0_rgba(255,255,255,0.35)]"
      style={{ background: album.bg, color: album.fg, marginBottom: selected ? 30 : 0 }}
    >
      <span className={`absolute left-1/2 top-[14px] -translate-x-1/2 ${MONO} text-[10px]`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-[17px] tracking-[0.04em] lowercase"
        style={{ fontFamily: spineFont }}
      >
        {album.name}
      </span>
      <span
        className="absolute left-1/2 bottom-3 -translate-x-1/2 w-[18px] h-[18px] rounded-full"
        style={{ background: album.dot }}
      />
    </button>
  );
}
