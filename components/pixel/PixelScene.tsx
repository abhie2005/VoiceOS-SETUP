"use client";

import { useCallback, useEffect, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import PixelSprite from "./PixelSprite";
import type { SpriteName } from "./sprites";
import { cn } from "@/lib/utils";

export type Motion = "pop" | "rise" | "drift" | "pulse" | "shake";

export type Beat = {
  /** Sprites shown side by side for this beat. */
  sprites: SpriteName[];
  caption: string;
  motion?: Motion;
  /** Milliseconds this beat holds. Defaults to 3000. */
  ms?: number;
};

export type PixelAnimation = {
  title: string;
  beats: Beat[];
};

const MOTION_CLASS: Record<Motion, string> = {
  pop: "px-pop",
  rise: "px-rise",
  drift: "px-drift",
  pulse: "px-pulse",
  shake: "px-shake",
};

/**
 * Plays a sequence of beats as a pixel animation.
 *
 * The backend supplies the beats — which sprites, what caption, which motion —
 * and this renders and paces them. It is deliberately declarative: adding a
 * new explainer means returning different data, not writing new components.
 */
export default function PixelScene({ title, beats }: PixelAnimation) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  const beat = beats[i];
  const last = i >= beats.length - 1;

  const next = useCallback(() => {
    setI((n) => Math.min(n + 1, beats.length - 1));
  }, [beats.length]);

  const prev = useCallback(() => setI((n) => Math.max(n - 1, 0)), []);

  useEffect(() => {
    if (!playing || last) return;
    const t = setTimeout(next, beat?.ms ?? 3000);
    return () => clearTimeout(t);
  }, [playing, last, next, beat, i]);

  if (!beat) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Stage */}
      <div className="relative grid flex-1 place-items-center overflow-hidden bg-muted p-6">
        <div
          // Keyed so React remounts on every beat and the entry motion replays.
          key={i}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {beat.sprites.map((s, n) => (
            <PixelSprite
              key={`${s}-${n}`}
              name={s}
              size={128}
              className={cn(
                "h-auto w-[68px] md:w-[128px]",
                MOTION_CLASS[beat.motion ?? "pop"],
              )}
              // Staggered so a row of sprites arrives in sequence, not as a block.
              style={{ animationDelay: `${n * 0.14}s` }}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="border-t border-border px-5 py-4">
        <p className="text-center text-base leading-snug text-balance md:text-lg">
          {beat.caption}
        </p>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-3 border-t border-border px-4 py-2.5">
        <button
          onClick={prev}
          disabled={i === 0}
          aria-label="Previous step"
          className="rounded-full p-1.5 transition hover:bg-accent disabled:opacity-30"
        >
          <SkipBack className="size-4" />
        </button>

        <button
          onClick={() => (last ? setI(0) : setPlaying((p) => !p))}
          aria-label={playing && !last ? "Pause" : "Play"}
          className="rounded-full p-1.5 transition hover:bg-accent"
        >
          {playing && !last ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </button>

        <button
          onClick={next}
          disabled={last}
          aria-label="Next step"
          className="rounded-full p-1.5 transition hover:bg-accent disabled:opacity-30"
        >
          <SkipForward className="size-4" />
        </button>

        {/* Progress */}
        <div className="flex flex-1 items-center gap-1.5">
          {beats.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Step ${n + 1}`}
              className={cn(
                "h-1 flex-1 rounded-full transition",
                n <= i ? "bg-primary" : "bg-border",
              )}
            />
          ))}
        </div>

        <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
          {i + 1}/{beats.length}
        </span>
        <span className="sr-only">{title}</span>
      </div>
    </div>
  );
}
