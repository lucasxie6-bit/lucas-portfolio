import Image from "next/image";
import type { VisualProof as VisualProofData } from "@/data/projects";

interface VisualProofProps {
  proof: VisualProofData;
}

export default function VisualProof({ proof }: VisualProofProps) {
  if (proof.kind === "gallery") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {proof.images.map((image, i) => (
          <figure key={i}>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-50 ring-1 ring-stone-200/60">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-2.5 text-xs text-stone-400 tracking-wide">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {proof.directions.map((direction, i) => (
        <figure key={i}>
          <p className="text-xs tracking-widest text-stone-400 uppercase mb-3">
            {direction.label}
          </p>
          <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-stone-50 ring-1 ring-stone-200/60">
            <Image
              src={direction.src}
              alt={direction.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <figcaption className="mt-3 text-xs text-stone-400 tracking-wide leading-relaxed">
            {direction.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
