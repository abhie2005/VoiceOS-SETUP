#!/usr/bin/env node
/**
 * VoiceOS ⇄ Buddy bridge.
 *
 * VoiceOS launches custom integrations as a child process and speaks MCP over
 * **stdio**. The Buddy backend is deployed and speaks MCP over **HTTP**. This
 * is the adapter between them — and the only locally launched Buddy process,
 * exactly as the architecture document specifies: headless, no UI, no state.
 *
 * It does two jobs:
 *
 *   1. Proxy every tool. The remote tool list is fetched at startup and each
 *      tool re-registered verbatim, so tools added upstream appear here on the
 *      next launch with no code change.
 *
 *   2. Drive the browser. MCP returns text only, so VoiceOS can speak an answer
 *      but cannot show one. After each call the adapter POSTs the turn to the
 *      web app, which pushes it to the browser over SSE. That is what makes
 *      Garfield react to speech he never hears.
 *
 * Job 2 is best-effort: if the web app is closed, the voice answer still works.
 * Never let the visual channel break the spoken one.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const REMOTE =
  process.env.BUDDY_MCP_URL ??
  "https://voiceos-winner.vercel.app/buddy-api/mcp";
const WEB = process.env.BUDDY_WEB_URL ?? "http://localhost:3000";

/** stdout is the MCP transport — logging there corrupts the protocol. */
const log = (...a) => console.error("[buddy-adapter]", ...a);

async function rpc(method, params, timeoutMs = 20_000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(REMOTE, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message ?? "rpc error");
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

/** Best-effort nudge to the browser. Must never throw into the tool path. */
async function notify(body) {
  try {
    await fetch(`${WEB}/api/turn`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2500),
    });
  } catch {
    // Web app closed, or not running. The spoken answer is unaffected.
  }
}

const server = new Server(
  { name: "ams-onboarding-buddy", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

let cachedTools = null;

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!cachedTools) {
    const result = await rpc("tools/list", {});
    cachedTools = result?.tools ?? [];
    log(`proxying ${cachedTools.length} tools from ${REMOTE}`);
  }
  return { tools: cachedTools };
});

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  const turnId = randomId();
  const question = typeof args.question === "string" ? args.question : undefined;

  // Garfield starts listening before the answer exists, so the character
  // reacts at the moment you speak rather than when the backend replies.
  if (name === "answer_company_question") {
    void notify({ kind: "listening", question, turnId });
  }

  try {
    const result = await rpc("tools/call", { name, arguments: args });
    const text =
      result?.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join(" ")
        .trim() ?? "";

    if (name === "answer_company_question") {
      await notify({ kind: "answer", question, text, turnId });
      void delayed(() => notify({ kind: "done", turnId }), 6000);
    } else if (name === "get_onboarding_status") {
      void notify({ kind: "status", text, turnId });
    }

    return result ?? { content: [{ type: "text", text: "" }] };
  } catch (err) {
    log(`tool ${name} failed:`, err?.message ?? err);
    void notify({ kind: "done", turnId });
    // Spoken failure, not a protocol error — VoiceOS reads this aloud.
    return {
      content: [
        {
          type: "text",
          text: "I couldn't reach the onboarding service just then. Try me again in a moment.",
        },
      ],
    };
  }
});

function randomId() {
  return `turn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function delayed(fn, ms) {
  return new Promise((r) => setTimeout(() => r(fn()), ms));
}

const transport = new StdioServerTransport();
await server.connect(transport);
log(`ready · remote ${REMOTE} · web ${WEB}`);
