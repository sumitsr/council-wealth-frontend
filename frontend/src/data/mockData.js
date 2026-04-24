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
