import React from 'react';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import StateTag from '@/components/shared/StateTag';
import { AUDIT_SESSIONS, LIVE_STREAM_SCRIPT } from '@/data/mockData';

const STEP_COLOR = {
  THOUGHT:     { label: 'Thought',     color: '#876538' },
  ACTION:      { label: 'Action',      color: '#A85B42' },
  OBSERVATION: { label: 'Observation', color: '#5E635A' },
  RESPONSE:    { label: 'Response',    color: '#1E3B2D' },
};

export default function AuditViewer() {
  const [query, setQuery] = React.useState('');
  const [vetoedOnly, setVetoedOnly] = React.useState(false);
  const [selected, setSelected] = React.useState(AUDIT_SESSIONS[0].id);
  const selectedSession = AUDIT_SESSIONS.find((s) => s.id === selected);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUDIT_SESSIONS.filter((s) => {
      if (vetoedOnly && s.outcome !== 'VETOED') return false;
      if (!q) return true;
      return (
        s.id.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.advisorName.toLowerCase().includes(q) ||
        s.jurisdiction.toLowerCase().includes(q)
      );
    });
  }, [query, vetoedOnly]);

  const steps = selectedSession?.outcome === 'VETOED'
    ? LIVE_STREAM_SCRIPT.slice(0, 7).concat([
        { agent: 'SentinelCompliance', stepType: 'ACTION',      content: 'Evaluating FINRA 2111 suitability; concentration check underway.' },
        { agent: 'SentinelCompliance', stepType: 'OBSERVATION', content: 'Concentration 42% exceeds 25% policy ceiling.' },
        { agent: 'SentinelCompliance', stepType: 'RESPONSE',    content: 'VETOED · Policy v2026-04 · reasons: suitability, concentration.' },
        { agent: 'Historian',          stepType: 'ACTION',      content: 'Trace persisted. WORM export pending.' },
      ])
    : LIVE_STREAM_SCRIPT;

  return (
    <PageFrame>
      <PageMasthead
        eyebrow="Archives · Bound & Sealed"
        meta="Regulator-grade replay"
        title={<>The immutable <span className="not-italic text-cw-copper">record of every deliberation</span>.</>}
        lede="Each session is persisted step-by-step by Historian and exported nightly to Write-Once-Read-Many storage under SEC 17a-4, MiFID II Art.25, and Reg BI retention policy. Nothing is amended. Nothing is forgotten."
      />

      <Canvas>
        {/* Search bar — looks like a library card catalogue */}
        <div className="border-t-2 border-b-2 border-cw-ink py-4 mb-10 flex items-center gap-6" data-testid="audit-controls">
          <div className="flex-1 flex items-center gap-3">
            <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Catalogue</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="enter client, advisor, trace or session number…"
              data-testid="audit-search"
              className="flex-1 bg-transparent border-b border-cw-ink pb-1 font-display italic text-[22px] leading-none text-cw-ink focus:outline-none placeholder:text-cw-ink-mute"
            />
          </div>
          <div className="flex items-center gap-2">
            {['Client', 'Advisor', 'Date', 'Jurisdiction'].map((f) => (
              <button key={f} className="h-9 px-3 border border-cw-rule text-cw-ink-soft font-mono text-[10.5px] tracking-[0.2em] uppercase hover:border-cw-ink hover:text-cw-ink" data-testid={`audit-filter-${f.toLowerCase()}`}>
                {f} · any
              </button>
            ))}
            <button
              onClick={() => setVetoedOnly((v) => !v)}
              data-testid="audit-vetoed-only"
              className={[
                'h-9 px-3 border font-mono text-[10.5px] tracking-[0.2em] uppercase transition-colors',
                vetoedOnly ? 'bg-cw-veto-bg border-cw-vetoed text-cw-vetoed' : 'border-cw-rule text-cw-ink-soft hover:border-cw-ink hover:text-cw-ink',
              ].join(' ')}
            >
              Vetoed only
            </button>
            <button className="h-9 px-4 bg-cw-fiduciary text-cw-canvas font-mono text-[10.5px] tracking-[0.22em] uppercase hover:bg-cw-fiduciary-deep">
              Export packet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10 mb-16">
          {/* Catalogue */}
          <section className="col-span-12 lg:col-span-5" data-testid="audit-catalog">
            <SectionRule label="Catalogue of sessions" tail={`${rows.length} ENTRIES`} />
            <div className="border-t-2 border-cw-ink">
              {rows.length === 0 && (
                <div className="px-4 py-12 text-center">
                  <div className="font-display italic text-[22px] text-cw-ink-mute">No sessions answer to "{query}".</div>
                </div>
              )}
              {rows.map((s) => {
                const active = s.id === selected;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    data-testid={`audit-row-${s.id}`}
                    className={[
                      'w-full text-left grid grid-cols-[80px_1fr_110px] gap-4 items-start px-4 py-4 border-b border-cw-rule transition-colors',
                      active ? 'bg-cw-masthead border-l-[3px] border-l-cw-fiduciary pl-3' : 'hover:bg-cw-masthead/60',
                    ].join(' ')}
                  >
                    <span className="font-mono text-[11.5px] text-cw-ink pt-1">{s.id}</span>
                    <div className="min-w-0">
                      <div className="font-display italic text-[18px] leading-tight text-cw-ink">{s.clientName}</div>
                      <div className="font-mono text-[10.5px] text-cw-ink-mute tracking-wide mt-1">{s.advisorName} · {s.startedAt} · {s.jurisdiction}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StateTag state={s.outcome} size="sm" uppercase />
                      <StateTag state={s.wormStatus} size="sm" uppercase />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Replay */}
          <section className="col-span-12 lg:col-span-7" data-testid="audit-replay">
            <SectionRule label="Folio · selected session" tail={selectedSession?.id} />
            {/* Folio header */}
            <div className="border-2 border-cw-ink bg-cw-canvas cw-paper-grain p-8 mb-6">
              <div className="flex items-baseline justify-between pb-5 mb-5 border-b-2 border-cw-ink">
                <div>
                  <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">{selectedSession?.jurisdiction} · {selectedSession?.startedAt}</div>
                  <h2 className="font-display italic text-[34px] leading-tight tracking-tight text-cw-ink mt-2">{selectedSession?.clientName}</h2>
                  <div className="font-mono text-[11px] text-cw-ink-soft mt-1">Advisor {selectedSession?.advisorName} · trace 7af1-…-c02a</div>
                </div>
                <StateTag state={selectedSession?.outcome} uppercase />
              </div>

              <div className="grid grid-cols-5 gap-0 border-b border-cw-ink">
                {[
                  ['Agents', '14'],
                  ['Steps', '27'],
                  ['PII redacted', '100%', 'text-cw-fiduciary'],
                  ['WORM', selectedSession?.wormStatus.replace('_', ' ')],
                  ['Retention', '7y · 17a-4'],
                ].map((c, i) => (
                  <div key={i} className={`py-4 px-4 ${i < 4 ? 'border-r border-cw-rule' : ''}`}>
                    <div className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-cw-ink-mute">{c[0]}</div>
                    <div className={`font-display italic text-[20px] leading-none mt-1 ${c[2] || 'text-cw-ink'}`}>{c[1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trace timeline */}
            <div className="border-2 border-cw-ink bg-cw-canvas">
              <div className="flex items-center justify-between px-6 py-3 border-b-2 border-cw-ink bg-cw-masthead">
                <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Trace of reasoning</span>
                <div className="flex items-center gap-3">
                  {Object.entries(STEP_COLOR).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cw-ink-mute">
                      <span className="w-1.5 h-1.5" style={{ backgroundColor: v.color }} />
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 max-h-[560px] overflow-y-auto cw-paper-grain">
                <ol className="relative pl-8 border-l-2 border-cw-ink">
                  {steps.map((s, i) => {
                    const sc = STEP_COLOR[s.stepType];
                    return (
                      <li key={i} className="relative pb-6 last:pb-0" data-testid={`trace-step-${i}`}>
                        <span className="absolute -left-[34px] top-1 w-4 h-4 bg-cw-canvas border-2" style={{ borderColor: sc.color }} />
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="font-mono text-[10.5px] text-cw-ink-mute tracking-wide w-9">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-mono text-[10.5px] text-cw-ink-mute">14:{String(2 + Math.floor(i / 4)).padStart(2, '0')}:{String((i * 7) % 60).padStart(2, '0')}</span>
                          <span className="font-display italic text-[17px] text-cw-ink">{s.agent}</span>
                          <span className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: sc.color }}>[{sc.label}]</span>
                        </div>
                        <p className="pl-12 text-[14px] leading-[1.6] text-cw-ink">"{s.content}"</p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </section>
        </div>
      </Canvas>
    </PageFrame>
  );
}
