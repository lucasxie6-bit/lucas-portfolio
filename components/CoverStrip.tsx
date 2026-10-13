import Image from "next/image";
import { albumCovers } from "@/data/covers";

// Phones and smaller screens have no side margins for the covers, so they get one slow-moving row of them instead.
// The row is drawn twice so the loop is seamless; the copy is hidden from screen readers.
const STRIP = albumCovers.slice(0, 24);

export default function CoverStrip({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`cover-strip xl:hidden relative left-1/2 w-screen -translate-x-1/2 overflow-hidden ${className}`}>
      <div className="cover-strip-track flex w-max gap-2.5">
        {[...STRIP, ...STRIP].map((src, i) => (
          <div key={i} className="relative size-[72px] md:size-[88px] shrink-0 overflow-hidden rounded-[3px] bg-[#EEF0F3]">
            <Image src={src} alt="" fill className="object-cover" sizes="88px" />
          </div>
        ))}
      </div>
    </div>
  );
}
