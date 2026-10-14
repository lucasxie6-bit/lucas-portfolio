import { items } from "@/components/records";

// The sponty hero: a pastel city map with friends nearby, you in the middle, and a plan floated into the chat.
// Everything is sized in cqw (shares of the frame's width) so it scales cleanly from phones to wide screens.
const SPONTY_BG = items.find((it) => it.name === "sponty")?.bg ?? "#E8C4E4";

const COLS = 8;
const ROWS = 7;
// The one block that's a park.
const PARK = 1;

const FRIENDS = [
  { letter: "A", x: 28.5, y: 33.5, bg: "#F8DFC4" },
  { letter: "N", x: 69.7, y: 22.3, bg: "#E4DDF5" },
  { letter: "C", x: 36.1, y: 77.8, bg: "#F5D3E6" },
];

function Avatar({ letter, bg, size }: { letter?: string; bg: string; size: string }) {
  return (
    <span
      className="grid place-items-center rounded-full font-semibold text-[#4B3F5F]"
      style={{ width: size, height: size, background: bg, border: "0.45cqw solid #fff", fontSize: `calc(${size} * 0.32)` }}
    >
      {letter}
    </span>
  );
}

export default function SpontyMap() {
  return (
    <div
      role="img"
      aria-label="Sponty's map: three friends nearby, you in the middle, and a plan in the chat, Mall at 3pm"
      className="absolute inset-0 overflow-hidden"
      style={{ background: SPONTY_BG, containerType: "inline-size" }}
    >
      {/* City blocks, turned a little off the grid; the streets are the gaps between them. The whole map drifts slowly. */}
      <div aria-hidden="true" className="sponty-drift absolute inset-0">
      <div
        className="absolute grid"
        style={{
          left: "-30%",
          top: "-45%",
          width: "160%",
          height: "190%",
          transform: "rotate(-11deg)",
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gap: "3.6cqw",
        }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span
            key={i}
            style={{
              borderRadius: "2cqw",
              background: i === PARK ? "rgba(178, 214, 186, 0.6)" : "rgba(255, 255, 255, 0.34)",
            }}
          />
        ))}
      </div>
      </div>

      {/* Friends nearby, each bobbing gently out of step */}
      {FRIENDS.map((f, i) => (
        <span
          key={f.letter}
          aria-hidden="true"
          className="sponty-float absolute shadow-[0_1cqw_2.5cqw_-0.8cqw_rgba(75,63,95,0.35)] rounded-full"
          style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${-i * 1.6}s`, animationDuration: `${4.6 + i * 0.7}s` }}
        >
          <Avatar letter={f.letter} bg={f.bg} size="6.3cqw" />
          <span
            className="absolute rounded-full"
            style={{ right: "-0.2cqw", bottom: "-0.2cqw", width: "1.9cqw", height: "1.9cqw", background: "#4CC36B", border: "0.35cqw solid #fff" }}
          />
        </span>
      ))}

      {/* You, with a soft pulse */}
      <span aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "52.9%", top: "49.9%" }}>
        <span className="sponty-halo absolute left-1/2 top-1/2 rounded-full" style={{ width: "17.5cqw", height: "17.5cqw", background: "rgba(76, 126, 240, 0.09)" }} />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: "9.8cqw", height: "9.8cqw", background: "rgba(76, 126, 240, 0.16)" }} />
        <span className="relative block rounded-full" style={{ width: "3.4cqw", height: "3.4cqw", background: "#4C7EF0", border: "0.5cqw solid #fff" }} />
      </span>

      {/* The plan, floated into the chat */}
      <span
        aria-hidden="true"
        className="absolute flex -translate-y-1/2 items-center bg-white shadow-[0_1.5cqw_4cqw_-1.5cqw_rgba(75,63,95,0.35)]"
        style={{ left: "57.5%", top: "61%", gap: "1.6cqw", padding: "1.4cqw 1.8cqw 1.4cqw 2.4cqw", borderRadius: "2.2cqw" }}
      >
        <span className="font-[family-name:var(--font-script)] leading-none text-[#3B2F55]" style={{ fontSize: "3.4cqw" }}>
          Mall @ 3pm?
        </span>
        <span className="flex">
          {["#F8DFC4", "#F5D3E6", "#E4DDF5"].map((bg, i) => (
            // Friends join the plan one at a time
            <span key={bg} className="sponty-join inline-block" style={{ marginLeft: i ? "-1.2cqw" : 0, animationDelay: `${0.5 + i * 0.45}s` }}>
              <Avatar bg={bg} size="3.3cqw" />
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}
