// The grove hero: a grid of seeds. Twenty are grown, in three greens; the rest are empty rings still to fill.
// Sized in cqw (shares of the frame's width) so it scales cleanly from phones to wide screens.
const DARK = "#647D4B";
const MID = "#849A66";
const LIGHT = "#B2C78A";
const RING = "#D7CDB7";

// Row by row: d = dark, m = mid, l = light, o = not grown yet.
const PATTERN = ["dmdmdldl", "mlmdmdmd", "ldlmoooo", "oooooooo"].join("");
const FILL: Record<string, string> = { d: DARK, m: MID, l: LIGHT };

export default function GroveDots() {
  const grown = PATTERN.split("").filter((c) => c !== "o").length;
  return (
    <div
      role="img"
      aria-label={`Grove: ${grown} of ${PATTERN.length} seeds grown, and the line small actions, grown`}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#F2EEE4", containerType: "inline-size" }}
    >
      <div
        aria-hidden="true"
        className="absolute grid"
        style={{ left: "12.6cqw", top: "7.5cqw", gridTemplateColumns: "repeat(8, 6cqw)", gap: "2cqw" }}
      >
        {PATTERN.split("").map((c, i) =>
          c === "o" ? (
            <span
              key={i}
              className={`rounded-full ${i === grown ? "grove-next" : ""}`}
              style={{ width: "6cqw", height: "6cqw", border: `0.28cqw solid ${RING}` }}
            />
          ) : (
            <span
              key={i}
              className="grove-dot rounded-full"
              style={{ width: "6cqw", height: "6cqw", background: FILL[c], animationDelay: `${0.2 + i * 0.05}s` }}
            />
          ),
        )}
      </div>
      <p
        aria-hidden="true"
        className="absolute m-0 font-semibold leading-none"
        style={{ left: "12.6cqw", bottom: "7cqw", fontSize: "5.4cqw", letterSpacing: "-0.055em", color: "#2B1F18" }}
      >
        Small actions, <span style={{ color: DARK }}>grown.</span>
      </p>
    </div>
  );
}
