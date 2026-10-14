import Image from "next/image";

const DARK = "#2A2722";
const CREAM = "#F4F0E2";
const SAND = "#E6DCB2";
const NUM = "#9A7A3A";

const PRICES = [
  { name: "Brand A", price: 45 },
  { name: "Brand B", price: 120 },
  { name: "alvarez", price: 78, ours: true },
  { name: "Brand C", price: 210 },
];

// 01: where alvarez's price sits among the brands it was compared with
function PriceBars() {
  return (
    <div className="grid grid-cols-[52px_1fr] items-center gap-x-3 gap-y-2 text-[11px]">
      {PRICES.map((p) => (
        <div key={p.name} className="contents">
          <span style={{ color: p.ours ? DARK : "#8A8270" }}>{p.name}</span>
          <span className="flex items-center gap-2">
            <span className="h-[7px] rounded-full" style={{ width: `${(p.price / 210) * 80}%`, background: p.ours ? DARK : "#E2DDD0" }} />
            <span style={{ color: "#8A8270" }}>${p.price}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// 02: the two wordmarks side by side, dark streetwear and clean retail
function Directions() {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-[12px] p-2" style={{ background: "#3A3632", containerType: "inline-size" }}>
      <span
        className="grid aspect-[146/137] place-items-center rounded-[8px] leading-none"
        style={{ background: "#161412", color: "#F2EAD3", fontFamily: "var(--font-archivo-var), sans-serif", fontWeight: 900, fontStretch: "85%", fontSize: "8.4cqw", letterSpacing: "-0.04em" }}
      >
        ALVAREZ
      </span>
      <span
        className="grid aspect-[146/137] place-items-center rounded-[8px] bg-white leading-none"
        style={{ color: DARK, fontFamily: "var(--font-archivo-var), sans-serif", fontWeight: 800, fontStretch: "92%", fontSize: "9cqw", letterSpacing: "-0.045em" }}
      >
        alvarez
      </span>
    </div>
  );
}

// 03: a storefront grid in miniature
function Storefront() {
  const items = ["/alvarez/hoodie-front.png", "/alvarez/hoodie-back.png", "/alvarez/hoodie-front.png"];
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[10px] bg-white p-3">
      {items.map((src, i) => (
        <div key={i}>
          <div className="relative aspect-[93/107] rounded-[6px]" style={{ background: SAND }}>
            <Image src={src} alt="" fill className="object-contain p-[12%]" sizes="100px" />
          </div>
          <span className="mt-2 block h-[5px] w-[70%] rounded-full" style={{ background: DARK }} />
          <span className="mt-1.5 block h-[5px] w-[40%] rounded-full" style={{ background: "#DCD6C6" }} />
        </div>
      ))}
    </div>
  );
}

// 04: the hoodie itself
function Garment() {
  return (
    <div className="relative mx-auto aspect-[607/638] w-[36%] max-w-[124px]">
      <Image src="/alvarez/hoodie-front.png" alt="Alvarez hoodie with the walking-figures print" fill className="object-contain" sizes="124px" />
    </div>
  );
}

const ART = [PriceBars, Directions, Storefront, Garment];
const BG = [CREAM, DARK, SAND, CREAM];

// The four parts of the alvarez work, each card with a small drawing of it.
export default function AlvarezSolution({ items }: { items: { title: string; line: string }[] }) {
  return (
    <ol className="m-0 mt-6 grid list-none gap-3 p-0 sm:grid-cols-2">
      {items.slice(0, 4).map((item, i) => {
        const Art = ART[i];
        const dark = i === 1;
        return (
          <li key={item.title} className="flex flex-col rounded-[16px] p-5 md:p-[22px]" style={{ background: BG[i] }}>
            <span className="text-[12px]" style={{ color: dark ? "#A49B88" : NUM }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className={`flex flex-1 flex-col justify-center ${i === 0 ? "py-8" : "pt-5 pb-4"}`}>
              <Art />
            </div>
            <p className="m-0 text-[16px] md:text-[17px] leading-snug" style={{ color: dark ? "#FFFFFF" : DARK }}>
              {item.title}
            </p>
            <p className="m-0 mt-1.5 text-[13px] leading-[1.55]" style={{ color: dark ? "#B8B0A0" : "#6E6757" }}>
              {item.line}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
