"use client";

import Link from "next/link";
import { EMAIL } from "@/components/records";

const PAGES = [
  { label: "work", href: "/play/useno" },
  { label: "about", href: "/about" },
];

// The homepage header: the name on the left, plain text links on the right.
export default function TopBar({ className = "" }: { className?: string }) {
  return (
    <header className={`flex items-center justify-between text-[14px] text-[#111827] ${className}`}>
      <Link href="/" className="-my-2 py-2 font-medium hover:!text-[#8B919C] transition-colors">
        lucas xie
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-5">
        {PAGES.map(({ label, href }) => (
          <Link key={href} href={href} className="-my-2 py-2 hover:!text-[#8B919C] transition-colors">
            {label}
          </Link>
        ))}
        <a href={EMAIL} className="-my-2 py-2 hover:!text-[#8B919C] transition-colors">
          say hi ↗
        </a>
      </nav>
    </header>
  );
}
