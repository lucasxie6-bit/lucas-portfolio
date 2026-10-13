import Link from "next/link";
import { EMAIL } from "@/components/records";

// The plain header on every page but the homepage: the name on the left, Work / About / Contact on the right.
export default function SiteHeader({
  active = "work",
  workHref = "/play/useno",
  className = "",
}: {
  active?: "work" | "about";
  workHref?: string;
  className?: string;
}) {
  const tone = (page: "work" | "about") => (page === active ? "text-[#111827]" : "text-[#6B7280]");
  return (
    <header className={`relative z-10 flex items-center justify-between text-[#111827] ${className}`}>
      <Link href="/" className="text-[14px] font-medium hover:opacity-70 transition-opacity">
        lucas xie
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-7 md:gap-10 text-[13px] md:text-[14px]">
        <Link href={workHref} aria-current={active === "work" ? "page" : undefined} className={`${tone("work")} hover:opacity-70 transition-opacity`}>
          Work
        </Link>
        <Link href="/about" aria-current={active === "about" ? "page" : undefined} className={`${tone("about")} hover:opacity-70 transition-opacity`}>
          About
        </Link>
        <a href={EMAIL} className="text-[#6B7280] hover:opacity-70 transition-opacity">
          Contact
        </a>
      </nav>
    </header>
  );
}
