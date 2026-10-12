import Link from "next/link";
import { EMAIL } from "@/components/records";

export default function TopBar({ className = "" }: { className?: string }) {
  return (
    <header className={`flex items-center justify-between text-[15px] text-[#1C191B] ${className}`}>
      <Link
        href="/"
        className="text-[22px] leading-none hover:!text-[#8A847A] transition-colors"
        style={{ fontFamily: "var(--font-archivo-var), sans-serif", fontWeight: 600, fontStretch: "68%", letterSpacing: "-0.035em", wordSpacing: "0.08em" }}
      >
        lucas xie
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-7">
        <Link href="/play/useno" className="hover:!text-[#8A847A] transition-colors">
          work
        </Link>
        <Link href="/about" className="hover:!text-[#8A847A] transition-colors">
          about
        </Link>
        <a
          href={EMAIL}
          className="inline-flex items-center gap-2 h-8 pl-3.5 pr-1.5 rounded-full bg-[#1C191B] !text-white hover:bg-[#3A3533] transition-colors"
        >
          say hi
          <span className="grid place-items-center w-5 h-5 rounded-full bg-[#F4F1EA] text-[#1C191B]">
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 7L7 3M3.5 3H7V6.5" />
            </svg>
          </span>
        </a>
      </nav>
    </header>
  );
}
