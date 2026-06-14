import Image from "next/image";
import type { Proofs } from "@/data/projects";
import PrototypeCarousel from "@/components/PrototypeCarousel";

interface ProofsSectionProps {
  proofs: Proofs;
}

export default function ProofsSection({ proofs }: ProofsSectionProps) {
  return (
    <div className="space-y-10">
      {proofs.tryIt && proofs.tryIt.slides.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-stone-600 tracking-wide mb-3">
            Try it
          </h3>
          <PrototypeCarousel slides={proofs.tryIt.slides} />
        </div>
      )}

      {proofs.process && proofs.process.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-stone-600 tracking-wide mb-3">
            Process
          </h3>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
            {proofs.process.map((slide, i) => (
              <figure
                key={i}
                className="shrink-0 w-[75%] sm:w-[340px] snap-start"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-50 ring-1 ring-stone-200/60">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 75vw, 340px"
                    unoptimized
                  />
                </div>
                <figcaption className="mt-2.5 text-xs text-stone-400 tracking-wide">
                  {slide.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
