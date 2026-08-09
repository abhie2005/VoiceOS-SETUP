import { NextResponse } from "next/server";
import { callTool, parseAnswer } from "@/lib/mcp-client";
import { lookup, visualsFor } from "@/lib/db/knowledge";

/**
 * The web app's question endpoint.
 *
 * Asks the same MCP backend VoiceOS asks, so the words on screen and the words
 * spoken aloud come from one source of truth.
 *
 * Two things the backend cannot give us, both by design:
 *
 * 1. Visuals. MCP tools return text only — there is no animation or
 *    walkthrough payload in the contract yet. So the answer's words come from
 *    the backend and its visuals are matched locally. When Phase A adds
 *    `animation.play`, delete `visualsFor` and take them off the wire.
 *
 * 2. Tiering. The backend answers from company documents or not at all. When
 *    it has nothing sourced, we fall back to local general knowledge — clearly
 *    labelled as not-AMS-policy — before giving up and handing off.
 */
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  let question: string;

  try {
    const body = (await req.json()) as { question?: unknown };
    if (typeof body.question !== "string" || !body.question.trim()) {
      return NextResponse.json(
        { error: "invalid_request", message: "question is required" },
        { status: 400 },
      );
    }
    question = body.question.trim().slice(0, 500);
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "body must be JSON" },
      { status: 400 },
    );
  }

  const visuals = visualsFor(question);
  const turnId = crypto.randomUUID();

  try {
    const raw = await callTool("answer_company_question", { question });
    const { text, citations } = parseAnswer(raw);

    // A sourced answer is a company answer. Unsourced means the backend had
    // nothing internal, so it is not safe to present as policy.
    if (citations.length > 0 && text) {
      return NextResponse.json({
        turnId,
        question,
        scope: "company",
        text,
        citations,
        source: "mcp",
        ...visuals,
      });
    }

    const local = lookup(question);
    return NextResponse.json({
      turnId,
      question,
      ...local,
      // Keep the backend's wording when it said something useful but uncited.
      ...(local.scope === "unknown" && text ? { text } : {}),
      source: "mcp+local",
      ...visuals,
    });
  } catch (err) {
    // The backend being down must not take the character down with it. Local
    // knowledge still answers, and the client is told the answer is degraded.
    console.error("[ask] MCP unavailable, falling back to local:", err);
    return NextResponse.json({
      turnId,
      question,
      ...lookup(question),
      source: "local",
      degraded: true,
      ...visuals,
    });
  }
}
