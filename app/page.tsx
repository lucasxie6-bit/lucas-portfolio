"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export type Tab = "work" | "about" | "contact";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("work");

  return (
    <div className="min-h-screen flex flex-col">
      <Hero activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        <TabPanel active={activeTab === "work"}>
          <Work />
        </TabPanel>
        <TabPanel active={activeTab === "about"}>
          <About />
        </TabPanel>
        <TabPanel active={activeTab === "contact"}>
          <Contact />
        </TabPanel>
      </main>
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}

function TabPanel({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  if (!active) return null;
  return (
    <div style={{ animation: "fadeIn 0.25s ease forwards" }}>
      {children}
    </div>
  );
}
