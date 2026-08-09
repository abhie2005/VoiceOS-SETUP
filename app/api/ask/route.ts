import { NextResponse } from "next/server";
import { lookup } from "@/lib/db/knowledge";

/**
 * Mock Buddy API.
 *
 * Stands in for `POST /v1/questions` on the real backend so the product runs
 * end to end without Phase A. The response shape deliberately matches what the
 * real answer event carries, so switching over is a change of URL rather than a
 * change of client code.
 */
export const runtime = "nodejs";

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

  // Retrieval takes time in the real thing, and the character's "thinking"
  // state needs somewhere to live. Without this the answer lands instantly and
  // Garfield looks like a lookup table.
  await new Promise((r) => setTimeout(r, 600));

  return NextResponse.json({
    turnId: crypto.randomUUID(),
    question,
    ...lookup(question),
  });
}
