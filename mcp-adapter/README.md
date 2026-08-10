# VoiceOS ⇄ Buddy adapter

The bridge that makes the product voice-native. VoiceOS launches custom
integrations as a child process and speaks MCP over **stdio**; the Buddy
backend is deployed and speaks MCP over **HTTP**. This translates between them.

It is the only locally launched Buddy process — headless, no UI, no state.

## What it does

1. **Proxies every tool.** The remote tool list is fetched at startup and each
   tool re-registered verbatim, so tools added upstream appear on the next
   launch with no code change here.

2. **Drives the browser.** MCP returns text only, so VoiceOS can *speak* an
   answer but cannot *show* one. After each call the adapter POSTs the turn to
   the web app, which pushes it to the browser over SSE. That is what makes
   Garfield react to speech he never hears.

Job 2 is best-effort. If the web app is closed the voice answer still works —
the visual channel must never be able to break the spoken one.

## Setup

**1. Start the web app** (the adapter posts turns to it):

```bash
npm run dev
```

**2. Register in VoiceOS:** Settings → Integrations → Custom Integrations → Add

| Field | Value |
| --- | --- |
| Launch command | `node /absolute/path/to/mcp-adapter/index.mjs` |

Use an absolute path — VoiceOS does not run it from the repo directory.

**3. Talk to it.** Open <http://localhost:3000>, then ask VoiceOS something like
*"How do I set up payroll?"* The answer is spoken aloud while the browser shows
Garfield speaking and plays the matching animation.

## Configuration

| Variable | Default |
| --- | --- |
| `BUDDY_MCP_URL` | `https://voiceos-winner.vercel.app/buddy-api/mcp` |
| `BUDDY_WEB_URL` | `http://localhost:3000` |

## Verifying without VoiceOS

The adapter is a normal stdio MCP server, so anything that speaks MCP can drive
it. To confirm the chain by hand:

```bash
# 1. Watch what the browser would receive
curl -N http://localhost:3000/api/events

# 2. In another shell, drive a turn
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"answer_company_question","arguments":{"question":"How do I set up payroll?"}}}' \
  | node mcp-adapter/index.mjs
```

Expected on the event stream:

```
turn.started → answer.produced → animation.play → turn.completed
```

## Notes

- `stdout` is the MCP transport. All logging goes to `stderr`; writing to
  stdout corrupts the protocol.
- The event bus is an in-process singleton, which works because dev and
  `next start` run one Node process. A serverless deployment needs Redis or
  Vercel Queues instead — a deployment concern, not a demo one.
- `/api/turn` is trusted and local-only. Anything internet-facing needs the
  auth claims from the Buddy contract.
