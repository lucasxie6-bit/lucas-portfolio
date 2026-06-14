"use client";

import { useState } from "react";

export default function Contact() {
  const [isCopied, setIsCopied] = useState(false);
  const email = "lucas.xie6@gmail.com";

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <footer className="pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">

        {/* Heading + tagline */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-inter)] text-3xl md:text-4xl font-light text-stone-800 tracking-wide mb-3">
            Let&apos;s talk.
          </h2>
          <p className="text-sm text-stone-400 font-light">
            building toward what&apos;s next.
          </p>
        </div>

        {/* Email row */}
        <div className="flex flex-wrap items-center gap-3 mb-12">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-stone-900 text-stone-100 text-sm hover:bg-[#9C7B5A] transition-colors duration-300 cursor-pointer"
          >
            {email}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10" /><path d="M7 17 17 7" />
            </svg>
          </a>

          <button
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full border border-stone-200 bg-white text-stone-500 text-sm hover:border-stone-400 hover:text-stone-800 transition-all duration-200 cursor-pointer"
          >
            {isCopied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              "Copy"
            )}
          </button>
        </div>

        {/* Links — simple pill row with quiet right-side note */}
        <div className="flex flex-wrap items-center justify-between gap-y-4 mb-16">
          <div className="flex flex-wrap gap-3">
            <ExternalLink href="https://www.linkedin.com/in/lucas-xie-630238244">
              LinkedIn
            </ExternalLink>
            <ExternalLink href="/resume.pdf" download>
              Resume ↓
            </ExternalLink>
            <ExternalLink href="https://github.com/lucasxie6-bit">
              GitHub
            </ExternalLink>
          </div>
          <p className="hidden md:block text-[11px] text-stone-400/70 font-light tracking-wide">
            open to opportunities
          </p>
        </div>

        {/* Footer identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-8 border-t border-stone-100">
          <span className="font-[family-name:var(--font-inter)] text-sm font-light text-stone-600 tracking-wide">
            lucas xie
          </span>
          <p className="text-xs text-stone-400 font-light">
            © {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </footer>
  );
}

function ExternalLink({
  href,
  children,
  download,
}: {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel="noopener noreferrer"
      download={download}
      className="inline-flex items-center px-4 py-2 rounded-full border border-stone-200 text-stone-500 text-sm hover:border-stone-400 hover:text-stone-800 transition-all duration-200 cursor-pointer"
    >
      {children}
    </a>
  );
}
