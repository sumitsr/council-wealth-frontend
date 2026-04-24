import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, ShieldSlash, Pause, Play, Export, CaretRight,
  Brain, Broadcast, MagnifyingGlassPlus
} from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import RadialCommittee from '@/components/shared/RadialCommittee';
import AgentDrillModal from '@/components/shared/AgentDrillModal';
import ReplayScrubber from '@/components/shared/ReplayScrubber';
import { useToast } from '@/components/shared/ToastProvider';
import { AGENTS, LIVE_STREAM_SCRIPT, RECENT_SESSIONS, CLIENTS } from '@/data/mockData';

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
function nowClockOffset(i) {
  const base = 14 * 3600 + 2 * 60 + 11;
  const t = base + i * 4;
  return `${pad(Math.floor(t / 3600) % 24)}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`;
}

// Pure derivation of agent states from a slice of the stream script.
// This makes scrubbing predictable: any streamIndex maps to a deterministic state.
function deriveAgentStates(scriptSlice, isVetoCase) {
  const map = {};
  AGENTS.forEach((a) => { map[a.name] = { state: 'QUEUED', confidence: null, summary: null }; });
  scriptSlice.forEach((nx) => {
    const cur = map[nx.agent] || { state: 'QUEUED' };
    if (nx.stepType === 'THOUGHT' || nx.stepType === 'ACTION' || nx.stepType === 'OBSERVATION') {
      if (cur.state === 'QUEUED') map[nx.agent] = { ...cur, state: 'RUNNING', summary: nx.content };
      else map[nx.agent] = { ...cur, summary: nx.content };
    } else if (nx.stepType === 'RESPONSE') {
      const conf = nx.agent === 'SentinelCompliance' ? null
                   : nx.agent === 'Empath' ? 0.73
                   : nx.agent === 'Actuarial' ? 0.90
                   : nx.agent === 'RiskAnalyst' && isVetoCase ? 0.42
                   : 0.87;
      const state = nx.agent === 'SentinelCompliance'
        ? (nx.content.startsWith('APPROVED') ? 'COMPLETED' : 'VETOED')
        : 'COMPLETED';
      map[nx.agent] = { state, confidence: conf, summary: nx.content };
    }
  });
  return map;
}

export default function LiveSession() {
  const { sessionId = 'CW-2041' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { push } = useToast();
  const session = RECENT_SESSIONS.find((s) => s.id === sessionId) || RECENT_SESSIONS[0];
  const client = CLIENTS[0];
  const isVetoCase = session.status === 'VETOED';

  // For vetoed case use a slightly different script that ends in VETO
  const effectiveScript = React.useMemo(() => {
    if (!isVetoCase) return LIVE_STREAM_SCRIPT;
    return LIVE_STREAM_SCRIPT.slice(0, 6).concat([
      { agent: 'RiskAnalyst', stepType: 'OBSERVATION', content: 'Sequence risk exceeds stated MODERATE profile.' },
      { agent: 'RiskAnalyst', stepType: 'RESPONSE',    content: 'Confidence 0.42 — concentration breach flagged.' },
      { agent: 'SentinelCompliance', stepType: 'ACTION', content: 'Evaluating FINRA 2111 suitability and concentration.' },
      { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'Concentration threshold exceeded (single-issuer 42%).' },
      { agent: 'SentinelCompliance', stepType: 'RESPONSE', content: 'VETOED. Policy v2026-04. Reason: suitability & concentration.' },
    ]);
  }, [isVetoCase]);

  const totalScriptLen = effectiveScript.length;

  const [paused, setPaused] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(108);
  const [streamIndex, setStreamIndex] = React.useState(isVetoCase ? totalScriptLen : 8);
  const [focusedAgent, setFocusedAgent] = React.useState(null);
  const [lastPushedIndex, setLastPushedIndex] = React.useState(streamIndex); // toast dedupe

  // Derived agent states — updates whenever streamIndex changes (drives scrubbing)
  const agentStates = React.useMemo(
    () => deriveAgentStates(effectiveScript.slice(0, streamIndex), isVetoCase),
    [effectiveScript, streamIndex, isVetoCase]
  );

  // Deep-link focus via ?agent=Name
  React.useEffect(() => {
    const a = searchParams.get('agent');
    if (a) {
      const agent = AGENTS.find((x) => x.name === a);
      if (agent) setFocusedAgent(agent);
    }
  }, [searchParams]);

  // Elapsed ticker
  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Stream advancer — uses pure derivation
  React.useEffect(() => {
    if (paused) return;
    if (streamIndex >= totalScriptLen) return;
    const t = setTimeout(() => {
      const justSeen = effectiveScript[streamIndex];
      setStreamIndex((i) => i + 1);
      // Toast on Sentinel APPROVED transition (only when advancing forward, dedupe)
      if (
        !isVetoCase &&
        justSeen?.agent === 'SentinelCompliance' &&
        justSeen?.stepType === 'RESPONSE' &&
        justSeen?.content?.startsWith('APPROVED') &&
        streamIndex !== lastPushedIndex
      ) {
        setLastPushedIndex(streamIndex);
        push({ variant: 'success', title: 'Sentinel · APPROVED', desc: 'Session eligible for delivery and WORM export.' });
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [streamIndex, paused, isVetoCase, push, totalScriptLen, effectiveScript, lastPushedIndex]);

  const votes = Object.values(agentStates).filter((v) => v.state === 'COMPLETED' && v.confidence != null).map((v) => v.confidence);
  const consensus = votes.length ? votes.reduce((a, b) => a + b, 0) / votes.length : 0;
  const vetoed = isVetoCase && streamIndex >= totalScriptLen ? true : Object.values(agentStates).some((v) => v.state === 'VETOED');
  const completedCount = Object.values(agentStates).filter((v) => v.state === 'COMPLETED' || v.state === 'VETOED').length;
  const sessionStatus = vetoed ? 'VETOED' : (streamIndex >= totalScriptLen ? 'APPROVED' : 'RUNNING');

  const streamed = effectiveScript.slice(0, streamIndex);

  const openAgent = (a) => setFocusedAgent(a);
  const closeAgent = () => {
    setFocusedAgent(null);
    if (searchParams.get('agent')) {
      searchParams.delete('agent');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <AppShell
      title={`Session ${session.id} · ${session.clientName}`}
      subtitle="Live Council Deliberation"
      rightRail={
        <>
          <RailSection label="Client Snapshot">
            <div className="space-y-1.5 text-[12px]">
              <Row k="Name" v={client.name} />
              <Row k="Age / Retire" v={`${client.age} / ${client.retireAge}`} mono />
              <Row k="Risk" v={client.risk} mono />
              <Row k="Jurisdiction" v={client.jurisdiction} mono />
              <Row k="AUM" v={`$${(client.aum/1e6).toFixed(2)}M`} mono />
              <Row k="Need" v={`$${(client.need/1000).toFixed(0)}k/yr`} mono />
            </div>
            <Link to={`/clients/${client.id}`} className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-cw-running hover:underline">
              OPEN PROFILE <CaretRight size={10} />
            </Link>
          </RailSection>
          <RailSection label="Session Metadata">
            <div className="space-y-1.5 text-[12px]">
              <Row k="Session" v={session.id} mono />
              <Row k="Advisor" v="S. Navarro" />
              <Row k="Firm" v="Aldrich & Quinn" />
              <Row k="Started" v={session.startedAt} mono />
              <Row k="Trace" v="7af1…c02" mono />
              <Row k="Workflow" v="AGENT_FANOUT" mono />
              <Row k="Model" v="gpt-5.2-pro" mono />
            </div>
          </RailSection>
          <RailSection label="Governance signals">
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
      {/* Sticky compliance banner */}
      <div className="sticky top-0 z-20 -mx-8 -mt-8 mb-4" data-testid="compliance-banner">
        <ComplianceBanner status={vetoed ? 'VETOED' : sessionStatus === 'APPROVED' ? 'APPROVED' : 'REVIEWING'} />
      </div>

      {/* Radial Committee hero */}
      <section className="cw-reveal rounded-sm border border-white/10 bg-cw-surface overflow-hidden mb-4" data-testid="committee-hero">
        <div className="grid grid-cols-[1fr_360px]">
          <div className="relative cw-ambient-bg">
            {/* scanlines layer */}
            <div className="absolute inset-0 cw-scanlines opacity-70" />
            <div className="relative p-6">
              <RadialCommittee
                agents={AGENTS}
                agentStates={agentStates}
                vetoed={vetoed}
                consensus={consensus}
                completedCount={completedCount}
                sessionId={session.id}
                onAgentClick={openAgent}
              />
            </div>
          </div>

          <div className="border-l border-white/10 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Broadcast size={12} className="text-cw-running" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-cw-running uppercase">Live Council</span>
              <StateBadge state={sessionStatus} size="sm" pulse={sessionStatus === 'RUNNING'} />
            </div>
            <h2 className="font-display text-[22px] leading-tight tracking-tight text-white/95 mb-3">
              {vetoed
                ? 'Blocked by SentinelCompliance — recommendation not eligible for delivery'
                : 'Phased retirement-income strategy with staged Roth conversions'}
            </h2>
            <p className="text-[12.5px] text-white/55 leading-relaxed mb-5">
              {vetoed
                ? 'Review the Sentinel reasoning below, or request a revised plan from the committee.'
                : 'Weighted consensus across Retirement, Tax, Risk, Actuarial, and Empath. Sentinel clearance finalizing.'}
            </p>

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

            <div className="grid grid-cols-2 gap-2 mt-5 text-[11px]">
              <Tile label="Agents" value={`${completedCount} / 14`} />
              <Tile label="Elapsed" value={formatElapsed(elapsed)} />
              <Tile label="Veto" value={vetoed ? 'invoked' : 'none'} accent={vetoed ? 'text-cw-vetoed' : 'text-cw-approved'} />
              <Tile label="Trace" value="7af1…c02" />
            </div>

            <div className="mt-auto pt-5 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => setPaused((p) => !p)}
                data-testid="btn-stream-toggle"
                className="flex-1 h-9 rounded-sm border border-white/10 bg-cw-elevated hover:bg-cw-hover hover:border-white/25 text-[11px] text-white/85 flex items-center justify-center gap-1.5"
              >
                {paused ? <Play size={11} weight="fill" /> : <Pause size={11} weight="fill" />}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <Link to="/compliance/audit" className="flex-1 h-9 rounded-sm border border-white/10 bg-cw-elevated hover:bg-cw-hover text-[11px] text-white/85 flex items-center justify-center gap-1.5">
                <Export size={11} /> Audit replay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Replay scrubber — narrative tool */}
      <section className="mb-6 cw-reveal" style={{ animationDelay: '0.05s' }}>
        <ReplayScrubber
          script={effectiveScript}
          streamIndex={streamIndex}
          setStreamIndex={setStreamIndex}
          paused={paused}
          setPaused={setPaused}
          vetoed={vetoed}
        />
      </section>

      {/* Thought stream + Recommendation tabs */}
      <section className="grid grid-cols-12 gap-6 cw-reveal" style={{ animationDelay: '0.1s' }}>
        <ThoughtStream streamed={streamed} paused={paused} live={sessionStatus === 'RUNNING'} onAgentClick={(n) => openAgent(AGENTS.find((a) => a.name === n))} />
        <RecommendationPanel vetoed={vetoed} />
      </section>

      {/* Agent drill-down modal */}
      {focusedAgent && (
        <AgentDrillModal
          agent={focusedAgent}
          state={agentStates[focusedAgent.name]?.state}
          confidence={agentStates[focusedAgent.name]?.confidence}
          summary={agentStates[focusedAgent.name]?.summary}
          trace={streamed}
          onClose={closeAgent}
        />
      )}
    </AppShell>
  );
}

function Row({ k, v, mono }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{k}</span>
      <span className={mono ? 'font-mono text-white/95' : 'text-white/95'}>{v}</span>
    </div>
  );
}
function Tile({ label, value, accent = 'text-white/95' }) {
  return (
    <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
      <div className="font-mono text-[10px] text-white/40">{label}</div>
      <div className={`font-mono text-[15px] ${accent}`}>{value}</div>
    </div>
  );
}

function ComplianceBanner({ status }) {
  const styles = {
    APPROVED: { icon: ShieldCheck, color: 'text-cw-approved', border: 'border-cw-approved/40', bg: 'bg-[rgba(16,185,129,0.10)]', label: 'Compliance · APPROVED' },
    REVIEWING:{ icon: ShieldCheck, color: 'text-cw-running',  border: 'border-cw-running/40',  bg: 'bg-[rgba(59,130,246,0.10)]', label: 'Compliance · UNDER REVIEW' },
    VETOED:   { icon: ShieldSlash, color: 'text-cw-vetoed',   border: 'border-cw-vetoed/50',   bg: 'bg-[rgba(220,38,38,0.12)]',  label: 'Compliance · VETOED BY SENTINEL' },
  }[status] || {};
  const Icon = styles.icon;
  return (
    <div className={`border-b border-t ${styles.border} ${styles.bg} px-8 py-3 flex items-center justify-between backdrop-blur-md`}>
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

function ThoughtStream({ streamed, paused, live, onAgentClick }) {
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
      <div className="h-[440px] overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.75] relative">
        <div className="cw-scanlines absolute inset-0 pointer-events-none" aria-hidden="true" />
        {streamed.length === 0 && <div className="text-white/30">Awaiting first event…</div>}
        {streamed.map((e, i) => (
          <div key={i} className="cw-stream-line flex gap-3 group" data-testid={`stream-line-${i}`}>
            <span className="text-white/30 shrink-0 w-16">{e.ts || nowClockOffset(i)}</span>
            <button onClick={() => onAgentClick?.(e.agent)} className="shrink-0 w-[110px] truncate text-left text-white/95 hover:text-cw-running transition-colors flex items-center gap-1">
              {e.agent}
              <MagnifyingGlassPlus size={9} className="opacity-0 group-hover:opacity-60 transition-opacity" />
            </button>
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
          <ShieldSlash size={16} className="text-cw-vetoed" weight="duotone" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-cw-vetoed uppercase">Blocked Output</span>
        </div>
        <h3 className="font-display text-[18px] text-white/95 leading-tight mb-2">Delivery not permitted</h3>
        <p className="text-[12px] text-white/65 mb-3 leading-relaxed">
          SentinelCompliance blocked this session. The full trace remains in Historian for review.
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
