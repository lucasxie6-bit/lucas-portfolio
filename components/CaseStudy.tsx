"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SpontyMap from "@/components/SpontyMap";
import GroveDots from "@/components/GroveDots";
import AlvarezHero from "@/components/AlvarezHero";
import SparkHero from "@/components/SparkHero";
import AlvarezReel from "@/components/AlvarezReel";
import AlvarezContext from "@/components/AlvarezContext";
import AlvarezOutcome from "@/components/AlvarezOutcome";
import { SparkContext, SparkSolution } from "@/components/SparkSections";
import { SparkGallery } from "@/components/SparkScreens";
import AlvarezSolution from "@/components/AlvarezSolution";
import type { CaseStudy as Study } from "@/data/caseStudies";

const WIDE_QUERY = "(min-width: 1024px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

// A cool, quiet palette for the project pages.
const INK = "#111827";
const MUTED = "#6B7280";
const FAINT = "#A3AAB8";
const PANEL = "#EEF2F8";
const NAVY = "#1B2D58";
const SMOOTH = "cubic-bezier(0.22, 1, 0.36, 1)";
const SOFT = "#F5F7FA";

const LABELS: Record<string, string> = {
  intro: "Overview",
  overview: "Context",
  research: "Research",
  exploration: "Design Exploration",
  solution: "Solution",
  decisions: "Key design decisions",
  role: "Role",
  outcome: "Outcome",
  gallery: "Gallery",
};
// Shorter names for the floating bar on smaller screens, so more of it fits.
const SHORT: Record<string, string> = { exploration: "Exploration", decisions: "Decisions" };

// Section label: a quiet number, then the name in the project's tint.
function Label({ id, tint, n, text }: { id: string; tint: string; n?: number; text?: string }) {
  return (
    <h2 id={`${id}-title`} className="m-0 flex items-baseline gap-2.5 text-[12px] font-medium" style={{ color: tint }}>
      {n !== undefined && (
        <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
          {String(n).padStart(2, "0")}
        </span>
      )}
      {text ?? LABELS[id]}
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
    </figure>
  );
}

// One listing, and how each kind of app answers "can I apply?": job boards bury it, other apps tag it, useno says it.
function EligibilityCard() {
  const rows = [
    { who: "Job boards", answer: "Buried in the description", mark: "\u00d7", tone: { bg: "#FBE7E2", fg: "#B5513B" } },
    { who: "Other apps", answer: "Tags, but no answer", mark: "?", tone: { bg: "#FDF1D2", fg: "#B7791F" } },
    { who: "useno", answer: "Open to 1st and 2nd years", mark: "check", tone: { bg: "#DDF0E4", fg: "#2F7D4F" } },
  ];
  return (
    <figure className="m-0 mt-5 rounded-[16px] p-2.5 md:p-4" style={{ background: "#EEF1F5" }}>
      <div aria-hidden="true" className="rounded-[18px] bg-white px-5 py-7 md:px-9 md:py-9">
        <div className="flex items-center gap-3.5">
          <span className="grid size-10 md:size-[42px] shrink-0 place-items-center rounded-[9px] border bg-white" style={{ borderColor: "#E5E7EB" }}>
            <svg viewBox="0 0 40 28" className="w-6 md:w-7">
              <rect width="40" height="28" rx="2" fill="#76B900" />
              <path d="M7 15c4-6 13-8 21-3-5-1-10 0-13 3 3 3 8 4 13 3-8 5-17 3-21-3Z" fill="#fff" />
              <path d="M15 15c2-2 5-3 8-2-2 1-3 2-3 2s1 1 3 2c-3 1-6 0-8-2Z" fill="#76B900" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-semibold" style={{ color: INK }}>
              NVIDIA
            </span>
            <span className="mt-0.5 block text-[12.5px] md:text-[13px]" style={{ color: "#9CA3AF" }}>
              Santa Clara · Summer 2027
            </span>
          </span>
        </div>
        <p className="m-0 mt-4 md:mt-5 text-[24px] md:text-[33px] font-bold leading-[1.05] tracking-[-0.05em] md:whitespace-nowrap" style={{ color: INK }}>
          Software Engineering Intern
        </p>

        <p className="m-0 mt-5 md:mt-6 inline-block rounded-full px-3 py-1.5 text-[12px] md:text-[12.5px] font-semibold" style={{ background: "#F1F3F6", color: NAVY }}>
          Can I apply?
        </p>
        <ul className="m-0 mt-3 p-0 list-none space-y-1.5">
          {rows.map((row, i) => {
            const last = i === rows.length - 1;
            return (
              <li
                key={row.who}
                className={`grid grid-cols-[28px_minmax(0,1fr)] md:grid-cols-[24px_100px_minmax(0,1fr)] items-center gap-x-3 md:gap-x-4 gap-y-0.5 rounded-[12px] border px-4 py-2.5 md:px-5 md:py-3.5 ${
                  last ? "shadow-[0_14px_30px_-18px_rgba(17,24,39,0.28)]" : ""
                }`}
                style={{ borderColor: "#E5E7EB" }}
              >
                <span
                  className="row-span-2 md:row-span-1 grid size-6 place-items-center rounded-full text-[11px] font-bold"
                  style={{ background: row.tone.bg, color: row.tone.fg }}
                >
                  {row.mark === "check" ? (
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 5.2 4.2 7.4 8 3" />
                    </svg>
                  ) : (
                    row.mark
                  )}
                </span>
                <span className="text-[13px] md:text-[13.5px] font-semibold" style={{ color: last ? INK : MUTED }}>
                  {row.who}
                </span>
                <span
                  className={last ? "text-[14px] md:text-[15px] font-semibold tracking-[-0.01em]" : "text-[13px] md:text-[13.5px]"}
                  style={{ color: last ? INK : "#9CA3AF" }}
                >
                  {row.answer}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="sr-only">
        A Software Engineering Intern listing at NVIDIA. Job boards bury who can apply in the description, other apps show
        tags without an answer, and useno says it is open to 1st and 2nd years.
      </figcaption>
    </figure>
  );
}

// useno's search screen: the query on top, five filters beside the results, and every result led by its match score.
const FILTERS = [
  { name: "Location", value: "New York" },
  { name: "Work style", value: "" },
  { name: "Role type", value: "Internship" },
  { name: "Posted", value: "" },
  { name: "Pay", value: "" },
];
const RESULTS = [
  { match: 83, title: "Quantitative Developer Intern (Summer 2027 \u2013 New York)", company: "Jain Global", where: "New York, NY", when: "today", logo: "jain" },
  { match: 82, title: "Software Engineering Intern \u2013 Winter 2027", company: "Replit", where: "Foster City, CA", when: "5d ago", logo: "replit" },
  { match: 80, title: "Software Engineering Intern (Summer 2027)", company: "Harvey", where: "NY", when: "1w ago", logo: "harvey" },
] as const;

function ResultLogo({ logo }: { logo: (typeof RESULTS)[number]["logo"] }) {
  if (logo === "jain")
    return (
      <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded-full bg-[#7B8494] text-[9px] font-semibold text-white">
        J
      </span>
    );
  if (logo === "replit")
    return (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0">
        <path d="M4 2h4v4H4zM8 6h4v4H8zM4 10h4v4H4z" fill="#F26207" />
      </svg>
    );
  return (
    <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded-[3px] bg-[#111] text-[10px] font-bold text-white">
      H
    </span>
  );
}

function Chevron({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#C4C8CE" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={down ? "rotate-90" : ""}>
      <path d="M3.5 2 6.5 5 3.5 8" />
    </svg>
  );
}

// The search screen plays out on a loop while it's on screen: the query types itself, two filters switch on, then the
// results arrive one by one with their match scores counting up. With reduced motion it simply shows the end state.
const QUERY = "Software internships in New York";
const LOOP_MS = 10000;
const DONE_MS = 5000;
const EXIT_MS = 9200;
const TYPE_START = 400;
// Each character lands a little unevenly, like someone typing; a pause after each word.
const TYPE_AT = QUERY.split("").reduce<number[]>((at, ch, i) => {
  const prev = i ? at[i - 1] : TYPE_START;
  at.push(prev + (QUERY[i - 1] === " " ? 90 : 0) + 28 + ((i * 37) % 23));
  return at;
}, []);
const FILTER_ON: Record<string, number> = { Location: 2100, "Role type": 2450 };
const RESULT_START = 2900;
const RESULT_GAP = 220;
const COUNT_MS = 1100;

// Plays a looping timeline (in ms) while the element is on screen; restarts from zero each time it comes back into
// view. With reduced motion it stays on `done`, the finished frame.
function useLoopTimeline(ref: React.RefObject<HTMLElement | null>, loop: number, done: number) {
  const [t, setT] = useState(done);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      setT((now - start) % loop);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        start = 0;
        raf = requestAnimationFrame(tick);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, loop]);
  return t;
}

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

function DiscoveryLayout() {
  const ref = useRef<HTMLElement>(null);
  const t = useLoopTimeline(ref, LOOP_MS, DONE_MS);
  const exiting = t >= EXIT_MS;
  const typed = QUERY.slice(0, TYPE_AT.filter((at) => t >= at).length);
  const typing = typed.length > 0 && typed.length < QUERY.length;
  const filterValue = (f: (typeof FILTERS)[number]) => (f.value && !exiting && t >= (FILTER_ON[f.name] ?? 0) ? f.value : "");
  return (
    <figure ref={ref} className="m-0 mt-5">
      <div aria-hidden="true" className="grid gap-7 rounded-[16px] border bg-white p-5 md:grid-cols-[minmax(0,205px)_minmax(0,1fr)] md:gap-10 md:p-8" style={{ borderColor: "#E9EBEF" }}>
        {/* Search and filters */}
        <div>
          <div className="flex min-w-0 items-center">
            <div className="flex h-10 min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-[10px] px-3 text-[12px]" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" className="shrink-0">
                <circle cx="7" cy="7" r="4.6" />
                <path d="m10.5 10.5 3 3" />
              </svg>
              <span className="truncate transition-opacity duration-500" style={{ color: typed ? INK : "#9CA3AF", opacity: exiting ? 0 : 1 }}>
                {typed || "Search internships"}
                {typing && <span className="ml-px inline-block h-[13px] w-px translate-y-[2px] bg-[#111827]" />}
              </span>
            </div>
          </div>
          <ul className="m-0 mt-2 p-0 list-none">
            {FILTERS.map((f) => (
              <li key={f.name}>
                <span className="flex items-center justify-between gap-2 border-b py-2.5 text-[13px]" style={{ borderColor: "#EEF0F3" }}>
                  <span style={{ color: INK }}>{f.name}</span>
                  <span className="flex items-center gap-1.5" style={{ color: filterValue(f) ? INK : "#B0B5BE", transition: `color 600ms ${SMOOTH}` }}>
                    <span key={filterValue(f) || "any"} className="search-swap">
                      {filterValue(f) || "Any"}
                    </span>
                    <Chevron />
                  </span>
                </span>
              </li>
            ))}
            <li>
              <span className="flex items-center justify-between gap-2 py-2.5 text-[13px]">
                <span className="flex items-center gap-1.5" style={{ color: INK }}>
                  Advanced
                  <span className="rounded-full px-1.5 py-[1px] text-[10px] font-semibold text-white" style={{ background: NAVY }}>
                    useno+
                  </span>
                </span>
                <span className="flex items-center gap-1.5" style={{ color: "#B0B5BE" }}>
                  Any
                  <Chevron down />
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Results, each led by how well it matches */}
        <div>
          <ul className="m-0 p-0 list-none">
            {RESULTS.map((r, i) => {
              const from = RESULT_START + i * RESULT_GAP;
              const shown = t >= from && !exiting;
              const score = Math.round(r.match * easeOut((t - from) / COUNT_MS));
              return (
              <li
                key={r.title}
                className={`grid grid-cols-[46px_minmax(0,1fr)] sm:grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2.5 py-4 md:gap-x-5 ${i < RESULTS.length - 1 ? "border-b" : ""}`}
                style={{
                  borderColor: "#EEF0F3",
                  opacity: shown ? 1 : 0,
                  filter: shown ? "blur(0)" : "blur(6px)",
                  transform: shown ? "none" : "translateY(10px)",
                  transition: `opacity 800ms ${SMOOTH}, filter 800ms ${SMOOTH}, transform 800ms ${SMOOTH}`,
                  transitionDelay: exiting ? `${(RESULTS.length - 1 - i) * 70}ms` : "0ms",
                }}
              >
                <span className="row-span-2 self-start sm:row-span-1 sm:self-center leading-none">
                  <span className="block text-[18px] md:text-[20px] font-medium tracking-[-0.02em]" style={{ color: NAVY }}>
                    {score}%
                  </span>
                  <span className="mt-1 block text-[10.5px]" style={{ color: MUTED }}>
                    match
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] md:text-[14px] leading-snug" style={{ color: INK }}>
                    {r.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-[12px]" style={{ color: MUTED }}>
                    <ResultLogo logo={r.logo} />
                    <span className="truncate">
                      {r.company} · {r.where} · {r.when}
                    </span>
                  </span>
                </span>
                {/* On phones Apply drops under the listing so the title gets the full width */}
                <span className="col-start-2 flex items-center sm:col-start-auto">
                  <span className="rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white md:px-4" style={{ background: NAVY }}>
                    Apply
                  </span>
                </span>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </figure>
  );
}

// Context for useno: a browser full of career-page tabs, then the same hunt as one short useno list.
const AFTER_JOBS = [
  { title: "Forward Deployed Engineer Intern", company: "Coinbase", age: "4d", logo: "coinbase" },
  { title: "Machine Learning Engineer Intern", company: "IMC Trading", age: "5d", logo: "imc" },
  { title: "Software Engineering Intern", company: "Sigma Computing", age: "1w", logo: "sigma" },
] as const;

function CompanyMark({ logo, size }: { logo: (typeof AFTER_JOBS)[number]["logo"]; size: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-[8px] border bg-white"
      style={{ width: size, height: size, borderColor: "#E5E7EB" }}
    >
      {logo === "coinbase" ? (
        <svg viewBox="0 0 24 24" style={{ width: size * 0.5, height: size * 0.5 }}>
          <circle cx="12" cy="12" r="12" fill="#1652F0" />
          <path d="M15.6 9.6a4.3 4.3 0 1 0 0 4.8" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="butt" />
        </svg>
      ) : logo === "imc" ? (
        <svg viewBox="0 0 24 24" style={{ width: size * 0.56, height: size * 0.56 }}>
          <circle cx="12" cy="12" r="10.5" fill="#2E55E4" />
          <circle cx="12" cy="12" r="4.6" fill="#fff" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" style={{ width: size * 0.56, height: size * 0.56 }}>
          <rect width="24" height="24" rx="3" fill="#111" />
          <path d="M7 6.5h10l-4.2 5.5L17 17.5H7" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function BeforeAfter({ accent, description }: { accent: string; description: string }) {
  return (
    <figure className="m-0 mt-10 grid gap-6 sm:grid-cols-2 sm:gap-[22px]">
      <figcaption className="sr-only">{description}</figcaption>

      {/* Before: tab after tab of career pages, the one that fits lost in the middle */}
      <div aria-hidden="true">
        <p className="m-0 text-[13px] font-semibold" style={{ color: "#9CA3AF" }}>
          Before
        </p>
        <div className="relative mt-3 h-[300px] overflow-hidden rounded-[12px]" style={{ background: "#F1F2F4" }}>
          <div className="absolute left-[14px] right-0 top-[20px] flex gap-[2px]">
            {["Jobs | Sage", "Careers – Auctor", "Search (99+)"].map((tab, i) => (
              <span
                key={tab}
                className="h-[26px] min-w-0 shrink-0 basis-[34%] truncate rounded-t-[6px] px-2.5 text-[11px] leading-[26px]"
                style={i === 2 ? { background: "#fff", color: "#374151" } : { background: "#E5E7EB", color: "#6B7280" }}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="absolute bottom-0 left-[14px] right-0 top-[46px] bg-white px-5 pt-5">
            {[
              ["78%", "#EAECEF"],
              ["58%", "#EAECEF"],
              ["84%", "#F3D7CE"],
              ["50%", "#EAECEF"],
            ].map(([w, c], i) => (
              <span key={i} className="mb-[15px] block h-[7px] rounded-full" style={{ width: w, background: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* After: a few internships you can actually apply to */}
      <div aria-hidden="true">
        <p className="m-0 text-[13px] font-semibold" style={{ color: accent }}>
          After
        </p>
        <div className="mt-3 h-[300px] overflow-hidden rounded-[12px] px-5 pt-[22px]" style={{ background: SOFT }}>
          <p className="m-0 flex items-center gap-2 text-[11.5px] font-semibold" style={{ color: INK }}>
            <span className="grid size-[14px] place-items-center rounded-[3px]" style={{ background: accent }}>
              <svg viewBox="0 0 100 100" className="size-[10px]" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round">
                <path d="M37.9 30.5V55C37.9 66 39.6 69.4 44.3 69.4" />
                <path d="M62.1 30.5V55C62.1 66 60.4 69.4 55.7 69.4" />
              </svg>
            </span>
            useno
          </p>
          <ul className="m-0 mt-[14px] p-0 list-none space-y-[7px]">
            {AFTER_JOBS.map((job, i) =>
              i === 0 ? (
                <li
                  key={job.title}
                  className="flex items-center gap-3 rounded-[10px] border bg-white p-3 shadow-[0_10px_24px_-14px_rgba(17,24,39,0.25)]"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <CompanyMark logo={job.logo} size={38} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold leading-[1.25]" style={{ color: INK }}>
                      {job.title}
                    </span>
                    <span className="mt-1 block text-[11.5px]" style={{ color: MUTED }}>
                      {job.company} · {job.age}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-[6px] px-3 py-[7px] text-[12px] font-semibold text-white" style={{ background: accent }}>
                    Apply
                  </span>
                </li>
              ) : (
                <li key={job.title} className="flex items-center gap-2.5 rounded-[10px] border bg-white px-3 py-2.5" style={{ borderColor: "#E5E7EB" }}>
                  <CompanyMark logo={job.logo} size={28} />
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-semibold" style={{ color: INK }}>
                      {job.title}
                    </span>
                    <span className="mt-0.5 block text-[11px]" style={{ color: MUTED }}>
                      {job.company} · {job.age}
                    </span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </figure>
  );
}

// One solution point: a pastel card with the phone screen rising out of its bottom edge, and the words beside it.
// When the row scrolls into view the phone glides up into place and the words follow.
function SolutionRow({
  n,
  item,
  flip,
  wash,
}: {
  n: number;
  item: { title: string; line: string; short?: string; src?: string; alt?: string };
  flip: boolean;
  wash: string;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  return (
    <li ref={ref} className="grid items-center gap-x-10 gap-y-5 md:grid-cols-2">
      <div
        className={`relative aspect-[6/5] overflow-hidden rounded-[22px] ${flip ? "md:order-2" : ""}`}
        style={{ background: wash }}
      >
        {item.src && (
          <div
            className="absolute left-1/2 top-[12%] w-[48%] aspect-[393/852] overflow-hidden rounded-[22px] shadow-[0_24px_50px_-24px_rgba(74,63,107,0.45)] motion-reduce:!transition-none"
            style={{
              transform: shown ? "translate(-50%, 0)" : "translate(-50%, 14%)",
              opacity: shown ? 1 : 0,
              transition: `transform 1100ms ${ease}, opacity 800ms ${ease}`,
            }}
          >
            <Image src={item.src} alt={item.alt ?? item.title} fill unoptimized={item.src.endsWith(".svg")} className="object-cover object-top" sizes="(max-width: 768px) 45vw, 200px" />
          </div>
        )}
      </div>
      <div
        className={`motion-reduce:!transition-none ${flip ? "md:order-1" : ""}`}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(10px)",
          transition: `opacity 800ms ${ease} 250ms, transform 800ms ${ease} 250ms`,
        }}
      >
        <p className="m-0 flex items-baseline gap-3 text-[19px] md:text-[22px] font-medium tracking-[-0.025em]" style={{ color: INK }}>
          <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
            {String(n).padStart(2, "0")}
          </span>
          {item.title}
        </p>
        <p className="m-0 mt-1.5 pl-[30px] text-[14px] md:text-[15px] leading-[1.6]" style={{ color: MUTED }}>
          {item.short ?? item.line}
        </p>
      </div>
    </li>
  );
}

// A self-contained animation in a 4:3 frame: a soft blue card with the animation in a white inset. It only loads once
// it's close to the screen, fades up as it arrives, and it's inert, so nothing inside can take focus and move the page.
function EmbedFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          if (entry.intersectionRatio > 0.2) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "300px 0px", threshold: [0, 0.2] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="rounded-[20px] p-2.5 md:p-3 motion-reduce:!transition-none"
      style={{
        background: "linear-gradient(155deg, #F4F7FE 0%, #E8EEFB 100%)",
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px)",
        transition: "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-white shadow-[0_14px_30px_-20px_rgba(27,45,88,0.35)]">
        {near && <iframe src={src} title={title} tabIndex={-1} inert className="absolute inset-0 size-full border-0 pointer-events-none" />}
      </div>
    </div>
  );
}

// Context as a conversation: the headline on the left, and the group chat that never turns into a plan on the right,
// until one pink bubble suggests right now.
function ChatContext({
  lead,
  sub,
  chat,
  tint,
  description,
}: {
  lead: string;
  sub: string;
  chat: { from?: string; text: string; mine?: boolean; faded?: boolean }[];
  tint: string;
  description: string;
}) {
  return (
    <div className="mt-8 grid items-center gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
      <div>
        <p className="m-0 text-[30px] md:text-[38px] font-semibold leading-[1.08] tracking-[-0.045em]" style={{ color: INK }}>
          <Rich text={lead} color={tint} />
        </p>
        <p className="m-0 mt-5 text-[16px] md:text-[18px] leading-[1.5]" style={{ color: MUTED }}>
          {sub}
        </p>
        <p className="sr-only">{description}</p>
      </div>
      <div
        aria-hidden="true"
        className="rounded-[22px] px-5 py-6 md:px-6 md:py-7"
        style={{ background: "linear-gradient(160deg, #FAEDE6 0%, #F7E9F1 50%, #F1EAF8 100%)" }}
      >
        <ul className="m-0 p-0 list-none space-y-2.5">
          {chat.map((msg, i) =>
            msg.mine ? (
              <li key={i} className="flex justify-end pt-2">
                <span className="rounded-[14px] px-4 py-2.5 text-[14px] text-white" style={{ background: tint }}>
                  {msg.text}
                </span>
              </li>
            ) : (
              <li key={i}>
                {msg.from && (
                  <span className="mb-1 block pl-2 text-[11.5px]" style={{ color: FAINT }}>
                    {msg.from}
                  </span>
                )}
                <span
                  className="inline-block rounded-[14px] px-4 py-2.5 text-[14px]"
                  style={{ background: "rgba(243, 241, 245, 0.95)", color: msg.faded ? MUTED : "#3F3A45" }}
                >
                  {msg.text}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

// The role as one line, then the steps owned as a row of soft shapes joined by a dashed line.
const STEP_SHAPES = [
  { bg: "#FBEADF", radius: "9999px" },
  { bg: "#F8E4EC", radius: "14px" },
  { bg: "#EEE6F8", radius: "9999px" },
  { bg: "#E4F1E8", radius: "14px" },
  { bg: "#F8E4EC", radius: "9999px" },
];
function RoleProcess({ statement, steps }: { statement: string; steps: string[] }) {
  return (
    <>
      <p className="m-0 mt-5 max-w-[620px] text-[17px] md:text-[19px] leading-[1.55]" style={{ color: INK }}>
        {statement}
      </p>
      <ol className="m-0 mt-8 p-0 list-none grid grid-cols-3 gap-y-6 sm:flex sm:items-start">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start sm:flex-1 sm:min-w-0">
            <span className="flex flex-col items-start">
              <span
                aria-hidden="true"
                className="block size-12 md:size-[58px]"
                style={{ background: STEP_SHAPES[i % STEP_SHAPES.length].bg, borderRadius: STEP_SHAPES[i % STEP_SHAPES.length].radius }}
              />
              <span className="mt-3 text-[12.5px] md:text-[13.5px]" style={{ color: INK }}>
                {step}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-3 mt-6 md:mt-[29px] hidden h-0 flex-1 border-t border-dashed sm:block"
                style={{ borderColor: "#DDBFD0" }}
              />
            )}
          </li>
        ))}
      </ol>
    </>
  );
}

// The outcome as a before and after: the chat that never lands, and the plan that happens instead.
// The useno outcome as a bento: the headline number in the big card, the second number in a tall one beside it,
// two wins in small cards underneath and the last one in a strip along the bottom.
const BENTO_INK = "#22365F";
function BentoCard({ item, mark, boxed }: { item: { title: string; line: string }; mark: React.ReactNode; boxed?: boolean }) {
  return (
    <div
      className="flex flex-col rounded-[16px] p-5 md:p-6"
      style={boxed ? { border: "1px solid #E5E7EB" } : { background: "#F0F2F7" }}
    >
      {mark}
      <p className="m-0 mt-8 md:mt-auto pt-0 md:pt-10 text-[15px] md:text-[16px] font-medium" style={{ color: BENTO_INK }}>
        {item.title}
      </p>
      <p className="m-0 mt-1.5 text-[13px] md:text-[14px] leading-[1.6]" style={{ color: "#4B5563" }}>
        {item.line}
      </p>
    </div>
  );
}

function OutcomeBento({
  intro,
  stats,
  highlights,
}: {
  intro: string;
  stats: { value: string; label: string }[];
  highlights: { title: string; line: string }[];
}) {
  const [hero, ...side] = stats;
  const [first, second, strip] = highlights;
  const number = "font-[family-name:var(--font-baloo)] font-bold leading-[0.8] tracking-[-0.02em]";
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      <div
        className="relative overflow-hidden rounded-[16px] p-5 md:p-7 md:col-span-2 flex flex-col aspect-[648/378]"
        style={{ background: "#F0F2F7", containerType: "inline-size" }}
      >
        <span aria-hidden="true" className="absolute rounded-full" style={{ background: "#DFE5F6", width: "54cqw", height: "54cqw", left: "63.7cqw", top: "-21cqw" }} />
        <p className="relative m-0 text-[15px] md:text-[16px]" style={{ color: BENTO_INK }}>
          {intro}
        </p>
        <p className="relative m-0 mt-auto flex items-baseline gap-2.5 md:gap-3" style={{ color: BENTO_INK }}>
          <span className={number} style={{ fontSize: "min(26.5cqw, 180px)" }}>
            {hero.value}
          </span>
          <span className="text-[15px] md:text-[16px]">{hero.label.toLowerCase()}</span>
        </p>
      </div>
      <div className="flex flex-col justify-end gap-7 rounded-[16px] p-5 md:p-7 md:row-span-2 min-h-[140px]" style={{ background: "#DFE5F6", color: BENTO_INK }}>
        {side.map((stat) => (
          <div key={stat.label}>
            <p className={`m-0 text-[40px] md:text-[44px] ${number}`}>{stat.value}</p>
            <p className="m-0 mt-2.5 text-[15px] md:text-[16px]">{stat.label.toLowerCase()}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:col-span-2">
        <BentoCard item={first} boxed mark={<span className="block size-5 rounded-full" style={{ background: "#E4DEF5" }} />} />
        <BentoCard item={second} mark={<span className="block size-5 rounded-[5px]" style={{ background: "#D5EEDD" }} />} />
      </div>
      {strip && (
        <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 rounded-[14px] px-5 py-4 md:px-7" style={{ background: "#FAF2D6" }}>
          <p className="m-0 shrink-0 text-[15px] md:text-[16px] font-medium" style={{ color: BENTO_INK }}>
            {strip.title}
          </p>
          <p className="m-0 text-[13px] md:text-[14px] leading-[1.6]" style={{ color: "#4B5563" }}>
            {strip.line}
          </p>
        </div>
      )}
    </div>
  );
}

function OutcomeCompare({
  compare,
  tint,
}: {
  compare: { before: string[]; after: { title: string; sub: string; cta: string } };
  tint: string;
}) {
  const fade = ["#3F3A45", "#4B4652", MUTED, FAINT];
  return (
    <div aria-hidden="true" className="mt-8 grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6">
      <div className="rounded-[18px] px-6 py-6" style={{ background: SOFT }}>
        <p className="m-0 text-[12px]" style={{ color: FAINT }}>
          Before
        </p>
        <ul className="m-0 mt-3 p-0 list-none space-y-2">
          {compare.before.map((msg, i) => (
            <li key={i}>
              <span className="inline-block rounded-[12px] px-3.5 py-2 text-[13px]" style={{ background: "#EEF0F3", color: fade[Math.min(i, fade.length - 1)], opacity: 1 - i * 0.15 }}>
                {msg}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <span className="justify-self-center rotate-90 md:rotate-0 text-[18px]" style={{ color: tint }}>
        →
      </span>
      <div className="rounded-[18px] px-6 py-6" style={{ background: "linear-gradient(160deg, #FAEDE6 0%, #F7E9F1 50%, #F1EAF8 100%)" }}>
        <p className="m-0 text-[12px] font-medium" style={{ color: tint }}>
          With Sponty
        </p>
        <div className="mt-3 rounded-[14px] bg-white/90 px-5 py-4 shadow-[0_16px_34px_-20px_rgba(74,63,107,0.4)]">
          <p className="m-0 text-[16px] font-semibold tracking-[-0.01em]" style={{ color: INK }}>
            {compare.after.title}
          </p>
          <p className="m-0 mt-1 text-[13px]" style={{ color: MUTED }}>
            {compare.after.sub}
          </p>
          <span className="mt-3.5 inline-block rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white" style={{ background: tint }}>
            {compare.after.cta}
          </span>
        </div>
      </div>
    </div>
  );
}

// Sponty's moodboard: summer-2016 snapshots around two pastel cards, the palette and the tagline.
const MOOD_SCRIPT = "#4A2E55";
// The source photos are small, so instead of pretending they're crisp they all get the same 2016 filter: faded and
// warm, a little film grain, and a soft vignette. The softness reads as the look, and the six read as one set.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
function MoodPhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[12px] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ filter: "saturate(1.12) contrast(0.88) brightness(1.07) sepia(0.14) blur(0.4px)" }}
        sizes="(max-width: 768px) 33vw, 160px"
      />
      {/* A pink-lilac wash, grain and a vignette over every photo */}
      <span aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(251,226,214,0.18), rgba(226,200,240,0.16))", mixBlendMode: "soft-light" }} />
      <span aria-hidden="true" className="absolute inset-0 opacity-[0.22]" style={{ backgroundImage: GRAIN, backgroundSize: "160px", mixBlendMode: "overlay" }} />
      <span aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(74,46,85,0.22) 100%)" }} />
    </div>
  );
}
function SpontyMoodboard() {
  return (
    <figure className="m-0 mt-8" style={{ containerType: "inline-size" }}>
      {/* Phones: three across and three down. Wider screens: five across and two down. */}
      <div className="grid aspect-[3/4] grid-cols-3 grid-rows-3 gap-[1.6cqw] sm:aspect-[2.1/1] sm:grid-cols-5 sm:grid-rows-2 sm:gap-[1.1cqw]">
        <MoodPhoto src="/sponty/mood/car.jpg" alt="A friend in the back seat on a road trip, flower in her hair" className="col-start-1 row-start-1 row-span-2" />
        <MoodPhoto src="/sponty/mood/selfie.jpg" alt="Two friends making hair moustaches" className="col-start-2 row-start-1" />
        <div
          aria-hidden="true"
          className="relative col-start-3 row-start-1 flex flex-col justify-between overflow-hidden rounded-[12px] p-[2.6cqw] sm:p-[1.8cqw]"
          style={{ background: "linear-gradient(170deg, #FBE9DF 0%, #F9E3EE 55%, #F1E3F7 100%)" }}
        >
          <span className="font-[family-name:var(--font-script)] leading-[0.95]" style={{ color: MOOD_SCRIPT, fontSize: "max(4.4cqw, 17px)" }}>
            Summer
            <br />
            2016
          </span>
          <span className="flex gap-[0.7cqw]">
            {["#EDB2E4", "#FCDDB8", "#D9D2F6", "#CDEBDC"].map((c) => (
              <span key={c} className="rounded-full" style={{ width: "max(3.6cqw, 13px)", height: "max(3.6cqw, 13px)", background: c, border: "2px solid #fff" }} />
            ))}
          </span>
        </div>
        <MoodPhoto src="/sponty/mood/palms.jpg" alt="Palm trees over a turquoise beach" className="col-start-1 row-start-3 sm:col-start-4 sm:row-start-1" />
        <div
          aria-hidden="true"
          className="relative col-start-3 row-start-3 flex items-end overflow-hidden rounded-[12px] p-[2.6cqw] sm:col-start-5 sm:row-start-1 sm:row-span-2 sm:p-[1.8cqw]"
          style={{ background: "linear-gradient(180deg, #F1E6FA 0%, #F7E6F1 55%, #FBE9DF 100%)" }}
        >
          <span className="font-[family-name:var(--font-script)] leading-[1]" style={{ color: MOOD_SCRIPT, fontSize: "max(3.9cqw, 15px)" }}>
            No plans,
            <br />
            just vibes.
          </span>
        </div>
        <MoodPhoto src="/sponty/mood/drinks.jpg" alt="Three pink frappuccinos held together" className="col-start-2 row-start-2" />
        <MoodPhoto src="/sponty/mood/party.jpg" alt="Friends dabbing at a party" className="col-start-3 row-start-2" />
        <MoodPhoto src="/sponty/mood/sunset.jpg" alt="A palm-lined street at sunset" className="col-start-2 row-start-3 sm:col-start-4 sm:row-start-2" />
      </div>
      <figcaption className="sr-only">
        A summer 2016 moodboard: road trips, selfies, pink frappuccinos, palm trees and parties, with a pastel palette
        and the line no plans, just vibes.
      </figcaption>
    </figure>
  );
}

// Decisions as a swipeable row: each card snaps into place, the one most in view is highlighted, and tapping a card
// brings it forward.
function DecisionSwiper({ items, tint }: { items: { title: string; line: string }[]; tint: string }) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = [...track.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(cards.indexOf(best.target as HTMLElement));
      },
      { root: track, threshold: [0.6, 0.9, 1] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);
  const go = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActive(i);
  };
  return (
    <div className="mt-8">
      <ol
        ref={trackRef}
        className="m-0 flex snap-x snap-mandatory gap-6 overflow-x-auto p-0 pb-2 list-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const on = i === active;
          return (
            <li key={item.title} className="w-[78%] shrink-0 snap-start sm:w-[40%]">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={on ? "true" : undefined}
                className="block w-full cursor-pointer border-0 border-t-2 bg-transparent p-0 pt-4 text-left transition-colors duration-300"
                style={{ borderColor: on ? tint : "#EEF0F3" }}
              >
                <span className="font-[family-name:var(--font-dm-mono)] text-[11px]" style={{ color: on ? tint : FAINT }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mt-2 block text-[17px] md:text-[19px] font-medium leading-[1.25] tracking-[-0.02em] transition-colors duration-300"
                  style={{ color: on ? INK : MUTED }}
                >
                  {item.title}
                </span>
                <span className="mt-2 block text-[13.5px] leading-[1.6]" style={{ color: MUTED }}>
                  {item.line}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {/* Where you are in the row */}
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={item.title}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{ width: i === active ? 22 : 8, background: i === active ? tint : "#E5E7EB" }}
          />
        ))}
      </div>
    </div>
  );
}

// Sponty's gallery as a bento: Add Friends tall on the left, the nine characters across the top, a "pick your
// character" card and Your Memories underneath. Phones rise out of the bottom edge of their cards.
const SPONTY_WASH = "linear-gradient(160deg, #FAEDE6 0%, #F7E9F1 50%, #F1EAF8 100%)";
function BentoPhone({ src, alt, width, top }: { src: string; alt: string; width: string; top: string }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 aspect-[393/852] overflow-hidden rounded-[18px] shadow-[0_22px_44px_-22px_rgba(74,63,107,0.45)]"
      style={{ width, top }}
    >
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="(max-width: 768px) 60vw, 260px" />
    </div>
  );
}
function SpontyGallery() {
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] md:row-span-2 md:aspect-auto" style={{ background: SPONTY_WASH }}>
        <BentoPhone src="/sponty/add-friends.jpg" alt="Add Friends: a QR code to scan, and a link to copy" width="74%" top="7%" />
      </div>
      <div
        className="relative flex aspect-[16/8] items-center justify-center overflow-hidden rounded-[22px] md:col-span-2 md:aspect-[731/311]"
        style={{ background: "linear-gradient(160deg, #F3E9FA 0%, #F7E9F3 60%, #FAEAEF 100%)" }}
      >
        <div className="relative h-[82%] aspect-square overflow-hidden rounded-[10px]">
          <Image src="/sponty/characters.jpg" alt="Nine animal characters to pick from: a cat, pug, horse, mouse, penguin, polar bear, chick, unicorn and raccoon" fill className="object-cover" sizes="260px" />
        </div>
      </div>
      <div className="relative flex aspect-[358/311] flex-col justify-end overflow-hidden rounded-[22px] p-6" style={{ background: "#FBEADF" }}>
        <p className="m-0 font-[family-name:var(--font-script)] text-[30px] md:text-[34px] leading-[1.05]" style={{ color: "#4A2E55" }}>
          Pick your character
        </p>
        <p className="m-0 mt-1.5 text-[13px]" style={{ color: MUTED }}>
          Nine animals, no profile photos.
        </p>
      </div>
      <div className="relative aspect-[358/311] overflow-hidden rounded-[22px]" style={{ background: SPONTY_WASH }}>
        <BentoPhone src="/sponty/memories-photos.jpg" alt="Your Memories: a hangout recap with photos, Starbucks with Claire and Layla" width="64%" top="12%" />
      </div>
    </div>
  );
}

// A product's screens in order, large and side by side on one soft panel, each with a one-word caption.
function ScreenSequence({ screens, wash }: { screens: { src: string; alt: string; caption: string }[]; wash: string }) {
  return (
    <div className="mt-8 rounded-[22px] px-4 py-7 md:px-8 md:py-10" style={{ background: wash }}>
      <ol className="m-0 grid grid-cols-2 gap-x-4 gap-y-7 p-0 list-none md:grid-cols-4 md:gap-x-5">
        {screens.map((screen, i) => (
          <li key={screen.src} className="flex flex-col items-center">
            <div className="relative w-full max-w-[170px] aspect-[393/852] overflow-hidden rounded-[18px] shadow-[0_18px_40px_-22px_rgba(40,50,30,0.45)]">
              <Image src={screen.src} alt={screen.alt} fill unoptimized className="object-cover" sizes="170px" />
            </div>
            <p className="m-0 mt-3 flex items-baseline gap-2 text-[13px]" style={{ color: INK }}>
              <span className="font-[family-name:var(--font-dm-mono)] text-[10.5px]" style={{ color: FAINT }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {screen.caption}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Context as a receipt: the headline on the left, and a receipt's footprint on the right, item by item, with the
// heaviest one flagged and a single swap suggested underneath.
function ReceiptContext({
  lead,
  sub,
  receipt,
  tint,
  description,
}: {
  lead: string;
  sub: string;
  receipt: { label: string; items: { name: string; value: number; heavy?: boolean }[]; swap: string; action: string };
  tint: string;
  description: string;
}) {
  const max = Math.max(...receipt.items.map((it) => it.value));
  return (
    <div className="mt-8 grid items-center gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
      <div>
        <p className="m-0 text-[30px] md:text-[38px] font-semibold leading-[1.08] tracking-[-0.045em]" style={{ color: INK }}>
          <Rich text={lead} color={tint} />
        </p>
        <p className="m-0 mt-5 text-[16px] md:text-[18px] leading-[1.5]" style={{ color: MUTED }}>
          {sub}
        </p>
        <p className="sr-only">{description}</p>
      </div>
      <div aria-hidden="true" className="rounded-[22px] px-5 py-5 md:px-6 md:py-6" style={{ background: "#F2EEE4" }}>
        <p className="m-0 text-[12px]" style={{ color: MUTED }}>
          {receipt.label}
        </p>
        <ul className="m-0 mt-3 p-0 list-none">
          {receipt.items.map((it) => (
            <li
              key={it.name}
              className="grid grid-cols-[92px_minmax(0,1fr)_28px] items-center gap-3 border-t py-2.5 font-[family-name:var(--font-dm-mono)] text-[12.5px]"
              style={{ borderColor: "#E6DFD0", color: "#3A3128" }}
            >
              <span className="truncate">{it.name}</span>
              <span className="block h-[6px] rounded-full" style={{ background: "#E6DDCB" }}>
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${Math.max(6, (it.value / max) * 100)}%`, background: it.heavy ? "#B9705A" : "#ADC585" }}
                />
              </span>
              <span className="text-right">{it.value.toFixed(1)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[12px] bg-white px-4 py-3 text-[13px]" style={{ color: INK }}>
          <span>{receipt.swap}</span>
          <span className="shrink-0 text-[12.5px] font-semibold" style={{ color: tint }}>
            {receipt.action}
          </span>
        </div>
      </div>
    </div>
  );
}

// Grove's solution illustrations: a receipt, a number you can picture, a sprout, and a small grove filling up.
function GroveIcon({ icon }: { icon: "receipt" | "number" | "sprout" | "dots" }) {
  if (icon === "receipt")
    return (
      <svg viewBox="0 0 120 150" className="h-[62%]">
        <path d="M6 4h108v132l-9-7-9 7-9-7-9 7-9-7-9 7-9-7-9 7-9-7-9 7-9-7-9 7z" fill="#FCFAF4" />
        {[22, 36, 50, 64].map((y, i) => (
          <rect key={y} x="20" y={y} width={[70, 52, 62, 44][i]} height="6" rx="3" fill="#E6DDCB" />
        ))}
        <rect x="20" y="110" width="38" height="7" rx="3.5" fill="#647D4B" />
      </svg>
    );
  if (icon === "number")
    return (
      <span className="flex flex-col items-center">
        <span className="font-[family-name:var(--font-fraunces)] font-light leading-none tracking-[-0.03em]" style={{ color: "#2B1F18", fontSize: "clamp(34px, 5vw, 50px)" }}>
          5.4<span className="ml-1 text-[0.45em]">kg</span>
        </span>
        <span className="mt-1.5 text-[11.5px]" style={{ color: "#5C5146" }}>
          &asymp; 45 min of driving
        </span>
      </span>
    );
  if (icon === "sprout")
    return (
      <svg viewBox="0 0 120 150" className="h-[66%]">
        <ellipse cx="60" cy="128" rx="34" ry="11" fill="#D7CDB7" />
        <path d="M60 128V62" stroke="#647D4B" strokeWidth="6" strokeLinecap="round" />
        <path d="M60 70C58 50 46 38 26 34c2 20 14 32 34 36z" fill="#647D4B" />
        <path d="M60 64c2-24 16-38 40-42-2 24-16 38-40 42z" fill="#B2C78A" />
      </svg>
    );
  const pattern = "dmlmmldmlooo";
  const fill: Record<string, string> = { d: "#647D4B", m: "#849A66", l: "#B2C78A" };
  return (
    <span className="grid grid-cols-4 gap-[10%] w-[44%]">
      {pattern.split("").map((c, i) => (
        <span key={i} className="aspect-square rounded-full" style={c === "o" ? { border: "2px solid #D7CDB7" } : { background: fill[c] }} />
      ))}
    </span>
  );
}

// Three phones on one soft panel: the outer two level with each other, the middle one larger and raised.
const TRIO = [
  { left: "17.3%", top: "17%", width: "19.7%", radius: "8%" },
  { left: "38%", top: "7.4%", width: "24%", radius: "9%" },
  { left: "63%", top: "17%", width: "19.7%", radius: "8%" },
];
function PhoneTrio({ phones, wash }: { phones: { src: string; alt: string }[]; wash: string }) {
  return (
    <div className="relative mt-8 aspect-[998/582] overflow-hidden rounded-[22px]" style={{ background: wash }}>
      {phones.slice(0, 3).map((phone, i) => (
        <div
          key={phone.src}
          className="absolute aspect-[344/756] overflow-hidden shadow-[0_24px_50px_-26px_rgba(40,50,30,0.5)]"
          style={{ left: TRIO[i].left, top: TRIO[i].top, width: TRIO[i].width, borderRadius: `${TRIO[i].radius} / ${parseFloat(TRIO[i].radius) * 0.455}%`, zIndex: i === 1 ? 2 : 1 }}
        >
          <Image src={phone.src} alt={phone.alt} fill className="object-cover" sizes="(max-width: 768px) 30vw, 200px" />
        </div>
      ))}
    </div>
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
  const wash = study.wash ?? SPONTY_WASH;
  const labelOf = (id: string) => study.labels?.[id] ?? LABELS[id];
  const showGallery = study.gallery.length > 0 || !!study.galleryArt || (!study.heroScreens && !study.heroImage && !study.heroEmbed && !study.heroArt);
  const sections = [
    "intro",
    "overview",
    ...(study.research ? ["research"] : []),
    ...(study.exploration ? ["exploration"] : []),
    ...(study.solution.length ? ["solution"] : []),
    ...(study.decisions ? ["decisions"] : []),
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

  // The floating bar scrolls sideways when it can't fit: fade whichever edge has more behind it,
  // and keep the current section's pill in view as you read.
  const barRef = useRef<HTMLOListElement>(null);
  const [barEdges, setBarEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);
  useEffect(() => {
    const el = barRef.current;
    const pill = el?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!el || !pill) return;
    const li = pill.parentElement as HTMLElement;
    el.scrollTo({ left: li.offsetLeft - (el.clientWidth - li.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);
  const barMask = `linear-gradient(to right, ${barEdges.left ? "transparent" : "#000"}, #000 28px, #000 calc(100% - 28px), ${barEdges.right ? "transparent" : "#000"})`;

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)]" style={{ color: INK }}>
      {/* Header */}
      <SiteHeader workHref={back} className="h-[64px] md:h-[80px] px-6 md:px-8" />

      {/* Smaller screens: a floating pill bar once you're past the title */}
      <nav
        aria-label="On this page"
        aria-hidden={!showBar}
        inert={!showBar}
        className="lg:hidden fixed z-30 top-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-24px)]"
      >
        <div className={`transition-all duration-300 ${showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
          <div className="rounded-full bg-white/90 p-1 backdrop-blur-md shadow-[0_0_0_1px_rgba(17,24,39,0.06),0_8px_24px_-14px_rgba(17,24,39,0.35)]">
            <ol
              ref={barRef}
              className="relative m-0 flex items-center gap-0.5 overflow-x-auto rounded-full p-0 list-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ maskImage: barMask, WebkitMaskImage: barMask }}
            >
              {sections.map((id) => (
                <li key={id} className="shrink-0">
                  <a
                    href={`#${id}`}
                    aria-current={active === id ? "true" : undefined}
                    className="flex items-center h-8 px-3 sm:px-3.5 rounded-full text-[13px] transition-colors"
                    style={active === id ? { background: PANEL, color: INK } : { color: MUTED }}
                  >
                    {study.labels?.[id] ?? SHORT[id] ?? LABELS[id]}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      <div className="px-6 md:px-8 pt-6 lg:pt-14 pb-32 lg:grid lg:grid-cols-[minmax(190px,1fr)_minmax(0,732px)_minmax(0,1fr)] lg:gap-x-10">
        {/* Wide screens: back to the work carousel, then the sections */}
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
                    {labelOf(id)}
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
          <div className="rounded-[16px] p-4 md:p-8" style={{ background: study.panel ?? PANEL }}>
            {study.heroArt ? (
              <div className="relative aspect-video overflow-hidden rounded-[8px]">
                {study.heroArt === "sponty-map" ? <SpontyMap /> : study.heroArt === "alvarez-hoodie" ? <AlvarezHero /> : study.heroArt === "spark-phone" ? <SparkHero /> : <GroveDots />}
              </div>
            ) : study.heroEmbed ? (
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
              <Rich text={study.headline ?? study.line} color={tint} />
            </h1>

            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium hover:opacity-70 transition-opacity"
                style={{ color: tint }}
              >
                View the live site
                <span aria-hidden="true" className="text-[12px]">
                  ↗
                </span>
              </a>
            )}

            {/* Role, timeline and platform, each with its label */}
            <dl className="m-0 mt-6 flex flex-wrap gap-x-9 md:gap-x-12 gap-y-4">
              {(
                [
                  ["Role", study.meta.role],
                  ["Timeline", study.meta.timeline],
                  ["Platform", study.meta.platform],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[12px]" style={{ color: MUTED }}>
                    {label}
                  </dt>
                  <dd className="m-0 mt-1 text-[14px] md:text-[15px]" style={{ color: INK }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <article className="mt-16 md:mt-[84px]">
            <section id="overview" aria-labelledby="overview-title" className="scroll-mt-24">
              <Label id="overview" text={labelOf("overview")} tint={tint} n={sections.indexOf("overview")} />
              {study.overviewVisual === "receipt" && study.receipt ? (
                <ReceiptContext
                  lead={study.overviewLead ?? ""}
                  sub={study.overviewSub ?? ""}
                  receipt={study.receipt}
                  tint={tint}
                  description={[study.overview].flat().map((c) => (typeof c === "string" ? c : `${c.label}: ${c.text}`)).join(" ")}
                />
              ) : study.overviewVisual === "spark-compare" ? (
                <>
                  {study.overviewLead && <Lead tint={tint}>{study.overviewLead}</Lead>}
                  <SparkContext tint={tint} paragraphs={[study.overview].flat().map((c) => (typeof c === "string" ? c : c.text))} />
                </>
              ) : study.overviewVisual === "brief" ? (
                <AlvarezContext lead={study.overviewLead ?? ""} text={[study.overview].flat().map((c) => (typeof c === "string" ? c : c.text)).join(" ")} />
              ) : study.overviewVisual === "chat" && study.chat ? (
                <ChatContext
                  lead={study.overviewLead ?? ""}
                  sub={study.overviewSub ?? ""}
                  chat={study.chat}
                  tint={tint}
                  description={[study.overview].flat().map((c) => (typeof c === "string" ? c : `${c.label}: ${c.text}`)).join(" ")}
                />
              ) : (
                study.overviewLead && <Lead tint={tint}>{study.overviewLead}</Lead>
              )}
              {study.overviewVisual === "chat" || study.overviewVisual === "receipt" || study.overviewVisual === "brief" || study.overviewVisual === "spark-compare" ? null : study.overviewVisual === "before-after" ? (
                <BeforeAfter
                  accent={study.accent}
                  description={[study.overview].flat().map((c) => (typeof c === "string" ? c : `${c.label}: ${c.text}`)).join(" ")}
                />
              ) : typeof study.overview === "string" ? (
                <Prose>{study.overview}</Prose>
              ) : study.overview.every((c) => typeof c === "string") ? (
                (study.overview as string[]).map((para) => <Prose key={para}>{para}</Prose>)
              ) : (
                <div className="mt-10 grid gap-y-10 gap-x-10 sm:grid-cols-2">
                  {(study.overview as { label: string; text: string }[]).map((card, i) => (
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
                <Label id="research" text={labelOf("research")} tint={tint} n={sections.indexOf("research")} />
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
              </section>
            )}

            {study.exploration && (
              <section id="exploration" aria-labelledby="exploration-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="exploration" text={labelOf("exploration")} tint={tint} n={sections.indexOf("exploration")} />
                <Lead tint={tint}>{study.exploration.lead}</Lead>
                {study.exploration.paragraphs.map((para) => (
                  <Prose key={para}>{para}</Prose>
                ))}
                <p
                  className="m-0 mt-10 max-w-[620px] border-l-2 pl-5 md:pl-6 text-[18px] md:text-[20px] font-medium leading-[1.4] tracking-[-0.02em]"
                  style={{ color: INK, borderColor: tint }}
                >
                  <Rich text={study.exploration.closing} color={tint} />
                </p>

                <h3 className="m-0 mt-16 text-[16px] md:text-[17px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                  Eligibility, answered up front
                </h3>
                <p className="m-0 mt-1 text-[13px] md:text-[14px]" style={{ color: MUTED }}>
                  The same listing, and how each kind of app tells you whether you can apply.
                </p>
                <EligibilityCard />

                <h3 className="m-0 mt-16 text-[16px] md:text-[17px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                  Search, filters and matches on one screen
                </h3>
                <p className="m-0 mt-1 text-[13px] md:text-[14px]" style={{ color: MUTED }}>
                  Search leads, five filters sit up front, and every result opens with its match.
                </p>
                <DiscoveryLayout />
              </section>
            )}

            {study.solution.length > 0 && (
              <section id="solution" aria-labelledby="solution-title" className="scroll-mt-24 mt-20 md:mt-24">
              <Label id="solution" text={labelOf("solution")} tint={tint} n={sections.indexOf("solution")} />
              {study.solutionLead && <Lead tint={tint}>{study.solutionLead}</Lead>}
              {study.solutionArt === "alvarez" ? (
                <AlvarezSolution items={study.solution} />
              ) : study.solutionArt === "spark" ? (
                <SparkSolution items={study.solution} tint={tint} />
              ) : study.solution.every((item) => item.icon) ? (
                <ol className="m-0 mt-8 grid grid-cols-2 gap-x-3 gap-y-7 p-0 list-none md:grid-cols-4">
                  {study.solution.map((item, i) => (
                    <li key={item.title}>
                      <div
                        aria-hidden="true"
                        className="flex aspect-[5/4] items-center justify-center rounded-[18px]"
                        style={{ background: item.icon === "sprout" ? "#E9EEDF" : "#F2EEE4" }}
                      >
                        <GroveIcon icon={item.icon!} />
                      </div>
                      <p className="m-0 mt-4 flex items-baseline gap-2.5 text-[15px] md:text-[16px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                        <span className="font-[family-name:var(--font-dm-mono)] text-[10.5px] font-normal" style={{ color: FAINT }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </p>
                      <p className="m-0 mt-1 pl-[26px] text-[13px] leading-[1.55]" style={{ color: MUTED }}>
                        {item.line}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : study.solution.some((item) => item.src) ? (
                // One point per row: a pastel card with the phone rising out of its bottom edge, the words beside it,
                // swapping sides each row
                <ol className="m-0 mt-8 p-0 list-none space-y-10 md:space-y-6">
                  {study.solution.map((item, i) => (
                    <SolutionRow key={item.title} n={i + 1} item={item} flip={i % 2 === 1} wash={wash} />
                  ))}
                </ol>
              ) : (
              // Features in words: numbered, two to a row, under hairlines
              <ol className="m-0 mt-8 p-0 list-none grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {study.solution.map((item, i) => (
                  <li key={item.title} className="border-t pt-5" style={{ borderColor: "#EEF0F3" }}>
                    <p className="m-0 flex items-baseline gap-3 text-[16px] md:text-[17px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                      <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.title}
                    </p>
                    <p className="m-0 mt-2 pl-[30px] text-[14px] leading-[1.65]" style={{ color: MUTED }}>
                      {item.line}
                    </p>
                  </li>
                ))}
              </ol>
              )}
            </section>
            )}

            {study.decisions && (
              <section id="decisions" aria-labelledby="decisions-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="decisions" text={labelOf("decisions")} tint={tint} n={sections.indexOf("decisions")} />
                {study.decisionsLead && <Lead tint={tint}>{study.decisionsLead}</Lead>}
                {study.decisions.every((item) => item.phone && item.src) ? (
                  <ol className="m-0 mt-8 p-0 list-none space-y-10 md:space-y-6">
                    {study.decisions.map((item, i) => (
                      <SolutionRow key={item.title} n={i + 1} item={{ ...item, alt: item.visual }} flip={i % 2 === 1} wash={wash} />
                    ))}
                  </ol>
                ) : study.decisionsArt === "sponty-mood" ? (
                  <>
                    <SpontyMoodboard />
                    <DecisionSwiper items={study.decisions} tint={tint} />
                  </>
                ) : study.decisions.every((item) => !item.visual && !item.src && !item.embed) ? (
                  // Decisions told in words: numbered, two to a row, under hairlines
                  <ol className="m-0 mt-8 p-0 list-none grid gap-x-10 gap-y-8 sm:grid-cols-2">
                    {study.decisions.map((item, i) => (
                      <li key={item.title} className="border-t pt-5" style={{ borderColor: "#EEF0F3" }}>
                        <p className="m-0 flex items-baseline gap-3 text-[16px] md:text-[17px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                          <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {item.title}
                        </p>
                        <p className="m-0 mt-2 pl-[30px] text-[14px] leading-[1.65]" style={{ color: MUTED }}>
                          {item.line}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                <ol className="m-0 mt-8 p-0 list-none grid gap-x-6 gap-y-12 sm:grid-cols-2">
                  {study.decisions.map((item, i) => (
                    <li key={item.title}>
                      {item.embed ? (
                        <EmbedFrame src={item.embed} title={item.title} />
                      ) : item.src ? (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px]" style={{ background: SOFT }}>
                          <Image src={item.src} alt={item.visual ?? item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 360px" />
                        </div>
                      ) : (
                        // Waiting on a real screenshot.
                        <div
                          className="grid aspect-[4/3] place-items-center rounded-[10px] border border-dashed"
                          style={{ background: "#F5F5F5", borderColor: "#C4C8CE" }}
                        >
                          <span className="flex flex-col items-center gap-2 text-[13px] font-medium" style={{ color: "#4B5563" }}>
                            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.6" />
                              <path d="M21 15.5 15.5 10 5 20.5" strokeLinecap="round" />
                            </svg>
                            {item.visual}
                          </span>
                        </div>
                      )}
                      <p className="m-0 mt-4 flex items-baseline gap-3 text-[15px] md:text-[16px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
                        <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: tint }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </p>
                      <p className="m-0 mt-1 pl-[30px] text-[13.5px] leading-[1.6]" style={{ color: MUTED }}>
                        {item.line}
                      </p>
                    </li>
                  ))}
                </ol>
                )}
              </section>
            )}

            <section id="role" aria-labelledby="role-title" className="scroll-mt-24 mt-20 md:mt-24">
              <Label id="role" text={labelOf("role")} tint={tint} n={sections.indexOf("role")} />
              {study.roleProcess ? (
                <RoleProcess statement={study.roleProcess.statement} steps={study.roleProcess.steps} />
              ) : study.roleDetail ? (
                <>
                  {/* One soft shape per hat: a circle, a rounded square and a pill */}
                  <ul className="m-0 mt-8 p-0 list-none grid gap-y-9 gap-x-8 sm:grid-cols-3">
                    {study.roleDetail.parts.map((part, i) => (
                      <li key={part.title}>
                        <span
                          aria-hidden="true"
                          className={`block h-14 md:h-16 ${["w-14 md:w-16 rounded-full", "w-14 md:w-16 rounded-[14px]", "w-[90px] md:w-[104px] rounded-full"][i % 3]}`}
                          style={{ background: ["#DFE7F8", "#E7DEF3", "#E1EFE5"][i % 3] }}
                        />
                        <p className="m-0 mt-6 text-[22px] md:text-[26px] font-medium tracking-[-0.03em]" style={{ color: INK }}>
                          {part.title}
                        </p>
                        <p className="m-0 mt-1.5 text-[14px] md:text-[15px]" style={{ color: MUTED }}>
                          {part.line}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {study.roleDetail.closing && (
                    <p className="m-0 mt-10 text-[15px] md:text-[16px]" style={{ color: INK }}>
                      {study.roleDetail.closing}
                    </p>
                  )}
                </>
              ) : (
                study.roleStatement ? (
                  // The role as one large sentence
                  <p className="m-0 mt-6 max-w-[680px] text-[22px] md:text-[28px] leading-[1.32] tracking-[-0.02em]" style={{ color: INK }}>
                    {[study.role].flat().join(" ")}
                  </p>
                ) : (
                  [study.role].flat().map((para) => <Prose key={para}>{para}</Prose>)
                )
              )}
            </section>

            <section
              id="outcome"
              aria-labelledby="outcome-title"
              className={`scroll-mt-24 mt-20 md:mt-24 ${study.outcomeArt === "alvarez" ? "rounded-[16px] px-6 py-8 md:px-12 md:py-10" : ""}`}
              style={study.outcomeArt === "alvarez" ? { background: "#E6DCB2" } : undefined}
            >
              <Label id="outcome" text={labelOf("outcome")} tint={study.outcomeArt === "alvarez" ? "#2A2722" : tint} n={sections.indexOf("outcome")} />
              {study.outcomeArt === "alvarez" && study.outcomeDetail ? (
                <AlvarezOutcome lead={study.outcomeDetail.lead.replace(/\*\*/g, "")} text={study.outcomeDetail.paragraphs.join(" ")} />
              ) : study.outcomeDetail?.intro && study.outcomeDetail.stats && study.outcomeDetail.highlights ? (
                <>
                  <OutcomeBento intro={study.outcomeDetail.intro} stats={study.outcomeDetail.stats} highlights={study.outcomeDetail.highlights} />
                  {study.outcomeDetail.next && (
                    // A quiet aside, not a section of its own
                    <p className="m-0 mt-8 max-w-[600px] text-[13px] md:text-[14px] leading-[1.6]" style={{ color: FAINT }}>
                      <span className="font-medium" style={{ color: MUTED }}>
                        What&apos;s next:
                      </span>{" "}
                      {study.outcomeDetail.next.charAt(0).toLowerCase() + study.outcomeDetail.next.slice(1)}
                    </p>
                  )}
                </>
              ) : study.outcomeDetail ? (
                <>
                  {study.outcomeDetail.compare || study.outcomeDetail.screens || study.outcomeDetail.trio ? (
                    <p className="m-0 mt-6 text-[30px] md:text-[40px] font-semibold leading-[1.08] tracking-[-0.045em]" style={{ color: INK }}>
                      <Rich text={study.outcomeDetail.lead} color={tint} />
                    </p>
                  ) : (
                    <Lead tint={tint}>{study.outcomeDetail.lead}</Lead>
                  )}
                  {study.outcomeDetail.compare && <OutcomeCompare compare={study.outcomeDetail.compare} tint={tint} />}
                  {study.outcomeDetail.screens && <ScreenSequence screens={study.outcomeDetail.screens} wash={wash} />}
                  {study.outcomeDetail.trio && <PhoneTrio phones={study.outcomeDetail.trio} wash={wash} />}
                  {study.outcomeDetail.closing && (
                    <p className="m-0 mt-8 text-[15px] md:text-[16px]" style={{ color: MUTED }}>
                      {study.outcomeDetail.closing}
                    </p>
                  )}
                  {/* The numbers, set large in a serif with a small label beside each */}
                  {study.outcomeDetail.stats && (
                  <dl className="m-0 mt-8 flex flex-wrap items-baseline gap-x-14 gap-y-5">
                    {study.outcomeDetail.stats.map((stat) => (
                      <div key={stat.label} className="flex flex-row-reverse items-baseline justify-end gap-2.5">
                        <dt className="text-[13px] md:text-[14px]" style={{ color: MUTED }}>
                          {stat.label}
                        </dt>
                        <dd
                          className="m-0 font-[family-name:var(--font-fraunces)] text-[48px] md:text-[58px] font-light leading-none tracking-[-0.03em]"
                          style={{ color: INK }}
                        >
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  )}
                  {study.outcomeDetail.paragraphs.map((para) => (
                    <Prose key={para}>{para}</Prose>
                  ))}
                  {study.outcomeDetail.highlights && (
                    <div className="mt-12">
                      <h3 className="m-0 text-[12px] font-medium" style={{ color: MUTED }}>
                        Beyond the numbers
                      </h3>
                      <ul className="m-0 mt-4 p-0 list-none grid gap-x-8 gap-y-5 sm:grid-cols-3">
                        {study.outcomeDetail.highlights.map((h) => (
                          <li key={h.title} className="border-t pt-3.5" style={{ borderColor: "#EEF0F3" }}>
                            <p className="m-0 text-[14px] font-medium" style={{ color: INK }}>
                              {h.title}
                            </p>
                            <p className="m-0 mt-1 text-[13px] leading-[1.55]" style={{ color: FAINT }}>
                              {h.line}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {study.outcomeDetail.next && (
                    // A quiet aside, not a section of its own
                    <p className="m-0 mt-8 max-w-[600px] text-[13px] md:text-[14px] leading-[1.6]" style={{ color: FAINT }}>
                      <span className="font-medium" style={{ color: MUTED }}>
                        What&apos;s next:
                      </span>{" "}
                      {study.outcomeDetail.next.charAt(0).toLowerCase() + study.outcomeDetail.next.slice(1)}
                    </p>
                  )}
                </>
              ) : (
                <Prose>{study.outcome}</Prose>
              )}
            </section>

            {showGallery && (
              study.galleryArt === "alvarez-reel" ? (
              // The gallery on the brand's dark colour, the reel running off its right edge
              <section
                id="gallery"
                aria-labelledby="gallery-title"
                className="scroll-mt-24 mt-20 md:mt-24 overflow-hidden rounded-[16px] px-6 py-8 md:px-10 md:py-10"
                style={{ background: "#2A2722" }}
              >
                <Label id="gallery" text={labelOf("gallery")} tint="#F2EAD3" n={sections.indexOf("gallery")} />
                <AlvarezReel />
              </section>
              ) : (
              <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="gallery" text={labelOf("gallery")} tint={tint} n={sections.indexOf("gallery")} />
                {study.galleryArt === "sponty-bento" ? (
                  <SpontyGallery />
                ) : study.galleryArt === "spark-screens" ? (
                  <SparkGallery />
                ) : (
                <>
                {study.gallery.length > 0 && study.gallery.every((img) => img.phone) ? (
                  // Phone screens stand side by side on one soft panel
                  <div className="mt-6 flex justify-center gap-[5%] rounded-[16px] px-4 py-7 md:px-6 md:py-10" style={{ background: study.panel ?? SOFT }}>
                    {study.gallery.map((img) => (
                      <div
                        key={img.src}
                        className="relative w-[45%] max-w-[230px] aspect-[393/852] overflow-hidden rounded-[22px] shadow-[0_18px_40px_-22px_rgba(17,24,39,0.45)]"
                      >
                        <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 40vw, 230px" />
                      </div>
                    ))}
                  </div>
                ) : (
                <div className={`grid sm:grid-cols-2 mt-6 gap-4`}>
                  {study.gallery.length
                    ? study.gallery.map((img, i) => (
                        <div
                          key={img.src}
                          // With an odd count, the first image runs the full width
                          className={`relative overflow-hidden rounded-[12px] ${i === 0 && study.gallery.length % 2 ? "aspect-[2/1] sm:col-span-2" : "aspect-[4/3]"}`}
                          style={{ background: PANEL }}
                        >
                          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes={i === 0 && study.gallery.length % 2 ? "(max-width: 640px) 100vw, 740px" : "(max-width: 640px) 100vw, 360px"} />
                        </div>
                      ))
                    : ["[Screenshot]", "[Screenshot]"].map((label, i) => (
                        <Placeholder key={i} label={label} className="aspect-[4/3] rounded-[12px]" />
                      ))}
                </div>
                )}
                </>
                )}
              </section>
              )
            )}
          </article>
        </main>
      </div>
    </div>
  );
}
