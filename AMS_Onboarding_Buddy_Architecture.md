# Onboarding Buddy architecture

This document translates the [Onboarding Buddy business proposal](./AMS_Onboarding_Buddy_Business_Proposal.md) into a high-level technical architecture for a web application and browser extension controlled through VoiceOS.

## Architectural decisions

- VoiceOS custom integrations use MCP: local stdio servers exposing tools that return text content blocks. See the [VoiceOS custom integration guide](https://www.voiceos.com/guide/build-mcp-integration).
- VoiceOS owns microphone capture, speech-to-text, tool selection, and text-to-speech.
- A small headless MCP adapter is the only locally launched Buddy process. It translates VoiceOS stdio tool calls into authenticated HTTPS requests to the Buddy backend; it has no windows or UI.
- The Buddy backend owns workflows, safety, integrations, memory, company knowledge, and audit history.
- The web application owns the onboarding dashboard and concept animations. The browser extension owns page context, pointers, highlights, and guided actions on other websites.
- VoiceOS does not provide a visual channel to custom MCP tools. The backend synchronizes spoken results and browser visuals through workflow events consumed by the web app and extension.
- API or MCP connectors are preferred for provisioning. Extension-driven page guidance is the fallback for websites without an integration.
- Sensitive flows such as 401(k) elections remain explanation-and-guidance only. Financial choices require explicit user action, and secrets are never stored.

## Current foundation

The `feature/base-product` work provides reusable prototypes:

- VoiceOS stdio MCP integration and tool definitions.
- A web application with dashboard, whiteboard, and animation primitives.
- A Chrome extension with page highlighting and content-script capabilities.
- Durable `remember_fact` memory with privacy safeguards and an optional Mem0 semantic-retrieval provider.

The Electron, Windows-control, native screen-capture, always-on-top orb, and noVNC desktop paths are not part of this product architecture. The onboarding-specific backend, browser synchronization, journey state, SaaS provisioning connectors, cited company knowledge, hire-facing progress dashboard, and audit-grade action receipts still need to be implemented.

## Runtime process map

```mermaid
flowchart LR
  User[New hire]

  subgraph voiceProcess ["Process 1: VoiceOS desktop"]
    Mic[Microphone]
    STT[Speech to text]
    VoiceAgent[Agent Mode and tool selection]
    TTS[Text to speech]
    Mic --> STT --> VoiceAgent
    VoiceAgent --> TTS
  end

  subgraph mcpProcess ["Process 2: Buddy MCP child process"]
    BuddyMCP[Onboarding Buddy MCP tools]
  end

  subgraph cloudRuntime ["Process 3: Buddy cloud backend"]
    BuddyAPI[Authenticated Buddy API]
    Orchestrator[Onboarding orchestrator]
    Workflow[Journey state machine]
    Policy[Privacy, policy, and confirmation gate]
    EventStream[Realtime workflow event stream]
    ConnectorGateway[Connector gateway]
    PersonalMemory[Personal learning memory]
    Knowledge[ACL-aware company knowledge]
    Audit[Action receipts and audit log]

    BuddyAPI --> Orchestrator
    Orchestrator --> Workflow
    Orchestrator --> PersonalMemory
    Orchestrator --> Knowledge
    Orchestrator --> EventStream
    Workflow --> Policy
    Policy --> ConnectorGateway
    ConnectorGateway --> Audit
  end

  subgraph webProcess ["Process 4: Buddy web application"]
    Dashboard[Onboarding dashboard]
    Whiteboard[Concept animation and whiteboard]
  end

  subgraph extensionProcess ["Process 5: Browser extension"]
    ExtensionWorker[Extension service worker]
    ContentScript[Per-tab content script]
    Overlay[DOM pointer, highlights, and captions]
  end

  subgraph companyServices ["Company and SaaS services"]
    Apps[Slack, GitHub, Notion, Calendar, HR and IT APIs]
  end

  subgraph targetWebsite ["Website open in a browser tab"]
    CurrentPage[Application being configured]
  end

  User -->|"speaks"| Mic
  VoiceAgent -->|"stdio MCP tool call"| BuddyMCP
  BuddyMCP -->|"authenticated HTTPS"| BuddyAPI
  BuddyAPI -->|"short text result"| BuddyMCP
  BuddyMCP -->|"MCP text content"| VoiceAgent
  TTS -->|"spoken response"| User

  ConnectorGateway -->|"provision or verify"| Apps
  Apps -->|"typed result"| ConnectorGateway

  EventStream -->|"SSE or WebSocket"| Dashboard
  EventStream -->|"SSE or WebSocket"| ExtensionWorker
  Dashboard --> Whiteboard
  ExtensionWorker -->|"tab message"| ContentScript
  ContentScript --> Overlay
  CurrentPage -->|"DOM and approved visible-tab context"| ContentScript
  Overlay -.->|"rendered inside the page"| CurrentPage
  User -->|"clicks or types"| CurrentPage
```

VoiceOS has no direct visual channel into the Buddy. It handles voice and MCP tool selection; the backend emits correlated workflow events to the web application and extension. The extension can inspect and annotate authorized browser tabs, but it cannot overlay native desktop applications, browser chrome, protected pages, or operating-system dialogs.

## Two-person parallel implementation

The work is split into two independently testable phases that proceed in parallel. Both people implement against one frozen versioned contract; neither phase imports the other phase's internal code.

```mermaid
flowchart LR
  Contract[Versioned API, event, auth, and tool contracts]

  subgraph phaseA ["Phase A: Voice and backend control plane"]
    VoiceMCP[Headless VoiceOS MCP adapter]
    API[Buddy API]
    WorkflowA[Workflow and policy engine]
    Data[Memory, knowledge, audit, and connectors]
    VoiceMCP --> API --> WorkflowA --> Data
  end

  subgraph phaseB ["Phase B: Web experience plane"]
    Web[Onboarding web application]
    Extension[Browser extension]
    Content[Tab content scripts and overlays]
    Web --> Extension --> Content
  end

  Contract --> PhaseAFixture[Generated client and contract tests]
  Contract --> PhaseBFixture[Mock API and event fixtures]
  PhaseAFixture --> VoiceMCP
  PhaseBFixture --> Web
  API -->|"HTTPS responses and ordered events"| Web
  API -->|"Ordered extension commands"| Extension
  Extension -->|"Page observations and action results"| API
```

### Contract freeze before parallel work

Agree on and version these boundaries before either phase starts:

- MCP tool names, input schemas, text result shape, and error codes.
- HTTPS request and response schemas for journey status, questions, memories, action preparation, confirmation, and page observations.
- Auth claims linking the MCP adapter, web session, extension, employee, and organization.
- Event envelope: `version`, `eventId`, `turnId`, `sequence`, `type`, `employeeId`, `payload`, and `createdAt`.
- Extension command and result schemas for inspect, highlight, explain, verify, and confirmed action.
- A deterministic demo journey and fixture data used by both phases.

Contract changes require a new version or an additive compatible field. This prevents either person's implementation from silently breaking the other.

### Phase A — Voice and backend control plane

**Owner:** Person 1

**Owns:**

- Headless VoiceOS stdio MCP adapter.
- Buddy HTTPS API and authentication.
- Onboarding domain model and task state machine.
- Orchestration, policy, confirmation, and idempotency.
- Personal memory, workflow state, company knowledge, audit receipts, and credential interfaces.
- Fake Slack, GitHub, Notion, and Calendar connectors followed by real adapters.
- Ordered realtime event production.

**Develops independently using:**

- A CLI that invokes MCP tools without the web application.
- Contract tests for every endpoint and event.
- A fake browser client that acknowledges extension commands and returns fixture observations.

**Phase A completion criteria:**

- A voice or CLI request can load a fixture journey, answer a cited question, prepare and confirm a fake provisioning action, store a receipt, persist `remember_fact`, and resume after restart.
- Every state transition emits contract-valid ordered events.
- Repeating a confirmed request does not duplicate the external action.

### Phase B — Web application and browser extension

**Owner:** Person 2

**Owns:**

- Onboarding dashboard, progress states, approval previews, citations, and concept animations.
- Browser-extension service worker, session synchronization, and host permissions.
- Content scripts for DOM inspection, element targeting, highlights, captions, and verification.
- Confirmed browser click, typing, and form-action adapters.
- Realtime event consumption, ordering, reconnection, and stale-turn handling.
- Browser-side privacy controls and short-lived caches.

**Develops independently using:**

- A mock Buddy API generated from the frozen contract.
- Recorded event sequences for idle, explanation, approval, completion, blocked, and failed states.
- Static fixture websites representing Slack, GitHub, Notion, Calendar, and benefits flows.

**Phase B completion criteria:**

- Fixture events drive the complete dashboard and animation lifecycle.
- A mock command can inspect a fixture page, highlight the correct DOM element, wait for confirmation, perform the allowed action, and report verification.
- Reloading the web app or extension reconnects without replaying stale visual commands.

### Final integration

Integration is limited to replacing each phase's mock boundary with the other phase's real contract-compatible implementation:

1. Sign in once and verify that VoiceOS MCP, web app, extension, employee, and organization resolve to the same session.
2. Replace Phase A's fake browser client with the real extension event connection.
3. Replace Phase B's mock API and event stream with the real Buddy backend.
4. Run one correlation ID through speech, MCP, workflow, dashboard, extension overlay, connector result, audit receipt, and spoken completion.
5. Verify reconnect, cancellation, duplicate confirmation, connector failure, unsupported page, and “I don't know” behavior.

The integrated architecture is complete only when neither side needs an internal import or implementation-specific exception from the other.

## End-to-end provisioning turn

```mermaid
sequenceDiagram
  participant U as New hire
  participant V as VoiceOS
  participant M as Buddy MCP
  participant B as Buddy backend
  participant W as Web app and extension
  participant S as Company service

  U->>V: “Set up my GitHub access”
  V->>V: Speech to text and select MCP tool
  V->>M: prepare_onboarding_action
  M->>B: Authenticated HTTPS request
  B->>B: Load journey, check policy, build preview
  B->>W: Stream task and approval preview
  B-->>M: Ask user to confirm the scoped action
  M-->>V: MCP text result
  V-->>U: Speak confirmation question
  U->>V: “Yes”
  V->>M: confirm_onboarding_action
  M->>B: Confirm pending action
  B->>S: Execute idempotent connector operation
  S-->>B: Return result
  B->>B: Store receipt and complete task
  B->>W: Stream dashboard and extension update
  B-->>M: Return concise completion text
  M-->>V: MCP text result
  V-->>U: Speak completion
```

## Modules to add

### Onboarding domain and workflow

- Define `Organization`, `HireProfile`, `JourneyTemplate`, `Task`, `Step`, `Approval`, `ActionReceipt`, and `Citation`.
- Use an explicit task state machine: `not_started → ready → awaiting_approval → running → completed | blocked | failed`.
- Keep task completion and provisioning receipts separate from free-form personal memory.

### VoiceOS tool surface

- Add narrow tools such as `get_onboarding_status`, `continue_onboarding`, `explain_current_step`, `answer_company_question`, `prepare_onboarding_action`, `confirm_onboarding_action`, and `remember_fact`.
- Keep the headless MCP adapter stateless and route all work to the authenticated Buddy HTTPS API.
- Use a short-lived device or user token so tool calls resolve to the same employee and organization as the signed-in web app and extension.
- Return concise text for VoiceOS to speak; the Buddy does not run a second speech runtime.
- Make `remember_fact` a direct typed operation rather than relying on the model to reinterpret a generated sentence.

### Connector gateway

- Give each connector the same lifecycle: validate prerequisites, produce a preview, request confirmation, execute idempotently, return a typed receipt, and support retry and reconciliation.
- Start with deterministic fake connectors, then add Slack, GitHub, Notion, and Calendar adapters as credentials and admin scopes become available.
- Do not assume the Buddy can invoke VoiceOS built-in integrations; no such API is documented. Audit-critical provisioning remains Buddy-managed.

### Knowledge and honesty layer

- Ingest a small versioned corpus of HR policy, engineering READMEs, architecture decisions, and tool guides.
- Retrieve only documents authorized for the hire and return citations with every factual answer.
- If no source supports the answer, say “I don’t know” and identify the owner or escalation path.

### Visual coordinator

- Add a live dashboard showing completed, current, blocked, and upcoming tasks.
- Reuse whiteboard and animation actions for concepts.
- Use extension content scripts and DOM geometry for pointers, highlights, captions, and guided actions on authorized websites.
- Use visible-tab screenshots and vision only as a permissioned fallback when DOM context is insufficient.
- Synchronize VoiceOS replies, dashboard updates, and extension commands with a shared `turnId` and ordered workflow events.
- Default to highlighting the next control. Programmatic click, typing, or form submission requires a scoped preview and explicit confirmation.

### Persistence, security, and administration

- Validate every MCP request at the Buddy API and apply body limits, sensitive-text blocking, and confirmation-before-write.
- Add organization and employee scoping, extension origin and host-permission checks, least-privilege connector credentials, and retention controls.
- Add SSO, exportable audit logs, and an admin journey-authoring surface after the MVP.

## Data and memory boundaries

Memory is owned by the Buddy backend, not VoiceOS or the extension. The architecture separates five stores:

1. **Personal memory** — explicit learning preferences and durable user facts such as “I prefer diagrams.” Store these in the organization-scoped backend; self-hosted Mem0 remains an optional semantic-retrieval provider.
2. **Workflow state** — authoritative task progress such as “GitHub setup is complete.” This belongs in an onboarding store, not conversational memory.
3. **Company knowledge** — ACL-filtered policies, guides, and engineering documents stored in a cited retrieval index.
4. **Audit receipts** — append-only records of attempted and completed provisioning operations.
5. **Credential vault** — connector tokens and service credentials, isolated from every other store.

Browser storage contains only replaceable caches and short-lived session material. Automatic memory should be restricted to safe learning preferences, role context, and accessibility needs. Credentials, salary, health details, benefits selections, raw screenshots, and financial decisions are never remembered.

## End-to-end behaviors

- **Status:** “What’s left?” loads the hire’s journey, focuses the dashboard, and speaks a concise summary.
- **Provisioning:** “Set up GitHub” produces a scoped preview, asks for confirmation, executes through the connector, stores a receipt, and atomically completes the task.
- **Knowledge:** “How does deployment work?” retrieves authorized sources, answers with citations, and opens an explanatory whiteboard when useful.
- **Guided UI:** For unsupported or sensitive websites, the extension highlights the next DOM control. The user performs the action, and the extension verifies the resulting page state before advancing.
- **Memory:** Personal learning preferences use first-class `remember_fact`; secrets and authoritative task state never enter personal memory.

## Integrated delivery order

1. Freeze contract version 1 and publish the shared fixture journey.
2. Run Phase A and Phase B concurrently against their contract-generated mocks.
3. Require each phase to pass its independent completion criteria.
4. Connect the real backend event stream to the real web application and extension.
5. Pass the integrated browser smoke flow and failure scenarios.
6. Promote fake connectors to real integrations one at a time.
7. Add enterprise hardening: SSO, tenant isolation, credential vaulting, retention, observability, exportable audit logs, and admin journey authoring.

## Verification

- Contract and state-transition tests for every task status and failure or retry path.
- Connector tests against fakes and sandbox accounts, including idempotency and receipts.
- Knowledge tests for citation correctness, ACL exclusion, prompt-injection resistance, and unsupported questions.
- Extension tests for host permissions, DOM targeting, cross-origin frames, protected pages, stale tabs, and reconnecting to the event stream.
- Safety tests for secrets, financial decisions, destructive actions, cancellation, and unauthorized extension commands.
- Browser smoke flow: launch VoiceOS, sign into the web app and extension, ask status, explain a concept, approve one provision, observe the dashboard and target tab update, persist `remember_fact`, restart, and resume.
