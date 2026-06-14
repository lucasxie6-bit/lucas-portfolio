export type Theme = "light" | "dark";
export type TextSize = "base" | "lg" | "xl";

export interface SiteSettings {
  theme: Theme;
  reducedMotion: boolean;
  textSize: TextSize;
}

export const SETTINGS_EVENT = "sitesettingschange";
const STORAGE_KEY = "site-settings";

export const defaultSettings: SiteSettings = {
  theme: "light",
  reducedMotion: false,
  textSize: "base",
};

export function loadSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    // ignore malformed storage
  }

  return {
    ...defaultSettings,
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

export function applySettings(settings: SiteSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.toggle("dark", settings.theme === "dark");
  root.classList.toggle("reduce-motion", settings.reducedMotion);
  root.setAttribute("data-text-size", settings.textSize);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent<SiteSettings>(SETTINGS_EVENT, { detail: settings }));
}
