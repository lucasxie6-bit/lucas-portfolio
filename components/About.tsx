import Image from "next/image";

// Photos live in /public/photos. `ratio` is width / height so the grid reserves the right space.
const photos: { src: string; alt: string; ratio: number }[] = [
  { src: "/photos/photo-01.jpg", alt: "Lucas with friends on a red armchair", ratio: 1600 / 1200 },
  { src: "/photos/photo-03.jpg", alt: "Lucas and a friend in a dorm room", ratio: 1600 / 1200 },
  { src: "/photos/photo-04.jpg", alt: "Lucas with friends under fireworks", ratio: 1080 / 607 },
  { src: "/photos/photo-05.jpg", alt: "Lucas and a friend at a restaurant", ratio: 1170 / 878 },
  { src: "/photos/photo-06.jpg", alt: "Lucas and a friend in a dorm hallway", ratio: 1600 / 900 },
  { src: "/photos/photo-07.jpg", alt: "Lucas and a friend in a dorm room", ratio: 1600 / 900 },
  { src: "/photos/photo-09.jpg", alt: "Lucas with friends by a window", ratio: 1600 / 1573 },
  { src: "/photos/photo-10.jpg", alt: "Mirror selfie", ratio: 890 / 1081 },
  { src: "/photos/photo-11.jpg", alt: "Lucas and a friend on a couch", ratio: 844 / 684 },
  { src: "/photos/photo-12.jpg", alt: "Selfie with a friend", ratio: 1080 / 806 },
  { src: "/photos/photo-13.jpg", alt: "Lucas with a group of friends", ratio: 1076 / 580 },
];

const links = [
  { label: "twitter", href: "https://x.com/lxie_001" },
  { label: "linkedin", href: "https://www.linkedin.com/in/lucas-xie-630238244" },
  { label: "github", href: "https://github.com/lucasxie6-bit" },
];

export default function About() {
  return (
    <section className="pt-6 pb-16">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-0">
          {/* Sleeve with the record sliding out behind it */}
          <div className="relative w-[220px] md:w-[262px] shrink-0 aspect-square md:mr-[168px]">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-[46%] w-[93.5%] aspect-square -translate-y-1/2 rounded-full"
              style={{
                background: [
                  "radial-gradient(circle, #F4F1EA 0 3%, transparent 3.5%)",
                  "radial-gradient(circle, #3E5AA8 0 30%, transparent 30.5%)",
                  "conic-gradient(from 60deg, transparent 0 18%, rgba(255,255,255,0.14) 22%, transparent 27% 100%)",
                  "repeating-radial-gradient(circle, #1C1A1B 0 2px, #2A2728 2px 3px)",
                ].join(", "),
                boxShadow: "inset 0 0 0 2px #121011",
              }}
            />
            <div className="relative size-full overflow-hidden bg-[#E8E3D9] shadow-[0_22px_40px_-22px_rgba(28,25,27,0.5)]">
              <Image src="/lucas.png" alt="Lucas Xie" fill quality={90} className="object-cover" sizes="262px" priority />
            </div>
          </div>

          <div>
            <h1 className="text-[52px] md:text-[60px] font-extrabold leading-[0.92] tracking-[-0.055em] text-[#1C191B]">
              hi, i&apos;m
              <br />
              lucas.
            </h1>
          </div>
        </div>

        <p className="mt-12 text-[19px] md:text-[20px] leading-[1.65] text-[#3A3533]">
          i design apps and websites, mostly early-stage products: working out what to build, then making it simple to
          use. right now i&apos;m designing useno, an internship tracker. i study commerce at queen&apos;s, so i care
          whether a design works for the business too.
        </p>

        <div className="mt-11 pt-6 border-t border-[#D9D4CA] flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <div className="flex gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[17px] text-[#3A3533] hover:text-[#1C191B] transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
          <span className="font-[family-name:var(--font-dm-mono)] text-[13px] text-[#8A847A]">
            33⅓ rpm · toronto ↔ kingston
          </span>
        </div>

        {/* Photos — a loose masonry of mixed heights */}
        <section aria-label="Photos" className="mt-20">
          <p className="text-[11px] text-stone-400 tracking-widest font-light select-none mb-6">
            photos
          </p>
          <div className="columns-2 md:columns-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.src}
                className="relative mb-4 break-inside-avoid overflow-hidden rounded-xl bg-[#E8E3D9]"
                style={{ aspectRatio: photo.ratio }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 320px"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
