"use client";

import { useEffect, useRef, useState } from "react";
import {
  applySettings,
  defaultSettings,
  loadSettings,
  type SiteSettings,
  type TextSize,
} from "@/lib/settings";

const textSizes: { value: TextSize; label: string }[] = [
  { value: "base", label: "A" },
  { value: "lg", label: "A+" },
  { value: "xl", label: "A++" },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const update = (next: Partial<SiteSettings>) => {
    const merged = { ...settings, ...next };
    setSettings(merged);
    applySettings(merged);
  };

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-[60]" data-cursor="sm">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-64 rounded-2xl bg-white/95 dark:bg-stone-50/95 backdrop-blur-sm ring-1 ring-stone-200/70 shadow-lg p-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-stone-800 tracking-wide mb-2">
              Appearance
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update({ theme: "light" })}
                className={`flex-1 text-xs py-1.5 rounded-full ring-1 transition-colors duration-150 cursor-pointer ${
                  settings.theme === "light"
                    ? "bg-stone-800 text-stone-50 ring-stone-800"
                    : "text-stone-500 ring-stone-200 hover:text-stone-800"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => update({ theme: "dark" })}
                className={`flex-1 text-xs py-1.5 rounded-full ring-1 transition-colors duration-150 cursor-pointer ${
                  settings.theme === "dark"
                    ? "bg-stone-800 text-stone-50 ring-stone-800"
                    : "text-stone-500 ring-stone-200 hover:text-stone-800"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-stone-800 tracking-wide mb-2">
              Text size
            </p>
            <div className="flex gap-2">
              {textSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => update({ textSize: size.value })}
                  className={`flex-1 text-xs py-1.5 rounded-full ring-1 transition-colors duration-150 cursor-pointer ${
                    settings.textSize === size.value
                      ? "bg-stone-800 text-stone-50 ring-stone-800"
                      : "text-stone-500 ring-stone-200 hover:text-stone-800"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-medium text-stone-800 tracking-wide">
              Reduce motion
            </span>
            <span
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => update({ reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ${
                settings.reducedMotion ? "bg-stone-800" : "bg-stone-200"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-150 ${
                  settings.reducedMotion ? "translate-x-[18px]" : "translate-x-[3px]"
                }`}
              />
            </span>
          </label>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Display settings"
        aria-expanded={open}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/85 dark:bg-stone-50/85 backdrop-blur-sm ring-1 ring-stone-200/70 text-stone-500 hover:text-stone-800 shadow-sm transition-colors duration-150 cursor-pointer"
      >
        {settings.theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
