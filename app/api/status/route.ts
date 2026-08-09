import { NextResponse } from "next/server";
import { callTool } from "@/lib/mcp-client";

/**
 * Live onboarding status from the Buddy backend, used for Garfield's opening
 * line. A greeting that knows where you actually are ("0 of 5 done, next up
 * Slack access") is the difference between a companion and a widget.
 */
export const runtime = "nodejs";
export const maxDuration = 20;

export async function GET() {
  try {
    const text = await callTool("get_onboarding_status");
    return NextResponse.json({ text, source: "mcp" });
  } catch {
    // No status is fine — the client falls back to its generic greeting.
    return NextResponse.json({ text: null, source: "unavailable" });
  }
}
