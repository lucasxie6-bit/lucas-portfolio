"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="w-[48px] h-[48px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(156,123,90,0.10) 0%, rgba(210,160,120,0.04) 50%, transparent 70%)",
            boxShadow: "0 0 0 1px rgba(156,123,90,0.6), 0 0 6px rgba(156,123,90,0.15)",
          }}
        />
      </div>
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
