import type { Metadata } from "next";
import About from "@/components/About";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "About — Lucas Xie",
  description: "About Lucas Xie.",
};

export default function AboutPage() {
  return (
    <div className="force-light min-h-screen bg-[#F4F1EA] text-[#1C191B] font-[family-name:var(--font-dm-sans)]">
      <TopBar className="px-6 md:px-12 pt-8 lg:pt-10" />
      <main className="pt-16 md:pt-24 pb-4">
        <About />
      </main>
    </div>
  );
}
