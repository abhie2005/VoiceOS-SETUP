"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Garfield, { type GarfieldState } from "./Garfield";
import { Badge } from "@/components/ui/badge";
import GuidedTour, { type TourStep } from "./GuidedTour";
import PixelScene, { type PixelAnimation } from "./pixel/PixelScene";
import { cn } from "@/lib/utils";

type Turn = {
  id: number;
  from: "garfield" | "you";
  text: string;
  cites?: string[];
  unknown?: boolean;
  /** Pre-rendered clip. `src` is supplied by the backend per question. */
  video?: { src: string; poster?: string; caption: string };
  /** Pixel explainer, composed from the sprite library at run time. */
  animation?: PixelAnimation;
  /** Names a walkthrough in TOURS — the step-by-step answer mode. */
  tour?: string;
};

/**
 * Walkthroughs. `target` matches a data-tour attribute on the page; the user
 * has to click each one before the next step appears.
 */
const TOURS: Record<string, TourStep[]> = {
  payroll: [
    { target: "finance", label: "Start here — open Finance" },
    { target: "payroll-card", label: "This is payroll, running on ADP" },
    { target: "deposit-setup", label: "Now set up your direct deposit" },
  ],
};

const ASKS = [
  "Explain how to set up payroll in ADP — in animation",
  "How do I set up payroll in ADP?",
  "Explain photosynthesis with an animation",
  "Why do we run two deploy pipelines?",
  "What's our on-call policy?",
];

const ANSWERS: Record<string, Omit<Turn, "id" | "from">> = {
  "Explain how to set up payroll in ADP — in animation": {
    text: "Here's the animated version — four steps in ADP.",
    cites: ["ADP — Payroll setup", "wiki/payroll"],
    animation: {
      title: "Setting up payroll in ADP",
      beats: [
        {
          sprites: ["person", "computer"],
          caption:
            "Open ADP from the AMS launcher — SSO signs you straight in.",
          motion: "rise",
        },
        {
          sprites: ["bank", "arrow", "payslip"],
          caption:
            "Step 1 — Deposit vault. Add your bank, routing and account number. That's where the paycheck lands.",
          motion: "drift",
        },
        {
          sprites: ["document", "check"],
          caption:
            "Step 2 — Tax scroll. Filing status and state of residence set how much comes out of each check.",
          motion: "pop",
        },
        {
          sprites: ["calendar", "coin"],
          caption:
            "Step 3 — Pay calendar. AMS pays bi-weekly, every other Friday. Pick email or mail for your stub.",
          motion: "pulse",
        },
        {
          sprites: ["lock"],
          caption:
            "Your account details are encrypted. Finance sees the deposit, never the raw numbers.",
          motion: "pulse",
        },
        {
          sprites: ["check", "payslip"],
          caption:
            "Step 4 — Final review, then submit. First paycheck lands Friday, August 21.",
          motion: "pop",
        },
      ],
    },
  },
  "How do I set up payroll in ADP?": {
    text: "Four steps in ADP: deposit vault, tax scroll, pay calendar, then a final review. I'll point at each one — click where the paw lands and I'll show you the next.",
    tour: "payroll",
    cites: ["ADP — Payroll setup", "wiki/payroll"],
  },
  "Why do we run two deploy pipelines?": {
    text: "Legacy services still ship through Jenkins. Anything created after the 2024 platform migration goes through GitHub Actions — Jenkins retires once the last three services move over.",
    cites: ["ADR-014 Platform Migration", "wiki/deploys"],
  },
  "How do I get staging access?": {
    text: "Staging sits behind the eng-staging group. I can request it now — one approval from your manager, usually lands within the hour.",
    cites: ["wiki/environments"],
  },
  "What's our on-call policy?": {
    text: "I don't have this documented. On-call rotations aren't in anything I've indexed, so I'd rather not guess — ask Priya Raman on Platform, she owns the rotation.",
    unknown: true,
  },
};

const GREETING = "Hey! Do you want to start onboarding?";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), Math.max(lo, hi));

/**
 * Garfield, and nothing else.
 *
 * There is no chat panel — the character is the entire interface. Everything
 * it says comes out of the bubble beside it, which keeps the interaction
 * voice-shaped instead of turning into a messaging window.
 */
export default function VoiceBuddy() {
  const [state, setState] = useState<GarfieldState>("idle");
  const [caption, setCaption] = useState<Turn | null>(null);
  const [greeting, setGreeting] = useState(false);
  const [asked, setAsked] = useState(0);
  /** null means Garfield is still on the travel animation. */
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [tour, setTour] = useState<string | null>(null);
  const [media, setMedia] = useState<Turn | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    dx: number;
    dy: number;
    x0: number;
    y0: number;
  } | null>(null);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const hello = setTimeout(() => setGreeting(true), 900);
    // Withdraws itself if ignored. A prompt that hangs around forever reads
    // as a nag, and Garfield is meant to be patient, not pushy.
    const bye = setTimeout(() => setGreeting(false), 8000);
    const pending = timers.current;
    return () => {
      clearTimeout(hello);
      clearTimeout(bye);
      pending.forEach(clearTimeout);
    };
  }, []);

  const respond = useCallback(
    (q: string) => {
      setGreeting(false);
      setCaption({ id: Date.now(), from: "you", text: q });
      setState("thinking");

      const body = ANSWERS[q] ?? {
        text: "I don't have that documented. Rather than guess, I'll flag it so it gets written down for the next hire.",
        unknown: true,
      };

      later(() => {
        setCaption({ ...body, id: Date.now() + 1, from: "garfield" });
        setState("speaking");
        // The walkthrough starts once Garfield has finished introducing it.
        if (body.tour) later(() => setTour(body.tour!), 1200);
        if (body.video || body.animation)
          later(() => setMedia({ ...body, id: 0, from: "garfield" }), 700);
        later(() => setState("idle"), 4500);
      }, 1500);
    },
    [later],
  );

  /** Clicking Garfield opens the mic. Real build swaps this for VoiceOS. */
  const talk = useCallback(() => {
    if (state !== "idle") return;
    setGreeting(false);
    setCaption(null);
    setTour(null);
    setMedia(null);
    setState("listening");
    const q = ASKS[asked % ASKS.length];
    setAsked((n) => n + 1);
    later(() => respond(q), 2000);
  }, [state, asked, respond, later]);

  /* ---- Drag to reposition ---- */

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      // Freeze at the current visual spot before handing over to explicit
      // coordinates, so there's no jump when the animation stops applying.
      setPos({ x: r.left, y: r.top });
      dragRef.current = {
        dx: e.clientX - r.left,
        dy: e.clientY - r.top,
        x0: e.clientX,
        y0: e.clientY,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    const box = boxRef.current;
    if (!d || !box) return;
    // Only once it's a real drag — a plain click shouldn't annoy it.
    if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 5) setDragging(true);
    setPos({
      x: clamp(e.clientX - d.dx, 0, window.innerWidth - box.offsetWidth),
      y: clamp(e.clientY - d.dy, 0, window.innerHeight - box.offsetHeight),
    });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (!d) return;
      // Under the threshold it was a click, not a drag. Garfield keeps the
      // position pointerdown froze it at and listens right there — handing it
      // back to the travel animation would teleport it mid-sentence.
      if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) <= 5) talk();
    },
    [talk],
  );

  const status =
    state === "listening"
      ? "Listening…"
      : state === "thinking"
        ? "Checking the wiki…"
        : null;

  return (
    <>
      {media && <MediaOverlay turn={media} onClose={() => setMedia(null)} />}

      {tour && TOURS[tour] && (
        <GuidedTour steps={TOURS[tour]} onDone={() => setTour(null)} />
      )}

      <div
        className={cn(
          "pointer-events-none fixed z-40",
          // Once dropped somewhere, Garfield is positioned explicitly and the
          // travel animation no longer applies.
          pos ? "w-max" : "inset-x-0 top-1/2 -translate-y-1/2",
        )}
        style={pos ? { left: pos.x, top: pos.y } : undefined}
      >
        <div
          ref={boxRef}
          className={cn("flex w-max items-center", !pos && "garfield-travel")}
          // Parks wherever it is the moment Garfield is engaged, so the bubble
          // stays put while you read it.
          style={{
            animationPlayState: state === "idle" ? undefined : "paused",
          }}
        >
          <button
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onDoubleClick={() => setPos(null)}
            aria-label="Talk to Garfield — drag to move"
            title="Drag to move · double-click to set loose"
            className="pointer-events-auto block w-[62px] shrink-0 cursor-grab touch-none select-none active:cursor-grabbing md:w-[84px]"
          >
            <Garfield
              state={state}
              grabbed={dragging}
              className="h-auto w-full"
            />
          </button>

          {/* Everything Garfield says lives here. */}
          <div className="pointer-events-auto ml-2 w-max max-w-[13rem] md:max-w-[18rem]">
            {status ? (
              <Bubble>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {status}
                </span>
              </Bubble>
            ) : caption ? (
              <Bubble key={caption.id}>
                {caption.from === "you" ? (
                  <span className="text-sm italic text-muted-foreground">
                    “{caption.text}”
                  </span>
                ) : (
                  <>
                    {caption.unknown && (
                      <Badge
                        variant="outline"
                        className="mb-2 border-dashed text-[10px] font-semibold uppercase"
                      >
                        Not documented
                      </Badge>
                    )}
                    <p className="text-sm leading-relaxed">{caption.text}</p>
                    {(caption.video || caption.animation) && (
                      <button
                        onClick={() => setMedia(caption)}
                        className="mt-2.5 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        ▶ Play again
                      </button>
                    )}
                    {caption.cites && (
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {caption.cites.map((c) => (
                          <li key={c}>
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              {c}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </Bubble>
            ) : greeting ? (
              // Compact while travelling — a full-width bubble would hang off the
              // right edge for most of the crossing.
              <button
                onClick={talk}
                className="caption-in glass-chip rounded-full px-3.5 py-2 text-xs font-medium shadow-lg transition hover:scale-105"
              >
                {GREETING}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Media overlay at 75% of the viewport. Carries either a pre-rendered clip
 * from the backend or a pixel animation composed from the sprite library.
 */
function MediaOverlay({ turn, onClose }: { turn: Turn; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = turn.animation?.title ?? turn.video?.caption ?? "Explainer";

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <figure
        className="caption-in flex h-[75vh] w-[75vw] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        // The backdrop closes on click; the player itself must not.
        onClick={(e) => e.stopPropagation()}
      >
        <figcaption className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <span className="flex-1 text-sm font-semibold">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2 py-0.5 text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            ✕
          </button>
        </figcaption>

        {turn.animation ? (
          <PixelScene {...turn.animation} />
        ) : turn.video?.src ? (
          <video
            src={turn.video.src}
            poster={turn.video.poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full bg-black object-contain"
          />
        ) : (
          <div className="grid flex-1 place-items-center bg-muted">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Awaiting video from backend
            </span>
          </div>
        )}
      </figure>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="caption-in glass-chip relative rounded-2xl px-4 py-3 shadow-lg">
      {children}
      {/* Tail, pointing back at Garfield. */}
      <span className="glass-chip absolute -left-1 top-1/2 size-3 -translate-y-1/2 rotate-45 rounded-[3px] border-r-0 border-t-0" />
    </div>
  );
}
