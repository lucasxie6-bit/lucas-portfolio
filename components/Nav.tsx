"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Work");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => ({ id: l.href.slice(1), label: l.label }));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.id === entry.target.id);
            if (match) setActive(match.label);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Pill nav — fades in after scrolling past hero */}
      <div
        className={`flex justify-center pt-5 transition-all duration-300 ${
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul className="hidden md:flex items-center gap-1 bg-white/85 backdrop-blur-sm border border-stone-200 rounded-full px-2 py-1.5 shadow-sm">
          {links.map((l) => {
            const isActive = active === l.label;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setActive(l.label)}
                  className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-stone-100 text-stone-900 font-medium border border-stone-200"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger — always visible */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden absolute right-6 top-5 p-2 text-stone-600 hover:text-stone-900"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mx-6 mt-2 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden">
          <ul className="py-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => {
                    setActive(l.label);
                    setMenuOpen(false);
                  }}
                  className={`block px-5 py-3 text-sm transition-colors ${
                    active === l.label
                      ? "text-stone-900 font-medium bg-stone-50"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
