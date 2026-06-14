"use client";

import { useEffect, useRef, useState } from "react";
import { SETTINGS_EVENT, loadSettings, type SiteSettings } from "@/lib/settings";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktop(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setReducedMotion(loadSettings().reducedMotion);

    const onSettingsChange = (e: Event) => {
      setReducedMotion((e as CustomEvent<SiteSettings>).detail.reducedMotion);
    };

    window.addEventListener(SETTINGS_EVENT, onSettingsChange);
    return () => window.removeEventListener(SETTINGS_EVENT, onSettingsChange);
  }, []);

  useEffect(() => {
    if (!isDesktop || reducedMotion) return;

    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      setIsVisible(true);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsCompact(!!target.closest('[data-cursor="sm"]'));
    };

    const onLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [isDesktop, reducedMotion]);

  if (!isDesktop || reducedMotion) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
        style={{ willChange: "transform", opacity: isVisible ? 1 : 0 }}
      >
        <div
          className="w-[34px] h-[34px] rounded-full transition-transform duration-200 ease-out"
          style={{
            background:
              "radial-gradient(circle, rgba(156,123,90,0.08) 0%, rgba(210,160,120,0.03) 45%, transparent 62%)",
            boxShadow:
              "0 0 0 1px rgba(156,123,90,0.5), 0 0 2.8px rgba(156,123,90,0.08)",
            transform: isCompact ? "scale(0.5)" : "scale(1)",
          }}
        />
      </div>
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
