"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
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
const SOFT = "#F5F7FA";

const LABELS: Record<string, string> = {
  intro: "Overview",
  overview: "Context",
  research: "Research",
  exploration: "Design Exploration",
  solution: "Solution",
  decisions: "Key Design Decisions",
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

// Design exploration visuals. These were drawn after the fact, so each one carries a "retrospective" tag.
function ExploreFigure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="m-0 mt-10 rounded-[12px] px-5 py-7 md:px-10 md:py-10" style={{ background: SOFT }}>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="text-[17px] md:text-[20px] font-semibold tracking-[-0.025em]" style={{ color: INK }}>
          {title}
        </span>
        <span className="rounded-[4px] border bg-white px-2 py-1 text-[11px]" style={{ borderColor: "#E5E7EB", color: MUTED }}>
          Retrospective exploration
        </span>
      </figcaption>
      {children}
    </figure>
  );
}

function Check({ tint }: { tint: string }) {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={tint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5.2 4.2 7.4 8 3" />
    </svg>
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
    <figure className="m-0 mt-10 rounded-[16px] p-2.5 md:p-4" style={{ background: "#EEF1F5" }}>
      <div className="rounded-[18px] bg-white px-5 py-7 md:px-10 md:py-10">
        <div className="flex items-center gap-3.5">
          <span aria-hidden="true" className="grid size-11 md:size-12 shrink-0 place-items-center rounded-[10px] border bg-white" style={{ borderColor: "#E5E7EB" }}>
            <svg viewBox="0 0 40 28" className="w-7 md:w-8">
              <rect width="40" height="28" rx="2" fill="#76B900" />
              <path d="M7 15c4-6 13-8 21-3-5-1-10 0-13 3 3 3 8 4 13 3-8 5-17 3-21-3Z" fill="#fff" />
              <path d="M15 15c2-2 5-3 8-2-2 1-3 2-3 2s1 1 3 2c-3 1-6 0-8-2Z" fill="#76B900" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] md:text-[16px] font-semibold" style={{ color: INK }}>
              NVIDIA
            </span>
            <span className="mt-0.5 block text-[13px] md:text-[15px]" style={{ color: "#9CA3AF" }}>
              Santa Clara · Summer 2027
            </span>
          </span>
        </div>
        <p className="m-0 mt-4 md:mt-5 text-[26px] md:text-[38px] font-bold leading-[1.05] tracking-[-0.05em] md:whitespace-nowrap" style={{ color: INK }}>
          Software Engineering Intern
        </p>

        <p className="m-0 mt-6 md:mt-7 inline-block rounded-full px-3.5 py-1.5 text-[13px] md:text-[14px] font-semibold" style={{ background: "#F1F3F6", color: "#1B2D58" }}>
          Can I apply?
        </p>
        <ul className="m-0 mt-3 p-0 list-none space-y-1.5">
          {rows.map((row, i) => {
            const last = i === rows.length - 1;
            return (
              <li
                key={row.who}
                className={`grid grid-cols-[28px_minmax(0,1fr)] md:grid-cols-[28px_112px_minmax(0,1fr)] items-center gap-x-3 md:gap-x-4 gap-y-0.5 rounded-[14px] border px-4 py-3 md:px-5 md:py-4 ${
                  last ? "shadow-[0_14px_30px_-18px_rgba(17,24,39,0.28)]" : ""
                }`}
                style={{ borderColor: "#E5E7EB" }}
              >
                <span
                  aria-hidden="true"
                  className="row-span-2 md:row-span-1 grid size-7 place-items-center rounded-full text-[12px] font-bold"
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
                <span className="text-[14px] md:text-[15px] font-semibold" style={{ color: last ? INK : MUTED }}>
                  {row.who}
                </span>
                <span
                  className={last ? "text-[15px] md:text-[17px] font-semibold tracking-[-0.01em]" : "text-[14px] md:text-[15px]"}
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

function Marker({ n, tint }: { n: number; tint: string }) {
  return (
    <span aria-hidden="true" className="grid size-[18px] shrink-0 place-items-center rounded-[4px] text-[10px] font-semibold text-white" style={{ background: tint }}>
      {n}
    </span>
  );
}

function DiscoveryLayout({ tint }: { tint: string }) {
  const bar = (w: string, c = "#E5E7EB") => <span className="block h-[6px] rounded-full" style={{ width: w, background: c }} />;
  const notes = [
    "Search leads. Students describe the role in their own words instead of building a query.",
    "Three filters stay up front: grad year, role type and location. The rest wait behind “More”.",
    "Every result answers “can I apply?” before anything else, so a scan is enough to rule a role in or out.",
  ];
  return (
    <ExploreFigure title="Discovery layout explorations">
      <p className="m-0 mt-2 text-[13px] md:text-[14px]" style={{ color: MUTED }}>
        What gets prominence, what stays secondary, and what makes an internship quick to assess.
      </p>

      {/* The wireframe */}
      <div aria-hidden="true" className="mt-7 rounded-[8px] border bg-white p-3.5 md:p-5" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 flex-1 items-center rounded-[6px] border px-3 text-[11px] md:text-[12px]" style={{ borderColor: "#D7DBE2", color: FAINT }}>
            Describe your dream internship…
          </div>
          <Marker n={1} tint={tint} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[150px_minmax(0,1fr)] md:gap-5">
          <div>
            <div className="flex items-center gap-2 md:mb-2">
              <span className="text-[10px] uppercase tracking-[0.08em]" style={{ color: FAINT }}>Filters</span>
              <Marker n={2} tint={tint} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5 md:flex-col md:gap-2">
              {["Class of 2027", "Software", "New York"].map((f) => (
                <span key={f} className="rounded-[4px] border px-2 py-1 text-[11px]" style={{ borderColor: INK, color: INK }}>
                  {f}
                </span>
              ))}
              <span className="px-2 py-1 text-[11px]" style={{ color: FAINT }}>More +</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-[6px] border p-3" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center gap-2">
                  <Check tint={tint} />
                  {bar("34%", tint)}
                  {i === 0 && <span className="ml-auto"><Marker n={3} tint={tint} /></span>}
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {bar(["62%", "54%", "58%"][i], "#C9CFD9")}
                  {bar(["40%", "46%", "36%"][i])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="m-0 mt-6 p-0 list-none grid gap-4 sm:grid-cols-3 sm:gap-5">
        {notes.map((note, i) => (
          <li key={i} className="flex gap-2.5">
            <Marker n={i + 1} tint={tint} />
            <p className="m-0 text-[12px] leading-relaxed" style={{ color: MUTED }}>{note}</p>
          </li>
        ))}
      </ol>
    </ExploreFigure>
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
    ...(study.exploration ? ["exploration"] : []),
    study.decisions ? "decisions" : "solution",
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
      <SiteHeader workHref={back} className="h-[64px] md:h-[80px] px-6 md:px-8" />

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

      <div className="px-6 md:px-8 pt-6 lg:pt-14 pb-32 lg:grid lg:grid-cols-[minmax(190px,1fr)_minmax(0,732px)_minmax(0,1fr)] lg:gap-x-10">
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
              <Rich text={study.headline ?? study.line} color={tint} />
            </h1>

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
              <Label id="overview" tint={tint} n={sections.indexOf("overview")} />
              {study.overviewLead && <Lead tint={tint}>{study.overviewLead}</Lead>}
              {study.overviewVisual === "before-after" ? (
                <BeforeAfter
                  accent={study.accent}
                  description={typeof study.overview === "string" ? study.overview : study.overview.map((c) => `${c.label}: ${c.text}`).join(" ")}
                />
              ) : typeof study.overview === "string" ? (
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
              </section>
            )}

            {study.exploration && (
              <section id="exploration" aria-labelledby="exploration-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="exploration" tint={tint} n={sections.indexOf("exploration")} />
                <Lead tint={tint}>{study.exploration.lead}</Lead>
                {study.exploration.paragraphs.map((para) => (
                  <Prose key={para}>{para}</Prose>
                ))}
                <EligibilityCard />
                <DiscoveryLayout tint={tint} />
                <p
                  className="m-0 mt-12 max-w-[620px] text-[18px] md:text-[20px] font-medium leading-[1.4] tracking-[-0.02em]"
                  style={{ color: INK }}
                >
                  <Rich text={study.exploration.closing} color={tint} />
                </p>
              </section>
            )}

            {study.decisions ? (
              <section id="decisions" aria-labelledby="decisions-title" className="scroll-mt-24 mt-20 md:mt-24">
                <Label id="decisions" tint={tint} n={sections.indexOf("decisions")} />
                <ol className="m-0 mt-8 p-0 list-none">
                  {study.decisions.map((item, i) => (
                    <li
                      key={item.title}
                      className="grid gap-y-2 border-t py-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-x-10"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <p className="m-0 flex items-baseline gap-3 text-[16px] md:text-[17px] font-medium tracking-[-0.01em]" style={{ color: INK }}>
                        <span className="font-[family-name:var(--font-dm-mono)] text-[11px] font-normal" style={{ color: FAINT }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.title}
                      </p>
                      <p className="m-0 text-[14px] leading-[1.65] md:pt-0.5" style={{ color: MUTED }}>
                        {item.why}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : (
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
            )}

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
