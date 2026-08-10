import {
  GENERAL,
  POLICIES,
  UNDOCUMENTED,
  type AnimationPayload,
  type PolicyDoc,
} from "./documents";

export type { AnimationPayload };
export type Citation = { title: string; url?: string };

export type LookupResult =
  | {
      scope: "company";
      text: string;
      citations: Citation[];
      facts: string[];
      confidence: number;
      animation?: AnimationPayload;
      tour?: string;
    }
  | {
      scope: "general";
      text: string;
      disclaimer: string;
      animation?: AnimationPayload;
    }
  | { scope: "unknown"; text: string; person?: string; team?: string };

const DISCLAIMER =
  "This isn't documented at AMS, so it's general guidance rather than company policy — worth confirming with your team before acting on it.";

/**
 * Minimum score before a document may be cited.
 *
 * This threshold is the whole safety mechanism. Without it, retrieval always
 * returns its best match — so "what's our on-call policy?" comes back as the
 * PTO document, cited and confident. A confidently-cited wrong answer is worse
 * than no answer, because a new hire will act on it. Below this bar we decline.
 */
const CITE_THRESHOLD = 8;

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Longer keyword matches score higher, so a specific phrase ("set up payroll")
 * beats an incidental word ("payroll") appearing in an unrelated document. A
 * whole-word match scores double a substring match, which is what stops "call"
 * inside "on-call" from dragging in an unrelated document.
 */
function score(question: string, keywords: string[]): number {
  const q = normalise(question);
  let total = 0;

  for (const raw of keywords) {
    const k = normalise(raw);
    if (!k || !q.includes(k)) continue;
    const whole = new RegExp(`(^|\\s)${k.replace(/\s/g, "\\s")}($|\\s)`).test(
      q,
    );
    total += k.length * (whole ? 2 : 1);
  }
  return total;
}

export function rank(question: string): { doc: PolicyDoc; score: number }[] {
  return POLICIES.map((doc) => ({ doc, score: score(question, doc.keywords) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Three tiers, in order of trust:
 *
 *   company — a policy document cleared the threshold. Cited, safe to act on.
 *   general — true generally, not verified for AMS. Labelled and disclaimed.
 *   unknown — nothing on file. Named hand-off, never a guess.
 *
 * UNDOCUMENTED is checked before general knowledge so a question with a real
 * internal owner reaches a person rather than an encyclopaedia answer.
 */
export function lookup(question: string): LookupResult {
  const best = rank(question)[0];

  if (best && best.score >= CITE_THRESHOLD) {
    const d = best.doc;
    return {
      scope: "company",
      text: d.summary,
      citations: [{ title: d.title }],
      facts: d.facts,
      confidence: best.score,
      animation: d.animation,
      tour: d.tour,
    };
  }

  const owned = UNDOCUMENTED.find((u) => score(question, u.keywords) > 0);
  if (owned) {
    return {
      scope: "unknown",
      text: `I don't have this documented, and I'd rather not guess — ask ${owned.owner} on ${owned.ownerTeam}, they own it.`,
      person: owned.owner,
      team: owned.ownerTeam,
    };
  }

  const general = GENERAL.map((g) => ({ g, s: score(question, g.keywords) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)[0];

  if (general) {
    return {
      scope: "general",
      text: general.g.text,
      disclaimer: DISCLAIMER,
      animation: general.g.animation,
    };
  }

  return {
    scope: "unknown",
    text: "I don't have anything on that, and I'm not going to invent an answer. I'll flag it so it gets written down for the next hire — in the meantime your onboarding lead is the fastest route.",
  };
}

/**
 * Visuals for a question, chosen locally.
 *
 * The MCP contract carries text only, so an answer's words can come from the
 * backend while its animation and walkthrough are matched here. This is the
 * seam that disappears the moment Phase A emits `animation.play`.
 */
export function visualsFor(question: string): {
  animation?: AnimationPayload;
  tour?: string;
} {
  const best = rank(question).find((r) => r.doc.animation || r.doc.tour);
  if (best && best.score >= CITE_THRESHOLD) {
    return { animation: best.doc.animation, tour: best.doc.tour };
  }

  const g = GENERAL.map((x) => ({ x, s: score(question, x.keywords) }))
    .filter((r) => r.s > 0 && r.x.animation)
    .sort((a, b) => b.s - a.s)[0];

  return g ? { animation: g.x.animation } : {};
}
