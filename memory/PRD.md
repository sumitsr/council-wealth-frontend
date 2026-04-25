# Council Wealth — Bank-Grade Agentic AI Platform for RIAs

## Original problem statement
"build ui for this" → **Council Wealth Architecture & Low Level Design Master File** (Appendix H/I/J).
Subsequent direction:
- v1: "lets completely rebuild it from scratch in a whole new design." → fiduciary-archival rebuild (rejected).
- v3: "the previous version was good. let's improve that at next level." → restored dark-terminal v1 + full polish pass.
- iter-4: ReplayScrubber + distinct Settings + Onboarding wizard (3-step) + pricing tiers.
- **iter-5 (current)**: ReplayScrubber off-by-one fix + functional **NotificationBell** (live council events + plan/seat consumption + integration health). Java/Spring Boot/Spring AI/PostgreSQL+pgvector/JWT/WebSocket scoped into Upcoming per master roadmap.

## Product vision (per master roadmap)
> Bank-grade, multi-tenant agentic AI platform for Independent RIAs. Simulates an institutional **investment committee** of specialized AI agents producing **fiduciary-defensible, auditable advice** with hard pre-advice compliance gating, PII sanitization at inference, and an immutable WORM audit trail.

### Core USPs
1. **Council of Agents** — multi-model consensus (Vision, Scholar, RetirementPlanner, TaxStrategist, RiskAnalyst, EstatePlanner, Actuarial, Empath, Debater, SentinelCompliance, Historian, Forensic, Oracle, Concierge).
2. **Sentinel VETO** — pre-advice compliance gate with hard veto power (FINRA 2111, Reg BI, MiFID II Art. 25).
3. **Privacy Shield (Ghost Map)** — deterministic PII sanitization at inference time.
4. **Historian** — append-only WORM trail (SEC 17a-4) → S3 Object Lock.
5. **Bank-grade enterprise stack** (Java 21 + Spring Boot 3.4 + Spring AI) — sales advantage with regulated firms.
6. **True multi-tenancy** (Postgres RLS + Hibernate `@TenantId`).

### Pricing tiers (per roadmap)
- STARTER — $149 / advisor / month
- PROFESSIONAL — $299 / advisor / month
- ENTERPRISE — Custom (est. $499+) · 5 jurisdictions · SAML SSO · WORM export

## Architecture (current build)

### Frontend (running in this pod) — `/app/frontend`
- **Stack**: React 19 + React Router 7 + Tailwind CSS + shadcn primitives + `@phosphor-icons/react`.
- **Typography**: Cabinet Grotesk (display), Manrope (body), IBM Plex Mono (data).
- **Theme**: dark "Bloomberg-Terminal-but-beautiful" — `#0A0A0A` base, `rounded-sm` (2px), strict 7-state colour vocabulary.
- **Shell**: fixed left nav + fixed header + center workspace + fixed right intelligence rail.
- **Global providers**: `ToastProvider` → `NotificationProvider` → `CommandPaletteProvider`.
- **Data**: domain-rich mock data in `/src/data/mockData.js` and `/src/data/pricing.js`.

### Backend (planned target — Phase 1 of master roadmap)
- **Stack**: Java 21 (Virtual Threads) + Spring Boot 3.4 + Spring AI + Gradle build.
- **Auth**: Auth0 JWT + SAML2 federated identity, multi-tenant filtering via `@TenantId`.
- **Persistence**: PostgreSQL multi-tenant RLS + **pgvector** for RAG/KG, Redis for rate limits & feature cache, S3 + Object Lock for WORM audit.
- **Workflow**: Temporal.io for HITL gates and long-running approvals.
- **Real-time**: Spring WebSocket + STOMP for `/ws/council/{sessionId}` thought stream.
- **Models**: Gemini 3 / Vertex AI primary; Ollama fallback; Claude Sonnet 4.5 + GPT-5.2-Pro per-agent.

## User personas
1. **Advisor** — convenes councils, takes a seat in live sessions, drills into individual agents.
2. **Compliance officer** — ratifies approvals, audits replays, opens VETOs.
3. **Tenant admin** — Chambers tab for plan, quotas, flags, SSO, retention.
4. **Family / heir** (Phase 7) — heir portal for wealth-transfer intelligence.

---

## What's been implemented

### iteration 1 — Dark terminal base (2026-04-22)
All 6 screens (Dashboard, New Session, Live Session, Audit & Replay, Integrations, Tenant Admin) with shell, state badges, mock data, streaming simulator, compliance banner.

### iteration 3 — Full polish pass (2026-04-24)
- ✅ **⌘K Command Palette** (`CommandPalette.jsx`) — global overlay, ArrowUp/Down + Enter + Esc, per-group labels.
- ✅ **Radial Committee Diagram** (`RadialCommittee.jsx`) — full-circle SVG, 14 agent nodes, 60 tick-marks, ink edges to Consensus hub, animated pulse + shock-ring on VETO.
- ✅ **Agent Drill-Down Modal** (`AgentDrillModal.jsx`) — click radial node or thought-stream agent name → mission, utterance, metrics, citations, trace excerpts.
- ✅ **Clients index + Client Profile** — household cards w/ sparklines, masthead hero, donut, session history.
- ✅ **Toast system** (`ToastProvider.jsx`) — variants, auto-dismiss, click-to-dismiss, pulse dot.
- ✅ **Dashboard upgrades** — area-gradient sparklines, 7×24 activity heatmap, dual-line intraday chart.
- ✅ Approval queue wired with toasts; deep-link `?agent=<Name>` opens drill modal.

### iteration 4 — Replay + Onboarding (2026-04-25)
- ✅ **Replay Scrubber** (`ReplayScrubber.jsx`) — transport (Restart/Back/Play/Forward), draggable track with hover tooltip, event markers colour-coded by stepType, playhead, legend.
- ✅ **Distinct Settings page** (`Settings.jsx`) — 5 tabs (Profile, Density, Notifications, Keyboard, Account) split out from `/admin/tenant`.
- ✅ **Onboarding wizard** (`Onboarding.jsx`) — 3 steps (Tier → Seats/Add-ons → Firm), dynamic seat-based pricing, annual discount, addon checkboxes, slug auto-derive, terms gate, success toast.

### iteration 5 — Notifications + Roadmap pivot (2026-04-25)
- ✅ **ReplayScrubber off-by-one fix** — added `e.stopPropagation()` on marker `onMouseDown` (track listened on mousedown which bubbled and raced with marker click). Interior markers now land exactly on `streamIndex = i+1`.
- ✅ **NotificationProvider** (`NotificationProvider.jsx`) — central event bus with seed feed assembled from existing mock data:
  - **COMPLIANCE**: Sentinel VETO on CW-2040 (CRITICAL), SEC-206(4)-7 policy drift (WARN), MiFID II Art.25 (WARN)
  - **INTEGRATION**: Plaid disconnected (CRITICAL), Salesforce token expiring (WARN)
  - **AUDIT**: WORM nightly archive queued (INFO, pre-read)
  - **PLAN**: seat consumption ≥60% (Sessions 43%, Docs 36%, Seats 68%, Storage 41% — surfaces ≥60% only), warns ≥85%
  - **SESSION**: Council deliberating CW-2041, HITL approval waiting CW-2038
  - **Synthetic live event rotation** every 35s (Phase-3 WS placeholder).
- ✅ **NotificationBell** (`NotificationBell.jsx`) — bell button with red unread badge (`cw-pulse`), 400px popover panel:
  - Header with "X new · Y total" and "Mark all read"
  - Filter chips (All / Compliance / Session / Integration / Audit / Plan) with per-category counts
  - Scrollable list (max 480px), each item = severity dot + category icon + title + body (line-clamp-2) + time + CTA arrow
  - Unread accent bar (left, severity-coloured), unread shadow-glow on dot
  - Hover-revealed dismiss (X) button per item
  - Click item → marks read + navigates to `route` (live session / audit / integrations / admin)
  - Footer: pulse + "LIVE · WS pending (Phase 3)" + "Open audit log →"
  - Outside-click + ESC close.
- ✅ **HeaderBar** updated to use `NotificationBell` (replaced static bell+badge).

---

## Prioritized backlog

### 🟢 Upcoming (per master roadmap — Phase 1 backend)
> **Pod constraint**: this preview environment runs FastAPI on `:8001` via supervisor; the Java backend will be scaffolded under `/app/backend-java/` for production deployment, not run in this pod.

- **P0** Scaffold **Java 21 + Spring Boot 3.4 + Spring AI** project under `/app/backend-java/` with **Gradle** build, starter modules, and `application.yml`.
- **P0** **JWT authentication & authorization** — Auth0 integration, role hierarchy (ADVISOR / COMPLIANCE / ADMIN / SUPPORT), `@PreAuthorize` on REST + WS, `@TenantId` filter.
- **P0** **PostgreSQL + pgvector schemas** (per master roadmap, _not_ MongoDB):
  - `tenants`, `users`, `firms` (multi-tenant root with RLS)
  - `sessions` (CW-XXXX, status, advisor, client, jurisdiction, started_at, headline)
  - `session_steps` (trace_id, agent, step_type, content, ts, votes)
  - `agents` registry + `tenant_agent_configs` (promptAppend, externalApiHook, contextInjection, scoringOverride, featureFlags)
  - `agent_audit_log` (immutable WORM, append-only, S3 Object Lock target)
  - `compliance_events` (FINRA 2111, Reg BI, MiFID II)
  - `integrations` + `integration_sync_cursors`
  - `notifications` (severity, category, route, cta, read, tenant_id, user_id)
  - `pgvector` embeddings table for Scholar RAG (regulatory corpus)
- **P0** **Real-time WebSocket streaming** — Spring WebSocket + STOMP at `/ws/council/{sessionId}`, server-side fanout from Council Orchestrator → frontend `useCouncilSocket` hook, replace scripted `setTimeout` simulator.
- **P0** Wire **NotificationBell** to live `/ws/notifications/{tenantId}` topic.
- **P1** Council Orchestrator (Phase 1 ✅ scaffold per roadmap) — sequential Historian → Scholar → Deliberation → Sentinel → Historian flow with Java 21 Virtual Threads.
- **P1** RetirementPlanner + Sentinel + Historian agent implementations w/ Spring AI prompt templates.

### 🔵 Future (master roadmap)

#### Phase 2 — Integration Moat (2026-07 → 08)
- Wealthbox CRM, Salesforce FSC, Orion Advisor, Black Diamond, Plaid, Morningstar Direct connectors.
- OAuth refresh, sync cursors, destructive-unlink HITL gate.

#### Phase 2B — Multi-Jurisdictional Intelligence (2026-08 → 09)
- `JurisdictionResolver` with deterministic conflict hierarchy.
- Jurisdiction matrix: SEC, FCA, MiFID II, GDPR, PIPEDA, MAS, ASIC, BaFin.
- FATCA / CRS detection; data-residency routing.
- EU AI Act Art. 6 high-risk classification + technical documentation.

#### Phase 3 — Advisor Command Center (2026-07 → 09)
- Migrate frontend to Next.js 15 + React 19 + Zustand + TanStack Query (or extend current React app).
- WebSocket real-time deliberation, XAI council visualizer.

#### Phase 4 — Domain Specialization (2026-09 → 11)
- New deliberation agents: TaxStrategist, RiskAnalyst, EstatePlanner, Actuarial, Empath.
- Forensic (AML + elder-abuse), Concierge, Oracle (market surveillance).
- WORM ledger + GDPR right-to-erasure + IaC + SOC 2 Type I.

#### Phase 5 — Agentic Execution (2026-11 → 12)
- HITL framework (Temporal-gated workflow staging).
- Debater meta-agent for disputed cases.
- CI/CD on GKE + SOC 2 Type I cert + Beta launch.

#### Phase 6 — BehaviorIQ + LifeSignal (2027-Q1 → Q2)
- Behavioral profile infra + dashboard.
- Life-event detection (job change, divorce, inheritance, illness).

#### Phase 7 — Family Council (2027-Q2 → Q3)
- Multi-generational relationship graph + heir portal + wealth-transfer intelligence.

#### Phase 8 — Advisor Intelligence Network + OutcomeIQ (2027-Q3 → Q4)
- Network insights, OutcomeIQ feedback loop, LifeSignal ML model, EU AI Act conformity audit.

### 🟣 Frontend refactor (deferred)
- Extract `ThoughtStream` + `RecommendationPanel` from `LiveSession.jsx` (525 → <300).
- Split `Onboarding.jsx` (476 → <300) into `SummaryRail`, `StepDot`, `Connector`.
- Tablet/responsive breakpoints (currently optimised ≥ 1440).
- Agent-to-agent influence edges on Radial Committee.
- Focus trap + focus restore on Command Palette and modals.

---

## Testing status
- **iteration_3**: 28/28 frontend checks pass.
- **iteration_4**: 24/26 pass. Off-by-one on ReplayScrubber interior markers (LOW). **Fixed in iteration 5.**
- **iteration_5** (this turn): smoke-tested via screenshot — bell badge "7", panel renders, filter chips work, all categories visible, ReplayScrubber playhead aligned with markers. Testing-agent verification queued.
- No backend exists; backend tests N/A until Phase 1 scaffold lands.

## Test credentials
N/A — no auth implemented yet (will be added in Phase 1 with Auth0 JWT seed accounts).
