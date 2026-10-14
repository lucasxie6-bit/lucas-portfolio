import type { ReactNode } from "react";

const NAVY = "#2B2D6E";
const INK = "#1F2347";
const BODY = "#4B5563";
const MUTED = "#8B8FA3";
const PANEL = "#F4F5FA";
const LAV = "#F1F0FA";
const LAV_LINE = "#E3E1F2";
const LINE = "#ECEDF3";
const MONO = "font-[family-name:var(--font-dm-mono)]";

function Tag({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <p className={`m-0 text-[10px] ${MONO}`} style={{ color }}>
      {children}
    </p>
  );
}

function Asks({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 ml-auto w-fit max-w-[78%] rounded-[10px] px-3 py-2 text-[11.5px] leading-[1.4] text-white" style={{ background: NAVY }}>
      {children}
    </p>
  );
}

function Lock() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-label="Locked" role="img">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" />
      <path d="M4.2 5.5V4a1.8 1.8 0 0 1 3.6 0v1.5" />
    </svg>
  );
}

const ESSAY = ["Can you write my english assignment about climate change?"];

// Context: the same request to a typical AI chat and to spark, side by side.
export function SparkContext({ paragraphs, tint }: { paragraphs: string[]; tint: string }) {
  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-10">
        {paragraphs.map((p) => (
          <p key={p} className="m-0 text-[14px] md:text-[15px] leading-[1.7]" style={{ color: BODY }}>
            {p}
          </p>
        ))}
      </div>
      <div className="mt-10 grid gap-3 rounded-[16px] p-3 md:grid-cols-2 md:p-4" style={{ background: PANEL }}>
        <div className="flex flex-col rounded-[12px] border p-4 md:p-5" style={{ borderColor: LINE, background: "#F8F9FC" }}>
          <Tag>a typical ai chat</Tag>
          <div className="mt-4">
            <Asks>{ESSAY[0]}</Asks>
          </div>
          <div className="mt-4 w-[86%] rounded-[10px] border bg-white p-3" style={{ borderColor: LINE }}>
            <p className="m-0 text-[11px]" style={{ color: MUTED }}>
              Here&apos;s your essay:
            </p>
            {[100, 94, 100, 86, 96, 60].map((w, i) => (
              <span key={i} className="mt-2 block h-[5px] rounded-full" style={{ width: `${w}%`, background: "#E6E8EF" }} />
            ))}
          </div>
          <p className="m-0 mt-auto pt-8 text-[11.5px]" style={{ color: MUTED }}>
            The answer, in seconds.
          </p>
        </div>
        <div className="flex flex-col rounded-[12px] border p-4 md:p-5" style={{ borderColor: LAV_LINE, background: LAV }}>
          <Tag color={tint}>✦ spark</Tag>
          <div className="mt-4">
            <Asks>{ESSAY[0]}</Asks>
          </div>
          <p className="m-0 mt-4 w-fit max-w-[86%] rounded-[10px] border bg-white px-3 py-2 text-[11.5px] leading-[1.45]" style={{ borderColor: LINE, color: INK }}>
            While I can&apos;t fully write your assignment for you, I can help you out!
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ["Hint", "+2"],
              ["Guiding question", "+1"],
              ["Outline suggestion", "+1"],
              ["Full explanation", null],
            ].map(([label, pts]) => (
              <span
                key={label}
                className="flex items-center justify-between rounded-[8px] border bg-white px-2.5 py-2 text-[11px]"
                style={{ borderColor: LINE, color: pts ? INK : MUTED }}
              >
                {label}
                <span className="text-[10px]" style={{ color: MUTED }}>
                  {pts ?? <Lock />}
                </span>
              </span>
            ))}
          </div>
          <p className="m-0 mt-auto pt-8 text-[11.5px]" style={{ color: tint }}>
            The thinking stays with the student.
          </p>
        </div>
      </div>
    </>
  );
}

// 01: asking for a hint gets a question back, not an answer
function HintChat({ tint }: { tint: string }) {
  return (
    <div className="flex h-full flex-col">
      <Tag>the student asks for a hint</Tag>
      <div className="mt-3">
        <Asks>Hint</Asks>
      </div>
      <div className="mt-3 max-w-[88%] rounded-[10px] border bg-white px-3 py-2.5" style={{ borderColor: LINE }}>
        <p className={`m-0 text-[9.5px] ${MONO}`} style={{ color: tint }}>
          ✦ spark asks back
        </p>
        <p className="m-0 mt-1.5 text-[11.5px] leading-[1.5]" style={{ color: INK }}>
          Think about &lsquo;Climate Gentrification.&rsquo; When sea levels rise, why does the value of inland property go up, and who gets pushed out of those
          neighborhoods as a result?
        </p>
      </div>
      <p className="m-0 mt-auto rounded-[8px] border bg-white px-3 py-2 text-[11px]" style={{ borderColor: LINE, color: MUTED }}>
        Ask Spark…
      </p>
    </div>
  );
}

// 02: four levels of help, the fuller the help the fewer the points
const HELP = [
  { label: "Hint", pts: "+2", h: 34 },
  { label: "Guiding question", pts: "+1", h: 57 },
  { label: "Outline suggestion", pts: "+1", h: 79 },
  { label: "Full explanation", pts: null, h: 101 },
];
function HelpBars() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between">
        <Tag>less help</Tag>
        <Tag>more help</Tag>
      </div>
      <div className="mt-auto grid grid-cols-4 items-end gap-2 pt-6">
        {HELP.map((b, i) => (
          <div key={b.label} className="flex flex-col">
            <span className="mb-2 text-[10px]" style={{ color: MUTED }}>
              {b.pts ?? <Lock />}
            </span>
            <span
              className="block rounded-[6px]"
              style={{
                height: `${b.h * 1.12}px`,
                background:
                  i === 0
                    ? `linear-gradient(180deg, #4A4D9E, ${NAVY})`
                    : b.pts
                      ? "#DCD9EE"
                      : "repeating-linear-gradient(135deg, #ECEAF5 0 4px, #F8F7FC 4px 8px)",
                border: b.pts ? undefined : `1px solid ${LAV_LINE}`,
              }}
            />
            <span className="mt-2 text-[10.5px] leading-tight" style={{ color: b.pts ? INK : MUTED }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LEVELS = [
  { name: "Assisted", range: "0–50", note: "Learning the ropes", h: 54 },
  { name: "Guided", range: "50–150", note: "Growing confidence, step by step", h: 96, you: 78 },
  { name: "Builder", range: "150–300", note: "Strong thinking, minimal help", h: 139 },
  { name: "Thinker", range: "300+", note: "Leading with your own reasoning", h: 181 },
];

// Solution: the first two ideas drawn as cards, then the four spark levels as rising steps.
export function SparkSolution({ items, tint }: { items: { title: string; line: string }[]; tint: string }) {
  const art = [<HintChat key="hint" tint={tint} />, <HelpBars key="help" />];
  return (
    <>
      <ol className="m-0 mt-6 grid list-none gap-x-4 gap-y-8 p-0 md:grid-cols-2">
        {items.slice(0, 2).map((item, i) => (
          <li key={item.title}>
            <div className="h-[260px] rounded-[16px] p-4 md:p-5" style={{ background: i === 0 ? PANEL : LAV }}>
              {art[i]}
            </div>
            <p className="m-0 mt-4 flex items-baseline gap-2.5 text-[16px] md:text-[17px] font-medium tracking-[-0.015em]" style={{ color: INK }}>
              <span className={`text-[10.5px] font-normal ${MONO}`} style={{ color: "#A3AAB8" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.title}
            </p>
            <p className="m-0 mt-2 pl-[26px] text-[14px] leading-[1.65]" style={{ color: BODY }}>
              {item.line}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex items-baseline justify-between gap-4">
        <h3 className="m-0 text-[16px] md:text-[17px] font-medium" style={{ color: INK }}>
          Spark status
        </h3>
        <p className="m-0 text-[12px]" style={{ color: MUTED }}>
          four levels, from assisted to thinker
        </p>
      </div>
      <div className="mt-4 rounded-[16px] p-4 md:p-5" style={{ background: PANEL }}>
        <ol className="m-0 grid list-none grid-cols-2 items-end gap-3 p-0 pt-6 md:grid-cols-4">
          {LEVELS.map((lv) => {
            const you = lv.you !== undefined;
            return (
              <li key={lv.name} className="flex flex-col">
                <div
                  className="flex flex-col justify-between rounded-[10px] border p-3"
                  style={{ height: lv.h, background: you ? NAVY : "#FFFFFF", borderColor: you ? NAVY : LINE, color: you ? "#FFFFFF" : INK }}
                >
                  <span className="flex items-center justify-between">
                    <span className={`text-[10px] ${MONO}`} style={{ color: you ? "rgba(255,255,255,0.7)" : MUTED }}>
                      {lv.range}
                    </span>
                    {you && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "rgba(255,255,255,0.18)" }}>
                        you · {lv.you}
                      </span>
                    )}
                  </span>
                  <span className="text-[14px] font-semibold">{lv.name}</span>
                </div>
                <span className="mt-2.5 text-[11px] leading-snug" style={{ color: MUTED }}>
                  {lv.note}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
