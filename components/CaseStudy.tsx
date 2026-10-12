"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy as Study } from "@/data/caseStudies";

const WIDE_QUERY = "(min-width: 1280px)";
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const CORAL = "#E0533D";
const condensed = { fontFamily: "var(--font-archivo-var), sans-serif", fontStretch: "62%", fontWeight: 500 } as const;

function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`shrink-0 ${className}`} style={{ color: CORAL }}>
      <path d="M8 1.5v13M2.4 4.75l11.2 6.5M2.4 11.25l11.2-6.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={`${id}-title`}
      className="flex items-center gap-2 m-0 font-[family-name:var(--font-archivo)] font-normal text-[22px] md:text-[24px] tracking-[-0.03em] leading-none"
    >
      <Asterisk className="size-[12px]" />
      {children}
    </h2>
  );
}

function Prose({ children }: { children: string }) {
  return <p className="m-0 mt-5 max-w-[620px] text-[16px] leading-[1.75] text-[#4A4541]">{children}</p>;
}

function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`grid place-items-center bg-[#E9E5DD] ${className}`}>
      <span className="font-[family-name:var(--font-dm-mono)] text-[11px] text-[#A39E95]">{label}</span>
    </div>
  );
}

export default function CaseStudy({ study }: { study: Study }) {
  const showGallery = study.gallery.length > 0 || (!study.heroScreens && !study.heroImage && !study.heroEmbed);
  const sections = ["overview", "problem", "solution", "role", "outcome", ...(showGallery ? ["gallery"] : [])];

  // Highlight the section currently in the reading band of the screen.
  const [active, setActive] = useState(sections[0]);
  // Wide screens get a quiet list in the left margin, always there. Smaller screens get a floating bar that only
  // appears once the project name has scrolled away, since it sits over the content.
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
    <div className="force-light min-h-screen bg-[#FAF9F6] text-[#1C191B] font-[family-name:var(--font-dm-sans)] lowercase">
      {/* Wide screens: back link and sections, quietly in the left margin */}
      <nav aria-label="On this page" className="hidden xl:block fixed left-12 top-28 z-20">
        <Link href={back} className="block text-[15px] text-[#A39E95] hover:text-[#1C191B] transition-colors">
          back
        </Link>
        <ol className="m-0 mt-14 p-0 list-none space-y-2.5">
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`relative block text-[15px] transition-colors ${
                  active === id ? "text-[#1C191B]" : "text-[#A39E95] hover:text-[#1C191B]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-4 top-1/2 size-[5px] -translate-y-1/2 rounded-full transition-opacity duration-300 ${active === id ? "opacity-100" : "opacity-0"}`}
                  style={{ background: CORAL }}
                />
                {id}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Smaller screens: a floating pill bar once you're past the title */}
      <nav
        aria-label="On this page"
        aria-hidden={!showBar}
        inert={!showBar}
        className="xl:hidden fixed z-30 top-3 left-1/2 -translate-x-1/2 max-w-[calc(100%-24px)]"
      >
        <div className={`transition-all duration-300 ${showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
          <ol className="m-0 flex items-center gap-0.5 overflow-x-auto rounded-full bg-[#ECE8E0]/90 p-1 list-none backdrop-blur-md shadow-[0_8px_24px_-14px_rgba(28,25,27,0.4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((id) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`flex items-center h-8 px-3.5 rounded-full text-[13px] transition-colors ${
                    active === id ? "bg-[#FAF8F4] text-[#1C191B] shadow-[0_1px_2px_rgba(28,25,27,0.1)]" : "text-[#8A847A]"
                  }`}
                >
                  {id}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-[800px] px-6 md:px-0 pt-8 xl:pt-28 pb-32">
        <Link href={back} className="xl:hidden inline-block py-2 text-[14px] text-[#A39E95] hover:text-[#1C191B] transition-colors">
          ← back
        </Link>

        {/* Screenshot first */}
        <div className="mt-6 xl:mt-0 overflow-hidden rounded-[14px]">
          {study.heroEmbed ? (
            <div className="relative aspect-video bg-[#E4EAF2]">
              <iframe
                src={study.heroEmbed.src}
                title={study.heroEmbed.title}
                loading="lazy"
                tabIndex={-1}
                className="absolute inset-0 size-full border-0 pointer-events-none"
              />
            </div>
          ) : study.heroScreens ? (
            <div className="flex items-center justify-center gap-[3.5%] aspect-[4/3] md:aspect-[800/540] bg-[#E9E5DD] px-[6%] py-[7%]">
              {study.heroScreens.map((screen) => (
                <div
                  key={screen.src}
                  className="relative h-full aspect-[393/852] overflow-hidden rounded-[12px] shadow-[0_18px_36px_-22px_rgba(28,25,27,0.45)]"
                >
                  <Image src={screen.src} alt={screen.alt} fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
          ) : study.heroImage ? (
            <div className="relative aspect-[4/3] md:aspect-[800/540] bg-[#E9E5DD]">
              <Image src={study.heroImage.src} alt={study.heroImage.alt} fill className="object-cover" sizes="(max-width: 800px) 100vw, 800px" priority />
            </div>
          ) : (
            <Placeholder label="product screenshot" className="aspect-[4/3] md:aspect-[800/540]" />
          )}
        </div>

        {/* Title */}
        <header className="mt-12 md:mt-14">
          <h1
            ref={titleRef}
            className="m-0 font-[family-name:var(--font-archivo)] font-normal text-[48px] md:text-[64px] leading-[0.95] tracking-[-0.05em]"
          >
            {study.name}
          </h1>
          <p className="m-0 mt-4 text-[18px] md:text-[20px] leading-snug text-[#4A4541]">{study.line}</p>

          <dl className="m-0 mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
            {(
              [
                ["year", study.year],
                ["role", study.meta.role],
                ["timeline", study.meta.timeline],
                ["platform", study.meta.platform],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-[14px] text-[#A39E95]">{label}</dt>
                <dd className="m-0 mt-2.5 text-[15px] text-[#1C191B]">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <article className="mt-20 md:mt-24 space-y-20 md:space-y-24">
          <section id="overview" aria-labelledby="overview-title" className="scroll-mt-24">
            <Heading id="overview">overview</Heading>
            <Prose>{study.overview}</Prose>
          </section>

          <section id="problem" aria-label="Problem" className="scroll-mt-24">
            <p className="m-0 max-w-[720px] text-[32px] md:text-[42px] leading-[1.04] tracking-[-0.02em] text-[#1C191B]" style={condensed}>
              {study.problem}
            </p>
          </section>

          <section id="solution" aria-labelledby="solution-title" className="scroll-mt-24">
            <Heading id="solution">solution</Heading>
            <ul className="m-0 mt-6 p-0 list-none grid sm:grid-cols-2 gap-x-10">
              {study.solution.map((item) => (
                <li key={item.title} className="border-t border-[#E2DDD3] py-5">
                  <p className="m-0 text-[15px] font-medium text-[#1C191B]">{item.title}</p>
                  <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-[#8A847A]">{item.line}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="role" aria-labelledby="role-title" className="scroll-mt-24">
            <Heading id="role">role</Heading>
            <Prose>{study.role}</Prose>
          </section>

          <section id="outcome" aria-labelledby="outcome-title" className="scroll-mt-24">
            <Heading id="outcome">outcome</Heading>
            <Prose>{study.outcome}</Prose>
          </section>

          {showGallery && (
            <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-24">
              <Heading id="gallery">gallery</Heading>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {study.gallery.length
                  ? study.gallery.map((img) => (
                      <div key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#E9E5DD]">
                        <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" />
                      </div>
                    ))
                  : ["[screenshot]", "[screenshot]"].map((label, i) => (
                      <Placeholder key={i} label={label} className="aspect-[4/3] rounded-[12px]" />
                    ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
