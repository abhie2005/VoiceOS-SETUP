"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nimbus, { type NimbusState } from "./Nimbus";
import { Badge } from "@/components/ui/badge";

type Turn = {
  id: number;
  from: "nimbus" | "you";
  text: string;
  cites?: string[];
  unknown?: boolean;
};

const ASKS = [
  "Why do we run two deploy pipelines?",
  "How do I get staging access?",
  "What's our on-call policy?",
];

const ANSWERS: Record<string, Omit<Turn, "id" | "from">> = {
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

/**
 * Nimbus, and nothing else.
 *
 * There is no chat panel — the character is the entire interface. Everything
 * it says comes out of the bubble beside it, which keeps the interaction
 * voice-shaped instead of turning into a messaging window.
 */
export default function VoiceBuddy() {
  const [state, setState] = useState<NimbusState>("idle");
  const [caption, setCaption] = useState<Turn | null>(null);
  const [greeting, setGreeting] = useState(false);
  const [asked, setAsked] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const hello = setTimeout(() => setGreeting(true), 900);
    const pending = timers.current;
    return () => {
      clearTimeout(hello);
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
        setCaption({ ...body, id: Date.now() + 1, from: "nimbus" });
        setState("speaking");
        later(() => setState("idle"), 4500);
      }, 1500);
    },
    [later],
  );

  /** Clicking Nimbus opens the mic. Real build swaps this for VoiceOS. */
  const talk = useCallback(() => {
    if (state !== "idle") return;
    setGreeting(false);
    setCaption(null);
    setState("listening");
    const q = ASKS[asked % ASKS.length];
    setAsked((n) => n + 1);
    later(() => respond(q), 2000);
  }, [state, asked, respond, later]);

  const status =
    state === "listening"
      ? "Listening…"
      : state === "thinking"
        ? "Checking the wiki…"
        : null;

  return (
    <div className="pointer-events-none fixed left-0 top-1/2 z-40 flex -translate-y-1/2 items-center">
      <button
        onClick={talk}
        aria-label="Talk to Nimbus"
        className="pointer-events-auto block w-[170px] -translate-x-[30%] transition-transform duration-500 ease-out hover:-translate-x-[20%] md:w-[330px]"
      >
        <Nimbus state={state} className="h-auto w-full" />
      </button>

      {/* Everything Nimbus says lives here. */}
      <div className="pointer-events-auto -ml-4 w-max max-w-[14rem] md:-ml-10 md:max-w-[19rem]">
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
          <Bubble>
            <p className="text-sm leading-snug">{GREETING}</p>
            <button
              onClick={talk}
              className="mt-2.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Yes — let&apos;s go
            </button>
          </Bubble>
        ) : null}
      </div>
    </div>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="caption-in glass-chip relative rounded-2xl px-4 py-3 shadow-lg">
      {children}
      {/* Tail, pointing back at Nimbus. */}
      <span className="glass-chip absolute -left-1 top-1/2 size-3 -translate-y-1/2 rotate-45 rounded-[3px] border-r-0 border-t-0" />
    </div>
  );
}
