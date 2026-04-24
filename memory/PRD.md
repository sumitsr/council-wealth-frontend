# Council Wealth — Advisor Command Center UI

## Original problem statement
"build ui for this" → Council Wealth Architecture & Low Level Design Master File (Appendix H/I/J). Followed by: "it looks nice. lets completely rebuild it from scratch in a whole new design."
Council Wealth is a bank-grade, multi-tenant agentic AI platform for independent RIAs. A committee of 14 specialist AI agents deliberates on wealth-planning questions under a hard compliance veto (SentinelCompliance), with PII redaction (Ghost Map) and immutable audit logging (Historian → WORM).

## Architecture (current build — iteration 2)
- **Frontend-only** with rich, domain-specific RIA mock data.
- Stack: React 19 + React Router 7 + Tailwind CSS + shadcn/radix primitives (unused) + `@phosphor-icons/react`.
- Typography: **Newsreader** (display italic serif), **Karla** (body), **Chivo Mono** (data/ledger).
- Theme: **Fiduciary archival** — cream paper (`#F4F3ED`), fiduciary green (`#1E3B2D`), copper seal (`#A85B42`), ledger rule (`#D4D2C9`).
- Shell: **Masthead + Canvas**, no fixed sidebars. Intelligence "Folio" drawer opens from the right on demand. Global footer acts like a colophon.
- No backend endpoints. Live stream is a client-side scripted simulator advancing one trace step every 1.5s.

## Design directions explored
1. **Iteration 1 (replaced)** — Dark "Bloomberg Terminal" aesthetic (Cabinet Grotesk + IBM Plex Mono, 3-column fixed-sidebar shell, tracing-beam Agent Vote Grid).
2. **Iteration 2 (current)** — Light "Fiduciary archival" aesthetic. Editorial newspaper-style mastheads. Ledger-framed KPIs. **Radial Consensus Dial** as the signature moment, replacing the agent grid: 14 specialist chairs arrayed on a half-circle SVG arc, ink-stroke lines drawn from each spoken agent to a central Consensus hub. Veto state triggers a shock-ring around the hub.

## User personas
1. **Advisor** — runs council deliberations, reviews consensus, takes a seat in the live session.
2. **Compliance officer** — lives in Audit & Replay; ratifies HITL approvals from the Folio drawer.
3. **Tenant admin** — operates in "Chambers" (plan, quotas, feature writs, SSO, retention).

## Core requirements (static)
- 6 screens, strict 7-state vocabulary, compliance banner sticky above the fold on live sessions.
- Streaming-first live session, but visualized as committee deliberation rather than a terminal log.
- Domain-specific RIA data everywhere; no lorem.
- `data-testid` on all interactive/informational elements.

## What's been implemented (2026-04-24 — iteration 2)
- ✅ Mock data: 14 agents across 4 layers, 8 sessions, 6 integrations, 4 compliance alerts, 3 approvals, 5 clients, 7 audit sessions, 8 feature writs, 6 users, 4 quotas, 16-step live stream script.
- ✅ Shell: `Masthead` (top nav with centered link rail, brand seal, Intelligence folio trigger), `PinnedDrawer` (folio with client dossier + compliance pulse + awaiting-counsel queue + WORM summary), `PageFrame` + `PageMasthead` editorial title block + `Canvas` + `SectionRule`.
- ✅ `StateTag` with full archival palette for all 9 states.
- ✅ **Dashboard** — editorial masthead "The committee convened 142 times…", 4-column KPI ledger with ▲▼ deltas, live-council lede article, governance sidenote with the blocking veto highlighted, ledger of recent sessions (8 rows), gazette of 6 integration tiles.
- ✅ **New Session** — "A new matter is brought before the council." · legal docket-style filing with Newsreader-italic client selector, chip groups for jurisdiction/risk/objectives, terminal-prompt textarea, 4 giant serif number inputs, Counsel's annotations column, file-and-convene submit (navigates to live).
- ✅ **Live Council Session** (SIGNATURE) — sticky compliance banner; Radial Consensus Dial SVG with 14 nodes on half-circle arc, ink strokes drawn from spoken agents to Consensus hub, copper pulse on RUNNING, green fill on COMPLETED, wine-red fill + shock-ring on VETOED; pause/resume control; "Court transcript · verbatim, as set" with THOUGHT/ACTION/OBSERVATION/RESPONSE labels; ink-pen cursor on live line; Verdict panel with 4 tabs (Summary/Actions/Risks/Audit). Vetoed path at /council/live/CW-2040.
- ✅ **Audit & Replay** — "The immutable record of every deliberation." · library card-catalogue search (wired filter over id/client/advisor/jurisdiction) + 4 filter pills + Vetoed-only toggle + Export packet; Catalogue of sessions on left; Folio panel on right with trace timeline (numbered steps, step-type dots, rule-marker spine).
- ✅ **Integrations** — "The council's correspondents in the field." · 2-column grid of 6 provider cards, selection updates Counsel's note sidebar with correspondence details; gazette table of 6 Temporal-durable sync runs with archival state tags.
- ✅ **Chambers (Tenant Admin)** — "The rules of the house." · vertical tab rail with 6 tabs (Profile of Chambers, Plan & Quotas, Feature Writs, Bench Access, Identity · SAML, Retention Policy); Writ toggles have 2px borders and flip a block between bg-fiduciary and bg-canvas.
- ✅ Motion: `cw-node-pulse` (mechanical, no glow), `cw-stroke-draw` (line ink in from node to hub), `cw-veto-shock` (stroke-ring once), `cw-typeset-in` (fade + tiny x-slide for new transcript lines), `cw-ink-cursor` (pen-block blink), `cw-drawer-in`.

## Testing status
- Testing subagent iteration_2: **100% frontend pass** (40/41 playwright assertions; the 1 failure was a test-script provider-name typo, not a product defect). Zero console errors. Both bugs from iteration_1 (audit search unwired; nested buttons) are fixed and re-verified.

## Prioritized backlog (P0/P1/P2)
- **P1**: Wire FastAPI backend + `useCouncilSocket` WebSocket hook per Appendix J so the radial dial is driven by real server events.
- **P1**: Clients index + client drill-down page (currently routes redirect home).
- **P2**: Tablet/responsive breakpoints (current layout is built for ≥ 1440 px).
- **P2**: Real handlers on Ratify/Decline in the Folio drawer approval queue.
- **P2**: ⌘K command palette across clients/sessions/trace IDs.
- **P3**: Per-agent drill-down drawer showing that agent's rationale, citations, and trace excerpt.

## Next tasks
1. Ask whether to proceed to real backend + WebSocket streaming for the live session.
2. Clients index page + CRUD.
3. Real approval actions + toast notifications.
