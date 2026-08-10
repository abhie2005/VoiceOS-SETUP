/**
 * AMS company policy corpus.
 *
 * This is the single mock in the system: the documents a real deployment would
 * index from a company wiki, handbook and ADRs. Everything else — retrieval,
 * tiering, citations, the API, the character — is real code operating on it.
 *
 * Facts here are the source of truth for the site. The Finance, Health and
 * Communications pages state the same numbers and dates, so a demo can't
 * contradict itself: change a figure here and change it on the page too.
 */

export type Section =
  "finance" | "health" | "communications" | "engineering" | "people";

export type AnimationPayload = {
  title: string;
  beats: {
    sprites: string[];
    caption: string;
    motion?: "pop" | "rise" | "drift" | "pulse" | "shake";
    ms?: number;
  }[];
};

export type PolicyDoc = {
  id: string;
  /** Used verbatim as the citation chip. */
  title: string;
  section: Section;
  /** Who to hand off to when the document doesn't cover the question. */
  owner: string;
  ownerTeam: string;
  updated: string;
  /** What Garfield says. Written to be spoken aloud — short, no lists. */
  summary: string;
  /** Retrieval surface. Longer phrases score higher, so they win ties. */
  keywords: string[];
  /** Supporting detail, shown but not spoken. */
  facts: string[];
  animation?: AnimationPayload;
  tour?: string;
};

export const POLICIES: PolicyDoc[] = [
  /* ───────────────────────── Finance ───────────────────────── */
  {
    id: "payroll-adp",
    title: "ADP — Payroll setup",
    section: "finance",
    owner: "Marcus Bell",
    ownerTeam: "People Ops",
    updated: "2026-07-14",
    summary:
      "Payroll runs through ADP in four steps: deposit vault, tax scroll, pay calendar, then a final review. It takes about five minutes, and you need to finish before the 20th to make this cycle.",
    keywords: [
      "set up payroll",
      "payroll setup",
      "direct deposit",
      "how do i get paid",
      "payroll",
      "adp",
      "paycheck",
      "deposit vault",
      "routing number",
    ],
    facts: [
      "AMS pays bi-weekly, every other Friday.",
      "Your first paycheck lands Friday, August 21.",
      "The cutoff to make a cycle is the 20th.",
      "Bank details are encrypted; Finance sees the deposit, never the raw numbers.",
      "Pay stubs are delivered by email unless you choose mail.",
    ],
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
    id: "expenses",
    title: "Expense policy",
    section: "finance",
    owner: "Marcus Bell",
    ownerTeam: "People Ops",
    updated: "2026-05-02",
    summary:
      "Expenses go through Expensify and are reimbursed alongside payroll. Anything under seventy-five dollars skips approval entirely — submit the receipt and you're done.",
    keywords: [
      "expense",
      "expenses",
      "reimburse",
      "reimbursement",
      "receipt",
      "mileage",
      "expensify",
      "claim back",
    ],
    facts: [
      "Under $75: no approval needed.",
      "$75 and over: one manager approval.",
      "Reimbursement arrives with the next payroll run.",
      "Mileage is claimed at the current IRS standard rate.",
    ],
  },
  {
    id: "retirement-401k",
    title: "401(k) plan summary",
    section: "finance",
    owner: "Marcus Bell",
    ownerTeam: "People Ops",
    updated: "2026-06-20",
    summary:
      "AMS matches four percent through Fidelity. You're auto-enrolled at three percent after thirty days, and you can change or opt out at any time.",
    keywords: [
      "401k",
      "401(k)",
      "retirement",
      "pension",
      "fidelity",
      "employer match",
      "auto-enrol",
    ],
    facts: [
      "AMS matches up to 4% of salary.",
      "Auto-enrolment at 3% begins 30 days after your start date.",
      "Vesting is immediate — the match is yours from day one.",
      "Elections are yours to make; AMS never changes them for you.",
    ],
  },
  {
    id: "tax-documents",
    title: "Tax documents",
    section: "finance",
    owner: "Marcus Bell",
    ownerTeam: "People Ops",
    updated: "2026-01-31",
    summary:
      "W-2s and year-end summaries live in ADP from January the thirty-first, going back three years.",
    keywords: ["w-2", "w2", "1099", "tax document", "tax form", "year end"],
    facts: [
      "Available in ADP from January 31.",
      "Three years of history retained.",
      "Corrections are handled by People Ops, not IT.",
    ],
  },

  /* ───────────────────────── Health ───────────────────────── */
  {
    id: "benefits-enrolment",
    title: "Benefits enrolment",
    section: "health",
    owner: "Sam Okoye",
    ownerTeam: "People Ops",
    updated: "2026-07-01",
    summary:
      "You have thirty days from your start date to enrol, which closes on September the eighth. Miss it and the next window is open enrolment in November.",
    keywords: [
      "benefits",
      "enrol",
      "enroll",
      "enrolment",
      "enrollment",
      "sign up for insurance",
      "deadline",
    ],
    facts: [
      "Enrolment closes September 8.",
      "Do nothing and you get medical at the default tier, with no dental or vision.",
      "The next window after that is open enrolment in November.",
    ],
  },
  {
    id: "medical-plans",
    title: "Medical, dental and vision",
    section: "health",
    owner: "Sam Okoye",
    ownerTeam: "People Ops",
    updated: "2026-07-01",
    summary:
      "Medical is Anthem PPO, with AMS covering ninety percent of your premium and seventy percent for dependents. Dental is Delta Dental and vision is VSP.",
    keywords: [
      "medical",
      "health insurance",
      "dental",
      "vision",
      "anthem",
      "delta dental",
      "vsp",
      "premium",
      "coverage",
    ],
    facts: [
      "Medical — Anthem PPO, $48 per paycheck.",
      "Dental — Delta Dental, $9 per paycheck. Two cleanings a year at no cost.",
      "Vision — VSP, $4 per paycheck. One exam and one pair of frames a year.",
      "AMS covers 90% of your medical premium, 70% for dependents.",
    ],
  },
  {
    id: "mental-health",
    title: "Mental health support",
    section: "health",
    owner: "Sam Okoye",
    ownerTeam: "People Ops",
    updated: "2026-04-18",
    summary:
      "Twelve therapy sessions a year through Spring Health, at no cost and with no manager approval. Booking is between you and them.",
    keywords: [
      "mental health",
      "therapy",
      "therapist",
      "counselling",
      "counseling",
      "spring health",
      "eap",
      "burnout",
    ],
    facts: [
      "12 sessions per year, fully covered.",
      "No manager approval and no notification — AMS never sees who books.",
      "Available from day one, not after a waiting period.",
    ],
  },
  {
    id: "leave",
    title: "Leave and time off",
    section: "health",
    owner: "Sam Okoye",
    ownerTeam: "People Ops",
    updated: "2026-03-11",
    summary:
      "Sick leave is untracked — no accrual and no balance. Tell your manager you're out and rest. Vacation is booked the same way but does get logged.",
    keywords: [
      "sick",
      "sick leave",
      "sick day",
      "time off",
      "pto",
      "vacation",
      "holiday",
      "annual leave",
      "parental leave",
    ],
    facts: [
      "Sick leave is untracked — no accrual, no balance.",
      "Vacation is logged but not capped by accrual.",
      "Parental leave is 18 weeks fully paid, for any parent.",
      "Public holidays follow the US federal calendar.",
    ],
  },

  /* ────────────────────── Communications ────────────────────── */
  {
    id: "comms-norms",
    title: "Ways of working",
    section: "communications",
    owner: "Priya Raman",
    ownerTeam: "Platform",
    updated: "2026-02-09",
    summary:
      "Reply in threads, work async by default, and keep decisions in channels rather than DMs. A meeting without an agenda is a fair one to decline.",
    keywords: [
      "slack",
      "how do we communicate",
      "communication",
      "norms",
      "threads",
      "async",
      "dm",
      "etiquette",
      "meeting",
    ],
    facts: [
      "Threads over channel replies — it keeps channels readable.",
      "Async by default; nobody expects a reply outside their own hours.",
      "Decisions that affect the team belong in a channel, not a DM.",
      "No agenda in the invite is a fair reason to decline.",
    ],
  },
  {
    id: "core-hours",
    title: "Core hours",
    section: "communications",
    owner: "Priya Raman",
    ownerTeam: "Platform",
    updated: "2026-02-09",
    summary:
      "Core hours are ten to three, Pacific. That's when meetings get scheduled. Outside them, work when you work.",
    keywords: [
      "core hours",
      "working hours",
      "what hours",
      "when do i work",
      "timezone",
      "time zone",
      "schedule",
    ],
    facts: [
      "10:00–15:00 Pacific.",
      "Meetings are scheduled inside core hours only.",
      "Outside them there is no expectation of availability.",
    ],
  },

  /* ───────────────────────── Engineering ───────────────────────── */
  {
    id: "deploy-pipelines",
    title: "ADR-014 Platform Migration",
    section: "engineering",
    owner: "Priya Raman",
    ownerTeam: "Platform",
    updated: "2026-01-22",
    summary:
      "Legacy services still ship through Jenkins. Anything created after the 2024 platform migration goes through GitHub Actions, and Jenkins retires once the last three services move over.",
    keywords: [
      "deploy",
      "deployment",
      "pipeline",
      "jenkins",
      "github actions",
      "ship code",
      "release",
      "ci",
      "cd",
      "two pipelines",
    ],
    facts: [
      "Pre-2024 services: Jenkins.",
      "Post-migration services: GitHub Actions.",
      "Three services remain on Jenkins before it is retired.",
    ],
  },
  {
    id: "environments",
    title: "Environments and access",
    section: "engineering",
    owner: "Dev Shah",
    ownerTeam: "IT",
    updated: "2026-06-05",
    summary:
      "Staging sits behind the eng-staging group. It needs one approval from your manager and usually lands within the hour. Production access is request-only and time-boxed.",
    keywords: [
      "staging",
      "staging access",
      "environment",
      "production access",
      "prod access",
      "eng-staging",
    ],
    facts: [
      "Staging — one manager approval, typically granted within the hour.",
      "Production — request-only, time-boxed to four hours.",
      "Access requests are audited.",
    ],
  },
  {
    id: "code-review",
    title: "Code review norms",
    section: "engineering",
    owner: "Priya Raman",
    ownerTeam: "Platform",
    updated: "2026-05-19",
    summary:
      "One approval merges. Reviews are expected within a working day, and anything over four hundred lines should be split before review rather than after.",
    keywords: [
      "code review",
      "pull request",
      "pr",
      "review",
      "merge",
      "approval",
    ],
    facts: [
      "One approval is enough to merge.",
      "Reviews are expected within one working day.",
      "Split anything over ~400 lines before requesting review.",
      "Authors merge their own PRs.",
    ],
  },
  {
    id: "security",
    title: "Security basics",
    section: "engineering",
    owner: "Dev Shah",
    ownerTeam: "IT",
    updated: "2026-06-28",
    summary:
      "Hardware keys for SSO, secrets in the vault and never in code, and laptops encrypted. If you think you've leaked something, say so immediately — nobody is ever in trouble for reporting fast.",
    keywords: [
      "security",
      "password",
      "mfa",
      "2fa",
      "sso",
      "secret",
      "credentials",
      "vault",
      "phishing",
      "leak",
    ],
    facts: [
      "Hardware security keys are required for SSO.",
      "Secrets live in the vault, never in code or config.",
      "Full-disk encryption is enforced on all laptops.",
      "Report suspected leaks immediately — speed matters more than certainty.",
    ],
  },
];

/**
 * Topics deliberately not documented.
 *
 * These exist so the honesty path is demonstrable rather than theoretical: a
 * question that lands here must produce a named hand-off, never an invented
 * answer or a loosely-related document.
 */
export const UNDOCUMENTED: {
  keywords: string[];
  owner: string;
  ownerTeam: string;
}[] = [
  {
    keywords: [
      "on-call",
      "on call",
      "oncall",
      "rotation",
      "pager",
      "pagerduty",
      "incident response",
    ],
    owner: "Priya Raman",
    ownerTeam: "Platform",
  },
  {
    keywords: [
      "laptop",
      "hardware",
      "monitor",
      "equipment",
      "desk setup",
      "keyboard",
    ],
    owner: "Dev Shah",
    ownerTeam: "IT",
  },
  {
    keywords: [
      "visa",
      "immigration",
      "sponsorship",
      "relocation",
      "green card",
      "h1b",
    ],
    owner: "Sam Okoye",
    ownerTeam: "People Ops",
  },
  {
    keywords: [
      "promotion",
      "levels",
      "career ladder",
      "raise",
      "compensation band",
      "equity refresh",
    ],
    owner: "Marcus Bell",
    ownerTeam: "People Ops",
  },
];

/**
 * General knowledge — true, but not AMS policy.
 *
 * Answers a new hire might reasonably ask that no company document would ever
 * contain. Kept separate from POLICIES so it can never be cited as internal.
 */
export const GENERAL: {
  id: string;
  keywords: string[];
  text: string;
  animation?: AnimationPayload;
}[] = [
  {
    id: "what-is-401k",
    keywords: [
      "what is a 401k",
      "what's a 401k",
      "401k mean",
      "how does a 401k work",
    ],
    text: "A 401(k) is a US retirement account you pay into straight from your salary, before tax. Employers often match part of what you contribute. The money is invested and normally can't be withdrawn without penalty until you're 59½.",
  },
  {
    id: "what-is-direct-deposit",
    keywords: [
      "what is direct deposit",
      "how does direct deposit work",
      "direct deposit mean",
    ],
    text: "Direct deposit means your employer sends pay straight into your bank account electronically instead of issuing a cheque. You supply a routing number and an account number once, and it repeats every pay cycle.",
  },
  {
    id: "what-is-withholding",
    keywords: [
      "withholding",
      "filing status",
      "w-4",
      "tax bracket",
      "how does payroll tax work",
    ],
    text: "Tax withholding is the portion of each paycheck your employer sends to the tax authorities on your behalf. How much depends on your filing status and where you live — too low and you owe at year end, too high and you've lent the government money interest-free.",
  },
  {
    id: "what-is-ppo",
    keywords: [
      "what is a ppo",
      "ppo mean",
      "hmo vs ppo",
      "what is a deductible",
      "what is a premium",
    ],
    text: "A PPO lets you see specialists without a referral and go outside the network at higher cost. The premium is what you pay each month to be covered; the deductible is what you pay yourself before the insurer starts contributing.",
  },
  {
    id: "standup",
    keywords: ["what is a standup", "standup", "stand-up", "daily scrum"],
    text: "A standup is a short daily check-in, usually under fifteen minutes, where each person says what they did, what's next, and what's blocking them. Format and strictness vary enormously between teams.",
  },
  {
    id: "photosynthesis",
    keywords: ["photosynthesis", "how do plants", "chlorophyll"],
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
];
