import "server-only";
import { randomUUID } from "node:crypto";

/**
 * In-process event bus for the visual channel.
 *
 * VoiceOS gives MCP tools a text return and nothing else, so when a spoken turn
 * happens the browser has to be told separately. The stdio adapter POSTs each
 * turn here; the browser holds an SSE connection and receives it.
 *
 * This mirrors the real backend's EventBus semantics — monotonic sequence,
 * bounded replay buffer, resume-after-N — so swapping to Phase A's
 * /v1/events is a URL change rather than a rewrite.
 *
 * A module singleton only works because dev and `next start` run one Node
 * process. On serverless this would need Redis or Vercel Queues; that is a
 * deployment concern, not a demo one.
 */

export type BuddyEvent = {
  version: number;
  eventId: string;
  turnId?: string;
  sequence: number;
  type: string;
  employeeId: string;
  payload: unknown;
  createdAt: string;
};

type Listener = (e: BuddyEvent) => void;

const BUFFER = 200;

class Bus {
  private seq = 0;
  private buffer: BuddyEvent[] = [];
  private listeners = new Set<Listener>();

  emit(type: string, payload: unknown, turnId?: string): BuddyEvent {
    const event: BuddyEvent = {
      version: 1,
      eventId: randomUUID(),
      turnId,
      sequence: this.seq++,
      type,
      employeeId: "joy.mehta",
      payload,
      createdAt: new Date().toISOString(),
    };

    this.buffer.push(event);
    if (this.buffer.length > BUFFER) this.buffer.shift();
    for (const l of this.listeners) l(event);
    return event;
  }

  /** Replays anything after `resume`, then streams live. */
  subscribe(listener: Listener, resume = -1): () => void {
    for (const e of this.buffer) {
      if (e.sequence > resume) listener(e);
    }
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * Survives hot reload — Next replaces modules in dev, which would otherwise
 * drop every open SSE connection's bus on each edit.
 */
const globalForBus = globalThis as unknown as { __buddyBus?: Bus };
export const bus = (globalForBus.__buddyBus ??= new Bus());
