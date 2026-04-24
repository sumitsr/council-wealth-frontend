import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShieldCheck, ShieldSlash, Pause, Play, Export, CircleNotch, CaretRight,
  ChartLineUp, Warning, CheckCircle, XCircle, Brain, Broadcast
} from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { AGENTS, LIVE_STREAM_SCRIPT, RECENT_SESSIONS, CLIENTS } from '@/data/mockData';

const LAYER_ORDER = ['INGESTION', 'DELIBERATION', 'GOVERNANCE', 'INTELLIGENCE'];
const LAYER_LABELS = {
  INGESTION: 'Ingestion',
  DELIBERATION: 'Deliberation',
  GOVERNANCE: 'Governance',
  INTELLIGENCE: 'Intelligence',
};

function pad(n) { return String(n).padStart(2, '0'); }
function formatElapsed(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${pad(m)}:${pad(s)}`;
}
function nowClock() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function AgentCard({ agent, state, confidence, summary, highlight }) {
  const isRunning = state === 'RUNNING';
  const isCompleted = state === 'COMPLETED';
  const isVetoed = state === 'VETOED';
  const borderColor = isVetoed ? 'border-cw-vetoed/50' : isRunning ? 'border-cw-running/45' : isCompleted ? 'border-white/20' : 'border-white/10';
  const bg = isVetoed ? 'bg-[rgba(220,38,38,0.06)]' : isRunning ? 'bg-cw-elevated' : 'bg-cw-surface';

  return (
    <div
      className={[
        'relative rounded-sm p-3 transition-colors overflow-hidden',
        'border', borderColor, bg,
        isRunning ? 'cw-beam-border' : '',
        highlight ? 'ring-1 ring-white/10' : '',
      ].join(' ')}
      data-testid={`agent-card-${agent.name}`}
    >
      {isRunning && (
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
          <div className="h-full w-1/3 bg-cw-running cw-running-bar" />
        </div>
      )}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <div className="font-display text-[13px] font-medium text-white/95 truncate">{agent.name}</div>
          <div className="font-mono text-[9px] tracking-wider text-white/35 uppercase">{agent.role}</div>
        </div>
        {isVetoed ? (
          <ShieldSlash size={14} weight="duotone" className="text-cw-vetoed shrink-0" />
        ) : isCompleted ? (
          <CheckCircle size={14} weight="duotone" className="text-cw-approved shrink-0" />
        ) : isRunning ? (
          <CircleNotch size={14} weight="bold" className="text-cw-running shrink-0 animate-spin" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
        )}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <StateBadge state={state} size="sm" />
        {confidence != null && (
          <span className="font-mono text-[10px] text-white/60">conf <span className="text-white/95">{confidence.toFixed(2)}</span></span>
        )}
      </div>
      {summary && (
        <div className="text-[11px] text-white/55 leading-snug line-clamp-2 mt-1">{summary}</div>
      )}
    </div>
  );
}

export default function LiveSession() {
  const { sessionId = 'CW-2041' } = useParams();
  const session = RECENT_SESSIONS.find((s) => s.id === sessionId) || RECENT_SESSIONS[0];
  const client = CLIENTS[0];

  const isVetoCase = session.status === 'VETOED';
  const [paused, setPaused] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(108);
  const [streamIndex, setStreamIndex] = React.useState(isVetoCase ? LIVE_STREAM_SCRIPT.length : 8);
  const [agentStates, setAgentStates] = React.useState(() => {
    // initial states
    const map = {};
    AGENTS.forEach((a) => { map[a.name] = { state: 'QUEUED', confidence: null, summary: null }; });
    if (isVetoCase) {
      // final veto state
      ['Scholar','RetirementPlanner','TaxStrategist','Actuarial','Empath','Historian'].forEach((n) => map[n] = { state: 'COMPLETED', confidence: 0.8, summary: 'Completed.' });
      map['RiskAnalyst'] = { state: 'COMPLETED', confidence: 0.42, summary: 'Sequence risk exceeds stated moderate profile; flagged.' };
      map['SentinelCompliance'] = { state: 'VETOED', confidence: null, summary: 'FINRA 2111 suitability & concentration breach.' };
      return map;
    }
    // running default: first batch completed, Sentinel running
    map['Historian']          = { state: 'COMPLETED', confidence: 1.00, summary: 'Trace opened and persisted.' };
    map['Scholar']            = { state: 'COMPLETED', confidence: 0.92, summary: '8 citations retrieved. US jurisdiction.' };
    map['RetirementPlanner']  = { state: 'COMPLETED', confidence: 0.87, summary: '4.2% initial, SSA delay to 70, bond tent glidepath.' };
    map['TaxStrategist']      = { state: 'COMPLETED', confidence: 0.91, summary: 'Staged Roth $85k/yr, QCD at 70½.' };
    map['RiskAnalyst']        = { state: 'COMPLETED', confidence: 0.85, summary: 'Maintain 2y cash floor; 20% drift rebalance.' };
    map['Actuarial']          = { state: 'COMPLETED', confidence: 0.90, summary: '92.4% survival probability at 30y.' };
    map['Empath']             = { state: 'COMPLETED', confidence: 0.73, summary: 'Frame as income floor, not withdrawal.' };
    map['SentinelCompliance'] = { state: 'RUNNING',   confidence: null, summary: 'Running suitability + disclosure checks.' };
    return map;
  });

  // Tick clock
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Stream advance
  React.useEffect(() => {
    if (paused || isVetoCase) return;
    if (streamIndex >= LIVE_STREAM_SCRIPT.length) return;
    const t = setTimeout(() => {
      const next = LIVE_STREAM_SCRIPT[streamIndex];
      setAgentStates((prev) => {
        const clone = { ...prev };
        const cur = clone[next.agent] || { state: 'QUEUED' };
        if (next.stepType === 'THOUGHT' || next.stepType === 'ACTION') {
          if (cur.state === 'QUEUED') clone[next.agent] = { ...cur, state: 'RUNNING', summary: next.content };
          else clone[next.agent] = { ...cur, summary: next.content };
        } else if (next.stepType === 'RESPONSE') {
          const conf = next.agent === 'SentinelCompliance' ? null
                       : next.agent === 'Empath' ? 0.73
                       : next.agent === 'Actuarial' ? 0.90
                       : 0.85 + Math.random() * 0.08;
          const state = next.agent === 'SentinelCompliance'
            ? (next.content.startsWith('APPROVED') ? 'COMPLETED' : 'VETOED')
            : 'COMPLETED';
          clone[next.agent] = { state, confidence: conf, summary: next.content };
        } else if (next.stepType === 'OBSERVATION') {
          clone[next.agent] = { ...cur, state: 'RUNNING', summary: next.content };
        }
        return clone;
      });
      setStreamIndex((i) => i + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [streamIndex, paused, isVetoCase]);

  // compute consensus
  const votes = Object.entries(agentStates)
    .filter(([_, v]) => v.state === 'COMPLETED' && v.confidence != null)
    .map(([_, v]) => v.confidence);
  const consensus = votes.length ? votes.reduce((a, b) => a + b, 0) / votes.length : 0;
  const vetoed = isVetoCase || Object.values(agentStates).some((v) => v.state === 'VETOED');
  const completedCount = Object.values(agentStates).filter((v) => v.state === 'COMPLETED' || v.state === 'VETOED').length;

  const sessionStatus = vetoed ? 'VETOED' : (streamIndex >= LIVE_STREAM_SCRIPT.length ? 'APPROVED' : 'RUNNING');

  // Grouped agents
  const grouped = LAYER_ORDER.map((layer) => ({
    layer,
    agents: AGENTS.filter((a) => a.layer === layer),
  }));

  // Stream rendering: all items already streamed
  const streamed = isVetoCase
    ? LIVE_STREAM_SCRIPT.slice(0, 6).concat([
        { agent: 'RiskAnalyst', stepType: 'OBSERVATION', content: 'Sequence risk exceeds stated MODERATE profile.' },
        { agent: 'SentinelCompliance', stepType: 'ACTION', content: 'Evaluating FINRA 2111 suitability and concentration.' },
        { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'Concentration threshold exceeded (single-issuer 42%).' },
        { agent: 'SentinelCompliance', stepType: 'RESPONSE', content: 'VETOED. Policy v2026-04. Reason: suitability & concentration.' },
      ])
    : LIVE_STREAM_SCRIPT.slice(0, streamIndex);

  return (
    <AppShell
      title={`Session ${session.id} · ${session.clientName}`}
      subtitle="Live Council Deliberation"
      hideRightRail={false}
      rightRail={
        <>
          <RailSection label="Client Snapshot">
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between"><span className="text-white/50">Name</span><span className="text-white/95">{client.name}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Age / Retire</span><span className="font-mono text-white/95">{client.age} / {client.retireAge}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Risk</span><span className="font-mono text-white/95">{client.risk}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Jurisdiction</span><span className="font-mono text-white/95">{client.jurisdiction}</span></div>
              <div className="flex justify-between"><span className="text-white/50">AUM</span><span className="font-mono text-white/95">${(client.aum/1e6).toFixed(2)}M</span></div>
              <div className="flex justify-between"><span className="text-white/50">Need</span><span className="font-mono text-white/95">${(client.need/1000).toFixed(0)}k/yr</span></div>
            </div>
          </RailSection>
          <RailSection label="Session Metadata">
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between"><span className="text-white/50">Session</span><span className="font-mono text-white/95">{session.id}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Advisor</span><span className="text-white/95">S. Navarro</span></div>
              <div className="flex justify-between"><span className="text-white/50">Firm</span><span className="text-white/95">Aldrich & Quinn</span></div>
              <div className="flex justify-between"><span className="text-white/50">Started</span><span className="font-mono text-white/95">{session.startedAt}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Trace</span><span className="font-mono text-white/95">7af1…c02</span></div>
              <div className="flex justify-between"><span className="text-white/50">Workflow</span><span className="font-mono text-white/95">AGENT_FANOUT</span></div>
              <div className="flex justify-between"><span className="text-white/50">Model</span><span className="font-mono text-white/95">gpt-5.2-pro</span></div>
            </div>
          </RailSection>
          <RailSection label="Alerts" icon={Warning}>
            {vetoed ? (
              <ul className="space-y-2 text-[12px]">
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-vetoed mt-1.5" /><span className="text-white/80">Concentration 42% &gt; policy 25%</span></li>
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-vetoed mt-1.5" /><span className="text-white/80">Suitability mismatch · risk MODERATE</span></li>
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-waiting mt-1.5" /><span className="text-white/80">Disclosure language insufficient</span></li>
              </ul>
            ) : (
              <ul className="space-y-2 text-[12px]">
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /><span className="text-white/80">No blocking compliance findings</span></li>
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /><span className="text-white/80">Estate docs not required</span></li>
                <li className="flex gap-2 items-start"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /><span className="text-white/80">Actuarial inputs complete</span></li>
              </ul>
            )}
          </RailSection>
        </>
      }
    >
      {/* Compliance Banner — always above the fold */}
      <ComplianceBanner status={vetoed ? 'VETOED' : sessionStatus === 'APPROVED' ? 'APPROVED' : 'REVIEWING'} />

      {/* Consensus header */}
      <section className="mt-4 rounded-sm border border-white/10 bg-cw-surface overflow-hidden" data-testid="consensus-header">
        <div className="grid grid-cols-[1fr_auto]">
          <div className="p-5 border-r border-white/10 cw-grid-bg">
            <div className="flex items-center gap-2 mb-1.5">
              <Broadcast size={12} className="text-cw-running" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-cw-running uppercase">Council Consensus</span>
              <StateBadge state={sessionStatus} size="sm" pulse={sessionStatus === 'RUNNING'} />
            </div>
            <h2 className="font-display text-[22px] leading-tight tracking-tight text-white/95 mb-1.5">
              {vetoed
                ? 'Blocked by SentinelCompliance — recommendation not eligible for delivery'
                : 'Phased retirement-income strategy with staged Roth conversions'}
            </h2>
            <p className="text-[12px] text-white/55 max-w-2xl leading-relaxed">
              {vetoed
                ? 'Suitability mismatch (FINRA 2111), concentration breach (single-issuer 42% > 25% policy), and disclosure deficiency. Review or request revision before any outbound communication.'
                : 'Weighted consensus across Retirement, Tax, Risk, Actuarial, and Empath. Sentinel clearance finalizing. Eligible for WORM export on approval.'}
            </p>
          </div>
          <div className="p-5 w-[280px] flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-2">Confidence</div>
              <div className="flex items-baseline gap-1.5">
                <span className={`font-mono text-[40px] leading-none tracking-tight ${vetoed ? 'text-cw-vetoed' : 'text-white/95'}`}>
                  {vetoed ? '0.42' : consensus.toFixed(2)}
                </span>
                <span className="font-mono text-[13px] text-white/30">/1.00</span>
              </div>
              <div className="h-1 mt-3 bg-white/[0.06] rounded-sm overflow-hidden">
                <div className={`h-full ${vetoed ? 'bg-cw-vetoed' : 'bg-gradient-to-r from-cw-running to-cw-approved'}`}
                     style={{ width: `${(vetoed ? 0.42 : consensus) * 100}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
              <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                <div className="font-mono text-[10px] text-white/40">Agents</div>
                <div className="font-mono text-[15px] text-white/95">{completedCount} / 14</div>
              </div>
              <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                <div className="font-mono text-[10px] text-white/40">Elapsed</div>
                <div className="font-mono text-[15px] text-white/95">{formatElapsed(elapsed)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/10 bg-[#101010]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaused((p) => !p)}
              data-testid="btn-stream-toggle"
              className="h-7 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/25 text-[11px] text-white/85 flex items-center gap-1.5"
            >
              {paused ? <Play size={11} weight="fill" /> : <Pause size={11} weight="fill" />}
              {paused ? 'Resume stream' : 'Pause stream'}
            </button>
            <span className="font-mono text-[10px] text-white/40">
              ws://cw/{session.id} · {streamed.length} events · backpressure <span className="text-cw-approved">ok</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated text-[11px] text-white/80 flex items-center gap-1.5" data-testid="btn-export">
              <Export size={11} /> Export trace
            </button>
            <Link to="/compliance/audit" className="h-7 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated text-[11px] text-white/80 flex items-center gap-1.5">
              Open in Audit <CaretRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* Agent vote grid */}
      <section className="mt-6" data-testid="agent-grid">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Agent Votes</span>
            <span className="font-mono text-[10px] text-white/30">4 layers · {AGENTS.length} specialists</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-white/50">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cw-queued" />QUEUED</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cw-running cw-pulse" />RUNNING</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved" />COMPLETED</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cw-vetoed" />VETOED</span>
          </div>
        </div>
        <div className="space-y-5">
          {grouped.map((g) => (
            <div key={g.layer}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">{LAYER_LABELS[g.layer]}</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {g.agents.map((a) => {
                  const st = agentStates[a.name] || { state: 'QUEUED' };
                  return (
                    <AgentCard
                      key={a.name}
                      agent={a}
                      state={st.state}
                      confidence={st.confidence}
                      summary={st.summary}
                      highlight={a.name === 'SentinelCompliance'}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Thought stream + Recommendation tabs */}
      <section className="mt-6 grid grid-cols-12 gap-6">
        <ThoughtStream streamed={streamed} paused={paused} live={sessionStatus === 'RUNNING'} />
        <RecommendationPanel vetoed={vetoed} />
      </section>
    </AppShell>
  );
}

// ---------------- Sub-components ----------------

function ComplianceBanner({ status }) {
  const styles = {
    APPROVED: { icon: ShieldCheck, color: 'text-cw-approved', border: 'border-cw-approved/40', bg: 'bg-[rgba(16,185,129,0.08)]', label: 'Compliance · APPROVED' },
    REVIEWING:{ icon: ShieldCheck, color: 'text-cw-running',  border: 'border-cw-running/40',  bg: 'bg-[rgba(59,130,246,0.08)]', label: 'Compliance · UNDER REVIEW' },
    VETOED:   { icon: ShieldSlash, color: 'text-cw-vetoed',   border: 'border-cw-vetoed/50',   bg: 'bg-[rgba(220,38,38,0.10)]',  label: 'Compliance · VETOED BY SENTINEL' },
  }[status] || {};
  const Icon = styles.icon;
  return (
    <div className={`rounded-sm border ${styles.border} ${styles.bg} px-4 py-3 flex items-center justify-between`} data-testid="compliance-banner">
      <div className="flex items-center gap-3">
        <Icon size={18} weight="duotone" className={styles.color} />
        <div>
          <div className={`font-mono text-[10px] tracking-[0.25em] uppercase ${styles.color}`}>{styles.label}</div>
          <div className="text-[13px] text-white/95 leading-tight mt-0.5">
            {status === 'VETOED'
              ? 'Recommendation is NOT eligible for delivery. Policy v2026-04 · FINRA 2111 · SEC Reg BI'
              : status === 'APPROVED'
                ? 'Output eligible for delivery. Historian persisted. WORM export queued.'
                : 'Sentinel evaluating suitability, disclosure, and concentration policies.'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === 'VETOED' ? (
          <>
            <button className="h-8 px-3 rounded-sm border border-white/15 bg-cw-elevated text-[12px] text-white/85 hover:border-white/25">Request revision</button>
            <button className="h-8 px-3 rounded-sm border border-cw-vetoed/40 text-cw-vetoed text-[12px] hover:bg-cw-vetoed/10">Escalate compliance</button>
          </>
        ) : (
          <>
            <span className="font-mono text-[10px] text-white/40">policy v2026-04</span>
            <button className="h-8 px-3 rounded-sm border border-white/15 bg-cw-elevated text-[12px] text-white/85 hover:border-white/25" data-testid="btn-view-policy">View policy</button>
          </>
        )}
      </div>
    </div>
  );
}

function ThoughtStream({ streamed, paused, live }) {
  const bottomRef = React.useRef(null);
  React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [streamed.length]);

  const stepColor = {
    THOUGHT: 'text-cw-archived',
    ACTION: 'text-cw-running',
    OBSERVATION: 'text-cw-waiting',
    RESPONSE: 'text-cw-approved',
  };

  return (
    <div className="col-span-8 rounded-sm border border-white/10 bg-[#0c0c0c] overflow-hidden" data-testid="thought-stream">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#101010]">
        <div className="flex items-center gap-2">
          <Brain size={13} weight="duotone" className="text-cw-archived" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">Real-time Thought Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${live && !paused ? 'bg-cw-running cw-pulse' : 'bg-white/25'}`} />
          <span className="font-mono text-[10px] tracking-wider text-white/50">{live ? (paused ? 'PAUSED' : 'STREAMING') : 'REPLAY'}</span>
        </div>
      </div>
      <div className="h-[440px] overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.75]">
        {streamed.length === 0 && <div className="text-white/30">Awaiting first event…</div>}
        {streamed.map((e, i) => (
          <div key={i} className="cw-stream-line flex gap-3" data-testid={`stream-line-${i}`}>
            <span className="text-white/30 shrink-0 w-16">{e.ts || nowClockOffset(i)}</span>
            <span className={`shrink-0 w-[110px] truncate text-white/95`}>{e.agent}</span>
            <span className={`shrink-0 w-[90px] ${stepColor[e.stepType]}`}>{e.stepType}</span>
            <span className="text-white/70 flex-1">{e.content}</span>
          </div>
        ))}
        {live && !paused && (
          <div className="cw-stream-line flex gap-3 text-white/40">
            <span className="w-16">{nowClock()}</span>
            <span className="w-[110px]">CouncilOrchestrator</span>
            <span className="w-[90px] text-cw-running">STREAM</span>
            <span className="flex-1 cw-cursor">awaiting next event</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
function nowClockOffset(i) {
  const base = 14 * 3600 + 2 * 60 + 11; // 14:02:11
  const t = base + i * 4;
  return `${pad(Math.floor(t/3600) % 24)}:${pad(Math.floor(t/60) % 60)}:${pad(t % 60)}`;
}

function RecommendationPanel({ vetoed }) {
  const [tab, setTab] = React.useState('summary');
  const TABS = [
    { k: 'summary', label: 'Summary' },
    { k: 'actions', label: 'Actions' },
    { k: 'risks', label: 'Risks' },
    { k: 'audit', label: 'Audit' },
  ];

  if (vetoed) {
    return (
      <div className="col-span-4 rounded-sm border border-cw-vetoed/30 bg-[rgba(220,38,38,0.05)] p-5" data-testid="recommendation-panel">
        <div className="flex items-center gap-2 mb-2">
          <XCircle size={16} className="text-cw-vetoed" weight="duotone" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-cw-vetoed uppercase">Blocked Output</span>
        </div>
        <h3 className="font-display text-[18px] text-white/95 leading-tight mb-2">Delivery not permitted</h3>
        <p className="text-[12px] text-white/65 mb-3 leading-relaxed">
          SentinelCompliance blocked this session. The advisor-safe rejection below is available, and the full trace remains in Historian for review.
        </p>
        <ul className="space-y-1.5 text-[12px] text-white/80 mb-4">
          <li className="flex gap-2"><span className="text-cw-vetoed">·</span> FINRA 2111 suitability mismatch</li>
          <li className="flex gap-2"><span className="text-cw-vetoed">·</span> Concentration 42% &gt; 25% policy</li>
          <li className="flex gap-2"><span className="text-cw-vetoed">·</span> Disclosure language insufficient</li>
        </ul>
        <button className="w-full h-9 rounded-sm border border-white/15 bg-cw-elevated text-[12px] text-white/85 hover:border-white/30">
          Request revision
        </button>
      </div>
    );
  }

  return (
    <div className="col-span-4 rounded-sm border border-white/10 bg-cw-surface flex flex-col" data-testid="recommendation-panel">
      <div className="flex border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            data-testid={`rec-tab-${t.k}`}
            className={[
              'flex-1 h-10 text-[12px] font-medium tracking-wide border-b-2 transition-colors',
              tab === t.k ? 'text-white/95 border-white' : 'text-white/50 border-transparent hover:text-white/80',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5 text-[12px] leading-relaxed text-white/80 flex-1">
        {tab === 'summary' && (
          <div className="space-y-3">
            <p className="text-[13px] text-white/95">
              Phased retirement-income approach: <span className="font-mono text-white">4.2%</span> initial withdrawal with dynamic guardrails, SSA delayed to 70, and a 10-year bond-tent glidepath (50% → 30% bonds).
            </p>
            <p>
              Stack tax-efficient income with staged Roth conversions sized to the 24% bracket (IRMAA Tier 2 avoidance) and plan QCDs at 70½.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="rounded-sm border border-white/10 bg-cw-bg p-2.5">
                <div className="font-mono text-[10px] text-white/40">p50 terminal</div>
                <div className="font-mono text-[16px] text-white/95">$3.11M</div>
              </div>
              <div className="rounded-sm border border-white/10 bg-cw-bg p-2.5">
                <div className="font-mono text-[10px] text-white/40">Plan survival</div>
                <div className="font-mono text-[16px] text-cw-approved">92.4%</div>
              </div>
            </div>
          </div>
        )}
        {tab === 'actions' && (
          <ul className="space-y-2.5">
            {[
              'Open Roth conversion schedule: $85k/yr through age 70',
              'Delay Social Security claim to age 70 (base +$11,400/yr)',
              'Establish 2-year cash floor in short-duration treasuries',
              'Set portfolio drift alerts at ±20% with rebalancing workflow',
              'Schedule QCD at age 70½ aligned with RMD start',
            ].map((a, i) => (
              <li key={i} className="flex gap-2"><CaretRight size={12} className="text-cw-running mt-0.5 shrink-0" /><span>{a}</span></li>
            ))}
          </ul>
        )}
        {tab === 'risks' && (
          <ul className="space-y-2.5">
            {[
              { t: 'Sequence-of-returns risk elevated first 10y · σ=14.2%', c: 'waiting' },
              { t: 'IRMAA bracket crossing if income spikes', c: 'waiting' },
              { t: 'Longevity beyond age 95 · plan stress inconclusive', c: 'warn' },
              { t: 'Behavioral drawdown aversion post-2022 (Empath)', c: 'info' },
            ].map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${r.c === 'waiting' ? 'bg-cw-waiting' : r.c === 'warn' ? 'bg-cw-vetoed' : 'bg-cw-running'}`} />
                <span>{r.t}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'audit' && (
          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between"><span className="text-white/50">Trace ID</span><span className="text-white/90">7af1-9b02-c02a</span></div>
            <div className="flex justify-between"><span className="text-white/50">Steps</span><span className="text-white/90">14 THOUGHT · 6 ACTION · 5 OBSERVATION · 7 RESPONSE</span></div>
            <div className="flex justify-between"><span className="text-white/50">Models</span><span className="text-white/90">gpt-5.2-pro · claude-4.5-sonnet</span></div>
            <div className="flex justify-between"><span className="text-white/50">PII redacted</span><span className="text-cw-approved">100%</span></div>
            <div className="flex justify-between"><span className="text-white/50">WORM eligible</span><span className="text-cw-approved">yes</span></div>
            <div className="flex justify-between"><span className="text-white/50">Retention</span><span className="text-white/90">7 years · SEC 17a-4</span></div>
            <Link to="/compliance/audit" className="mt-3 inline-flex items-center gap-1.5 text-cw-running hover:underline">Open in audit viewer <CaretRight size={11} /></Link>
          </div>
        )}
      </div>
    </div>
  );
}
