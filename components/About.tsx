import Image from "next/image";

export default function About() {
  return (
    <section className="pt-10 pb-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 md:gap-12 items-start">

          {/* Photo column — slight downward offset to break grid flatness */}
          <div className="mx-auto md:mx-0 md:translate-y-3 shrink-0">
            <div className="relative w-[240px] md:w-full">
              {/* Polaroid card — casual single tilt, no hover animation */}
              <div className="bg-stone-50 p-3 pb-9 ring-1 ring-stone-200/60 rotate-[1.1deg] shadow-[0_6px_28px_-8px_rgba(28,25,23,0.15)]">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <Image
                    src="/lucas.png"
                    alt="Lucas Xie"
                    fill
                    quality={90}
                    className="object-cover brightness-[0.97] saturate-[0.9]"
                    sizes="300px"
                  />
                </div>
                <p className="absolute bottom-2.5 left-0 right-0 text-center text-[9px] uppercase tracking-[0.25em] text-stone-400/70">
                  lucas
                </p>
              </div>

              {/* Small caption below the card — personal, specific, not a label */}
              <p className="mt-3 text-[10px] font-mono text-stone-400 tracking-wide pl-0.5">
                toronto, can. · 2026
              </p>
            </div>
          </div>

          {/* Text column */}
          <div className="pt-0 md:pt-4">
            {/* Heading — clean Inter, not dramatic, closer to header style */}
            <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-light text-stone-800 tracking-wide mb-7 leading-snug">
              Hi, I&apos;m Lucas!
            </h2>

            {/* Thin left-border accent — quiet visual anchor on the text block */}
            <div className="space-y-4 text-stone-500 text-sm md:text-base leading-relaxed mb-10 max-w-[360px] border-l border-stone-200 pl-5">
              <p>
                Founder, creative, student. I have an appetite for growth — building it, chasing it, helping early-stage startups find it.
              </p>
              <p>
                Studying Commerce at Queen&apos;s University. Looking to join a startup.
              </p>
            </div>

            {/* Connect — plain inline text links, nothing generic */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[11px] text-stone-400 tracking-widest font-light select-none">connect</span>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-800 text-sm transition-colors duration-150"
              >
                Twitter
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-800 text-sm transition-colors duration-150"
              >
                LinkedIn
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-800 text-sm transition-colors duration-150"
              >
                GitHub
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-stone-800 text-sm transition-colors duration-150"
              >
                Devpost
              </a>
            </div>

            {/* Small personal status note — fills column, feels human */}
            <p className="mt-5 text-[11px] text-stone-400/80 font-light tracking-wide">
              currently open to startup opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
