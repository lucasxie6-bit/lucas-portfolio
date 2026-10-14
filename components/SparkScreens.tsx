import type { ReactNode } from "react";

// The spark app's screens, drawn in code. Every size is in cqw of the phone's own width,
// so a phone renders the same at any size.
export const NAVY = "#2B2D6E";
const INK = "#1F2347";
const GREY = "#8A8B99";
const LINE = "#ECEBF2";
const SCREEN = "#F5F3EF";
const LAV = "#ECEAF8";
const SERIF = "var(--font-fraunces), serif";

const c = (px: number) => `${(px / 2.72).toFixed(2)}cqw`; // mock pixels on a 272px-wide phone → cqw

function Sparkle({ size = 7, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 12 12" style={{ width: c(size), height: c(size) }} fill={color} aria-hidden="true">
      <path d="M6 0.5C6.4 3.6 8.4 5.6 11.5 6 8.4 6.4 6.4 8.4 6 11.5 5.6 8.4 3.6 6.4 0.5 6 3.6 5.6 5.6 3.6 6 0.5Z" />
      <circle cx="10.4" cy="1.8" r="0.9" />
    </svg>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between" style={{ padding: `${c(13)} ${c(18)} 0 ${c(20)}`, fontSize: c(11), fontWeight: 600, color: INK }}>
      <span>9:41</span>
      <span className="flex items-center" style={{ gap: c(4) }}>
        <svg viewBox="0 0 18 12" style={{ width: c(13) }} fill={INK}>
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg viewBox="0 0 16 12" style={{ width: c(12) }} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
          <path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7.5a5.6 5.6 0 0 1 8 0" />
          <circle cx="8" cy="10.3" r="1.2" fill={INK} stroke="none" />
        </svg>
        <span className="block" style={{ width: c(17), height: c(8.5), borderRadius: c(2.5), background: INK }} />
      </span>
    </div>
  );
}

/** A phone: `dark` has the black bezel and island used in the hero; light is the gallery's thin white frame. */
export function Phone({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={className} style={{ containerType: "inline-size" }}>
      <div
        className="aspect-[272/586] w-full"
        style={{
          background: dark ? "#1C1C22" : "#FFFFFF",
          borderRadius: c(36),
          padding: dark ? c(7.5) : c(2.5),
          boxShadow: dark ? "0 30px 60px -30px rgba(0,0,0,0.6)" : "0 24px 50px -24px rgba(8,8,40,0.6)",
        }}
      >
        <div
          className="relative flex size-full flex-col overflow-hidden"
          style={{ background: SCREEN, borderRadius: dark ? c(29) : c(34), fontFamily: "var(--font-dm-sans), sans-serif", color: INK }}
        >
          {dark && <span className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: c(7), width: c(74), height: c(21) }} />}
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  );
}

function Tabs({ active }: { active: "home" | "learn" | "status" | "profile" }) {
  const icons: Record<string, ReactNode> = {
    home: <path d="M3 10.5L10 4l7 6.5V17a1 1 0 0 1-1 1h-3.5v-5h-5v5H4a1 1 0 0 1-1-1z" />,
    learn: <path d="M13.5 3.5a2.1 2.1 0 0 1 3 3L7 16l-4 1 1-4z" />,
    status: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="M7 10.2l2 2 4-4.2" />
      </>
    ),
    profile: (
      <>
        <circle cx="10" cy="7" r="3.2" />
        <path d="M4 17.5c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5" />
      </>
    ),
  };
  return (
    <div className="mt-auto bg-white" style={{ borderTop: `1px solid ${LINE}` }}>
      <div className="grid grid-cols-4" style={{ padding: `${c(8)} ${c(10)} 0` }}>
        {(["home", "learn", "status", "profile"] as const).map((tab) => (
          <span key={tab} className="flex flex-col items-center" style={{ gap: c(3), color: tab === active ? INK : "#A5A6B4" }}>
            <svg viewBox="0 0 20 20" style={{ width: c(15) }} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {icons[tab]}
            </svg>
            <span style={{ fontSize: c(7.5), fontWeight: tab === active ? 600 : 400 }}>{tab}</span>
          </span>
        ))}
      </div>
      <span className="mx-auto block rounded-full" style={{ width: c(92), height: c(3.5), background: INK, margin: `${c(10)} auto ${c(6)}` }} />
    </div>
  );
}

function ScoreCard() {
  return (
    <div
      className="relative overflow-hidden text-white"
      style={{
        margin: `0 ${c(11)}`,
        padding: `${c(14)} ${c(15)} ${c(13)}`,
        borderRadius: c(18),
        background: "radial-gradient(circle at 82% 20%, #5D5BAE 0%, rgba(93,91,174,0) 48%), linear-gradient(160deg, #2E3274 0%, #2A2D6A 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center" style={{ gap: c(4), fontSize: c(8), color: "rgba(255,255,255,0.75)" }}>
          <Sparkle size={6.5} /> spark score
        </span>
        <span className="rounded-full" style={{ fontSize: c(7.5), fontWeight: 600, padding: `${c(3)} ${c(7)}`, background: "rgba(255,255,255,0.18)" }}>
          guided
        </span>
      </div>
      <div className="flex items-end" style={{ marginTop: c(4), gap: c(6) }}>
        <span className="leading-none" style={{ fontSize: c(54), fontWeight: 700, letterSpacing: "-0.05em" }}>
          78
        </span>
        <span className="leading-tight" style={{ fontSize: c(8.5), paddingBottom: c(4), color: "rgba(255,255,255,0.8)" }}>
          72 points to
          <br />
          <b className="font-semibold text-white">builder</b>
        </span>
      </div>
      <div className="grid grid-cols-4" style={{ gap: c(4), marginTop: c(14) }}>
        {["assisted", "guided", "builder", "thinker"].map((stage, i) => (
          <div key={stage}>
            <span className="relative block overflow-hidden rounded-full" style={{ height: c(3.5), background: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.22)" }}>
              {i === 1 && <span className="spark-fill absolute inset-y-0 left-0 w-[30%] rounded-full bg-white" />}
            </span>
            <span className="block" style={{ marginTop: c(6), fontSize: c(7), fontWeight: i === 1 ? 600 : 400, color: i === 1 ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}>
              {stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="bg-white" style={{ borderRadius: c(13), ...style }}>
      {children}
    </div>
  );
}

export function HomeScreen() {
  return (
    <>
      <div className="flex items-center justify-between" style={{ padding: `${c(20)} ${c(17)} ${c(14)}` }}>
        <div>
          <p className="m-0" style={{ fontSize: c(8.5), color: GREY }}>
            good evening,
          </p>
          <p className="m-0 whitespace-nowrap leading-none" style={{ fontSize: c(19), marginTop: c(4), letterSpacing: "-0.03em" }}>
            <span style={{ fontWeight: 600 }}>lucas</span>
            <span style={{ color: GREY }}> — </span>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", letterSpacing: "-0.02em" }}>keep going.</span>
          </p>
        </div>
        <span className="grid shrink-0 place-items-center rounded-full" style={{ width: c(30), height: c(30), background: "#E7E4F6", fontSize: c(9), fontWeight: 600 }}>
          L
        </span>
      </div>
      <ScoreCard />
      <Card style={{ margin: `${c(11)} ${c(11)} 0`, padding: c(12) }}>
        <div className="flex items-center" style={{ gap: c(9) }}>
          <span className="grid shrink-0 place-items-center" style={{ width: c(31), height: c(31), borderRadius: c(9), background: "#EEEAFB" }}>
            <svg viewBox="0 0 24 24" style={{ width: c(13) }} fill="none" stroke="#3D3F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block" style={{ fontSize: c(7.5), color: GREY }}>
              pick up where you left off
            </span>
            <span className="block whitespace-nowrap" style={{ fontSize: c(9.5), fontWeight: 600, marginTop: c(2) }}>
              climate gentrification essay
            </span>
          </span>
          <span style={{ fontSize: c(10), color: GREY }}>›</span>
        </div>
      </Card>
      <div className="grid grid-cols-2" style={{ margin: `${c(11)} ${c(11)} 0`, gap: c(9) }}>
        {[
          ["hints earned", "12"],
          ["day streak", "4"],
        ].map(([label, value]) => (
          <Card key={label} style={{ padding: c(11) }}>
            <span className="block" style={{ fontSize: c(7.5), color: GREY }}>
              {label}
            </span>
            <span className="block" style={{ fontSize: c(16), fontWeight: 700, marginTop: c(3) }}>
              {value}
            </span>
          </Card>
        ))}
      </div>
      <span
        className="mt-auto flex items-center justify-center text-white"
        style={{ margin: `auto ${c(11)} ${c(13)}`, height: c(39), borderRadius: c(11), background: NAVY, fontSize: c(10), fontWeight: 600, gap: c(6) }}
      >
        <Sparkle size={7} /> start a session
      </span>
      <Tabs active="home" />
    </>
  );
}

function ChatHeader() {
  return (
    <div className="flex items-center" style={{ padding: `${c(16)} ${c(15)} ${c(9)}`, gap: c(9), borderBottom: `1px solid ${LINE}` }}>
      <svg viewBox="0 0 10 16" style={{ width: c(5) }} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2L2 8l6 6" />
      </svg>
      <span className="grid place-items-center text-white" style={{ width: c(26), height: c(26), borderRadius: c(7), background: NAVY }}>
        <Sparkle size={9} />
      </span>
      <span>
        <span className="block" style={{ fontSize: c(11), fontWeight: 600 }}>
          Spark
        </span>
        <span className="block" style={{ fontSize: c(7), color: GREY }}>
          english · climate change
        </span>
      </span>
    </div>
  );
}

function Mine({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 ml-auto w-fit text-white" style={{ maxWidth: "74%", fontSize: c(10), lineHeight: 1.45, padding: `${c(8)} ${c(11)}`, borderRadius: c(12), background: NAVY }}>
      {children}
    </p>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="grid place-items-center rounded-full" style={{ minWidth: c(18), height: c(13), padding: `0 ${c(4)}`, fontSize: c(7), fontWeight: 600, background: LAV, color: INK }}>
      {children}
    </span>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 12 12" style={{ width: c(9) }} fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" />
      <path d="M4.2 5.5V4a1.8 1.8 0 0 1 3.6 0v1.5" />
    </svg>
  );
}

function Composer() {
  return (
    <div className="mt-auto flex items-center bg-white" style={{ margin: `0 ${c(11)} ${c(10)}`, padding: `${c(4)} ${c(4)} ${c(4)} ${c(12)}`, borderRadius: c(16), border: `1px solid ${LINE}` }}>
      <span className="flex-1" style={{ fontSize: c(9), color: "#A5A6B4" }}>
        Ask Spark…
      </span>
      <span className="grid place-items-center rounded-full text-white" style={{ width: c(26), height: c(26), background: NAVY }}>
        <svg viewBox="0 0 12 12" style={{ width: c(10) }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 10V2M2.8 5.2L6 2l3.2 3.2" />
        </svg>
      </span>
    </div>
  );
}

const OPTIONS: [string, string | null][] = [
  ["Hint", "+2"],
  ["Guiding question", "+1"],
  ["Outline suggestion", "+1"],
  ["Full explanation", null],
];

export function AskScreen() {
  return (
    <>
      <ChatHeader />
      <div className="flex flex-col" style={{ padding: `${c(14)} ${c(11)} 0`, gap: c(10) }}>
        <Mine>Can you write my english assignment about climate change?</Mine>
        <Card style={{ padding: `${c(9)} ${c(11)}`, maxWidth: "82%" }}>
          <span className="flex items-center" style={{ gap: c(3), fontSize: c(7.5), fontWeight: 600, color: NAVY }}>
            <Sparkle size={6} /> Spark
          </span>
          <p className="m-0" style={{ fontSize: c(10), lineHeight: 1.45, marginTop: c(3) }}>
            While I can&apos;t fully write your assignment for you, I can help you out!
          </p>
        </Card>
        <p className="m-0" style={{ fontSize: c(8), color: GREY, marginTop: c(4) }}>
          What would you like?
        </p>
        <div className="flex flex-col" style={{ gap: c(7), marginTop: c(-3) }}>
          {OPTIONS.map(([label, pts]) => (
            <span
              key={label}
              className="flex items-center justify-between"
              style={{
                height: c(32),
                padding: `0 ${c(11)}`,
                borderRadius: c(9),
                fontSize: c(10),
                background: pts ? "#FFFFFF" : "transparent",
                border: `1px solid ${LINE}`,
                color: pts ? INK : "#A5A6B4",
              }}
            >
              {label}
              {pts ? <Badge>{pts}</Badge> : <Lock />}
            </span>
          ))}
        </div>
      </div>
      <Composer />
      <Tabs active="learn" />
    </>
  );
}

export function HintScreen() {
  return (
    <>
      <ChatHeader />
      <div className="flex flex-col" style={{ padding: `${c(14)} ${c(11)} 0`, gap: c(7) }}>
        <span className="flex items-center justify-between text-white" style={{ height: c(30), padding: `0 ${c(11)}`, borderRadius: c(9), fontSize: c(10), background: "#8486A9" }}>
          Hint
          <svg viewBox="0 0 12 12" style={{ width: c(9) }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.3 2.3 4.7-5" />
          </svg>
        </span>
        <span className="flex items-center justify-between" style={{ height: c(30), padding: `0 ${c(11)}`, borderRadius: c(9), fontSize: c(10), color: GREY, background: "rgba(255,255,255,0.55)" }}>
          Guiding question
          <Badge>+1</Badge>
        </span>
        <div style={{ marginTop: c(7) }}>
          <Mine>Hint</Mine>
        </div>
        <Card style={{ padding: `${c(9)} ${c(11)} ${c(11)}`, maxWidth: "86%", marginTop: c(7) }}>
          <span className="flex items-center justify-between">
            <span className="flex items-center" style={{ gap: c(3), fontSize: c(7.5), fontWeight: 600, color: NAVY }}>
              <Sparkle size={6} /> Spark · hint
            </span>
            <Badge>+2</Badge>
          </span>
          <p className="m-0" style={{ fontSize: c(10), lineHeight: 1.5, marginTop: c(4) }}>
            Think about &lsquo;Climate Gentrification.&rsquo; When sea levels rise, why does the value of inland property go up, and who gets pushed out of those
            neighborhoods as a result?
          </p>
        </Card>
        <p className="m-0 text-center" style={{ fontSize: c(7.5), color: GREY, marginTop: c(6) }}>
          your turn: answer in your own words
        </p>
      </div>
      <Composer />
      <Tabs active="learn" />
    </>
  );
}

const LEVELS = [
  { name: "Assisted", note: "Learning the ropes", range: "0–50", state: "done" },
  { name: "Guided", note: "Growing confidence, step by step", range: "50–150", state: "now" },
  { name: "Builder", note: "Strong thinking, minimal help", range: "150–300", state: "next" },
  { name: "Thinker", note: "Leading with your own reasoning", range: "300+", state: "next" },
];

export function StatusScreen() {
  return (
    <>
      <p className="m-0" style={{ padding: `${c(20)} ${c(17)} ${c(12)}`, fontSize: c(19), letterSpacing: "-0.03em" }}>
        <span style={{ fontWeight: 700 }}>spark</span> <span style={{ fontFamily: SERIF, fontStyle: "italic" }}>status</span>
      </p>
      <ScoreCard />
      <Card style={{ margin: `${c(11)} ${c(11)} 0`, padding: c(5) }}>
        {LEVELS.map((lv) => (
          <div
            key={lv.name}
            className="flex items-center"
            style={{ gap: c(9), padding: `${c(8)} ${c(8)}`, borderRadius: c(10), background: lv.state === "now" ? LAV : "transparent" }}
          >
            <span
              className="grid shrink-0 place-items-center rounded-full text-white"
              style={{ width: c(18), height: c(18), background: lv.state === "next" ? "transparent" : NAVY, border: lv.state === "next" ? `1px solid #D4D4DE` : undefined }}
            >
              {lv.state === "done" && (
                <svg viewBox="0 0 12 12" style={{ width: c(8) }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.2l2.3 2.3 4.7-5" />
                </svg>
              )}
              {lv.state === "now" && <Sparkle size={6} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block" style={{ fontSize: c(10), fontWeight: 600, color: lv.state === "next" ? GREY : INK }}>
                {lv.name}
              </span>
              <span className="block" style={{ fontSize: c(7.5), color: GREY, marginTop: c(1) }}>
                {lv.note}
              </span>
            </span>
            <span style={{ fontSize: c(8), fontWeight: lv.state === "now" ? 600 : 400, color: lv.state === "now" ? INK : GREY }}>{lv.range}</span>
          </div>
        ))}
      </Card>
      <Tabs active="status" />
    </>
  );
}

const GALLERY = [
  { title: "home", note: "your score, and where to pick up", Screen: HomeScreen },
  { title: "asking spark", note: "help on offer, not the answer", Screen: AskScreen },
  { title: "getting a hint", note: "a question back, to think through", Screen: HintScreen },
  { title: "spark status", note: "four levels, earned by thinking", Screen: StatusScreen },
];

// The four screens side by side on the app's navy, a soft glow behind them.
export function SparkGallery() {
  return (
    <div
      className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 rounded-[16px] px-5 py-8 md:grid-cols-4 md:gap-x-5 md:px-7 md:py-10"
      style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, #48489A 0%, rgba(72,72,154,0) 100%), #23255A" }}
    >
      {GALLERY.map(({ title, note, Screen }, i) => (
        <figure key={title} className="m-0">
          <Phone>
            <Screen />
          </Phone>
          <figcaption className="mt-4">
            <span className="flex items-baseline gap-2 text-[14px] md:text-[15px] font-semibold text-white">
              <span className="font-[family-name:var(--font-dm-mono)] text-[10px] font-normal" style={{ color: "#8D8FBF" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {title}
            </span>
            <span className="mt-1 block pl-[22px] text-[11.5px] leading-snug" style={{ color: "#A9ABD0" }}>
              {note}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
