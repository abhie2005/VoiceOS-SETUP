import { NextResponse } from "next/server";
import { callTool, parseAnswer } from "@/lib/mcp-client";
import { lookup, visualsFor } from "@/lib/db/knowledge";

/**
 * The web app's question endpoint.
 *
 * Order of trust, and the reasoning matters:
 *
 * 1. The local policy corpus, when a document clears the relevance threshold.
 *    These answers are cited and verified against the pages on this site.
 *
 * 2. The deployed MCP backend, for anything the corpus doesn't cover — but
 *    only when it returns a *sourced* answer.
 *
 * 3. General knowledge, explicitly labelled as not-AMS-policy.
 *
 * 4. A named hand-off.
 *
 * The backend is deliberately second rather than first. Its retrieval returns
 * its best match regardless of relevance — asked "what's our on-call policy?"
 * it answers with the PTO document, cited and confident. A confidently-cited
 * wrong answer is worse than no answer, because a new hire acts on it as
 * policy. Once Phase A adds a relevance floor, this order can flip.
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

  const turnId = crypto.randomUUID();
  const visuals = visualsFor(question);
  const local = lookup(question);

  // 1. A cited company document beats everything.
  if (local.scope === "company") {
    return NextResponse.json({
      turnId,
      question,
      ...local,
      source: "corpus",
      ...visuals,
    });
  }

  // 1b. Known-undocumented topics with a named owner never go to retrieval.
  // We positively know there is no document; a fuzzy match against some other
  // document is exactly the wrong answer, however confident it sounds.
  if (local.scope === "unknown" && local.person) {
    return NextResponse.json({
      turnId,
      question,
      ...local,
      source: "corpus",
      ...visuals,
    });
  }

  // 2. Ask the backend for anything the corpus doesn't cover.
  try {
    const raw = await callTool("answer_company_question", { question });
    const { text, citations } = parseAnswer(raw);

    if (citations.length > 0 && text) {
      return NextResponse.json({
        turnId,
        question,
        scope: "company",
        text,
        citations,
        facts: [],
        source: "mcp",
        ...visuals,
      });
    }
  } catch (err) {
    // A backend outage must not take the character down. The corpus answer
    // below is still honest, and the client is told the turn was degraded.
    console.error("[ask] MCP unavailable:", err);
    return NextResponse.json({
      turnId,
      question,
      ...local,
      source: "corpus",
      degraded: true,
      ...visuals,
    });
  }

  // 3 & 4. General knowledge, or a named hand-off.
  return NextResponse.json({
    turnId,
    question,
    ...local,
    source: "corpus",
    ...visuals,
  });
}
