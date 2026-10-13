"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { EMAIL } from "@/components/records";
import type { CaseStudy as Study } from "@/data/caseStudies";

const WIDE_QUERY = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

// A cool, quiet palette for the project pages.
const INK = "#111827";
const BODY = "#4B5563";
const MUTED = "#6B7280";
const FAINT = "#A3AAB8";
const PANEL = "#EEF2F8";
const SOFT = "#F5F7FA";

const LABELS: Record<string, string> = {
  intro: "Overview",
  overview: "Context",
  research: "Research",
  solution: "Solution",
  role: "Role",
  outcome: "Outcome",
  gallery: "Gallery",
};

// Section label: a quiet number, then the name in the project's tint.
function Label({ id, tint, n }: { id: string; tint: string; n?: number }) {
  return (
    <h2 id={`${id}-title`} className="m-0 flex items-baseline gap-2.5 text-[12px] font-medium" style={{ color: tint }}>
      {n !== undefined && (
        <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
          {String(n).padStart(2, "0")}
        </span>
      )}
      {LABELS[id]}
    </h2>
  );
}

// Copy may mark phrases with **double asterisks** to pick them out in another colour.
const plain = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, "$1");
function Rich({ text, color }: { text: string; color: string }) {
  return text.split(/\*\*([^*]+)\*\*/g).map((part, i) =>
    i % 2 ? (
      <span key={i} style={{ color }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Lead({ children, tint }: { children: string; tint: string }) {
  return (
    <p
      className="m-0 mt-5 max-w-[640px] text-[24px] md:text-[26px] font-medium leading-[1.23] tracking-[-0.03em]"
      style={{ color: INK }}
    >
      <Rich text={children} color={tint} />
    </p>
  );
}

function Prose({ children }: { children: string }) {
  return (
    <p className="m-0 mt-6 max-w-[520px] text-[14.5px] leading-[1.72]" style={{ color: MUTED }}>
      {plain(children)}
    </p>
  );
}

// The share of a job board's first page that says who can apply: one tile per listing, the ones that do in blue.
const HIT = "#2D54D2";
type Chart = NonNullable<NonNullable<Study["research"]>["chart"]>;
function BoardLogo({ board }: { board: string }) {
  return (
    <span aria-hidden="true" className="grid size-8 md:size-10 shrink-0 place-items-center rounded-[8px] border bg-white" style={{ borderColor: "#E5E7EB" }}>
      {board === "linkedin" ? (
        <span className="grid size-[18px] md:size-[22px] place-items-center rounded-[3px] bg-[#0A66C2] text-[11px] md:text-[13px] font-bold leading-none text-white">in</span>
      ) : (
        <svg viewBox="0 0 24 24" className="size-[18px] md:size-[22px]">
          <rect x="4" y="5.5" width="16" height="5" rx="2.5" fill="#62BBD8" transform="rotate(-24 12 8)" />
          <rect x="4" y="13.5" width="16" height="5" rx="2.5" fill="#62BBD8" transform="rotate(-24 12 16)" />
        </svg>
      )}
    </span>
  );
}
function ListingChart({ chart }: { chart: Chart }) {
  // Every row shares one grid as wide as the longest board, so the rows line up tile for tile.
  const cols = Math.max(...chart.rows.map((r) => r.total));
  const hits = chart.rows.reduce((sum, r) => sum + r.hits, 0);
  const total = chart.rows.reduce((sum, r) => sum + r.total, 0);
  return (
    <figure className="m-0 mt-12 rounded-[12px] px-5 py-7 md:px-10 md:py-10" style={{ background: SOFT }}>
      <p className="m-0 text-[20px] md:text-[24px] font-semibold leading-tight tracking-[-0.03em]" style={{ color: INK }}>
        {chart.title}
      </p>
      <figcaption className="mt-2 text-[13px] md:text-[14.5px] leading-snug" style={{ color: MUTED }}>
        {plain(chart.note)}
      </figcaption>

      {/* Key */}
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]" style={{ color: MUTED }}>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-2 rounded-[2px]" style={{ background: HIT }} />
          States a grad year
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3.5 w-2 rounded-[2px] bg-[#DDE1E7]" />
          Doesn&apos;t say
        </span>
      </div>

      <ul className="m-0 mt-8 p-0 list-none space-y-7">
        {chart.rows.map((row) => (
          <li
            key={row.name}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] md:grid-cols-[minmax(0,148px)_minmax(0,1fr)_72px] items-center gap-x-3 md:gap-x-8 gap-y-3"
          >
            <span className="flex items-center gap-3">
              <BoardLogo board={row.logo} />
              <span className="text-[15px] md:text-[16px]" style={{ color: INK }}>
                {row.name}
              </span>
            </span>
            <span
              role="img"
              aria-label={`${row.hits} of ${row.total} listings state a grad year`}
              className="col-span-3 row-start-2 md:col-span-1 md:row-start-auto grid gap-[3px] md:gap-[5px]"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: row.total }, (_, i) => (
                <span key={i} className="h-7 md:h-8 rounded-[2px]" style={{ background: i < row.hits ? HIT : "#DDE1E7" }} />
              ))}
            </span>
            <span className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto justify-self-end text-right leading-none">
              <span className="block text-[18px] md:text-[20px] font-medium tabular-nums" style={{ color: INK }}>
                {row.hits}/{row.total}
              </span>
              <span className="mt-1 block text-[11px] tabular-nums" style={{ color: MUTED }}>
                {Math.round((row.hits / row.total) * 100)}%
              </span>
            </span>
          </li>
        ))}
      </ul>

      <p className="m-0 mt-9 pt-6 border-t text-[14px] md:text-[15px]" style={{ borderColor: "#E5E7EB", color: INK }}>
        <span className="font-semibold" style={{ color: HIT }}>
          {hits} of {total}
        </span>{" "}
        listings said who could apply.
      </p>
    </figure>
  );
}

function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`grid place-items-center ${className}`} style={{ background: PANEL }}>
      <span className="font-[family-name:var(--font-dm-mono)] text-[11px]" style={{ color: MUTED }}>
        {label}
      </span>
    </div>
  );
}

export default function CaseStudy({ study }: { study: Study }) {
  const tint = study.tint ?? study.accent;
  const showGallery = study.gallery.length > 0 || (!study.heroScreens && !study.heroImage && !study.heroEmbed);
  const sections = [
    "intro",
    "overview",
    ...(study.research ? ["research"] : []),
    "solution",
    "role",
    "outcome",
    ...(showGallery ? ["gallery"] : []),
  ];

  // Highlight the section currently in the reading band of the screen.
  const [active, setActive] = useState(sections[0]);
  // Wide screens get the list in the left column. Smaller screens get a floating bar that only appears once the
  // project name has scrolled away, since it sits over the content.
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia(WIDE_QUERY).matches, () => false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [pastTitle, setPastTitle] = useState(false);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPastTitle(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      rootMargin: "-40px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // The section list only changes with the project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [study.slug]);

  const back = `/play/${study.slug}`;
  const showBar = !wide && pastTitle;

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)]" style={{ color: INK }}>
      {/* Header */}
      <header>
        <div className="mx-auto flex h-[60px] max-w-[1146px] items-center justify-between px-6 md:pl-[52px] md:pr-[38px]">
          <Link href="/" className="text-[14px] font-medium hover:opacity-70 transition-opacity">
            Lucas Xie
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-7 text-[13px]">
            <Link href={back} aria-current="page" className="hover:opacity-70 transition-opacity">
              Work
            </Link>
            <Link href="/about" className="hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
              About
            </Link>
            <a href={EMAIL} className="hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Smaller screens: a floating pill bar once you're past the title */}
      <nav
        aria-label="On this page"
        aria-hidden={!showBar}
        inert={!showBar}
        className="lg:hidden fixed z-30 top-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-24px)]"
      >
        <div className={`transition-all duration-300 ${showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
          <ol className="m-0 flex items-center gap-0.5 overflow-x-auto rounded-full bg-white/90 p-1 list-none backdrop-blur-md shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_8px_24px_-14px_rgba(17,24,39,0.35)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((id) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className="flex items-center h-8 px-3.5 rounded-full text-[13px] transition-colors"
                  style={active === id ? { background: PANEL, color: INK } : { color: MUTED }}
                >
                  {LABELS[id]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-[1146px] px-6 md:px-[52px] pt-10 lg:pt-[76px] pb-32 lg:grid lg:grid-cols-[minmax(180px,236px)_minmax(0,732px)]">
        {/* Wide screens: all work, then the sections */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-[88px]">
            <Link href={back} className="text-[12px] hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
              All work
            </Link>
            <ol className="m-0 mt-12 p-0 list-none space-y-2.5">
              {sections.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? "true" : undefined}
                    className="flex items-center gap-2.5 text-[13px] hover:opacity-70 transition-opacity"
                    style={{ color: active === id ? INK : MUTED }}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-[5px] shrink-0 transition-opacity ${active === id ? "opacity-100" : "opacity-0"}`}
                      style={{ background: tint }}
                    />
                    {LABELS[id]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <main>
          <Link href={back} className="lg:hidden inline-block mb-6 text-[13px]" style={{ color: MUTED }}>
            ← All work
          </Link>

          {/* Product shot */}
          <div className="rounded-[16px] p-4 md:p-8" style={{ background: PANEL }}>
            {study.heroEmbed ? (
              <div className="relative aspect-video overflow-hidden rounded-[8px] bg-[#2a55c9]">
                <iframe
                  src={study.heroEmbed.src}
                  title={study.heroEmbed.title}
                  loading="lazy"
                  tabIndex={-1}
                  className="absolute inset-0 size-full border-0 pointer-events-none"
                />
              </div>
            ) : study.heroScreens ? (
              <div className="flex items-center justify-center gap-[3.5%] aspect-video px-[4%] py-[2%]">
                {study.heroScreens.map((screen) => (
                  <div
                    key={screen.src}
                    className="relative h-full aspect-[393/852] overflow-hidden rounded-[10px] shadow-[0_14px_30px_-20px_rgba(17,24,39,0.45)]"
                  >
                    <Image src={screen.src} alt={screen.alt} fill unoptimized className="object-cover" />
                  </div>
                ))}
              </div>
            ) : study.heroImage ? (
              <div className="relative aspect-video overflow-hidden rounded-[8px] bg-white">
                <Image src={study.heroImage.src} alt={study.heroImage.alt} fill className="object-cover" sizes="(max-width: 800px) 100vw, 700px" priority />
              </div>
            ) : (
              <Placeholder label="Product screenshot" className="aspect-video rounded-[8px]" />
            )}
          </div>

          {/* Overview: name, line, details */}
          <section id="intro" aria-labelledby="intro-title" className="scroll-mt-24 mt-10 md:mt-14">
            <h1
              id="intro-title"
              ref={titleRef}
              className="m-0 text-[30px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.045em]"
              style={{ color: INK }}
            >
              <Rich text={study.headline ?? study.line} color={FAINT} />
            </h1>

            {/* Role, timeline and platform, each with its label */}
            <dl className="m-0 mt-6 flex flex-wrap gap-x-8 md:gap-x-10 gap-y-3">
              {(
                [
                  ["Role", study.meta.role],
                  ["Timeline", study.meta.timeline],
                  ["Platform", study.meta.platform],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px]" style={{ color: FAINT }}>
                    {label}
                  </dt>
                  <dd className="m-0 mt-1 text-[13px]" style={{ color: BODY }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <article className="mt-16 md:mt-[84px]">
            <section id="overview" aria-labelledby="overview-title" className="scroll-mt-24">
              <Label id="overview" tint={tint} n={sections.indexOf("overview")} />
              {study.overviewLead && <Lead tint={tint}>{study.overviewLead}</Lead>}
              {typeof study.overview === "string" ? (
                <Prose>{study.overview}</Prose>
              ) : (
                <div className="mt-10 grid gap-y-10 gap-x-10 sm:grid-cols-2">
                  {study.overview.map((card, i) => (
                    <div key={card.label} className="border-t pt-5" style={{ borderColor: i === 0 ? "#E5E7EB" : INK }}>
                      <p className="m-0 text-[12px]" style={{ color: i === 0 ? FAINT : INK }}>
                        {card.label}
                      </p>
                      <p className="m-0 mt-4 text-[17px] md:text-[18px] leading-[1.5] tracking-[-0.01em]" style={{ color: INK }}>
                        {card.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {study.research && (
              <section id="research" aria-labelledby="research-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="research" tint={tint} n={sections.indexOf("research")} />
                <Lead tint={tint}>{study.research.lead}</Lead>
                {study.research.paragraphs.map((para) => (
                  <Prose key={para}>{para}</Prose>
                ))}

                {/* Evidence: how many listings on each board say who can apply */}
                {study.research.chart ? (
                  <ListingChart chart={study.research.chart} />
                ) : (
                  study.research.evidence && (
                    <figure className="m-0 mt-10">
                      {study.research.evidence.src ? (
                        <div className="relative aspect-video overflow-hidden rounded-[12px]" style={{ background: PANEL }}>
                          <Image src={study.research.evidence.src} alt={study.research.evidence.alt} fill className="object-contain" sizes="(max-width: 800px) 100vw, 732px" />
                        </div>
                      ) : (
                        <Placeholder label="[Annotated search comparison]" className="aspect-video rounded-[12px]" />
                      )}
                      <figcaption className="mt-3 text-[12px]" style={{ color: MUTED }}>
                        {study.research.evidence.caption}
                      </figcaption>
                    </figure>
                  )
                )}

                {/* Key insight */}
                <div className="mt-10 rounded-[12px] px-6 py-6 md:px-8 md:py-7" style={{ background: PANEL }}>
                  <p className="m-0 text-[12px] font-medium" style={{ color: tint }}>
                    Key insight
                  </p>
                  <p className="m-0 mt-2.5 max-w-[560px] text-[20px] md:text-[22px] font-medium leading-[1.3] tracking-[-0.02em]" style={{ color: INK }}>
                    {plain(study.research.insight)}
                  </p>
                </div>

                {/* Principles drawn from the research */}
                <ol className="m-0 mt-10 p-0 list-none grid sm:grid-cols-3 gap-x-8 gap-y-6">
                  {study.research.principles.map((item, i) => (
                    <li key={item.title}>
                      <span className="font-[family-name:var(--font-dm-mono)] text-[11px]" style={{ color: MUTED }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="m-0 mt-2 text-[14px] font-medium" style={{ color: INK }}>
                        {item.title}
                      </p>
                      <p className="m-0 mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                        {item.line}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section id="solution" aria-labelledby="solution-title" className="scroll-mt-24 mt-20 md:mt-24">
              <Label id="solution" tint={tint} n={sections.indexOf("solution")} />
              <ul className="m-0 mt-6 p-0 list-none grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {study.solution.map((item) => (
                  <li key={item.title}>
                    <p className="m-0 text-[14px] font-medium" style={{ color: INK }}>
                      {item.title}
                    </p>
                    <p className="m-0 mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                      {item.line}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="role" aria-labelledby="role-title" className="scroll-mt-24 mt-20 md:mt-24">
              <Label id="role" tint={tint} n={sections.indexOf("role")} />
              <Prose>{study.role}</Prose>
            </section>

            <section id="outcome" aria-labelledby="outcome-title" className="scroll-mt-24 mt-20 md:mt-24">
              <Label id="outcome" tint={tint} n={sections.indexOf("outcome")} />
              <Prose>{study.outcome}</Prose>
            </section>

            {showGallery && (
              <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="gallery" tint={tint} n={sections.indexOf("gallery")} />
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {study.gallery.length
                    ? study.gallery.map((img) => (
                        <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-[12px]" style={{ background: PANEL }}>
                          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 360px" />
                        </div>
                      ))
                    : ["[Screenshot]", "[Screenshot]"].map((label, i) => (
                        <Placeholder key={i} label={label} className="aspect-[4/3] rounded-[12px]" />
                      ))}
                </div>
              </section>
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
