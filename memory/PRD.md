# Council Wealth — Advisor Command Center UI

## Original problem statement
"build ui for this" → Council Wealth Architecture & Low Level Design Master File (Appendix H/I/J).
Subsequent user direction:
- v1: "it looks nice. lets completely rebuild it from scratch in a whole new design." → produced fiduciary-archival rebuild (rejected).
- v3 (current): "This is not I was looking for. The previous version was good. Let's improve that at next level." → restored the dark-terminal v1 and shipped a full polish pass.

## Architecture (current build — iteration 3)
- **Frontend-only** with rich, domain-specific RIA mock data.
- Stack: React 19 + React Router 7 + Tailwind CSS + shadcn primitives (unused) + `@phosphor-icons/react`.
- Typography: **Cabinet Grotesk** (display), **Manrope** (body), **IBM Plex Mono** (data).
- Theme: dark "Bloomberg-Terminal-but-beautiful" — `#0A0A0A` base, `rounded-sm` (2px) edges, strict 7-state colour vocabulary.
- Shell: fixed left nav + fixed header + center workspace + fixed right intelligence rail.
- Global providers: `ToastProvider` + `CommandPaletteProvider` wrap Routes.
- No backend. Live stream advances via scripted `setTimeout`.

## User personas
1. **Advisor** — convenes councils, takes a seat in live sessions, drills into individual agents.
2. **Compliance officer** — ratifies approvals (toast feedback), audits replays.
3. **Tenant admin** — Chambers tab for plan, quotas, flags, SSO, retention.

## What's been implemented (2026-04-24)

### Iteration 1 — Dark terminal base
All 6 screens (Dashboard, New Session, Live Session, Audit & Replay, Integrations, Tenant Admin) with shell, state badges, mock data, streaming simulator, compliance banner.

### Iteration 3 — Full polish pass (current)
- ✅ **⌘K Command Palette** (`CommandPalette.jsx`) — global overlay triggered by Cmd/Ctrl+K or by clicking the header search. Filters navigation, sessions, clients, agents with ArrowUp/Down + Enter + Esc. Per-group labels. Keyboard hints footer.
- ✅ **Radial Committee Diagram** (`RadialCommittee.jsx`) — full-circle SVG with 14 agent nodes, 60 tick-marks on the outer ring, ink edges drawn from every spoken agent to a central Consensus hub (blue for running, green for completed, red for vetoed). Running nodes get an animated pulse halo; vetoed triggers a shock-ring. Replaces the flat agent-vote grid as the signature moment on Live Session.
- ✅ **Agent Drill-Down Modal** (`AgentDrillModal.jsx`) — click any radial node OR any agent name in the thought stream; modal shows mission, latest utterance, operating metrics (latency/tokens/confidence/model), retrieved evidence with citations, trace excerpts, governance footer.
- ✅ **Clients index** (`Clients.jsx`) — 5 household cards with initials avatar, AUM/target/age tiles, 24-month performance sparkline with delta %, session count + last state. Search + jurisdiction pills + risk pills filter the grid.
- ✅ **Client Profile** (`ClientProfile.jsx`) — masthead hero with narrative + 4-stat summary + gradient performance chart; portfolio donut chart + 4 allocation legend + accounts dotted-leader list; session history table; right-rail compliance history + Quick Actions (New council, Export dossier).
- ✅ **Toast system** (`ToastProvider.jsx`) — bottom-right toasts with variants (success/warning/danger/info), auto-dismiss at ~4s, click-to-dismiss, pulse dot, slide-in/out animations.
- ✅ **Dashboard upgrades** — area-gradient sparklines, bar chart for veto rate, 7×24 **activity heatmap** (blue-intensity grid for past week's council activity with peak annotation), **dual-line intraday chart** (sessions + p50 latency with gradient areas).
- ✅ **Approval queue wired** — right-rail Approve/Decline buttons trigger variant toasts and remove the item from the queue; count badge updates.
- ✅ **Atmosphere** — `cw-ambient-bg` drifting grid, `cw-scanlines` decorative overlay on Live Session dial, `cw-reveal` + `cw-stagger` mount animations, `cw-modal-in` + `cw-scrim-in` for overlays.
- ✅ **Deep-link support** — `?agent=<Name>` on Live Session auto-opens the drill modal.
- ✅ **Mock data expanded**: `INTRADAY_SESSIONS/VETOS/LATENCY`, `WEEK_HEATMAP` (7×24), `AGENT_DETAILS` (per-agent model/mission/citations/metrics), `PORTFOLIOS` (5 clients × accounts × allocation), `CLIENT_SESSIONS`, `CLIENT_SPARKS`.

## Testing status
- iteration_3: **28/28 frontend checks pass** after one testing-agent fix.
  - Bug fixed by tester: `cw-scanlines` class applied directly to the thought-stream scroll container set `pointer-events: none` on the whole subtree, blocking clicks on agent-name buttons. Fix: moved scanlines to an absolute sibling overlay.
- No backend issues (backend is not in scope).
- No lint errors. No console errors. All provided `data-testid`s confirmed.

## Prioritized backlog
- **P1** Wire a FastAPI backend + `useCouncilSocket` WebSocket so the radial dial is driven by real events per Appendix J.
- **P2** Tablet/responsive breakpoints (currently optimised for ≥ 1440).
- **P2** Agent-to-agent influence edges (show which agents cited which others) on the radial diagram.
- **P2** Focus trap + focus restore on command palette and modal close (a11y polish).
- **P2** Persistent client pinning so opening a session anywhere auto-loads the right dossier.
- **P3** Add sparklines to Audit Viewer row items (session duration, step count).

## Next tasks
1. Ask user whether to proceed to the real backend + WebSocket integration.
2. Tablet breakpoints.
3. Agent influence edges on radial diagram.
