"use client";

import { useEffect, useRef, useState } from "react";
import {
  isEnvelope,
  type AgentState,
  type AnimationPlay,
  type AnswerProduced,
  type EventEnvelope,
  type WalkthroughStart,
} from "./buddy-events";

export type BuddyLiveState = {
  /** False until the stream connects — the UI falls back to demo data. */
  connected: boolean;
  agent: AgentState;
  answer: (AnswerProduced & { turnId?: string }) | null;
  animation: AnimationPlay | null;
  walkthrough: WalkthroughStart | null;
  /** Highest sequence seen, so a reconnect resumes rather than replays. */
  lastSequence: number;
};

const INITIAL: BuddyLiveState = {
  connected: false,
  agent: "idle",
  answer: null,
  animation: null,
  walkthrough: null,
  lastSequence: -1,
};

/**
 * Subscribes to the Buddy event stream and reduces it to what the UI renders.
 *
 * Two things this deliberately does NOT do:
 *
 * - It never throws or blocks when the backend is absent. `connected` stays
 *   false and the caller keeps its scripted demo behaviour, so the frontend
 *   demo works standalone and lights up automatically once Phase A is running.
 * - It never renders an event from a superseded turn. The backend's `sequence`
 *   is monotonic per employee, so anything at or below `lastSequence` is a
 *   replay and gets dropped.
 */
export function useBuddyEvents(url?: string): BuddyLiveState {
  const [state, setState] = useState<BuddyLiveState>(INITIAL);
  const seq = useRef(-1);

  useEffect(() => {
    const endpoint = url ?? process.env.NEXT_PUBLIC_BUDDY_EVENTS_URL;
    if (!endpoint) return;

    // `resume` lets the server replay only what we missed, which is the whole
    // point of a monotonic per-employee sequence.
    const src = new EventSource(
      seq.current >= 0 ? `${endpoint}?resume=${seq.current}` : endpoint,
      { withCredentials: true },
    );

    const onOpen = () => setState((s) => ({ ...s, connected: true }));
    const onError = () => setState((s) => ({ ...s, connected: false }));

    const onMessage = (e: MessageEvent<string>) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(e.data);
      } catch {
        return;
      }
      if (!isEnvelope(parsed)) return;

      const env = parsed as EventEnvelope;
      if (env.sequence <= seq.current) return; // replay or out-of-order
      seq.current = env.sequence;

      setState((s) => reduce(s, env));
    };

    src.addEventListener("open", onOpen);
    src.addEventListener("error", onError);
    src.addEventListener("message", onMessage);

    return () => {
      src.removeEventListener("open", onOpen);
      src.removeEventListener("error", onError);
      src.removeEventListener("message", onMessage);
      src.close();
    };
  }, [url]);

  return state;
}

function reduce(s: BuddyLiveState, env: EventEnvelope): BuddyLiveState {
  const next: BuddyLiveState = { ...s, lastSequence: env.sequence };

  switch (env.type) {
    case "turn.started":
      // A new turn supersedes whatever the last one left on screen.
      return {
        ...next,
        agent: "listening",
        answer: null,
        animation: null,
        walkthrough: null,
      };

    case "answer.produced":
      return {
        ...next,
        agent: "speaking",
        answer: { ...(env.payload as AnswerProduced), turnId: env.turnId },
      };

    case "action.previewed":
      // Waiting on the user to confirm — Garfield stops talking and waits.
      return { ...next, agent: "idle" };

    case "turn.completed":
    case "error.raised":
      return { ...next, agent: "idle" };

    // Proposed events. Handled now so no frontend change is needed once
    // Phase A agrees to emit them.
    case "animation.play":
      return { ...next, animation: env.payload as AnimationPlay };

    case "walkthrough.start":
      return { ...next, walkthrough: env.payload as WalkthroughStart };

    default:
      // journey.loaded, task.status_changed, memory.stored, extension.command
      // don't drive the character; pages read those separately.
      return next;
  }
}
