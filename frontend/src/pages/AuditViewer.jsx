import React from 'react';
import { CaretRight, MagnifyingGlass, Export, Funnel, LockKey, CircleDashed, ArrowSquareOut } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { AUDIT_SESSIONS, LIVE_STREAM_SCRIPT } from '@/data/mockData';

const STEP_COLORS = {
  THOUGHT: 'text-cw-archived border-cw-archived/40',
  ACTION: 'text-cw-running border-cw-running/40',
  OBSERVATION: 'text-cw-waiting border-cw-waiting/40',
  RESPONSE: 'text-cw-approved border-cw-approved/40',
};

function Filter({ label, value, onClick, testid }) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      className="flex items-center gap-2 h-9 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/25 text-[12px] text-white/80"
    >
      <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase">{label}</span>
      <span>{value}</span>
      <CaretRight size={10} className="text-white/40 rotate-90" />
    </button>
  );
}

export default function AuditViewer() {
  const [selected, setSelected] = React.useState(AUDIT_SESSIONS[0].id);
  const [vetoedOnly, setVetoedOnly] = React.useState(false);
  const selectedSession = AUDIT_SESSIONS.find((s) => s.id === selected);

  const rows = vetoedOnly ? AUDIT_SESSIONS.filter((s) => s.outcome === 'VETOED') : AUDIT_SESSIONS;

  const steps = selectedSession?.outcome === 'VETOED'
    ? LIVE_STREAM_SCRIPT.slice(0, 7).concat([
        { agent: 'SentinelCompliance', stepType: 'ACTION', content: 'Evaluating FINRA 2111 suitability; concentration check running.' },
        { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'Concentration 42% exceeds 25% policy ceiling.' },
        { agent: 'SentinelCompliance', stepType: 'RESPONSE', content: 'VETOED · Policy v2026-04 · reasons: suitability, concentration.' },
        { agent: 'Historian', stepType: 'ACTION', content: 'Trace persisted. worm_export: pending.' },
      ])
    : LIVE_STREAM_SCRIPT;

  return (
    <AppShell
      title="Audit & Replay"
      subtitle="Regulator-Grade Session Review"
      rightRail={
        <>
          <RailSection label="WORM Archive" icon={LockKey}>
            <div className="rounded-sm border border-white/10 bg-cw-surface p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-white/40">Immutable storage</span>
                <StateBadge state={selectedSession?.wormStatus === 'COMPLETED' ? 'APPROVED' : 'PENDING'} size="sm" />
              </div>
              <div className="font-mono text-[11px] text-white/70 mt-1 break-all">
                s3://cw-worm/firm_aq_us/{selectedSession?.id}.jsonl
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-white/50">Mechanism</span><span className="font-mono text-white/90">S3 Object Lock</span></div>
                <div className="flex justify-between"><span className="text-white/50">Retention</span><span className="font-mono text-white/90">2033-04-28</span></div>
                <div className="flex justify-between"><span className="text-white/50">Checksum</span><span className="font-mono text-white/90">sha256:3f2a…</span></div>
                <div className="flex justify-between"><span className="text-white/50">Class</span><span className="font-mono text-cw-archived">SEC 17a-4</span></div>
              </div>
            </div>
          </RailSection>
          <RailSection label="Approval History">
            <ul className="space-y-2 text-[11px]">
              {[
                { who: 'S. Navarro', when: '14:02:11', action: 'Session started' },
                { who: 'Auto', when: '14:02:13', action: 'PII sanitized (Ghost Map)' },
                { who: 'Sentinel', when: '14:04:01', action: selectedSession?.outcome === 'VETOED' ? 'VETO issued' : 'Compliance cleared' },
                { who: 'Historian', when: '14:04:04', action: 'Trace persisted' },
              ].map((a, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <div>
                    <div className="text-white/85">{a.action}</div>
                    <div className="font-mono text-[10px] text-white/40">{a.who}</div>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">{a.when}</span>
                </li>
              ))}
            </ul>
          </RailSection>
        </>
      }
    >
      {/* Filters */}
      <section className="mb-5" data-testid="audit-filters">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              data-testid="audit-search"
              placeholder="Search by client, trace ID, or session…"
              className="w-full h-9 pl-9 pr-3 rounded-sm border border-white/10 bg-cw-surface focus:border-cw-running/60 focus:outline-none text-[12px] text-white/90 placeholder:text-white/30"
            />
          </div>
          <Filter testid="filter-client" label="Client" value="Any" />
          <Filter testid="filter-advisor" label="Advisor" value="Any" />
          <Filter testid="filter-date" label="Date" value="Last 7 days" />
          <Filter testid="filter-jurisdiction" label="Jurisdiction" value="All" />
          <button
            onClick={() => setVetoedOnly((v) => !v)}
            data-testid="filter-vetoed"
            className={[
              'flex items-center gap-2 h-9 px-3 rounded-sm border text-[12px]',
              vetoedOnly ? 'border-cw-vetoed/40 bg-cw-vetoed/10 text-cw-vetoed' : 'border-white/10 bg-cw-surface text-white/80 hover:border-white/25',
            ].join(' ')}
          >
            <Funnel size={12} weight="duotone" />
            Vetoed only
          </button>
          <button className="ml-auto flex items-center gap-2 h-9 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated text-[12px] text-white/85" data-testid="btn-export-packet">
            <Export size={12} /> Export audit packet
          </button>
        </div>
      </section>

      {/* Split: left results / right replay */}
      <div className="grid grid-cols-12 gap-6">
        {/* Results table */}
        <section className="col-span-5" data-testid="audit-results">
          <div className="rounded-sm border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[1fr_96px_90px] gap-2 px-3 py-2 bg-[#111] border-b border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              <span>Session · Client</span>
              <span>Outcome</span>
              <span className="text-right">WORM</span>
            </div>
            <div className="max-h-[620px] overflow-y-auto">
              {rows.map((s) => {
                const active = s.id === selected;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    data-testid={`audit-row-${s.id}`}
                    className={[
                      'w-full text-left grid grid-cols-[1fr_96px_90px] gap-2 px-3 py-3 border-b border-white/[0.06] transition-colors',
                      active ? 'bg-cw-elevated border-white/15' : 'hover:bg-cw-elevated',
                    ].join(' ')}
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[12px] text-white/85">{s.id}</div>
                      <div className="text-[12px] text-white/95 truncate">{s.clientName}</div>
                      <div className="font-mono text-[10px] text-white/40 mt-0.5">{s.advisorName} · {s.startedAt} · {s.jurisdiction}</div>
                    </div>
                    <div className="flex items-center"><StateBadge state={s.outcome} size="sm" /></div>
                    <div className="flex items-center justify-end">
                      <StateBadge state={s.wormStatus === 'COMPLETED' ? 'ARCHIVED' : 'PENDING'} size="sm" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Session replay */}
        <section className="col-span-7" data-testid="audit-replay">
          {/* Header */}
          <div className="rounded-sm border border-white/10 bg-cw-surface p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase mb-1">{selectedSession?.jurisdiction} · {selectedSession?.startedAt}</div>
                <div className="font-display text-[18px] text-white/95 tracking-tight">{selectedSession?.id} · {selectedSession?.clientName}</div>
                <div className="font-mono text-[11px] text-white/50 mt-1">Advisor {selectedSession?.advisorName} · trace 7af1-…-c02a</div>
              </div>
              <div className="flex items-center gap-2">
                <StateBadge state={selectedSession?.outcome} />
                <button className="h-8 px-3 rounded-sm border border-white/10 bg-cw-elevated text-[11px] text-white/80 hover:border-white/25 flex items-center gap-1.5">
                  <ArrowSquareOut size={11} /> Open session
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-[11px]">
              <Stat label="Agents" value="14" />
              <Stat label="Steps" value="27" />
              <Stat label="PII redacted" value="100%" color="text-cw-approved" />
              <Stat label="WORM" value={selectedSession?.wormStatus} color={selectedSession?.wormStatus === 'COMPLETED' ? 'text-cw-archived' : 'text-cw-waiting'} />
              <Stat label="Retention" value="7y · 17a-4" />
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-sm border border-white/10 bg-cw-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#111]">
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">Trace Timeline</span>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                {['THOUGHT','ACTION','OBSERVATION','RESPONSE'].map((k) => (
                  <span key={k} className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      k === 'THOUGHT' ? 'bg-cw-archived' :
                      k === 'ACTION' ? 'bg-cw-running' :
                      k === 'OBSERVATION' ? 'bg-cw-waiting' : 'bg-cw-approved'
                    }`} />
                    <span className="text-white/50">{k}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="max-h-[560px] overflow-y-auto p-5">
              <ol className="relative border-l border-white/10 ml-2 space-y-4">
                {steps.map((s, i) => (
                  <li key={i} className="pl-5 relative">
                    <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-sm border ${STEP_COLORS[s.stepType].split(' ')[1]} bg-cw-bg`} />
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[10px] text-white/40">{pad(i+1)}</span>
                      <span className="font-mono text-[10px] text-white/40">14:{pad(2 + Math.floor(i/4))}:{pad(i*7 % 60)}</span>
                      <span className="font-mono text-[10px] text-white/95">{s.agent}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${STEP_COLORS[s.stepType].split(' ')[0]}`}>{s.stepType}</span>
                    </div>
                    <div className="text-[12px] text-white/80 leading-relaxed">{s.content}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, color = 'text-white/95' }) {
  return (
    <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
      <div className="font-mono text-[9px] text-white/40 tracking-wider uppercase">{label}</div>
      <div className={`font-mono text-[13px] ${color} mt-0.5`}>{value || <CircleDashed size={12} />}</div>
    </div>
  );
}
function pad(n){ return String(n).padStart(2,'0'); }
