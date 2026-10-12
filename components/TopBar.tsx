"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMAIL } from "@/components/records";

const PAGES = [
  { label: "work", href: "/play/useno", match: (p: string) => p.startsWith("/play") || p.startsWith("/work") },
  { label: "about", href: "/about", match: (p: string) => p.startsWith("/about") },
];

export default function TopBar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <header className={`grid grid-cols-[1fr_auto_1fr] items-center text-[#1C191B] ${className}`}>
      <Link href="/" className="justify-self-start py-2 text-[15px] font-bold hover:!text-[#8A847A] transition-colors">
        lucas xie
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-0.5 p-1 rounded-full bg-[#E6E1D8]">
        {PAGES.map(({ label, href, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex items-center h-9 sm:h-7 px-3.5 rounded-full text-[13px] transition-colors ${
                active
                  ? "bg-[#F7F5F0] shadow-[0_1px_2px_rgba(28,25,27,0.12),0_0_0_1px_rgba(28,25,27,0.04)]"
                  : "hover:bg-[#EEEAE2]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <a
        href={EMAIL}
        className="justify-self-end inline-flex items-center gap-2 h-10 sm:h-8 pl-3.5 pr-1.5 rounded-full bg-[#1C191B] text-[13px] !text-white hover:bg-[#3A3533] transition-colors"
      >
        say hi
        <span className="grid place-items-center w-5 h-5 rounded-full bg-[#F4F1EA] text-[#1C191B]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M3 7L7 3M3.5 3H7V6.5" />
          </svg>
        </span>
      </a>
    </header>
  );
}
