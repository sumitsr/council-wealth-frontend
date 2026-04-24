// Council Wealth mock data. Domain-specific RIA financial data.

export const TENANT = {
  id: 'tnt_01HZX',
  name: 'Aldrich & Quinn Wealth',
  plan: 'ENTERPRISE',
  firmId: 'firm_aq_us',
  jurisdiction: 'US',
  region: 'us-east-1',
};

export const CURRENT_USER = {
  id: 'usr_sn9',
  name: 'Sierra Navarro',
  email: 'sierra.navarro@aldrichquinn.com',
  role: 'ADVISOR',
  avatarInitials: 'SN',
};

// 14 agents across 4 layers
export const AGENTS = [
  { name: 'Vision', layer: 'INGESTION', role: 'OCR + document extraction' },
  { name: 'Scholar', layer: 'INGESTION', role: 'Regulatory RAG + citations' },
  { name: 'RetirementPlanner', layer: 'DELIBERATION', role: 'Withdrawal & drawdown' },
  { name: 'TaxStrategist', layer: 'DELIBERATION', role: 'Roth, IRMAA, harvesting' },
  { name: 'RiskAnalyst', layer: 'DELIBERATION', role: 'Sequence & stress' },
  { name: 'EstatePlanner', layer: 'DELIBERATION', role: 'Trusts & transfer' },
  { name: 'Actuarial', layer: 'DELIBERATION', role: 'Monte Carlo + break-even' },
  { name: 'Empath', layer: 'DELIBERATION', role: 'Behavioral finance tone' },
  { name: 'Debater', layer: 'DELIBERATION', role: 'Disagreement resolver' },
  { name: 'SentinelCompliance', layer: 'GOVERNANCE', role: 'Hard veto gate' },
  { name: 'Historian', layer: 'GOVERNANCE', role: 'Immutable audit' },
  { name: 'Forensic', layer: 'GOVERNANCE', role: 'AML + anomaly' },
  { name: 'Oracle', layer: 'INTELLIGENCE', role: 'Market surveillance' },
  { name: 'Concierge', layer: 'INTELLIGENCE', role: 'Lifecycle outreach' },
];

export const RECENT_SESSIONS = [
  { id: 'CW-2041', clientName: 'Wilson, Jane', advisorName: 'S. Navarro', status: 'RUNNING', confidence: null, startedAt: '14:02:11', jurisdiction: 'US', headline: 'Retirement-income drawdown + staged Roth' },
  { id: 'CW-2040', clientName: 'Carter, Henry', advisorName: 'S. Shah', status: 'VETOED', confidence: 0.42, startedAt: '13:41:07', jurisdiction: 'US', headline: 'Concentration breach & suitability mismatch' },
  { id: 'CW-2039', clientName: 'Okafor, Amara', advisorName: 'D. Kumar', status: 'APPROVED', confidence: 0.91, startedAt: '13:15:52', jurisdiction: 'UK', headline: 'Cross-border ISA to Roth equivalency' },
  { id: 'CW-2038', clientName: 'Stewart, Miriam', advisorName: 'A. Mehta', status: 'WAITING_APPROVAL', confidence: 0.82, startedAt: '12:58:03', jurisdiction: 'US', headline: 'Gifting plan with GST exemption window' },
  { id: 'CW-2037', clientName: 'Hollingsworth, J.', advisorName: 'S. Navarro', status: 'APPROVED', confidence: 0.87, startedAt: '12:11:24', jurisdiction: 'US', headline: 'Tax-loss harvesting sequence + IRMAA avoid' },
  { id: 'CW-2036', clientName: 'Reyes, Paloma', advisorName: 'L. Yamada', status: 'APPROVED', confidence: 0.94, startedAt: '11:44:39', jurisdiction: 'EU', headline: 'MiFID II suitability-aligned allocation' },
  { id: 'CW-2035', clientName: 'Nguyen, Binh', advisorName: 'S. Shah', status: 'ARCHIVED', confidence: 0.88, startedAt: '10:02:14', jurisdiction: 'US', headline: 'Annuity ladder for longevity hedge' },
  { id: 'CW-2034', clientName: 'Rosenthal, Ivo', advisorName: 'D. Kumar', status: 'FAILED', confidence: null, startedAt: '09:17:58', jurisdiction: 'US', headline: 'Actuarial inputs insufficient — retry' },
];

export const KPIS = {
  sessions24h: 142,
  sessions24hDelta: +12.4,
  vetoRate: 4.8,
  vetoRateDelta: -0.9,
  syncHealth: 97.2,
  syncHealthDelta: +0.3,
  avgLatency: 11.4,
  avgLatencyDelta: -1.8,
  openApprovals: 7,
};

export const INTEGRATIONS = [
  { provider: 'Wealthbox', category: 'CRM', status: 'CONNECTED', lastSync: '2m ago', cursor: 'evt_42918', health: 99.1 },
  { provider: 'Salesforce FSC', category: 'CRM', status: 'TOKEN_EXPIRING', lastSync: '18m ago', cursor: 'cdc_81120', health: 86.3 },
  { provider: 'Orion Advisor', category: 'PMS', status: 'SYNC_RUNNING', lastSync: 'now', cursor: 'snap_0428', health: 95.0 },
  { provider: 'Black Diamond', category: 'PMS', status: 'CONNECTED', lastSync: '4m ago', cursor: 'snap_0427', health: 98.8 },
  { provider: 'Plaid', category: 'AGGREGATOR', status: 'DISCONNECTED', lastSync: '2d ago', cursor: '—', health: 0 },
  { provider: 'Morningstar Direct', category: 'MARKET', status: 'CONNECTED', lastSync: '1m ago', cursor: 'mkt_tick_22811', health: 99.7 },
];

export const COMPLIANCE_ALERTS = [
  { id: 'CA-81', severity: 'CRITICAL', code: 'FINRA-2111', message: 'Suitability mismatch on CW-2040', time: '13:42' },
  { id: 'CA-80', severity: 'WARN', code: 'SEC-206(4)-7', message: 'Policy version drift detected', time: '13:08' },
  { id: 'CA-79', severity: 'WARN', code: 'MiFID II Art.25', message: 'Cross-border suitability re-check needed', time: '12:11' },
  { id: 'CA-78', severity: 'INFO', code: 'WORM', message: 'Nightly archive queued (2,104 sessions)', time: '00:05' },
];

export const APPROVAL_QUEUE = [
  { id: 'APR-221', sessionId: 'CW-2038', client: 'Stewart, Miriam', reason: 'Gifting exceeds $50k — HITL required', waited: '08m' },
  { id: 'APR-220', sessionId: 'CW-2031', client: 'Osei, Kwame', reason: 'Outbound note publication', waited: '22m' },
  { id: 'APR-219', sessionId: 'CW-2029', client: 'Andersson, Liv', reason: 'Plaid destructive unlink', waited: '41m' },
];

export const CLIENTS = [
  { id: 'cli_01', name: 'Wilson, Jane', householdId: 'hh_01', age: 62, retireAge: 65, jurisdiction: 'US', risk: 'MODERATE', aum: 2_300_000, need: 140_000 },
  { id: 'cli_02', name: 'Carter, Henry', householdId: 'hh_02', age: 71, retireAge: 70, jurisdiction: 'US', risk: 'CONSERVATIVE', aum: 4_100_000, need: 210_000 },
  { id: 'cli_03', name: 'Okafor, Amara', householdId: 'hh_03', age: 54, retireAge: 62, jurisdiction: 'UK', risk: 'MODERATE', aum: 1_820_000, need: 90_000 },
  { id: 'cli_04', name: 'Hollingsworth, J.', householdId: 'hh_04', age: 58, retireAge: 66, jurisdiction: 'US', risk: 'AGGRESSIVE', aum: 6_750_000, need: 300_000 },
  { id: 'cli_05', name: 'Reyes, Paloma', householdId: 'hh_05', age: 49, retireAge: 65, jurisdiction: 'EU', risk: 'MODERATE', aum: 980_000, need: 60_000 },
];

export const OBJECTIVES = ['Retirement', 'Tax', 'Risk', 'Estate', 'Income', 'Insurance'];
export const JURISDICTIONS = ['US', 'UK', 'EU'];
export const RISK_PROFILES = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'];

// Scripted live-session stream for CW-2041 (Wilson)
export const LIVE_STREAM_SCRIPT = [
  { agent: 'Historian', stepType: 'ACTION', content: 'Trace opened. Session CW-2041 registered to firm_aq_us.' },
  { agent: 'Scholar', stepType: 'ACTION', content: 'Retrieving citations: IRC §408A, IRS Pub 590-B, Notice 2024-33.' },
  { agent: 'Scholar', stepType: 'OBSERVATION', content: 'Top-8 passages embedded (cos sim ≥ 0.78). Jurisdiction=US.' },
  { agent: 'RetirementPlanner', stepType: 'THOUGHT', content: 'Initial withdrawal 4.2% vs guardrails 3.6–4.8%. Delaying SSA to 70 adds ~$11,400/yr.' },
  { agent: 'TaxStrategist', stepType: 'THOUGHT', content: 'Roth conversion window 62→70. Top-up to 24% bracket avoids IRMAA Tier 2.' },
  { agent: 'RiskAnalyst', stepType: 'THOUGHT', content: 'Sequence-of-returns risk elevated first 10y (σ=14.2%). Bond tent 50→30% glidepath.' },
  { agent: 'Actuarial', stepType: 'OBSERVATION', content: 'Monte Carlo n=10,000 → p10:$1.42M, p50:$3.11M, p90:$5.84M at horizon 30y.' },
  { agent: 'Empath', stepType: 'THOUGHT', content: 'Client previously expressed loss aversion post-2022. Frame drawdown as "income floor" not "withdrawal".' },
  { agent: 'RetirementPlanner', stepType: 'RESPONSE', content: 'Recommend 4.2% initial, dynamic guardrails, SSA delay to 70, bond tent glidepath.' },
  { agent: 'TaxStrategist', stepType: 'RESPONSE', content: 'Staged Roth conversions $85k/yr, harvest losses ≥ 7%, QCD at 70½.' },
  { agent: 'RiskAnalyst', stepType: 'RESPONSE', content: 'Approve with caveat: maintain 2y cash floor; rebalance on 20% drift.' },
  { agent: 'Actuarial', stepType: 'RESPONSE', content: 'Plan survival probability 92.4% at 30y. Break-even SSA delay age 82.3.' },
  { agent: 'SentinelCompliance', stepType: 'ACTION', content: 'Running suitability (FINRA 2111), disclosure (Reg BI), and concentration checks.' },
  { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'No blocking violations. Disclosures present. Concentration within policy.' },
  { agent: 'SentinelCompliance', stepType: 'RESPONSE', content: 'APPROVED. Policy v2026-04. Eligible for WORM export.' },
  { agent: 'Historian', stepType: 'ACTION', content: 'Persisted 14 trace steps, 7 votes, compliance decision. trace_id=7af1-…-c02' },
];

export const AUDIT_SESSIONS = [
  { id: 'CW-2040', clientName: 'Carter, Henry', advisorName: 'S. Shah', outcome: 'VETOED', startedAt: '2026-04-28 13:41', wormStatus: 'PENDING', jurisdiction: 'US' },
  { id: 'CW-2037', clientName: 'Hollingsworth, J.', advisorName: 'S. Navarro', outcome: 'APPROVED', startedAt: '2026-04-28 12:11', wormStatus: 'COMPLETED', jurisdiction: 'US' },
  { id: 'CW-2035', clientName: 'Nguyen, Binh', advisorName: 'S. Shah', outcome: 'ARCHIVED', startedAt: '2026-04-28 10:02', wormStatus: 'COMPLETED', jurisdiction: 'US' },
  { id: 'CW-2034', clientName: 'Rosenthal, Ivo', advisorName: 'D. Kumar', outcome: 'FAILED', startedAt: '2026-04-28 09:17', wormStatus: 'PENDING', jurisdiction: 'US' },
  { id: 'CW-2029', clientName: 'Andersson, Liv', advisorName: 'L. Yamada', outcome: 'APPROVED', startedAt: '2026-04-27 16:44', wormStatus: 'COMPLETED', jurisdiction: 'EU' },
  { id: 'CW-2021', clientName: 'Reyes, Paloma', advisorName: 'L. Yamada', outcome: 'APPROVED', startedAt: '2026-04-27 11:44', wormStatus: 'COMPLETED', jurisdiction: 'EU' },
  { id: 'CW-2018', clientName: 'Okafor, Amara', advisorName: 'D. Kumar', outcome: 'APPROVED', startedAt: '2026-04-27 09:02', wormStatus: 'COMPLETED', jurisdiction: 'UK' },
];

export const FEATURE_FLAGS = [
  { key: 'debater_agent', enabled: true, desc: 'Meta-agent for disputed council cases' },
  { key: 'ws_visualizer', enabled: true, desc: 'Real-time thought stream over WebSocket' },
  { key: 'worm_export_ui', enabled: true, desc: 'Show WORM archive references in audit' },
  { key: 'saml_sso', enabled: true, desc: 'SAML 2.0 federated identity' },
  { key: 'langgraph_debate', enabled: false, desc: 'LangGraph4j cyclic debate graph (Phase 3)' },
  { key: 'firm_hooks', enabled: true, desc: 'Pre-deliberation firm API hooks' },
  { key: 'enterprise_admin', enabled: true, desc: 'Multi-entity admin controls' },
  { key: 'forensic_agent', enabled: false, desc: 'AML + elder-abuse anomaly detection (Phase 4)' },
];

// Intraday bucket stats (hourly, 24 buckets) for dashboard micro-charts
export const INTRADAY_SESSIONS = [3,2,2,1,1,2,3,5,8,11,14,16,19,17,14,12,10,8,6,4,3,3,4,5];
export const INTRADAY_VETOS   = [0,0,0,0,0,1,0,0,1,0,1,2,1,0,0,1,0,0,0,1,0,0,0,0];
export const INTRADAY_LATENCY = [12.1,12.4,11.9,13.2,12.6,11.8,11.2,11.9,13.4,12.1,11.4,11.2,10.9,11.1,11.6,10.8,10.6,10.9,11.3,11.4,11.5,11.4,11.2,11.4];

// Weekly heatmap: rows = day of week, cols = 24 hours
export const WEEK_HEATMAP = [
  [0,0,0,0,0,0,1,2,3,4,3,5,6,7,5,4,3,2,1,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,5,6,5,7,8,9,7,5,4,3,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,4,5,7,6,8,9,10,8,6,5,4,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,3,6,8,7,9,11,10,9,7,5,4,3,2,1,0,0,0],
  [0,0,0,0,0,1,3,4,7,9,8,10,12,11,9,8,6,5,3,2,1,0,0,0],
  [0,0,0,0,0,0,1,2,3,4,3,5,6,4,3,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,2,1,2,3,2,1,0,0,0,0,0,0,0,0,0],
];

// Agent full-detail records used in drill-down modal
export const AGENT_DETAILS = {
  Scholar: {
    model: 'gpt-5.2-pro + pgvector-rag',
    mission: 'Retrieve and embed the regulatory corpus relevant to the matter.',
    citations: [
      { id: 'IRC §408A',      passage: 'Roth IRA conversion rules and ordering.' },
      { id: 'IRS Pub 590-B',  passage: 'Distributions from IRAs and required minimums.' },
      { id: 'Notice 2024-33', passage: 'Clarifications on SECURE 2.0 provisions.' },
      { id: 'IRM 21.6.5',     passage: 'Taxpayer accounts and special adjustments.' },
    ],
    metrics: { latency: '2.1s', tokens: 4812, confidence: 0.92 },
  },
  RetirementPlanner: {
    model: 'claude-sonnet-4.5',
    mission: 'Derive a drawdown plan with guardrails, SSA timing, glidepaths.',
    citations: [
      { id: 'Guyton-Klinger', passage: 'Dynamic guardrail rules for sustainable withdrawals.' },
      { id: 'Kitces 2016',    passage: 'Sequence-of-returns risk & bond tent.' },
    ],
    metrics: { latency: '1.8s', tokens: 3124, confidence: 0.87 },
  },
  TaxStrategist: {
    model: 'gpt-5.2-pro',
    mission: 'Plan staged Roth conversions, avoid IRMAA, harvest losses.',
    citations: [
      { id: 'IRMAA 2026',    passage: 'Income thresholds and Medicare surcharges.' },
      { id: 'IRC §165(g)',   passage: 'Tax-loss harvesting eligibility.' },
    ],
    metrics: { latency: '1.5s', tokens: 2798, confidence: 0.91 },
  },
  RiskAnalyst: {
    model: 'claude-sonnet-4.5',
    mission: 'Measure sequence, stress, and concentration risk versus policy.',
    citations: [
      { id: 'Factor Model v3', passage: '10y volatility and drawdown envelope.' },
      { id: 'Historical 2022', passage: 'Stress path under 60/40 drawdown.' },
    ],
    metrics: { latency: '2.4s', tokens: 3401, confidence: 0.85 },
  },
  Actuarial: {
    model: 'gpt-5.2-pro',
    mission: 'Monte Carlo simulation for terminal wealth and plan survival.',
    citations: [
      { id: 'MC n=10000',   passage: 'p10 $1.42M · p50 $3.11M · p90 $5.84M at 30y.' },
      { id: 'SOA 2026 Mortality', passage: 'Longevity quantiles used for horizon.' },
    ],
    metrics: { latency: '4.8s', tokens: 5230, confidence: 0.90 },
  },
  Empath: {
    model: 'claude-sonnet-4.5',
    mission: 'Behavioural tone, framing, and loss-aversion mitigation.',
    citations: [
      { id: 'Kahneman-Tversky', passage: 'Prospect theory framing effects.' },
      { id: 'Client log 2022-Q4', passage: 'Expressed drawdown aversion.' },
    ],
    metrics: { latency: '1.1s', tokens: 1402, confidence: 0.73 },
  },
  SentinelCompliance: {
    model: 'gpt-5.2-pro (governance)',
    mission: 'Hard veto gate — suitability, disclosure, concentration.',
    citations: [
      { id: 'FINRA 2111',      passage: 'Suitability standards for recommendations.' },
      { id: 'SEC Reg BI',      passage: 'Best-interest disclosure obligations.' },
      { id: 'Policy v2026-04', passage: 'Firm-level concentration ceilings.' },
    ],
    metrics: { latency: '3.2s', tokens: 4100, confidence: null },
  },
  Historian: {
    model: 'spring-temporal',
    mission: 'Immutable append-only trace persistence and WORM export.',
    citations: [
      { id: 'SEC 17a-4', passage: '7-year retention for advice records.' },
      { id: 'Object Lock', passage: 'S3 write-once-read-many enforcement.' },
    ],
    metrics: { latency: '0.4s', tokens: 320, confidence: 1.0 },
  },
};

// Portfolios for client profile page
export const PORTFOLIOS = {
  cli_01: {
    total: 2_300_000,
    holdings: [
      { acc: 'Taxable',          value: 980_000,  allocation: 0.43, alloc: { eq: 62, fi: 30, alt: 6, cash: 2 } },
      { acc: 'Traditional IRA',  value: 820_000,  allocation: 0.36, alloc: { eq: 55, fi: 38, alt: 4, cash: 3 } },
      { acc: 'Roth IRA',         value: 340_000,  allocation: 0.15, alloc: { eq: 78, fi: 18, alt: 3, cash: 1 } },
      { acc: 'HSA',              value: 160_000,  allocation: 0.07, alloc: { eq: 60, fi: 35, alt: 3, cash: 2 } },
    ],
  },
  cli_02: {
    total: 4_100_000,
    holdings: [
      { acc: 'Taxable',          value: 1_900_000, allocation: 0.46, alloc: { eq: 42, fi: 50, alt: 5, cash: 3 } },
      { acc: 'Traditional IRA',  value: 1_400_000, allocation: 0.34, alloc: { eq: 35, fi: 58, alt: 4, cash: 3 } },
      { acc: 'Roth IRA',         value: 560_000,   allocation: 0.14, alloc: { eq: 55, fi: 40, alt: 3, cash: 2 } },
      { acc: 'Annuity',          value: 240_000,   allocation: 0.06, alloc: { eq: 20, fi: 70, alt: 5, cash: 5 } },
    ],
  },
  cli_03: {
    total: 1_820_000,
    holdings: [
      { acc: 'ISA (UK)',         value: 720_000, allocation: 0.40, alloc: { eq: 60, fi: 32, alt: 5, cash: 3 } },
      { acc: 'SIPP',             value: 640_000, allocation: 0.35, alloc: { eq: 55, fi: 38, alt: 4, cash: 3 } },
      { acc: 'Taxable',          value: 460_000, allocation: 0.25, alloc: { eq: 70, fi: 25, alt: 3, cash: 2 } },
    ],
  },
  cli_04: {
    total: 6_750_000,
    holdings: [
      { acc: 'Taxable',          value: 3_200_000, allocation: 0.47, alloc: { eq: 72, fi: 20, alt: 6, cash: 2 } },
      { acc: 'Traditional IRA',  value: 1_900_000, allocation: 0.28, alloc: { eq: 68, fi: 26, alt: 4, cash: 2 } },
      { acc: 'Roth IRA',         value: 1_100_000, allocation: 0.16, alloc: { eq: 80, fi: 16, alt: 3, cash: 1 } },
      { acc: 'Trust',            value:   550_000, allocation: 0.08, alloc: { eq: 55, fi: 35, alt: 8, cash: 2 } },
    ],
  },
  cli_05: {
    total: 980_000,
    holdings: [
      { acc: 'Taxable',          value: 520_000, allocation: 0.53, alloc: { eq: 65, fi: 28, alt: 5, cash: 2 } },
      { acc: 'Pension (EU)',     value: 360_000, allocation: 0.37, alloc: { eq: 45, fi: 48, alt: 4, cash: 3 } },
      { acc: 'Roth equivalent',  value: 100_000, allocation: 0.10, alloc: { eq: 70, fi: 25, alt: 3, cash: 2 } },
    ],
  },
};

// Per-client session history (keyed for quick lookup)
export const CLIENT_SESSIONS = {
  cli_01: [
    { id: 'CW-2041', date: '2026-04-28', status: 'RUNNING',  headline: 'Retirement-income drawdown with staged Roth conversions', confidence: null },
    { id: 'CW-1988', date: '2026-03-14', status: 'APPROVED', headline: 'Social Security claiming timing (age 70 delay)',           confidence: 0.89 },
    { id: 'CW-1902', date: '2026-01-22', status: 'APPROVED', headline: 'Estate letter of instruction review',                      confidence: 0.93 },
    { id: 'CW-1864', date: '2025-11-08', status: 'ARCHIVED', headline: 'Annual tax-loss harvesting sweep',                         confidence: 0.86 },
  ],
  cli_02: [
    { id: 'CW-2040', date: '2026-04-28', status: 'VETOED',   headline: 'Concentration breach · suitability mismatch',              confidence: 0.42 },
    { id: 'CW-1974', date: '2026-03-02', status: 'APPROVED', headline: 'Annuity ladder evaluation',                                confidence: 0.88 },
    { id: 'CW-1889', date: '2026-01-10', status: 'APPROVED', headline: 'Medicare IRMAA avoidance plan',                            confidence: 0.91 },
  ],
  cli_03: [
    { id: 'CW-2039', date: '2026-04-28', status: 'APPROVED', headline: 'Cross-border ISA to Roth equivalency',                     confidence: 0.91 },
    { id: 'CW-1991', date: '2026-03-18', status: 'APPROVED', headline: 'SIPP consolidation review',                                confidence: 0.84 },
  ],
  cli_04: [
    { id: 'CW-2037', date: '2026-04-28', status: 'APPROVED', headline: 'Tax-loss harvesting sequence · IRMAA avoidance',           confidence: 0.87 },
    { id: 'CW-1956', date: '2026-02-21', status: 'APPROVED', headline: 'Trust distribution to grandchildren',                      confidence: 0.92 },
    { id: 'CW-1881', date: '2025-12-18', status: 'WAITING_APPROVAL', headline: 'Large gifting plan · GST exemption window',        confidence: 0.79 },
  ],
  cli_05: [
    { id: 'CW-2036', date: '2026-04-28', status: 'APPROVED', headline: 'MiFID II suitability-aligned allocation',                  confidence: 0.94 },
  ],
};

// Performance sparkline per client (normalized monthly percent of starting AUM over 24 months)
export const CLIENT_SPARKS = {
  cli_01: [100,101,99,102,105,104,106,108,107,110,112,111,114,115,113,116,118,119,117,120,121,123,122,125],
  cli_02: [100,100,99,98,99,101,100,102,101,103,102,104,103,105,106,105,107,106,108,107,109,108,110,109],
  cli_03: [100,102,105,104,107,110,108,112,115,114,117,120,118,121,123,121,124,126,125,128,130,129,132,134],
  cli_04: [100,101,103,105,102,106,109,107,112,110,115,118,116,121,119,124,127,125,130,128,133,136,134,139],
  cli_05: [100,99,101,100,102,103,101,104,106,105,107,108,106,109,111,110,112,113,111,114,116,115,117,118],
};

export const USERS = [
  { id: 'u1', name: 'Sierra Navarro', email: 'sierra.navarro@aldrichquinn.com', role: 'ADVISOR', lastLogin: '14:02', status: 'ACTIVE' },
  { id: 'u2', name: 'Darian Kumar', email: 'darian.kumar@aldrichquinn.com', role: 'ADVISOR', lastLogin: '13:44', status: 'ACTIVE' },
  { id: 'u3', name: 'Sana Shah', email: 'sana.shah@aldrichquinn.com', role: 'ADVISOR', lastLogin: '13:41', status: 'ACTIVE' },
  { id: 'u4', name: 'Lila Yamada', email: 'lila.yamada@aldrichquinn.com', role: 'ADVISOR', lastLogin: '11:44', status: 'ACTIVE' },
  { id: 'u5', name: 'Priya Rao', email: 'priya.rao@aldrichquinn.com', role: 'COMPLIANCE', lastLogin: '14:00', status: 'ACTIVE' },
  { id: 'u6', name: 'Marcus Orrin', email: 'marcus.orrin@aldrichquinn.com', role: 'ADMIN', lastLogin: '09:12', status: 'ACTIVE' },
];

export const QUOTAS = [
  { label: 'Council sessions / mo', used: 4280, limit: 10000 },
  { label: 'Documents ingested', used: 18240, limit: 50000 },
  { label: 'Seats', used: 34, limit: 50 },
  { label: 'Storage (GB)', used: 412, limit: 1000 },
];
