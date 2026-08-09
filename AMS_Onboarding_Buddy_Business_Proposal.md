# Onboarding Buddy
### Business Proposal — A Voice-Native Onboarding Companion Built on VoiceOS

---

## 1. Problem

Onboarding is broken, and companies know it:

- **88%** of new hires rate their onboarding experience a failure. Only 12% of companies do it well.
- **74%** call their onboarding unsuccessful — 32% found it confusing, 24% found it boring.
- **60%** of companies set no clear goals or milestones for a new hire's first weeks.
- **63%** of remote employees feel undertrained.
- The average new hire faces **50+ onboarding tasks**, and **52%** say admin work dominated the experience.
- The average company runs **47+ applications** (175+ at companies with 2,000+ employees) — each with its own login, its own owner, and no single source of truth. One report described the result as "an archaeological expedition through fragmented systems."

The human cost compounds the operational one: **20%** of all turnover happens in the first 45 days, and **40%** of employees with a bad onboarding experience leave within their first year. And underneath the process failures is a quieter problem — most new hires simply don't ask the questions they need answered, because they don't want to look uninformed or interrupt someone busy. Silence, not lack of documentation, is often the real gap.

---

## 2. Solution

**Onboarding Buddy** is a voice-native AI teammate, built on VoiceOS's Agent Mode and MCP framework, that replaces the checklist-and-wiki model with something closer to a standing relationship.

It does two things no existing onboarding tool does together:

1. **It does things.** It provisions a new hire's access across every company tool — Slack, GitHub, Notion, Calendar, and anything else connected — live, narrating and visualizing each step as it happens, instead of leaving the new hire to chase down access manually.
2. **It knows things.** It has ingested the company's real knowledge base — wikis, architecture decisions, READMEs, HR policy — and will answer any question, technical or "dumb," for as long as the new hire wants to talk. No judgment, available indefinitely, and honest when it doesn't know something rather than guessing.

The product is not a smarter form. It is the patient, always-available colleague most new hires never get.

---

## 3. How It Works

A reference walkthrough: Joy, a new engineering hire at a large company, receives an HR email with her login and a link to the onboarding portal. She logs in and is greeted by a voice avatar — her buddy. Over the next few hours (compressible to minutes for a live demo), the buddy:

- Provisions her access to Slack, GitHub, Notion, and her calendar, narrating why each one matters, while a live dashboard checks off each step.
- Generates a short animated overview of the company and its product, built from real internal content rather than a static onboarding deck.
- Answers whatever she asks — technical, procedural, cultural, or administrative — sourced and cited from the real knowledge base, and openly says "I don't know, ask [person]" when it doesn't have a documented answer.
- Remains available indefinitely, so she can come back in week three with the question she didn't want to ask out loud in her first meeting.

---

## 4. Market Opportunity

Every company with more than a handful of employees runs onboarding, and the tool sprawl problem is structural, not going away: as companies adopt more SaaS, the number of systems a new hire needs access to only grows (47+ apps on average today). HR and IT teams currently solve this with a patchwork of HRIS tools, ITSM ticketing, and static LMS content — none of which narrate, visualize, or converse.

The natural buyer is mid-market to enterprise companies with high hiring volume, distributed/remote teams, and complex internal tool stacks — the same profile already straining under tool sprawl and already investing in onboarding software. This also aligns directly with VoiceOS's existing Enterprise tier (SSO/SAML, SOC 2, zero data retention), making Onboarding Buddy a natural extension of their enterprise offering rather than a new go-to-market motion.

---

## 5. Business Model

Proposed pricing follows the shape of existing HR tech (BambooHR, Personio) and VoiceOS's own tiers:

- **Per-seat / per-new-hire pricing:** charged per active onboarding (e.g., per new hire onboarded per month), so cost scales with hiring volume rather than headcount.
- **Enterprise tier:** bundled with VoiceOS Enterprise (SSO/SAML, SOC 2 Type II, zero data retention) for companies that need audit-grade provisioning logs.
- **Expansion path:** starts as an onboarding tool, naturally expands into an always-on internal knowledge assistant for the whole company, not just new hires — increasing seat count and stickiness over time.

---

## 6. Differentiation

| | Static onboarding tools (BambooHR, Personio, LMS) | Onboarding Buddy |
|---|---|---|
| Format | Checklist / document repository | Narrated, voice-native conversation |
| Access provisioning | Manual or ticket-based | Live, automated, visualized |
| Knowledge | Read-only wiki search | Conversational, sourced, honest about gaps |
| Availability | One-time, day-one only | Persistent — available indefinitely |
| Trust mechanism | None | Explicit "I don't know" fallback |

The defensible edge isn't the checklist — competitors can copy a checklist. It's the standing, judgment-free conversational relationship, which requires the combination VoiceOS already provides: voice-native interaction, MCP-based tool access, and screen-aware context.

---

## 7. Why VoiceOS, Why Now

VoiceOS's Agent Mode already does exactly the two things this product needs — chain multi-step actions across connected apps via MCP, and confirm before anything that changes state. Onboarding Buddy doesn't require new infrastructure from VoiceOS; it's a new application of the platform's existing primitives, aimed at a buyer (enterprise HR/IT) that maps directly onto VoiceOS's existing Enterprise tier.

---

## 8. Next Steps

- Build a scoped hackathon MVP: 3–4 tool integrations (Slack, GitHub, Notion, Calendar), a small pre-indexed knowledge base, and a live voice + visual dashboard demo.
- Validate the "I don't know" honesty mechanism as a trust signal with real users.
- Scope a pilot with a mid-market company already showing onboarding pain (high hiring volume, remote-heavy, 40+ internal tools).
