import "server-only";

/**
 * Minimal JSON-RPC client for the deployed Buddy MCP server.
 *
 * The same endpoint VoiceOS talks to, called over HTTP instead of stdio. That
 * matters: the web app and the voice agent hit one backend, so what Garfield
 * says on screen and what VoiceOS says aloud come from the same source of
 * truth rather than two drifting copies.
 *
 * The server is stateless — tools/call works without an initialize handshake —
 * so there's no session to carry.
 */

const ENDPOINT =
  process.env.BUDDY_MCP_URL ??
  "https://voiceos-winner.vercel.app/buddy-api/mcp";

export type McpToolName =
  | "get_onboarding_status"
  | "continue_onboarding"
  | "explain_current_step"
  | "answer_company_question"
  | "prepare_onboarding_action"
  | "confirm_onboarding_action"
  | "remember_fact";

type JsonRpcResult = {
  result?: { content?: { type: string; text?: string }[] };
  error?: { code: number; message: string };
};

/**
 * Calls a tool and returns its text. MCP tools return content blocks; every
 * tool on this server returns exactly one text block.
 */
export async function callTool(
  name: McpToolName,
  args: Record<string, unknown> = {},
  { timeoutMs = 15_000 }: { timeoutMs?: number } = {},
): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: ctrl.signal,
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: { name, arguments: args },
      }),
    });

    if (!res.ok) throw new Error(`MCP ${name} returned HTTP ${res.status}`);

    const data = (await res.json()) as JsonRpcResult;
    if (data.error) throw new Error(`MCP ${name}: ${data.error.message}`);

    const text = data.result?.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join(" ")
      .trim();

    if (!text) throw new Error(`MCP ${name} returned no text`);
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export type ParsedAnswer = {
  text: string;
  citations: { title: string }[];
};

/**
 * Splits trailing "Source: X." fragments off an answer.
 *
 * The tool appends citations into the prose because that is all a spoken
 * channel can carry — VoiceOS reads the whole string aloud. On screen we want
 * them as chips instead, so they get lifted out. The server repeats a source
 * once per supporting document, so duplicates are dropped.
 */
export function parseAnswer(raw: string): ParsedAnswer {
  const citations: { title: string }[] = [];
  const seen = new Set<string>();

  const text = raw
    .replace(/\s*Source:\s*([^.]+)\./g, (_, title: string) => {
      const t = title.trim();
      if (t && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        citations.push({ title: t });
      }
      return "";
    })
    .replace(/\s{2,}/g, " ")
    .trim();

  return { text, citations };
}
