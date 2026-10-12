"use client";

import { useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import { CoverArt, PROJECT_SLUGS, itemBySlug, type Item } from "@/components/records";
import { getAlbumBySlug, type Album } from "@/data/albums";

interface Record {
  slug: string;
  item: Item;
  album: Album;
}

const RECORDS: Record[] = PROJECT_SLUGS.map((slug) => ({
  slug,
  item: itemBySlug(slug)!,
  album: getAlbumBySlug(slug)!,
}));

// Cover art is sized for the ~248px homepage sleeve; scale it to the case width.
const cq = (px: number) => `${((px / 248) * 100).toFixed(2)}cqw`;

export default function CDRack({ initialSlug }: { initialSlug?: string }) {
  const [sel, setSel] = useState(() => Math.max(0, RECORDS.findIndex((r) => r.slug === initialSlug)));
  const rec = RECORDS[sel];

  const pick = (i: number) => {
    setSel(i);
    window.history.replaceState(null, "", `/play/${RECORDS[i].slug}`);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)] flex flex-col overflow-x-hidden">
      <TopBar className="px-6 md:px-12 pt-8 lg:pt-10" />

      <main className="flex-1 min-h-0 px-6 md:px-12 py-10 lg:py-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="flex justify-center">
          <CDCase key={sel} rec={rec} />
        </div>
        <div key={`np-${sel}`} className="rack-tracks flex flex-col gap-4">
          <span className="text-[13px] text-[#8A847A]">now playing · {rec.album.kind.toLowerCase()}</span>
          <h1 className="m-0 font-[family-name:var(--font-archivo)] font-normal text-5xl md:text-[72px] leading-[0.9] tracking-[-0.02em] lowercase">
            {rec.album.name}
          </h1>
          <p className="m-0 text-[17px] leading-[1.45] text-[#5E5852] max-w-[440px] lowercase">{rec.album.line}</p>
          {rec.album.href && (
            <Link
              href={rec.album.href}
              className="mt-2 self-start inline-flex items-center gap-2.5 h-11 px-5 rounded-full bg-[#1C191B] text-white text-[14px] hover:bg-[#3A3533] transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />
              </svg>
              read the case study
            </Link>
          )}
        </div>
      </main>

      <div className="px-6 md:px-12 pb-8">
        <div className="flex items-end gap-1.5 h-[190px] overflow-x-auto">
          {RECORDS.map((r, i) => (
            <Spine key={r.slug} rec={r} selected={i === sel} onPick={() => pick(i)} />
          ))}
        </div>
        <div className="h-0.5 bg-[#1C191B]" />
      </div>
    </div>
  );
}

function CDCase({ rec }: { rec: Record }) {
  const { item, album } = rec;
  return (
    <div
      className="rack-case relative w-[min(360px,40vh,78vw)] aspect-square shadow-[0_30px_50px_-24px_rgba(28,25,27,0.55)]"
      style={{ containerType: "inline-size" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-center box-border pl-[8%]"
        style={{ background: item.bg, color: item.fg }}
      >
        <span
          className="leading-[0.92] whitespace-pre-line"
          style={{ fontFamily: item.font, fontSize: cq(item.size), fontStyle: item.italic ? "italic" : "normal" }}
        >
          <CoverArt it={item} />
        </span>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-[5.2%] bg-[rgba(28,25,27,0.28)] border-r border-white/45" />
      <div
        className="absolute inset-0 box-border border-2 border-white/55"
        style={{
          background:
            "linear-gradient(125deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 34%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.14) 78%, rgba(255,255,255,0) 100%)",
        }}
      />
      <span className="absolute left-[8%] bottom-[4%] text-[11px] opacity-75" style={{ color: item.fg }}>
        lucas xie · {album.year}
      </span>
      <div
        className="absolute -right-[5%] -top-[5%] w-[22%] aspect-square rounded-full bg-[#FF7A1A] text-[#1C191B] border-2 border-[#1C191B] flex items-center justify-center text-center rotate-12 leading-none whitespace-pre-line font-[family-name:var(--font-bungee)] text-[3.1cqw]"
      >
        {album.sticker}
      </div>
    </div>
  );
}

function Spine({ rec, selected, onPick }: { rec: Record; selected: boolean; onPick: () => void }) {
  const { item } = rec;
  return (
    <button
      type="button"
      onClick={onPick}
      aria-label={`Pull out ${item.name}`}
      aria-pressed={selected}
      className="rack-spine relative w-[52px] h-[168px] shrink-0 border-0 p-0 cursor-pointer shadow-[inset_-5px_0_0_rgba(0,0,0,0.1),inset_2px_0_0_rgba(255,255,255,0.3)]"
      style={{ background: item.bg, color: item.art === "sponty" ? item.chipFg : item.fg, marginBottom: selected ? 22 : 0 }}
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-[15px] font-medium">
        {item.name}
      </span>
    </button>
  );
}
