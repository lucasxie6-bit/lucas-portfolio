import Image from "next/image";

const DARK = "#2A2722";

// Where alvarez started and where it ended up: a dashed "idea" card, an arrow, then the two finished hoodies.
export default function AlvarezOutcome({ lead, text }: { lead: string; text: string }) {
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-[180fr_76fr_266fr_266fr] md:gap-0">
        <div className="col-span-2 flex items-center gap-4 md:contents">
          <div
            className="grid h-24 flex-1 place-items-center rounded-[14px] border border-dashed text-center md:h-auto md:aspect-[180/290]"
            style={{ borderColor: "#A89E7E" }}
          >
            <span>
              <span className="block text-[11px]" style={{ color: "#7D7460" }}>
                Start
              </span>
              <span className="mt-1 block text-[18px] md:text-[19px]" style={{ color: DARK }}>
                An idea
              </span>
            </span>
          </div>
          <span aria-hidden="true" className="text-[20px] rotate-90 md:rotate-0 md:grid md:place-items-center" style={{ color: DARK }}>
            →
          </span>
        </div>
        {[
          ["/alvarez/gallery/hoodie-black.jpg", "The black hoodie with the circle print"],
          ["/alvarez/gallery/hoodie-white.jpg", "The white hoodie with the circle print"],
        ].map(([src, alt], i) => (
          <div key={src} className={`relative aspect-[266/290] overflow-hidden rounded-[14px] bg-white ${i === 1 ? "md:ml-2" : ""}`}>
            <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 45vw, 270px" />
          </div>
        ))}
      </div>
      <div className="mt-8 md:mt-10 grid gap-4 md:grid-cols-2 md:gap-10">
        <p className="m-0 text-[26px] md:text-[30px] leading-[1.15] tracking-[-0.03em]" style={{ color: DARK }}>
          {lead}
        </p>
        <p className="m-0 text-[13px] md:text-[14px] leading-[1.65]" style={{ color: "#5E574A" }}>
          {text}
        </p>
      </div>
    </>
  );
}
