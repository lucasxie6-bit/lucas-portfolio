"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

// One shared audio player for the About page's 30-second Apple Music previews. Nothing plays until someone clicks.
export type Track = { title: string; artist: string; cover: string; preview: string; href: string };
type State = { track: Track | null; playing: boolean; progress: number };

let audio: HTMLAudioElement | null = null;
let state: State = { track: null, playing: false, progress: 0 };
const IDLE: State = state;
const listeners = new Set<() => void>();
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function player() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("timeupdate", () => audio && set({ progress: audio.duration ? audio.currentTime / audio.duration : 0 }));
    audio.addEventListener("play", () => set({ playing: true }));
    audio.addEventListener("pause", () => set({ playing: false }));
    audio.addEventListener("ended", () => set({ playing: false, progress: 0 }));
  }
  return audio;
}

/** Play a track, or pause/resume it if it's the one already loaded. */
export function toggle(track: Track) {
  const a = player();
  if (state.track?.preview === track.preview) {
    if (a.paused) void a.play();
    else a.pause();
    return;
  }
  a.src = track.preview;
  set({ track, progress: 0 });
  void a.play();
}

export function stop() {
  audio?.pause();
  set({ track: null, playing: false, progress: 0 });
}

export function useNowPlaying() {
  return useSyncExternalStore(subscribe, () => state, () => IDLE);
}

export function PlayIcon({ playing, size = 9 }: { playing: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      {playing ? <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" /> : <path d="M4 2.6v10.8a.7.7 0 0 0 1.07.6l8.5-5.4a.7.7 0 0 0 0-1.2l-8.5-5.4A.7.7 0 0 0 4 2.6Z" />}
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A row in the favourites list. Rows with a preview play it; the thin line under the row shows how far in it is. */
export function TrackRow({ n, title, track }: { n: number; title: string; track?: Track }) {
  const now = useNowPlaying();
  const current = !!track && now.track?.preview === track.preview;
  const inner = (
    <>
      <span className="font-[family-name:var(--font-dm-mono)] text-[12px] text-white/45 w-7">{pad(n)}</span>
      <span className="flex-1 text-[14px] font-bold">{title}</span>
      {track && (
        <span aria-hidden="true" className={`grid size-6 place-items-center rounded-full transition-colors ${current ? "bg-white text-[#1F2945]" : "text-white/55 group-hover:text-white"}`}>
          <PlayIcon playing={current && now.playing} />
        </span>
      )}
    </>
  );
  return (
    <li className="relative border-b border-white/10 last:border-b-0">
      {track ? (
        <button
          type="button"
          onClick={() => toggle(track)}
          aria-label={`${current && now.playing ? "Pause" : "Play"} a preview of ${title}`}
          className="group flex w-full cursor-pointer items-center border-0 bg-transparent py-2.5 text-left text-white"
        >
          {inner}
        </button>
      ) : (
        <div className="flex items-center py-2.5">{inner}</div>
      )}
      {current && <span aria-hidden="true" className="absolute bottom-[-1px] left-0 h-px bg-white/80 transition-[width] duration-300 ease-linear" style={{ width: `${now.progress * 100}%` }} />}
    </li>
  );
}

/** A small album cover that plays a preview, with a progress line tracing round its edge. */
export function PlayableCover({ album, artist, cover, track }: { album: string; artist: string; cover: string; track: Track }) {
  const now = useNowPlaying();
  const current = now.track?.preview === track.preview;
  return (
    <button
      type="button"
      onClick={() => toggle(track)}
      aria-label={`${current && now.playing ? "Pause" : "Play"} ${track.title} by ${artist}`}
      className="group flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left"
    >
      <span className="relative size-12 shrink-0">
        <span className="absolute inset-0 overflow-hidden rounded-[2px] bg-[#E6E8EC]">
          <Image src={cover} alt={`${album} by ${artist}`} fill unoptimized className="object-cover" />
          <span
            aria-hidden="true"
            className={`absolute inset-0 grid place-items-center bg-black/35 text-white transition-opacity ${current ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          >
            <PlayIcon playing={current && now.playing} size={12} />
          </span>
        </span>
        {current && (
          <svg aria-hidden="true" className="pointer-events-none absolute -inset-[4px] size-[calc(100%+8px)]" viewBox="0 0 56 56">
            <rect x="1" y="1" width="54" height="54" rx="4" fill="none" stroke="#E6E8EC" strokeWidth="1.5" />
            <rect
              x="1"
              y="1"
              width="54"
              height="54"
              rx="4"
              fill="none"
              stroke="#111827"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray={`${now.progress} 1`}
              className="transition-[stroke-dasharray] duration-300 ease-linear"
            />
          </svg>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-bold text-[#111827]">{album}</span>
        <span className="block text-[13px] text-[#5F6672]">{artist}</span>
      </span>
    </button>
  );
}
