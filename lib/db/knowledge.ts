/**
 * Mock knowledge database.
 *
 * Stands in for the real Buddy backend's knowledge store so the whole product
 * works end to end without Phase A running. The shape is what matters: swap
 * this module for a real query against the company index and nothing upstream
 * changes.
 *
 * Answers come in three tiers, and keeping them distinct is the point of the
 * product:
 *
 *   company  — documented internally. Cited, safe to act on.
 *   general  — true in general, NOT verified for AMS. Must be labelled.
 *   unknown  — nothing on file. Hand off to a named human rather than guess.
 *
 * A general answer presented as a company answer is worse than no answer at
 * all, because a new hire will act on it as policy.
 */

export type Citation = { title: string; url?: string };

export type AnimationPayload = {
  title: string;
  beats: {
    sprites: string[];
    caption: string;
    motion?: "pop" | "rise" | "drift" | "pulse" | "shake";
    ms?: number;
  }[];
};

export type KnowledgeEntry = {
  id: string;
  scope: "company" | "general";
  /** Matched against the question, lowercase. */
  keywords: string[];
  text: string;
  citations?: Citation[];
  animation?: AnimationPayload;
  /** Names a walkthrough the client knows how to run. */
  tour?: string;
};

export const KNOWLEDGE: KnowledgeEntry[] = [
  /* ---------- Company: documented, cited ---------- */
  {
    id: "payroll-setup",
    scope: "company",
    keywords: [
      "payroll",
      "adp",
      "direct deposit",
      "get paid",
      "paycheck",
      "salary",
    ],
    text: "Payroll runs through ADP, in four steps: deposit vault, tax scroll, pay calendar, then a final review. AMS pays bi-weekly, every other Friday — set it up before the 20th to make this cycle.",
    citations: [{ title: "ADP — Payroll setup" }, { title: "wiki/payroll" }],
    tour: "payroll",
    animation: {
      title: "Setting up payroll in ADP",
      beats: [
        {
          sprites: ["person", "computer"],
          caption:
            "Open ADP from the AMS launcher — SSO signs you straight in.",
          motion: "rise",
        },
        {
          sprites: ["bank", "arrow", "payslip"],
          caption:
            "Step 1 — Deposit vault. Add your bank, routing and account number. That's where the paycheck lands.",
          motion: "drift",
        },
        {
          sprites: ["document", "check"],
          caption:
            "Step 2 — Tax scroll. Filing status and state of residence set how much comes out of each check.",
          motion: "pop",
        },
        {
          sprites: ["calendar", "coin"],
          caption:
            "Step 3 — Pay calendar. AMS pays bi-weekly, every other Friday. Pick email or mail for your stub.",
          motion: "pulse",
        },
        {
          sprites: ["lock"],
          caption:
            "Your account details are encrypted. Finance sees the deposit, never the raw numbers.",
          motion: "pulse",
        },
        {
          sprites: ["check", "payslip"],
          caption:
            "Step 4 — Final review, then submit. First paycheck lands Friday, August 21.",
          motion: "pop",
        },
      ],
    },
  },
  {
    id: "benefits-enrolment",
    scope: "company",
    keywords: [
      "benefits",
      "enrol",
      "enroll",
      "medical",
      "dental",
      "vision",
      "insurance",
    ],
    text: "You have 30 days from your start date to enrol — that closes on September 8. Miss it and the next window is open enrolment in November. AMS covers 90% of your medical premium and 70% for dependents.",
    citations: [{ title: "wiki/benefits" }, { title: "Handbook — Health" }],
  },
  {
    id: "deploy-pipelines",
    scope: "company",
    keywords: [
      "deploy",
      "pipeline",
      "jenkins",
      "github actions",
      "ship",
      "release",
    ],
    text: "Legacy services still ship through Jenkins. Anything created after the 2024 platform migration goes through GitHub Actions — Jenkins retires once the last three services move over.",
    citations: [
      { title: "ADR-014 Platform Migration" },
      { title: "wiki/deploys" },
    ],
  },
  {
    id: "expenses",
    scope: "company",
    keywords: ["expense", "reimburse", "receipt", "mileage", "expensify"],
    text: "Expenses go through Expensify and are reimbursed alongside payroll. Anything under $75 skips approval entirely — submit the receipt and it's done.",
    citations: [{ title: "wiki/expenses" }],
  },
  {
    id: "core-hours",
    scope: "company",
    keywords: [
      "hours",
      "core hours",
      "working hours",
      "timezone",
      "when to work",
    ],
    text: "Core hours are 10:00 to 15:00 Pacific — that's when meetings get scheduled. Outside those, work when you work. Nobody expects a reply outside someone's own hours.",
    citations: [{ title: "Handbook — Ways of working" }],
  },
  {
    id: "sick-leave",
    scope: "company",
    keywords: ["sick", "sick leave", "time off", "pto", "vacation", "holiday"],
    text: "Sick leave is untracked — no accrual, no balance. Tell your manager you're out and rest. Vacation is booked in the same place but does get logged.",
    citations: [{ title: "Handbook — Leave" }],
  },

  /* ---------- General: true, but not AMS policy ---------- */
  {
    id: "what-is-401k",
    scope: "general",
    keywords: [
      "what is a 401k",
      "401k mean",
      "what's a 401k",
      "retirement account",
    ],
    text: "A 401(k) is a US retirement account you pay into straight from your salary, before tax. Employers often match part of what you put in, up to a limit. The money is invested and normally can't be withdrawn without penalty until you're 59½.",
  },
  {
    id: "what-is-direct-deposit",
    scope: "general",
    keywords: [
      "what is direct deposit",
      "direct deposit mean",
      "how does direct deposit work",
    ],
    text: "Direct deposit means your employer sends pay straight into your bank account electronically instead of issuing a cheque. You supply a routing number and an account number once, and it repeats every pay cycle.",
  },
  {
    id: "what-is-withholding",
    scope: "general",
    keywords: [
      "withholding",
      "filing status",
      "w-4",
      "tax bracket",
      "how does payroll tax work",
    ],
    text: "Tax withholding is the portion of each paycheck your employer sends to the tax authorities on your behalf. How much depends on your filing status and where you live — set it too low and you owe money at year end, too high and you've lent the government money interest-free.",
  },
  {
    id: "photosynthesis",
    scope: "general",
    keywords: ["photosynthesis", "how plants", "chlorophyll"],
    text: "Photosynthesis is how plants turn light into food. Leaves absorb sunlight and carbon dioxide, roots draw up water, and the light energy rebuilds those into sugar — releasing oxygen as the by-product.",
    animation: {
      title: "Photosynthesis",
      beats: [
        {
          sprites: ["sun"],
          caption: "Sunlight hits the leaf.",
          motion: "pulse",
        },
        {
          sprites: ["co2", "arrow", "leaf"],
          caption: "The leaf takes in carbon dioxide from the air.",
          motion: "drift",
        },
        {
          sprites: ["water", "arrow", "soil"],
          caption: "Roots pull water up from the soil.",
          motion: "rise",
        },
        {
          sprites: ["sun", "leaf", "water"],
          caption: "Light splits the water and rebuilds it into sugar.",
          motion: "pop",
        },
        {
          sprites: ["leaf", "arrow", "oxygen"],
          caption:
            "Oxygen is released as the by-product. That's the air we breathe.",
          motion: "rise",
        },
      ],
    },
  },
  {
    id: "standup",
    scope: "general",
    keywords: ["standup", "stand-up", "daily scrum", "agile ceremony"],
    text: "A standup is a short daily check-in — usually under fifteen minutes — where each person says what they did, what they're doing next, and what's blocking them. Format and strictness vary enormously between teams.",
  },
];

/** Who to hand off to when nothing matches. */
export const HANDOFFS: { keywords: string[]; person: string; team: string }[] =
  [
    {
      keywords: ["on-call", "on call", "rotation", "pager", "incident"],
      person: "Priya Raman",
      team: "Platform",
    },
    {
      keywords: ["laptop", "hardware", "equipment", "monitor"],
      person: "Dev Shah",
      team: "IT",
    },
    {
      keywords: ["visa", "immigration", "sponsorship", "relocation"],
      person: "Sam Okoye",
      team: "People Ops",
    },
  ];

export type LookupResult =
  | {
      scope: "company";
      text: string;
      citations: Citation[];
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

/** Longer keywords are more specific, so they score higher. */
function score(question: string, keywords: string[]): number {
  const q = question.toLowerCase();
  return keywords.reduce((n, k) => (q.includes(k) ? n + k.length : n), 0);
}

/**
 * Company knowledge always wins. Only when nothing internal matches do we fall
 * back to general knowledge, and then it is explicitly labelled as such.
 */
export function lookup(question: string): LookupResult {
  const ranked = KNOWLEDGE.map((e) => ({ e, s: score(question, e.keywords) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  const company = ranked.find((r) => r.e.scope === "company");
  if (company) {
    const { text, citations = [], animation, tour } = company.e;
    return { scope: "company", text, citations, animation, tour };
  }

  const general = ranked.find((r) => r.e.scope === "general");
  if (general) {
    return {
      scope: "general",
      text: general.e.text,
      disclaimer: DISCLAIMER,
      animation: general.e.animation,
    };
  }

  const handoff = HANDOFFS.find((h) => score(question, h.keywords) > 0);
  if (handoff) {
    return {
      scope: "unknown",
      text: `I don't have this documented, and I'd rather not guess — ask ${handoff.person} on ${handoff.team}, they own it.`,
      person: handoff.person,
      team: handoff.team,
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
 * seam that disappears the moment Phase A emits `animation.play` — at that
 * point the payload arrives on the wire and this function goes away.
 */
export function visualsFor(question: string): {
  animation?: AnimationPayload;
  tour?: string;
} {
  const best = KNOWLEDGE.map((e) => ({ e, s: score(question, e.keywords) }))
    .filter((r) => r.s > 0 && (r.e.animation || r.e.tour))
    .sort((a, b) => b.s - a.s)[0];

  if (!best) return {};
  return { animation: best.e.animation, tour: best.e.tour };
}
