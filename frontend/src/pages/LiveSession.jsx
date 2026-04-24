import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import StateTag from '@/components/shared/StateTag';
import { AGENTS, LIVE_STREAM_SCRIPT, RECENT_SESSIONS, CLIENTS } from '@/data/mockData';

/* ----------------------------- Radial Dial ----------------------------- */

const DIAL_W = 940;
const DIAL_H = 500;
const CX = DIAL_W / 2;
const CY = 440;      // hub near bottom
const R_NODE = 380;  // outer radius where agent nodes sit
const R_LABEL = 420; // label ring

function nodePosition(i, total) {
  // Spread across upper arc from 180° to 360° (left to right of bottom hub)
  const startDeg = 185;
  const endDeg = 355;
  const t = i / (total - 1);
  const deg = startDeg + (endDeg - startDeg) * t;
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + R_NODE * Math.cos(rad),
    y: CY + R_NODE * Math.sin(rad),
    lx: CX + R_LABEL * Math.cos(rad),
    ly: CY + R_LABEL * Math.sin(rad),
    deg,
  };
}

function stateFill(state) {
  switch (state) {
    case 'RUNNING':   return { fill: '#A85B42', stroke: '#A85B42' };
    case 'COMPLETED': return { fill: '#1E3B2D', stroke: '#1E3B2D' };
    case 'VETOED':    return { fill: '#8B2E2E', stroke: '#8B2E2E' };
    case 'QUEUED':    return { fill: '#FCFBFA', stroke: '#8A8F85' };
    default:          return { fill: '#FCFBFA', stroke: '#8A8F85' };
  }
}

function RadialDial({ agentStates, vetoed, consensus, completedCount }) {
  const speakingStrokes = Object.entries(agentStates)
    .filter(([_, v]) => v.state === 'RUNNING' || v.state === 'COMPLETED' || v.state === 'VETOED')
    .map(([name]) => name);

  return (
    <div className="relative" data-testid="radial-dial">
      <svg viewBox={`0 0 ${DIAL_W} ${DIAL_H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
        {/* Arc rule */}
        <path
          d={`M ${CX + R_NODE * Math.cos((185 * Math.PI) / 180)} ${CY + R_NODE * Math.sin((185 * Math.PI) / 180)}
              A ${R_NODE} ${R_NODE} 0 0 1 ${CX + R_NODE * Math.cos((355 * Math.PI) / 180)} ${CY + R_NODE * Math.sin((355 * Math.PI) / 180)}`}
          fill="none"
          stroke="#1C1E1A"
          strokeWidth="1"
          opacity="0.85"
        />
        {/* Inner hairline arc */}
        <path
          d={`M ${CX + (R_NODE - 40) * Math.cos((185 * Math.PI) / 180)} ${CY + (R_NODE - 40) * Math.sin((185 * Math.PI) / 180)}
              A ${R_NODE - 40} ${R_NODE - 40} 0 0 1 ${CX + (R_NODE - 40) * Math.cos((355 * Math.PI) / 180)} ${CY + (R_NODE - 40) * Math.sin((355 * Math.PI) / 180)}`}
          fill="none"
          stroke="#1C1E1A"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          opacity="0.4"
        />

        {/* Strokes from spoken agents → hub */}
        {AGENTS.map((a, i) => {
          const pos = nodePosition(i, AGENTS.length);
          const state = agentStates[a.name]?.state || 'QUEUED';
          if (!speakingStrokes.includes(a.name)) return null;
          const sc = state === 'VETOED' ? '#8B2E2E' : state === 'RUNNING' ? '#A85B42' : '#1E3B2D';
          return (
            <line
              key={`l-${a.name}`}
              x1={pos.x}
              y1={pos.y}
              x2={CX}
              y2={CY}
              stroke={sc}
              strokeWidth={state === 'VETOED' ? 1.5 : 0.8}
              className="cw-stroke-anim"
              style={{ animationDelay: `${i * 30}ms` }}
              opacity={state === 'QUEUED' ? 0 : 0.7}
            />
          );
        })}

        {/* Agent nodes */}
        {AGENTS.map((a, i) => {
          const pos = nodePosition(i, AGENTS.length);
          const state = agentStates[a.name]?.state || 'QUEUED';
          const { fill, stroke } = stateFill(state);
          const running = state === 'RUNNING';
          const labelAngle = pos.deg - 270; // tangent to arc
          return (
            <g key={a.name} data-testid={`node-${a.name}`}>
              {/* seat number */}
              <text
                x={pos.lx}
                y={pos.ly}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${labelAngle}, ${pos.lx}, ${pos.ly})`}
                fontFamily="Chivo Mono"
                fontSize="9"
                fill="#8A8F85"
                letterSpacing="1.5"
              >
                {String(i + 1).padStart(2, '0')} · {a.name.toUpperCase()}
              </text>
              {/* node */}
              <g className={running ? 'cw-node-running' : ''} style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}>
                <circle cx={pos.x} cy={pos.y} r={9} fill={fill} stroke={stroke} strokeWidth="1.3" />
                <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle"
                      fontFamily="Newsreader" fontStyle="italic" fontSize="10"
                      fill={state === 'QUEUED' ? '#5E635A' : (state === 'COMPLETED' ? '#FCFBFA' : '#FCFBFA')}>
                  {a.abbr}
                </text>
              </g>
            </g>
          );
        })}

        {/* Conclusion Hub */}
        <g>
          {/* veto shock ring */}
          {vetoed && (
            <circle cx={CX} cy={CY} r={58} fill="none" stroke="#8B2E2E" className="cw-veto-shock" />
          )}
          <circle cx={CX} cy={CY} r={48} fill="#FCFBFA" stroke="#1C1E1A" strokeWidth="1.5" />
          <text x={CX} y={CY - 16} textAnchor="middle" fontFamily="Chivo Mono" fontSize="9" letterSpacing="2" fill="#8A8F85">
            CONSENSUS
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="Newsreader" fontStyle="italic" fontSize="30" fill={vetoed ? '#8B2E2E' : '#1C1E1A'}>
            {vetoed ? '0.42' : consensus.toFixed(2)}
          </text>
          <text x={CX} y={CY + 26} textAnchor="middle" fontFamily="Chivo Mono" fontSize="9" fill="#8A8F85">
            {completedCount} / {AGENTS.length} chairs
          </text>
        </g>

        {/* Seal at hub */}
        <g transform={`translate(${CX}, ${CY + 52})`}>
          <line x1="-40" y1="0" x2="40" y2="0" stroke="#1C1E1A" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

/* -------------------------- Transcript -------------------------- */

const STEP_COLOR = {
  THOUGHT:     { label: 'thought',     color: '#876538' },
  ACTION:      { label: 'action',      color: '#A85B42' },
  OBSERVATION: { label: 'observation', color: '#5E635A' },
  RESPONSE:    { label: 'response',    color: '#1E3B2D' },
};

function Transcript({ streamed, live, paused }) {
  const bottomRef = React.useRef(null);
  React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [streamed.length]);

  return (
    <div className="border border-cw-ink bg-cw-canvas" data-testid="transcript">
      <div className="flex items-center justify-between px-6 py-3 border-b-2 border-cw-ink bg-cw-masthead">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Court transcript</span>
          <span className="font-display italic text-[14px] text-cw-ink">verbatim, as set</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: live && !paused ? '#A85B42' : '#8A8F85', animation: live && !paused ? 'cw-node-pulse 1.6s ease-in-out infinite' : 'none' }} />
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">{live ? (paused ? 'paused' : 'setting') : 'replay'}</span>
        </div>
      </div>

      <div className="cw-paper-grain relative">
        <div className="max-h-[440px] overflow-y-auto px-8 py-6 relative">
          {streamed.map((e, i) => {
            const s = STEP_COLOR[e.stepType];
            return (
              <div key={i} className="cw-typeset pb-5 mb-5 border-b border-dotted border-cw-rule last:border-b-0 relative" data-testid={`trn-line-${i}`}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] tracking-wider text-cw-ink-mute min-w-[48px]">{e.ts || fmtTime(i)}</span>
                  <span className="font-display italic text-[18px] leading-tight text-cw-ink">{e.agent}</span>
                  <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase" style={{ color: s.color }}>
                    [{s.label}]
                  </span>
                </div>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-cw-ink pl-[64px]">
                  "{e.content}"
                </p>
              </div>
            );
          })}
          {live && !paused && (
            <div className="flex items-baseline gap-4 text-cw-ink-mute">
              <span className="font-mono text-[10px] min-w-[48px]">{fmtTimeNow()}</span>
              <span className="font-display italic text-[18px]">The bench</span>
              <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase">[awaits]</span>
              <span className="cw-ink-cursor ml-2"></span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
function pad(n){return String(n).padStart(2,'0');}
function fmtTime(i){const t = 14*3600+2*60+11 + i*4; return `${pad(Math.floor(t/3600)%24)}:${pad(Math.floor(t/60)%60)}:${pad(t%60)}`;}
function fmtTimeNow(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;}

/* --------------------- Recommendation panel --------------------- */

function Verdict({ vetoed }) {
  const [tab, setTab] = React.useState('summary');
  const tabs = ['summary', 'actions', 'risks', 'audit'];

  if (vetoed) {
    return (
      <div className="border-2 border-cw-vetoed bg-cw-veto-bg/40 p-8" data-testid="verdict-vetoed">
        <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-vetoed mb-3">Opinion of the bench</div>
        <h3 className="font-display italic text-[28px] leading-tight text-cw-ink mb-3">The petition is not granted.</h3>
        <p className="text-[14.5px] leading-relaxed text-cw-ink-soft mb-5">
          Sentinel has invoked a hard veto. The recommendation is not eligible for delivery to the client. Full reasoning is preserved in Historian and is open to advisor and compliance review.
        </p>
        <ul className="space-y-2 mb-6 text-[13.5px] border-t border-cw-veto-rule pt-4">
          {[
            'FINRA 2111 · suitability mismatch',
            'Single-issuer concentration 42% · policy ceiling 25%',
            'Disclosure language insufficient',
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-3 border-b border-dotted border-cw-veto-rule pb-2">
              <span className="w-1.5 h-1.5 bg-cw-vetoed mt-2" />
              <span className="text-cw-ink">{r}</span>
            </li>
          ))}
        </ul>
        <button className="h-11 px-6 border border-cw-ink text-cw-ink font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-canvas">Request a revision</button>
      </div>
    );
  }

  return (
    <div className="border-2 border-cw-ink bg-cw-canvas" data-testid="verdict-panel">
      <div className="flex border-b-2 border-cw-ink">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            data-testid={`verdict-tab-${t}`}
            className={[
              'flex-1 h-11 font-mono text-[11px] tracking-[0.22em] uppercase border-r last:border-r-0 border-cw-ink transition-colors',
              tab === t ? 'bg-cw-ink text-cw-canvas' : 'bg-cw-canvas text-cw-ink-soft hover:bg-cw-masthead',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-7 text-[14.5px] leading-relaxed text-cw-ink-soft min-h-[260px]">
        {tab === 'summary' && (
          <div className="space-y-3">
            <p className="text-cw-ink font-display italic text-[22px] leading-snug">
              A phased retirement-income approach: 4.2% initial withdrawal under dynamic guardrails, Social Security delayed to age seventy, and a ten-year bond-tent glidepath from fifty to thirty per cent in bonds.
            </p>
            <p>
              Tax-efficient income is stacked with staged Roth conversions sized to the 24% bracket to avoid IRMAA Tier 2; Qualified Charitable Distributions commence at age 70½ aligned with RMD onset.
            </p>
            <div className="grid grid-cols-2 border-t border-cw-ink mt-5 pt-4 gap-0">
              <div className="pr-6">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">Median terminal</div>
                <div className="font-display italic text-[30px] leading-none text-cw-ink mt-1">$3.11M</div>
              </div>
              <div className="pl-6 border-l border-cw-ink">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">Plan survival</div>
                <div className="font-display italic text-[30px] leading-none text-cw-fiduciary mt-1">92.4%</div>
              </div>
            </div>
          </div>
        )}
        {tab === 'actions' && (
          <ol className="space-y-3 list-decimal list-inside marker:font-mono marker:text-cw-ink-mute">
            {[
              'Open a Roth conversion schedule of $85k per year through age 70.',
              'Delay Social Security to age 70 (base +$11,400/yr).',
              'Establish a two-year cash floor in short-duration Treasuries.',
              'Set portfolio drift alerts at ±20% with a rebalancing workflow.',
              'Schedule QCDs at age 70½ aligned with the RMD commencement.',
            ].map((a, i) => <li key={i} className="text-cw-ink">{a}</li>)}
          </ol>
        )}
        {tab === 'risks' && (
          <ul className="space-y-3">
            {[
              ['Sequence-of-returns risk elevated during the first decade (σ = 14.2%).', 'WAITING_APPROVAL'],
              ['IRMAA bracket crossing risk if income spikes.', 'WAITING_APPROVAL'],
              ['Longevity beyond age 95 — plan stress inconclusive.', 'VETOED'],
              ['Behavioural drawdown aversion post-2022 (Empath).', 'RUNNING'],
            ].map(([t, st], i) => (
              <li key={i} className="flex items-start gap-3 border-b border-dotted border-cw-rule pb-3">
                <StateTag state={st} size="sm" uppercase />
                <span className="text-cw-ink flex-1">{t}</span>
              </li>
            ))}
          </ul>
        )}
        {tab === 'audit' && (
          <div className="space-y-2 font-mono text-[12px]">
            {[
              ['Trace ID', '7af1-9b02-c02a'],
              ['Step count', '14 THOUGHT · 6 ACTION · 5 OBSERVATION · 7 RESPONSE'],
              ['Models', 'gpt-5.2-pro · claude-sonnet-4.5'],
              ['PII redacted', '100%'],
              ['WORM eligible', 'yes'],
              ['Retention', '7 years · SEC 17a-4'],
            ].map((r) => (
              <div key={r[0]} className="flex justify-between border-b border-dotted border-cw-rule py-1">
                <span className="text-cw-ink-mute">{r[0]}</span>
                <span className="text-cw-ink">{r[1]}</span>
              </div>
            ))}
            <Link to="/compliance/audit" className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-cw-ink border-b border-cw-ink hover:text-cw-fiduciary pb-0.5">
              Open in audit viewer →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function LiveSession() {
  const { sessionId = 'CW-2041' } = useParams();
  const session = RECENT_SESSIONS.find((s) => s.id === sessionId) || RECENT_SESSIONS[0];
  const client = CLIENTS[0];
  const isVeto = session.status === 'VETOED';

  const [paused, setPaused] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(108);
  const [streamIndex, setStreamIndex] = React.useState(isVeto ? LIVE_STREAM_SCRIPT.length : 8);
  const [agentStates, setAgentStates] = React.useState(() => {
    const map = {};
    AGENTS.forEach((a) => { map[a.name] = { state: 'QUEUED', confidence: null }; });
    if (isVeto) {
      ['Scholar','RetirementPlanner','TaxStrategist','Actuarial','Empath','Historian'].forEach((n) => map[n] = { state: 'COMPLETED', confidence: 0.8 });
      map['RiskAnalyst'] = { state: 'COMPLETED', confidence: 0.42 };
      map['SentinelCompliance'] = { state: 'VETOED', confidence: null };
      return map;
    }
    map['Historian']          = { state: 'COMPLETED', confidence: 1.00 };
    map['Scholar']            = { state: 'COMPLETED', confidence: 0.92 };
    map['RetirementPlanner']  = { state: 'COMPLETED', confidence: 0.87 };
    map['TaxStrategist']      = { state: 'COMPLETED', confidence: 0.91 };
    map['RiskAnalyst']        = { state: 'COMPLETED', confidence: 0.85 };
    map['Actuarial']          = { state: 'COMPLETED', confidence: 0.90 };
    map['Empath']             = { state: 'COMPLETED', confidence: 0.73 };
    map['SentinelCompliance'] = { state: 'RUNNING',   confidence: null };
    return map;
  });

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  React.useEffect(() => {
    if (paused || isVeto) return;
    if (streamIndex >= LIVE_STREAM_SCRIPT.length) return;
    const t = setTimeout(() => {
      const nxt = LIVE_STREAM_SCRIPT[streamIndex];
      setAgentStates((prev) => {
        const clone = { ...prev };
        const cur = clone[nxt.agent] || { state: 'QUEUED' };
        if (nxt.stepType === 'THOUGHT' || nxt.stepType === 'ACTION' || nxt.stepType === 'OBSERVATION') {
          if (cur.state === 'QUEUED') clone[nxt.agent] = { ...cur, state: 'RUNNING' };
        } else if (nxt.stepType === 'RESPONSE') {
          const conf = nxt.agent === 'SentinelCompliance' ? null
                       : nxt.agent === 'Empath' ? 0.73
                       : nxt.agent === 'Actuarial' ? 0.90
                       : 0.85 + Math.random() * 0.08;
          const state = nxt.agent === 'SentinelCompliance'
            ? (nxt.content.startsWith('APPROVED') ? 'COMPLETED' : 'VETOED')
            : 'COMPLETED';
          clone[nxt.agent] = { state, confidence: conf };
        }
        return clone;
      });
      setStreamIndex((i) => i + 1);
    }, 1500);
    return () => clearTimeout(t);
  }, [streamIndex, paused, isVeto]);

  const completedCount = Object.values(agentStates).filter((v) => v.state === 'COMPLETED' || v.state === 'VETOED').length;
  const votes = Object.values(agentStates).filter((v) => v.state === 'COMPLETED' && v.confidence != null).map((v) => v.confidence);
  const consensus = votes.length ? votes.reduce((a, b) => a + b, 0) / votes.length : 0;
  const vetoed = isVeto || Object.values(agentStates).some((v) => v.state === 'VETOED');
  const finalState = vetoed ? 'VETOED' : (streamIndex >= LIVE_STREAM_SCRIPT.length ? 'APPROVED' : 'RUNNING');

  const streamed = isVeto
    ? LIVE_STREAM_SCRIPT.slice(0, 6).concat([
        { agent: 'RiskAnalyst',        stepType: 'OBSERVATION', content: 'Sequence risk exceeds stated Moderate profile.' },
        { agent: 'SentinelCompliance', stepType: 'ACTION',      content: 'Evaluating FINRA 2111 suitability and single-issuer concentration.' },
        { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'Concentration 42% exceeds the 25% policy ceiling.' },
        { agent: 'SentinelCompliance', stepType: 'RESPONSE',    content: 'VETOED. Policy v2026-04. Reasons: suitability and concentration.' },
      ])
    : LIVE_STREAM_SCRIPT.slice(0, streamIndex);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  return (
    <PageFrame>
      <PageMasthead
        eyebrow={`Session ${session.id} · Live`}
        meta={`Trace 7af1…c02 · Elapsed ${minutes}:${seconds}`}
        title={<><span className="not-italic">{session.clientName}.</span> A committee <span className="text-cw-copper">sits</span>.</>}
        lede={vetoed
          ? 'The bench has invoked a hard veto. The matter stands; the recommendation does not travel. Read the reasoning, or request revision.'
          : "Fourteen specialist chairs convene for Mrs. Wilson's retirement-income question. Deliberation is set in real time; Sentinel holds final review."}
        right={
          <div className="flex flex-col items-end gap-2">
            <StateTag state={finalState} uppercase />
            <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">advisor · S. Navarro</div>
          </div>
        }
      />

      <ComplianceBanner state={finalState} />

      <Canvas>
        {/* Dial hero */}
        <section className="grid grid-cols-12 gap-10 items-start mb-14" data-testid="dial-section">
          <div className="col-span-12 lg:col-span-8 relative">
            <div className="border border-cw-ink bg-cw-canvas relative overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b-2 border-cw-ink bg-cw-masthead">
                <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">The bench · radial consensus</span>
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">chairs 01–14</span>
              </div>
              <div className="p-8 cw-paper-grain">
                <RadialDial agentStates={agentStates} vetoed={vetoed} consensus={consensus} completedCount={completedCount} />
              </div>
              <div className="px-6 py-3 border-t-2 border-cw-ink flex items-center justify-between bg-cw-masthead">
                <button onClick={() => setPaused((p) => !p)} data-testid="btn-pause"
                        className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink hover:text-cw-fiduciary">
                  {paused ? '▸ Resume deliberation' : '❚❚ Pause deliberation'}
                </button>
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">
                  {streamed.length} events · backpressure · <span className="text-cw-fiduciary">ok</span>
                </span>
              </div>
            </div>
          </div>

          {/* Client dossier */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="border-t-2 border-cw-ink pt-4">
              <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Client dossier</div>
              <h3 className="font-display italic text-[32px] leading-none text-cw-ink mt-2 mb-4">{client.name}</h3>

              <div className="space-y-2 border-t border-cw-ink pt-4 text-[14px]">
                {[
                  ['Age / retirement', `${client.age} / ${client.retireAge}`, true],
                  ['Risk profile', client.risk, false],
                  ['Jurisdiction', client.jurisdiction, true],
                  ['Assets under mgmt.', `$${(client.aum/1e6).toFixed(2)}M`, true],
                  ['Target annual income', `$${(client.need/1000).toFixed(0)}k`, true],
                ].map((r) => (
                  <div key={r[0]} className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1">
                    <span className="text-cw-ink-soft">{r[0]}</span>
                    <span className={r[2] ? 'font-mono text-cw-ink' : 'font-display text-cw-ink'}>{r[1]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-cw-ink pt-4">
                <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute mb-2">Session meta</div>
                <div className="space-y-1.5 text-[13px] font-mono">
                  <Row k="session" v={session.id} />
                  <Row k="advisor" v="S. Navarro" />
                  <Row k="firm" v="Aldrich & Quinn" />
                  <Row k="workflow" v="AGENT_FANOUT" />
                  <Row k="model" v="gpt-5.2-pro" />
                  <Row k="trace" v="7af1…c02" />
                </div>
              </div>

              <div className="mt-8 border-t border-cw-ink pt-4">
                <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute mb-3">Legend</div>
                <div className="flex flex-wrap gap-2">
                  <StateTag state="QUEUED" size="sm" uppercase />
                  <StateTag state="RUNNING" size="sm" uppercase />
                  <StateTag state="COMPLETED" size="sm" uppercase />
                  <StateTag state="VETOED" size="sm" uppercase />
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Transcript + Verdict */}
        <SectionRule label="Transcript & verdict" tail="SET AS SPOKEN · ARCHIVED TO WORM" />
        <div className="grid grid-cols-12 gap-10 mb-16">
          <div className="col-span-12 lg:col-span-8"><Transcript streamed={streamed} live={finalState === 'RUNNING'} paused={paused} /></div>
          <div className="col-span-12 lg:col-span-4"><Verdict vetoed={vetoed} /></div>
        </div>
      </Canvas>
    </PageFrame>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1">
      <span className="text-cw-ink-mute">{k}</span>
      <span className="text-cw-ink">{v}</span>
    </div>
  );
}

/* Compliance Banner — sticky under masthead */
function ComplianceBanner({ state }) {
  const cfg = {
    APPROVED: { text: 'The matter is approved. The recommendation is eligible for delivery.', color: '#1E3B2D', bg: '#E5EBE6', rule: '#B0C4B6' },
    RUNNING:  { text: 'Sentinel review is underway — suitability, disclosure, and concentration.', color: '#876538', bg: '#EAE5D9', rule: '#C7B9A3' },
    VETOED:   { text: 'The matter is vetoed by the Sentinel. The recommendation shall not travel.', color: '#8B2E2E', bg: '#F2E6E6', rule: '#D4A5A5' },
  }[state];
  if (!cfg) return null;
  return (
    <section
      className="cw-banner-draw sticky top-0 z-30 border-y"
      style={{ backgroundColor: cfg.bg, borderColor: cfg.rule }}
      data-testid={`compliance-banner-${state.toLowerCase()}`}
    >
      <div className="max-w-[1480px] mx-auto px-10 py-3 flex items-center gap-5">
        <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase" style={{ color: cfg.color }}>Compliance · {state.toLowerCase().replace('_', ' ')}</span>
        <span className="h-4 w-px" style={{ backgroundColor: cfg.color, opacity: 0.5 }} />
        <span className="font-display italic text-[16px] leading-tight" style={{ color: cfg.color }}>{cfg.text}</span>
        <span className="ml-auto font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: cfg.color, opacity: 0.7 }}>policy v2026-04</span>
      </div>
    </section>
  );
}
