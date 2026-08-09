/**
 * Phase B's view of the Buddy event contract.
 *
 * These types mirror `backend/shared/src/events.ts` on feature/base-product.
 * They are duplicated rather than imported so the web app can be developed and
 * built before the backend workspace is merged in; once `@winner/buddy-shared`
 * is on this branch, delete the mirrored half and import from there instead.
 *
 * The envelope is exactly the field set the architecture document names.
 * `sequence` is monotonic per employee stream, not per turn — that is what
 * makes reconnection a single "resume after N" query, while `turnId` groups the
 * events of one spoken exchange so a late-arriving turn can be dropped whole.
 */

export const CONTRACT_VERSION = 1;

/** Produced by Phase A today. */
export type BackendEventType =
  | "turn.started"
  | "turn.completed"
  | "journey.loaded"
  | "task.status_changed"
  | "answer.produced"
  | "action.previewed"
  | "action.confirmed"
  | "action.completed"
  | "memory.stored"
  | "extension.command"
  | "error.raised";

/**
 * NOT YET IN THE BACKEND CONTRACT — proposed additive members.
 *
 * Nothing in the current enum can carry an animation payload or walkthrough
 * steps, and the architecture document requires additions be agreed and
 * versioned rather than added unilaterally. The consumer below already handles
 * them, so the day Phase A emits them the visuals light up with no further
 * frontend change.
 */
export type ProposedEventType = "animation.play" | "walkthrough.start";

export type BuddyEventType = BackendEventType | ProposedEventType;

export type EventEnvelope<P = unknown> = {
  version: number;
  eventId: string;
  turnId?: string;
  sequence: number;
  type: BuddyEventType;
  employeeId: string;
  payload: P;
  createdAt: string;
};

/* ---- Payloads this app cares about ---- */

export type Citation = { title: string; url?: string };

export type AnswerProduced = {
  text: string;
  citations?: Citation[];
  /** The honesty path: no documented answer, so it hands off instead. */
  unknown?: boolean;
};

export type TaskStatusChanged = {
  taskId: string;
  status: "pending" | "in_progress" | "blocked" | "done";
  label?: string;
};

export type ActionPreviewed = {
  actionId: string;
  summary: string;
  connector?: string;
};

/** Proposed. Shape matches PixelScene's props exactly. */
export type AnimationPlay = {
  title: string;
  beats: {
    sprites: string[];
    caption: string;
    motion?: "pop" | "rise" | "drift" | "pulse" | "shake";
    ms?: number;
  }[];
};

/** Proposed. Shape matches GuidedTour's steps exactly. */
export type WalkthroughStart = {
  tour: string;
  steps: { target: string; label: string }[];
};

/** Agent state is derived from turn events rather than sent explicitly. */
export type AgentState = "idle" | "listening" | "thinking" | "speaking";

export function isEnvelope(value: unknown): value is EventEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.eventId === "string" &&
    typeof e.type === "string" &&
    typeof e.sequence === "number"
  );
}
