import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function Work() {
  return (
    <section className="py-8">
      <div className="px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
          {projects.map((card) => {
            const cardContent = (
              <>
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={card.gradientStyle}
                  />
                )}

                {/* Vignette overlay for depth */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                    card.lightBackground
                      ? "from-stone-900/5"
                      : "from-black/30"
                  }`}
                />

                {/* Inset border for premium feel */}
                <div
                  className={`absolute inset-0 rounded-3xl ring-1 ring-inset ${
                    card.lightBackground
                      ? "ring-stone-900/8"
                      : "ring-white/20"
                  }`}
                />

                {/* Label */}
                <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
                  <span
                    className={`font-semibold text-sm tracking-wide text-sm ${
                      card.lightBackground
                        ? "text-stone-600"
                        : "text-white drop-shadow-sm"
                    }`}
                  >
                    {card.name}
                  </span>
                  <span
                    className={`text-xs tracking-widest ${
                      card.lightBackground
                        ? "text-stone-400"
                        : "text-white/60"
                    }`}
                  >
                    {card.year}
                  </span>
                </div>
              </>
            );

            const className = `group relative rounded-3xl overflow-hidden aspect-[2/1] w-full bg-stone-900 transition-all duration-500 ${
              card.comingSoon
                ? "cursor-default"
                : "cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
            }`;

            if (card.slug && !card.comingSoon) {
              return (
                <Link
                  key={card.name}
                  href={`/work/${card.slug}`}
                  className={className}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={card.name} className={className}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
