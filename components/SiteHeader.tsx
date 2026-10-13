import Link from "next/link";
import { EMAIL } from "@/components/records";

// The plain header on the work pages: the name on the left, Work / About / Contact on the right.
export default function SiteHeader({
  name = "lucas xie",
  workHref = "/play/useno",
  className = "",
}: {
  name?: string;
  workHref?: string;
  className?: string;
}) {
  return (
    <header className={`relative z-10 flex items-center justify-between text-[#111827] ${className}`}>
      <Link href="/" className="text-[14px] font-medium hover:opacity-70 transition-opacity">
        {name}
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-7 md:gap-10 text-[13px] md:text-[14px]">
        <Link href={workHref} aria-current="page" className="hover:opacity-70 transition-opacity">
          Work
        </Link>
        <Link href="/about" className="text-[#6B7280] hover:opacity-70 transition-opacity">
          About
        </Link>
        <a href={EMAIL} className="text-[#6B7280] hover:opacity-70 transition-opacity">
          Contact
        </a>
      </nav>
    </header>
  );
}
