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
          className="w-[34px] h-[34px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(156,123,90,0.08) 0%, rgba(210,160,120,0.03) 45%, transparent 62%)",
            boxShadow:
              "0 0 0 1px rgba(156,123,90,0.5), 0 0 2.8px rgba(156,123,90,0.08)",
          }}
        />
      </div>
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
