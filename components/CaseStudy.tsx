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

// Section label: a small square bullet and the name, in the project's tint.
function Label({ id, tint }: { id: string; tint: string }) {
  return (
    <h2 id={`${id}-title`} className="m-0 flex items-center gap-2 text-[12px] font-medium" style={{ color: tint }}>
      <span aria-hidden="true" className="size-[5px]" style={{ background: tint }} />
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
    <p className="m-0 mt-5 max-w-[320px] text-[24px] md:text-[26px] font-medium leading-[1.23] tracking-[-0.03em]" style={{ color: INK }}>
      <Rich text={children} color={tint} />
    </p>
  );
}

function Prose({ children }: { children: string }) {
  return (
    <p className="m-0 mt-6 max-w-[520px] text-[14.5px] leading-[1.72]" style={{ color: MUTED }}>
      <Rich text={children} color={INK} />
    </p>
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
          <section id="intro" aria-labelledby="intro-title" className="scroll-mt-24 mt-16 md:mt-[84px]">
            <Label id="intro" tint={tint} />
            <div className="mt-4 grid gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)] md:gap-x-10 md:items-start">
              <h1
                ref={titleRef}
                className="m-0 -ml-[0.04em] font-[family-name:var(--font-archivo)] font-normal text-[44px] md:text-[48px] leading-[1] tracking-[-0.05em]"
                style={{ color: study.accent }}
              >
                {study.name}
              </h1>
              <p className="m-0 md:pt-2 text-[15px] md:text-[16px] leading-[1.45]" style={{ color: BODY }}>
                {study.line}
              </p>
            </div>

            <dl
              className="m-0 mt-10 rounded-[12px] px-[22px] py-5 grid grid-cols-1 sm:grid-cols-[minmax(0,272px)_minmax(0,193px)_minmax(0,1fr)] gap-x-6 gap-y-4"
              style={{ background: SOFT }}
            >
              {(
                [
                  ["Role", study.meta.role],
                  ["Timeline", study.meta.timeline],
                  ["Platform", study.meta.platform],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px]" style={{ color: MUTED }}>
                    {label}
                  </dt>
                  <dd className="m-0 mt-1.5 text-[13px] leading-snug" style={{ color: INK }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <article className="mt-16 md:mt-[84px]">
            <section id="overview" aria-labelledby="overview-title" className="scroll-mt-24">
              <Label id="overview" tint={tint} />
              {study.overviewLead && <Lead tint={tint}>{study.overviewLead}</Lead>}
              <Prose>{study.overview}</Prose>
            </section>

            {study.research && (
              <section id="research" aria-labelledby="research-title" className="scroll-mt-24 mt-24 md:mt-32">
                <Label id="research" tint={tint} />
                <Lead tint={tint}>{study.research.lead}</Lead>
                {study.research.paragraphs.map((para) => (
                  <Prose key={para}>{para}</Prose>
                ))}

                {/* Evidence: the annotated comparison of real searches */}
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

            <section id="solution" aria-labelledby="solution-title" className="scroll-mt-24 mt-24 md:mt-32">
              <Label id="solution" tint={tint} />
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

            <section id="role" aria-labelledby="role-title" className="scroll-mt-24 mt-24 md:mt-32">
              <Label id="role" tint={tint} />
              <Prose>{study.role}</Prose>
            </section>

            <section id="outcome" aria-labelledby="outcome-title" className="scroll-mt-24 mt-24 md:mt-32">
              <Label id="outcome" tint={tint} />
              <Prose>{study.outcome}</Prose>
            </section>

            {showGallery && (
              <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-24 mt-24 md:mt-32">
                <Label id="gallery" tint={tint} />
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
