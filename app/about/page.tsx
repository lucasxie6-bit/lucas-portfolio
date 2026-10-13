import type { Metadata } from "next";
import About from "@/components/About";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About — Lucas Xie",
  description: "About Lucas Xie.",
};

export default function AboutPage() {
  return (
    <div className="force-light min-h-screen bg-white text-[#111827] font-[family-name:var(--font-dm-sans)]">
      <SiteHeader active="about" className="h-[72px] md:h-[96px] px-6 md:px-[72px]" />
      <main className="pt-16 md:pt-24 pb-4">
        <About />
      </main>
    </div>
  );
}
