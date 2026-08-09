"use client";

import { useCallback, useEffect, useState } from "react";
import PawPointer from "./PawPointer";

export type TourStep = {
  /** Matches a `data-tour="…"` attribute on the page. */
  target: string;
  label: string;
};

type Props = {
  steps: TourStep[];
  onDone: () => void;
};

type Anchor = { x: number; y: number; below: boolean };

/**
 * A step-by-step walkthrough pointed out by a cat paw.
 *
 * The gate is the whole point: step N+1 does not exist in the DOM until the
 * user actually clicks the target for step N. Nothing advances on a timer, so
 * the walkthrough can't run ahead of the person following it.
 */
export default function GuidedTour({ steps, onDone }: Props) {
  const [i, setI] = useState(0);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const step = steps[i];

  const advance = useCallback(() => {
    setAnchor(null);
    if (i + 1 >= steps.length) onDone();
    else setI(i + 1);
  }, [i, steps.length, onDone]);

  useEffect(() => {
    if (!step) return;
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${step.target}"]`,
    );
    if (!el) return;

    el.dataset.tourActive = "true";
    el.scrollIntoView({ block: "center", behavior: "smooth" });

    const measure = () => {
      const r = el.getBoundingClientRect();
      // Paw sits below the target normally, above it when the target is near
      // the bottom of the viewport and there'd be no room.
      const below = r.bottom + 120 < window.innerHeight;
      setAnchor({
        x: r.left + r.width / 2,
        y: below ? r.bottom + 8 : r.top - 8,
        below,
      });
    };

    // Deferred rather than called inline — a synchronous setState in an effect
    // body cascades renders.
    const raf = requestAnimationFrame(measure);

    el.addEventListener("click", advance);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      cancelAnimationFrame(raf);
      delete el.dataset.tourActive;
      el.removeEventListener("click", advance);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, advance]);

  if (!step || !anchor) return null;

  return (
    <div
      className="pointer-events-none fixed z-[60] flex flex-col items-center"
      style={{
        left: anchor.x,
        top: anchor.y,
        transform: anchor.below
          ? "translate(-50%, 0)"
          : "translate(-50%, -100%)",
      }}
    >
      {!anchor.below && <Label i={i} total={steps.length} text={step.label} />}

      <PawPointer
        size={32}
        className="paw-tap"
        // Flipped to point down when it's sitting above the target.
        style={anchor.below ? undefined : { transform: "rotate(180deg)" }}
      />

      {anchor.below && <Label i={i} total={steps.length} text={step.label} />}
    </div>
  );
}

function Label({ i, total, text }: { i: number; total: number; text: string }) {
  return (
    <div className="glass-chip mt-1 flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg">
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {i + 1}/{total}
      </span>
      <span className="text-xs font-medium whitespace-nowrap">{text}</span>
    </div>
  );
}
