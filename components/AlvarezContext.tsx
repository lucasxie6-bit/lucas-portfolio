import Image from "next/image";

const DARK = "#2A2722";

// The context headline with the hoodie tucked into it as a small pill, then the brief beside its label.
// "{hoodie}" in the headline marks where the pill goes.
export default function AlvarezContext({ lead, text }: { lead: string; text: string }) {
  const [before, after] = lead.split("{hoodie}");
  return (
    <>
      <p className="m-0 mt-6 max-w-[720px] text-[32px] md:text-[46px] leading-[1.12] tracking-[-0.035em]" style={{ color: DARK }}>
        {before}
        <span
          aria-hidden="true"
          className="relative mx-[0.12em] inline-block h-[0.92em] w-[1.6em] translate-y-[0.1em] overflow-hidden rounded-full align-baseline"
          style={{ background: "#E8DEB0" }}
        >
          <Image src="/alvarez/hoodie-front.png" alt="" fill className="object-contain pt-[0.12em]" sizes="80px" />
        </span>
        {after}
      </p>
      <div className="mt-8 md:mt-10 grid gap-2 border-t pt-6 md:grid-cols-[200px_1fr] md:gap-10" style={{ borderColor: "#EEEAE0" }}>
        <p className="m-0 text-[12px]" style={{ color: "#8A7A55" }}>
          The brief
        </p>
        <p className="m-0 text-[15px] md:text-[16px] leading-[1.7]" style={{ color: "#3D3830" }}>
          {text}
        </p>
      </div>
    </>
  );
}
