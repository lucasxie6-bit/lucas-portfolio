import Image from "next/image";

export type Cover = { src: string };

// Where each cover hangs in the side margins: distance down the page, nudge sideways, tilt, size and float timing.
const LEFT = [
  { top: "6%", x: 10, tilt: -7, size: 132, dur: 9 },
  { top: "27%", x: 70, tilt: 5, size: 112, dur: 11 },
  { top: "48%", x: 20, tilt: -4, size: 140, dur: 10 },
  { top: "69%", x: 80, tilt: 8, size: 118, dur: 12 },
  { top: "88%", x: 30, tilt: -6, size: 126, dur: 9.5 },
];
const RIGHT = [
  { top: "12%", x: 40, tilt: 6, size: 124, dur: 10.5 },
  { top: "33%", x: 0, tilt: -5, size: 140, dur: 9 },
  { top: "54%", x: 60, tilt: 4, size: 116, dur: 11.5 },
  { top: "74%", x: 10, tilt: -8, size: 134, dur: 10 },
  { top: "92%", x: 50, tilt: 5, size: 110, dur: 12 },
];

// Album covers scattered in the margins on wide screens: faded and slowly drifting, full colour on hover.
export default function SideCovers({ covers }: { covers: Cover[] }) {
  const place = (side: "left" | "right", spots: typeof LEFT, offset: number) =>
    spots.map((spot, k) => {
      const cover = covers[(k * 2 + offset) % covers.length];
      return (
        <div
          key={`${side}-${k}`}
          className="side-cover absolute"
          style={{
            top: spot.top,
            [side === "left" ? "right" : "left"]: `calc(50% + 430px + ${spot.x}px)`,
            width: spot.size,
            height: spot.size,
            ["--tilt" as string]: `${spot.tilt}deg`,
            animationDuration: `${spot.dur}s`,
            animationDelay: `${-k * 1.7}s`,
          }}
        >
          <Image src={cover.src} alt="" fill className="object-cover" sizes="140px" />
        </div>
      );
    });

  return (
    <div aria-hidden="true" className="hidden xl:block absolute inset-0 pointer-events-none">
      {place("left", LEFT, 0)}
      {place("right", RIGHT, 1)}
    </div>
  );
}
