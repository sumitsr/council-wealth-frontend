// Council Wealth — mock data. Fiduciary archival tone, RIA-specific.

export const TENANT = {
  id: 'tnt_01HZX',
  name: 'Aldrich & Quinn Wealth',
  plan: 'Enterprise',
  firmId: 'firm_aq_us',
  jurisdiction: 'US',
  region: 'us-east-1',
  seal: 'No. 04 · MMXXVI',
};

export const CURRENT_USER = {
  id: 'usr_sn9',
  name: 'Sierra Navarro',
  email: 'sierra.navarro@aldrichquinn.com',
  role: 'Advisor',
  initials: 'SN',
};

// 14 specialist agents, ordered for the radial dial (arc traversal left → right)
export const AGENTS = [
  { name: 'Vision',             layer: 'Ingestion',    role: 'Document extraction',     abbr: 'Vi' },
  { name: 'Scholar',            layer: 'Ingestion',    role: 'Regulatory RAG',           abbr: 'Sc' },
  { name: 'RetirementPlanner',  layer: 'Deliberation', role: 'Drawdown & income',        abbr: 'Rp' },
  { name: 'TaxStrategist',      layer: 'Deliberation', role: 'Roth · IRMAA · harvest',   abbr: 'Tx' },
  { name: 'RiskAnalyst',        layer: 'Deliberation', role: 'Sequence risk & stress',   abbr: 'Ri' },
  { name: 'Actuarial',          layer: 'Deliberation', role: 'Monte Carlo & survival',   abbr: 'Ac' },
  { name: 'EstatePlanner',      layer: 'Deliberation', role: 'Trusts & transfer',        abbr: 'Es' },
  { name: 'Empath',             layer: 'Deliberation', role: 'Behavioural tone',         abbr: 'Em' },
  { name: 'Debater',            layer: 'Deliberation', role: 'Disagreement resolver',    abbr: 'De' },
  { name: 'SentinelCompliance', layer: 'Governance',   role: 'Hard veto gate',           abbr: 'Sn' },
  { name: 'Historian',          layer: 'Governance',   role: 'Immutable audit',          abbr: 'Hi' },
  { name: 'Forensic',           layer: 'Governance',   role: 'AML · anomaly',            abbr: 'Fo' },
  { name: 'Oracle',             layer: 'Intelligence', role: 'Market surveillance',      abbr: 'Or' },
  { name: 'Concierge',          layer: 'Intelligence', role: 'Lifecycle outreach',       abbr: 'Co' },
];

export const RECENT_SESSIONS = [
  { id: 'CW-2041', clientName: 'Wilson, Jane',       advisorName: 'S. Navarro', status: 'RUNNING',          confidence: null, startedAt: '14:02', jurisdiction: 'US', headline: 'Retirement-income drawdown with staged Roth conversions' },
  { id: 'CW-2040', clientName: 'Carter, Henry',      advisorName: 'S. Shah',    status: 'VETOED',           confidence: 0.42, startedAt: '13:41', jurisdiction: 'US', headline: 'Concentration breach · suitability mismatch' },
  { id: 'CW-2039', clientName: 'Okafor, Amara',      advisorName: 'D. Kumar',   status: 'APPROVED',         confidence: 0.91, startedAt: '13:15', jurisdiction: 'UK', headline: 'Cross-border ISA to Roth equivalency' },
  { id: 'CW-2038', clientName: 'Stewart, Miriam',    advisorName: 'A. Mehta',   status: 'WAITING_APPROVAL', confidence: 0.82, startedAt: '12:58', jurisdiction: 'US', headline: 'Gifting plan with GST exemption window' },
  { id: 'CW-2037', clientName: 'Hollingsworth, J.',  advisorName: 'S. Navarro', status: 'APPROVED',         confidence: 0.87, startedAt: '12:11', jurisdiction: 'US', headline: 'Tax-loss harvesting sequence · IRMAA avoidance' },
  { id: 'CW-2036', clientName: 'Reyes, Paloma',      advisorName: 'L. Yamada',  status: 'APPROVED',         confidence: 0.94, startedAt: '11:44', jurisdiction: 'EU', headline: 'MiFID II-aligned allocation' },
  { id: 'CW-2035', clientName: 'Nguyen, Binh',       advisorName: 'S. Shah',    status: 'ARCHIVED',         confidence: 0.88, startedAt: '10:02', jurisdiction: 'US', headline: 'Annuity ladder for longevity hedge' },
  { id: 'CW-2034', clientName: 'Rosenthal, Ivo',     advisorName: 'D. Kumar',   status: 'FAILED',           confidence: null, startedAt: '09:17', jurisdiction: 'US', headline: 'Actuarial inputs insufficient — retry' },
];

export const KPIS = {
  sessions24h: 142, sessions24hDelta: +12.4,
  vetoRate: 4.8, vetoRateDelta: -0.9,
  syncHealth: 97.2, syncHealthDelta: +0.3,
  avgLatency: 11.4, avgLatencyDelta: -1.8,
  openApprovals: 7,
};

export const INTEGRATIONS = [
  { provider: 'Wealthbox',         category: 'CRM',        status: 'CONNECTED',      lastSync: '2 min',   cursor: 'evt_42918',      health: 99.1 },
  { provider: 'Salesforce FSC',    category: 'CRM',        status: 'WAITING_APPROVAL', lastSync: '18 min',  cursor: 'cdc_81120',      health: 86.3 },
  { provider: 'Orion Advisor',     category: 'PMS',        status: 'RUNNING',        lastSync: 'now',     cursor: 'snap_0428',      health: 95.0 },
  { provider: 'Black Diamond',     category: 'PMS',        status: 'CONNECTED',      lastSync: '4 min',   cursor: 'snap_0427',      health: 98.8 },
  { provider: 'Plaid',             category: 'Aggregator', status: 'FAILED',         lastSync: '2 days',  cursor: '—',              health: 0 },
  { provider: 'Morningstar Direct',category: 'Market',     status: 'CONNECTED',      lastSync: '1 min',   cursor: 'mkt_tick_22811', health: 99.7 },
];

export const COMPLIANCE_ALERTS = [
  { id: 'CA-81', severity: 'VETOED',           code: 'FINRA-2111',       message: 'Suitability mismatch on CW-2040',          time: '13:42' },
  { id: 'CA-80', severity: 'WAITING_APPROVAL', code: 'SEC-206(4)-7',     message: 'Policy version drift detected',            time: '13:08' },
  { id: 'CA-79', severity: 'WAITING_APPROVAL', code: 'MiFID II Art.25',  message: 'Cross-border suitability re-check needed', time: '12:11' },
  { id: 'CA-78', severity: 'ARCHIVED',         code: 'WORM',             message: 'Nightly archive queued (2,104 sessions)',  time: '00:05' },
];

export const APPROVAL_QUEUE = [
  { id: 'APR-221', sessionId: 'CW-2038', client: 'Stewart, Miriam',   reason: 'Gifting exceeds $50,000 — HITL required',   waited: '08m' },
  { id: 'APR-220', sessionId: 'CW-2031', client: 'Osei, Kwame',       reason: 'Outbound note publication',                 waited: '22m' },
  { id: 'APR-219', sessionId: 'CW-2029', client: 'Andersson, Liv',    reason: 'Plaid destructive unlink',                  waited: '41m' },
];

export const CLIENTS = [
  { id: 'cli_01', name: 'Wilson, Jane',        householdId: 'hh_01', age: 62, retireAge: 65, jurisdiction: 'US', risk: 'Moderate',     aum: 2_300_000, need: 140_000 },
  { id: 'cli_02', name: 'Carter, Henry',       householdId: 'hh_02', age: 71, retireAge: 70, jurisdiction: 'US', risk: 'Conservative', aum: 4_100_000, need: 210_000 },
  { id: 'cli_03', name: 'Okafor, Amara',       householdId: 'hh_03', age: 54, retireAge: 62, jurisdiction: 'UK', risk: 'Moderate',     aum: 1_820_000, need:  90_000 },
  { id: 'cli_04', name: 'Hollingsworth, J.',   householdId: 'hh_04', age: 58, retireAge: 66, jurisdiction: 'US', risk: 'Aggressive',   aum: 6_750_000, need: 300_000 },
  { id: 'cli_05', name: 'Reyes, Paloma',       householdId: 'hh_05', age: 49, retireAge: 65, jurisdiction: 'EU', risk: 'Moderate',     aum:   980_000, need:  60_000 },
];

export const OBJECTIVES = ['Retirement', 'Tax', 'Risk', 'Estate', 'Income', 'Insurance'];
export const JURISDICTIONS = ['US', 'UK', 'EU'];
export const RISK_PROFILES = ['Conservative', 'Moderate', 'Aggressive'];

// Scripted deliberation for CW-2041 (Wilson)
export const LIVE_STREAM_SCRIPT = [
  { agent: 'Historian',          stepType: 'ACTION',      content: 'Trace opened. Session CW-2041 registered to firm_aq_us.' },
  { agent: 'Scholar',            stepType: 'ACTION',      content: 'Retrieving citations: IRC §408A, IRS Pub 590-B, Notice 2024-33.' },
  { agent: 'Scholar',            stepType: 'OBSERVATION', content: 'Top-8 passages embedded (cos sim ≥ 0.78). Jurisdiction = US.' },
  { agent: 'RetirementPlanner',  stepType: 'THOUGHT',     content: 'Initial withdrawal 4.2% vs. guardrails 3.6–4.8%. Delaying SSA to 70 adds ~$11,400/yr.' },
  { agent: 'TaxStrategist',      stepType: 'THOUGHT',     content: 'Roth conversion window 62→70. Top-up to 24% bracket avoids IRMAA Tier 2.' },
  { agent: 'RiskAnalyst',        stepType: 'THOUGHT',     content: 'Sequence-of-returns risk elevated first 10y (σ=14.2%). Bond tent 50→30% glidepath.' },
  { agent: 'Actuarial',          stepType: 'OBSERVATION', content: 'Monte Carlo n=10,000 → p10: $1.42M, p50: $3.11M, p90: $5.84M at horizon 30y.' },
  { agent: 'Empath',             stepType: 'THOUGHT',     content: 'Client previously expressed loss aversion post-2022. Frame as an "income floor," not a "withdrawal."' },
  { agent: 'RetirementPlanner',  stepType: 'RESPONSE',    content: 'Recommend 4.2% initial, dynamic guardrails, SSA delay to 70, bond-tent glidepath.' },
  { agent: 'TaxStrategist',      stepType: 'RESPONSE',    content: 'Staged Roth conversions $85k/yr; harvest losses ≥ 7%; QCD at age 70½.' },
  { agent: 'RiskAnalyst',        stepType: 'RESPONSE',    content: 'Approve with caveat: maintain a two-year cash floor; rebalance on 20% drift.' },
  { agent: 'Actuarial',          stepType: 'RESPONSE',    content: 'Plan survival probability 92.4% at 30y. Break-even on SSA delay at age 82.3.' },
  { agent: 'SentinelCompliance', stepType: 'ACTION',      content: 'Running suitability (FINRA 2111), disclosure (Reg BI), and concentration checks.' },
  { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'No blocking violations. Disclosures present. Concentration within policy.' },
  { agent: 'SentinelCompliance', stepType: 'RESPONSE',    content: 'APPROVED. Policy v2026-04. Eligible for WORM export.' },
  { agent: 'Historian',          stepType: 'ACTION',      content: 'Persisted 14 trace steps, 7 votes, compliance decision. trace_id = 7af1-…-c02.' },
];

export const AUDIT_SESSIONS = [
  { id: 'CW-2040', clientName: 'Carter, Henry',       advisorName: 'S. Shah',    outcome: 'VETOED',   startedAt: '2026-04-28  13:41', wormStatus: 'WAITING_APPROVAL', jurisdiction: 'US' },
  { id: 'CW-2037', clientName: 'Hollingsworth, J.',   advisorName: 'S. Navarro', outcome: 'APPROVED', startedAt: '2026-04-28  12:11', wormStatus: 'ARCHIVED', jurisdiction: 'US' },
  { id: 'CW-2035', clientName: 'Nguyen, Binh',        advisorName: 'S. Shah',    outcome: 'ARCHIVED', startedAt: '2026-04-28  10:02', wormStatus: 'ARCHIVED', jurisdiction: 'US' },
  { id: 'CW-2034', clientName: 'Rosenthal, Ivo',      advisorName: 'D. Kumar',   outcome: 'FAILED',   startedAt: '2026-04-28  09:17', wormStatus: 'WAITING_APPROVAL', jurisdiction: 'US' },
  { id: 'CW-2029', clientName: 'Andersson, Liv',      advisorName: 'L. Yamada',  outcome: 'APPROVED', startedAt: '2026-04-27  16:44', wormStatus: 'ARCHIVED', jurisdiction: 'EU' },
  { id: 'CW-2021', clientName: 'Reyes, Paloma',       advisorName: 'L. Yamada',  outcome: 'APPROVED', startedAt: '2026-04-27  11:44', wormStatus: 'ARCHIVED', jurisdiction: 'EU' },
  { id: 'CW-2018', clientName: 'Okafor, Amara',       advisorName: 'D. Kumar',   outcome: 'APPROVED', startedAt: '2026-04-27  09:02', wormStatus: 'ARCHIVED', jurisdiction: 'UK' },
];

export const FEATURE_FLAGS = [
  { key: 'debater_agent',       enabled: true,  desc: 'Meta-agent activated on disputed council cases.' },
  { key: 'ws_visualizer',       enabled: true,  desc: 'Real-time thought stream over WebSocket.' },
  { key: 'worm_export_ui',      enabled: true,  desc: 'Expose WORM archive references in the audit viewer.' },
  { key: 'saml_sso',            enabled: true,  desc: 'SAML 2.0 federated identity.' },
  { key: 'langgraph_debate',    enabled: false, desc: 'LangGraph4j cyclic debate graph (Phase 3).' },
  { key: 'firm_hooks',          enabled: true,  desc: 'Pre-deliberation firm API hooks.' },
  { key: 'enterprise_admin',    enabled: true,  desc: 'Multi-entity admin controls.' },
  { key: 'forensic_agent',      enabled: false, desc: 'AML + elder-abuse anomaly detection (Phase 4).' },
];

export const USERS = [
  { id: 'u1', name: 'Sierra Navarro', email: 'sierra.navarro@aldrichquinn.com', role: 'Advisor',    lastLogin: '14:02', status: 'APPROVED' },
  { id: 'u2', name: 'Darian Kumar',   email: 'darian.kumar@aldrichquinn.com',   role: 'Advisor',    lastLogin: '13:44', status: 'APPROVED' },
  { id: 'u3', name: 'Sana Shah',      email: 'sana.shah@aldrichquinn.com',      role: 'Advisor',    lastLogin: '13:41', status: 'APPROVED' },
  { id: 'u4', name: 'Lila Yamada',    email: 'lila.yamada@aldrichquinn.com',    role: 'Advisor',    lastLogin: '11:44', status: 'APPROVED' },
  { id: 'u5', name: 'Priya Rao',      email: 'priya.rao@aldrichquinn.com',      role: 'Compliance', lastLogin: '14:00', status: 'APPROVED' },
  { id: 'u6', name: 'Marcus Orrin',   email: 'marcus.orrin@aldrichquinn.com',   role: 'Admin',      lastLogin: '09:12', status: 'APPROVED' },
];

export const QUOTAS = [
  { label: 'Council sessions / month', used: 4280,  limit: 10000 },
  { label: 'Documents ingested',       used: 18240, limit: 50000 },
  { label: 'Seats',                    used: 34,    limit: 50 },
  { label: 'Storage (GB)',             used: 412,   limit: 1000 },
];
