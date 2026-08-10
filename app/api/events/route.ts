import { bus } from "@/lib/event-bus";

/**
 * Server-sent events — the visual channel.
 *
 * The browser holds this open while Garfield is on screen. When you speak to
 * VoiceOS, the stdio adapter POSTs the turn to /api/turn and it arrives here
 * milliseconds later, so the character reacts to speech it never hears.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Long-lived by design; the platform cap is what actually ends it. */
export const maxDuration = 800;

export async function GET(req: Request) {
  const resume = Number(new URL(req.url).searchParams.get("resume") ?? -1);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data));
        } catch {
          // Client vanished mid-write; cleanup below handles it.
        }
      };

      const unsubscribe = bus.subscribe(
        (e) => send(`data: ${JSON.stringify(e)}\n\n`),
        Number.isFinite(resume) ? resume : -1,
      );

      // Comment frames keep proxies from closing an idle connection.
      const ping = setInterval(() => send(": ping\n\n"), 25_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(ping);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed.
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      // Nginx and friends buffer SSE into uselessness without this.
      "x-accel-buffering": "no",
    },
  });
}
