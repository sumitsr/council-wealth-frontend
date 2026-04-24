# Council Wealth — Advisor Command Center (UI)

## Original problem statement
"build ui for this" — reference document: **Council Wealth Architecture & Low Level Design Master File** (Appendix H/I/J).
Council Wealth is a bank-grade, multi-tenant agentic AI platform for independent RIAs. A committee of 14 specialist AI agents deliberates on wealth-planning questions under a hard compliance veto (SentinelCompliance), with PII redaction (Ghost Map) and immutable audit logging (Historian → WORM).

## Architecture (this build)
- **Frontend-only** build with rich, domain-specific mock data.
- Stack: React 19 + React Router 7 + Tailwind CSS 3 + shadcn/radix primitives + @phosphor-icons/react.
- Typography: **Cabinet Grotesk** (display/headings), **Manrope** (body), **IBM Plex Mono** (data/terminal).
- Theme: dark "Bloomberg Terminal but beautiful" — `#0A0A0A` base, `rounded-sm` (2px) terminal edges, 7-state color vocabulary (QUEUED slate, RUNNING blue pulse, WAITING_APPROVAL amber, APPROVED green, VETOED red, FAILED rose, ARCHIVED purple).
- Shell: fixed left nav (w-64) + fixed header (h-16) + center workspace + fixed right intelligence rail (w-80).
- **No backend** endpoints wired. Live stream is a client-side `setInterval/setTimeout` simulation using a scripted event log.

## User personas
1. **Advisor** (primary) — runs council deliberations, reviews consensus/veto, opens audit replay.
2. **Compliance officer** — lives in audit viewer, approves/declines HITL tasks, verifies WORM export.
3. **Tenant admin** — manages plan, quotas, feature flags, SSO, retention.

## Core requirements (static)
- 6 screens with strict state vocabulary and visible compliance posture above the fold.
- "Streaming-first" Live Council Session with real-time thought stream + agent vote grid + tracing-beam animation on RUNNING agents.
- Domain-specific RIA data everywhere (no lorem ipsum).
- `data-testid` on every interactive/informational element (kebab-case).

## What's been implemented (2026-04-24)
- ✅ Global shell: `LeftNav` (brand, 4 nav groups, tenant footer), `HeaderBar` (breadcrumb, search, UTC clock, alerts, user), `RightRail` (contextual sections), `AppShell` wrapper.
- ✅ Shared `StateBadge` mapping all 15 states → colors.
- ✅ Mock data layer: 14 agents (4 layers), 8 recent sessions, 6 integrations, compliance alerts, approval queue, 5 clients, 7 audit sessions, 8 feature flags, 6 users, 4 quotas, 16-step live stream script.
- ✅ **Dashboard** — KPI strip (5 tiles + sparklines), recent sessions table (8 rows), integration health grid, live-council highlight card with consensus meter, governance card with blocking-veto callout.
- ✅ **New Council Session** — structured intake (client/household/jurisdiction/risk selects, 6 objective chips, terminal-framed prompt editor, 4 scenario number inputs, held-away toggle). Validation on submit. Right rail shows cost estimate + governance preflight + client snapshot.
- ✅ **Live Council Session** (SIGNATURE) — compliance banner (Approved/Reviewing/Vetoed), consensus header (confidence/progress bar), agent vote grid grouped by 4 layers with `cw-beam-border` tracing animation on RUNNING agents, real-time thought stream with THOUGHT/ACTION/OBSERVATION/RESPONSE color-coded step types and IBM Plex Mono terminal aesthetic, pause/resume controls, recommendation tabs (Summary/Actions/Risks/Audit). Vetoed path (CW-2040) shows blocked output panel with FINRA 2111 findings.
- ✅ **Audit & Replay** — search (wired, filters by id/client/advisor/jurisdiction), filter pills, vetoed-only toggle, split results/replay layout, numbered trace timeline with step-type dot colors, WORM archive card with S3 Object Lock details and SEC 17a-4 retention.
- ✅ **Integrations Workspace** — 6 provider cards with per-provider accent gradients + sync-now micro-action, sync run history with 6 Temporal-durable entries, right rail with health summary + rate-limit + upcoming refreshes.
- ✅ **Tenant Admin** — vertical tab rail (Profile/Quotas/Flags/Users/SSO/Retention). Feature Flags toggle with state-color switches. Users table. SSO metadata. Retention matrix.
- ✅ Animations: beam-border on running agents, `cw-pulse` dot for RUNNING states, `cw-cursor` blink for live stream, `cw-slide-up` fade-in for each new stream line, `cw-grid-bg` subtle grid.
- ✅ All screens wired to left nav via React Router.

## Testing status
- Testing subagent iteration_1: frontend success 92%. Two issues reported and **both fixed**:
  1. Audit search input now wired (state + useMemo filter over id/client/advisor/jurisdiction). Verified: 'Carter' → 1 row; 'zzzzzz' → 0 rows.
  2. Nested `<button>` in Integrations provider cards replaced with `<div role="button" tabIndex={0}>` + keyboard handler + `stopPropagation` on inner Sync button. No more hydration warnings.
- Verified all 6 routes, 14 agent cards, 4 recommendation tabs, 6 admin tabs, 8 feature flag toggles, 5 KPI tiles, 8 session rows, 6 provider tiles.

## Prioritized backlog (P0/P1/P2)
- **P1**: Wire Clients route to a real clients index page (currently redirects to Dashboard).
- **P1**: Wire remaining Audit filter dropdowns (Client/Advisor/Date/Jurisdiction) to real state.
- **P2**: Connect FastAPI backend + WebSocket for the council stream so Live Session reflects server-issued events.
- **P2**: Responsive/tablet breakpoints (current layout is optimized for 1440–1920 desktops).
- **P2**: Command palette (⌘K) for universal search.
- **P2**: Replace Live Session scripted timer with real `useCouncilSocket` hook per Appendix J contract.
- **P3**: Per-agent drill-down modal (rationale, citations, trace excerpt).

## Next tasks
1. Ask user if they want the FastAPI backend + WebSocket simulator next to make the experience fully "live" end-to-end.
2. Add Clients index page + drill-down.
3. Command palette.
