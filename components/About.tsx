import Image from "next/image";
import Link from "next/link";
import PhotoGallery, { type Photo } from "@/components/PhotoGallery";
import PlayerFooter from "@/components/PlayerFooter";
import { EMAIL, INBOX } from "@/components/records";
import SideCovers, { type Cover } from "@/components/SideCovers";

// Photos live in /public/photos, shown in this order. Set `size` to "big" (full row), "wide" (half) or "small" (a
// quarter) to choose which ones stand out; rows always fill out, so any mix works. Big photos use their `ratio`, capped at 3:2.
const photos: Photo[] = [
  { src: "/photos/photo-05.jpg", alt: "Lucas and a friend at a restaurant", size: "big", ratio: 1170 / 878 },
  { src: "/photos/photo-04.jpg", alt: "Lucas with friends under fireworks", size: "wide" },
  { src: "/photos/photo-01.jpg", alt: "Lucas with friends on a red armchair", size: "wide" },
  { src: "/photos/photo-03.jpg", alt: "Lucas and a friend in a dorm room", size: "small" },
  { src: "/photos/photo-09.jpg", alt: "Lucas with friends by a window", size: "small" },
  { src: "/photos/photo-10.jpg", alt: "Mirror selfie", size: "small" },
  { src: "/photos/photo-11.jpg", alt: "Lucas and a friend on a couch", size: "small" },
  { src: "/photos/photo-06.jpg", alt: "Lucas and a friend in a dorm hallway", size: "wide" },
  { src: "/photos/photo-07.jpg", alt: "Lucas and a friend in a dorm room", size: "wide" },
  { src: "/photos/photo-13.jpg", alt: "Lucas with a group of friends", size: "big", ratio: 1076 / 580 },
];

// Album covers and references that hang faded in the side margins on wide screens.
const covers: Cover[] = [
  "photo-23", "photo-29", "photo-34", "photo-31", "photo-26", "photo-30", "photo-22", "photo-20", "photo-24", "photo-27",
  "photo-21", "photo-32", "photo-25", "photo-28", "photo-33", "photo-35",
].map((name) => ({ src: `/photos/${name}.jpg` }));

// Listening stats on the card at the top.
const wrapped = {
  artists: ["slayyyter", "olivia rodrigo", "taylor swift", "adéla"],
  songs: ["brand new chanel$", "beat up chanel$", "drop dead", "superscar"],
  genre: "pop",
  year: "2026",
};

// Recent favourite albums. Add `href` to a track to link it.
const favourite = {
  album: "wor$t girl in america",
  artist: "slayyyter",
  cover: "/albums/worst-girl-in-america.jpg",
  tracks: [{ title: "brand new chanel$" }, { title: "beat up chanel$" }, { title: "cannibalism!" }] as { title: string; href?: string }[],
};
const alsoOnRotation = [
  { album: "popstar", artist: "tinashe", cover: "/albums/popstar.jpg" },
  { album: "you seem so sad for a girl", artist: "olivia rodrigo", cover: "/albums/you-seem-so-sad-for-a-girl.jpg" },
];

const links = [
  { label: "linkedin", href: "https://www.linkedin.com/in/lucas-xie-630238244" },
  { label: "github", href: "https://github.com/lucasxie6-bit" },
];

export default function About() {
  return (
    <section className="relative overflow-x-clip pt-6 pb-2">
      <SideCovers covers={covers} />
      <div className="max-w-[800px] mx-auto px-6">
        {/* Wrapped-style card: the cover on the left, listening stats on the right */}
        <h1 className="sr-only">hi, i&apos;m lucas.</h1>
        <div className="rounded-lg bg-[#E0803F] p-4 md:p-5 flex flex-col md:flex-row gap-6 md:gap-7 text-[#1C191B]">
          {/* Cover with the record sliding out from behind it */}
          <div className="relative w-[70%] md:w-[250px] shrink-0 aspect-square md:mr-[92px]">
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-[46%] w-[93.5%] aspect-square -translate-y-1/2 rounded-full"
              style={{
                background: [
                  "radial-gradient(circle, #E0803F 0 3%, transparent 3.5%)",
                  "radial-gradient(circle, #3E5AA8 0 30%, transparent 30.5%)",
                  "conic-gradient(from 60deg, transparent 0 18%, rgba(255,255,255,0.14) 22%, transparent 27% 100%)",
                  "repeating-radial-gradient(circle, #1C1A1B 0 2px, #2A2728 2px 3px)",
                ].join(", "),
                boxShadow: "inset 0 0 0 2px #121011",
              }}
            />
            <div className="relative size-full overflow-hidden bg-[#E8E3D9] shadow-[0_18px_34px_-20px_rgba(28,25,27,0.55)]">
              <Image src="/lucas-cover.svg" alt="Lucas Xie, styled as an album cover" fill unoptimized className="object-cover" priority />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-8 content-between pt-1">
            <StatList label="top artists" items={wrapped.artists} />
            <StatList label="top songs" items={wrapped.songs} />
            <BigStat label="year" value={wrapped.year} />
            <BigStat label="top genre" value={wrapped.genre} />
          </div>
        </div>

        <div className="mt-12 space-y-5 text-[19px] md:text-[20px] leading-[1.65] text-[#3A3533]">
          <p>
            i design apps and websites. i like when something useful still has a bit of personality. right now i&apos;m
            working on useno, an internship discovery platform.
          </p>
          <p>
            i&apos;m a huge pop fan, especially the unpolished, unglamorous side of it. it shapes a lot of how i design.
            i like things that feel a bit raw and personal, not too perfect.
          </p>
        </div>


        {/* Favourite albums */}
        <section aria-labelledby="albums-heading" className="mt-20">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2 id="albums-heading" className="text-[17px] font-bold text-[#1C191B]">
              recent favourites
            </h2>
            <Link href="/" className="text-[13px] text-[#6B655C] hover:text-[#1C191B] transition-colors">
              see the whole shelf →
            </Link>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-[#2A3558] to-[#1F2945] p-5 md:p-6 flex flex-col md:flex-row md:items-end gap-6 md:gap-8 text-white">
            <div className="flex items-end gap-5 md:gap-6 flex-1 min-w-0">
              <div className="relative w-[120px] md:w-[160px] shrink-0 aspect-square overflow-hidden bg-[#36426B] shadow-[0_16px_30px_-16px_rgba(0,0,0,0.6)]">
                <Image
                  src={favourite.cover}
                  alt={`${favourite.album} by ${favourite.artist}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div className="min-w-0 pb-1">
                <p className="font-[family-name:var(--font-archivo)] text-[30px] md:text-[34px] leading-none tracking-[-0.03em]">
                  {favourite.album}
                </p>
                <p className="mt-2 text-[14px] text-white/85">{favourite.artist}</p>
              </div>
            </div>

            <div className="md:w-[300px] shrink-0">
              <p className="font-[family-name:var(--font-dm-mono)] text-[12px] text-white/55 pb-2">my favourites on it</p>
              <ol className="border-t border-white/10">
                {favourite.tracks.map((track, i) => {
                  const row = (
                    <>
                      <span className="font-[family-name:var(--font-dm-mono)] text-[12px] text-white/45 w-7">{pad(i + 1)}</span>
                      <span className="flex-1 text-[14px] font-bold">{track.title}</span>
                      <span aria-hidden="true" className="text-white/45">↗</span>
                    </>
                  );
                  return (
                    <li key={i} className="border-b border-white/10 last:border-b-0">
                      {track.href ? (
                        <a href={track.href} target="_blank" rel="noopener noreferrer" className="flex items-center py-2.5 hover:text-white/80">
                          {row}
                        </a>
                      ) : (
                        <div className="flex items-center py-2.5">{row}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-x-10 gap-y-4">
            <p className="sm:w-[64px] text-[12px] leading-tight text-[#6B655C]">also on rotation</p>
            {alsoOnRotation.map((item) => (
              <div key={item.artist} className="flex items-center gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-[2px] bg-[#E8E3D9]">
                  <Image src={item.cover} alt={`${item.album} by ${item.artist}`} fill unoptimized className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-[#1C191B]">{item.album}</span>
                  <span className="block text-[13px] text-[#6B655C]">{item.artist}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Photos — packed rows; sizes are set in the list above */}
      <section aria-label="Photos" className="max-w-[800px] mx-auto px-6 mt-20">
        <p className="text-[11px] text-stone-400 tracking-widest font-light select-none mb-5">photos</p>
        <PhotoGallery photos={photos} />
      </section>

      {/* Links on phones, where the player bar is too narrow for them */}
      <div className="md:hidden max-w-[800px] mx-auto px-6 mt-16 flex flex-wrap gap-x-6 gap-y-2">
        <a href={`${EMAIL}?subject=hi`} className="text-[17px] text-[#3A3533] hover:text-[#1C191B] transition-colors">
          {INBOX}
        </a>
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

      <PlayerFooter links={links} className="mt-16 md:mt-20" />
    </section>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function StatList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[12px] text-[#1C191B]/75">{label}</p>
      <ol className="mt-2.5 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-baseline gap-3">
            <span className="w-2 text-[11px] text-[#1C191B]/55">{i + 1}</span>
            <span className="text-[15px] font-bold leading-tight md:whitespace-nowrap">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] text-[#1C191B]/75">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-archivo)] text-[34px] md:text-[42px] leading-none tracking-[-0.03em]">{value}</p>
    </div>
  );
}
