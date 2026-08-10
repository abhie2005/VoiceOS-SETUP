import { NextResponse } from "next/server";
import { bus } from "@/lib/event-bus";
import { lookup, visualsFor } from "@/lib/db/knowledge";
import { parseAnswer } from "@/lib/mcp-client";

/**
 * Turn ingress from the VoiceOS stdio adapter.
 *
 * The adapter calls this after each spoken tool call so the browser can react
 * to speech it never hears. It emits the same event shapes the real backend
 * will, so the browser code doesn't change when Phase A takes over.
 *
 * Trusted local-only endpoint: the adapter runs on the same machine as the dev
 * server. Anything internet-facing needs the auth claims from the contract.
 */
export const runtime = "nodejs";

type Body = {
  kind: "listening" | "answer" | "status" | "done";
  question?: string;
  /** Raw tool text, citations still inline. */
  text?: string;
  turnId?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const turnId = body.turnId ?? crypto.randomUUID();

  switch (body.kind) {
    case "listening":
      bus.emit("turn.started", { question: body.question }, turnId);
      return NextResponse.json({ ok: true, turnId });

    case "answer": {
      const question = body.question ?? "";
      const { text, citations } = parseAnswer(body.text ?? "");

      // Same order of trust as /api/ask, and it has to be identical: a
      // spoken question and a clicked one must produce the same answer, or
      // the demo contradicts itself depending on how you asked.
      const local = lookup(question);
      const answer =
        local.scope === "company"
          ? local
          : local.scope === "unknown" && local.person
            ? local
            : citations.length > 0 && text
              ? { scope: "company" as const, text, citations }
              : local;

      bus.emit("answer.produced", answer, turnId);

      // Visuals can't ride the MCP channel, so they're matched here and sent
      // over the stream instead.
      const visuals = visualsFor(question);
      if (visuals.animation) {
        bus.emit("animation.play", visuals.animation, turnId);
      } else if (visuals.tour) {
        bus.emit("walkthrough.start", { tour: visuals.tour }, turnId);
      }

      return NextResponse.json({ ok: true, turnId, scope: answer.scope });
    }

    case "status":
      bus.emit("journey.loaded", { text: body.text }, turnId);
      return NextResponse.json({ ok: true, turnId });

    case "done":
      bus.emit("turn.completed", {}, turnId);
      return NextResponse.json({ ok: true, turnId });

    default:
      return NextResponse.json({ error: "unknown_kind" }, { status: 400 });
  }
}
