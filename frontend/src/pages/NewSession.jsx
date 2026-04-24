import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import { CLIENTS, OBJECTIVES, JURISDICTIONS, RISK_PROFILES } from '@/data/mockData';

function Label({ children, hint }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">{children}</span>
      {hint && <span className="font-mono text-[10px] tracking-wide text-cw-ink-mute">{hint}</span>}
    </div>
  );
}

function DocLine({ label, children, required }) {
  return (
    <div className="pt-2 pb-4 border-b border-cw-ink/20" data-testid={`doc-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <Label>{label}{required && <span className="text-cw-copper ml-1">*</span>}</Label>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children, testid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      className={[
        'h-10 px-5 border font-mono text-[11px] tracking-[0.2em] uppercase transition-colors',
        active
          ? 'bg-cw-ink text-cw-canvas border-cw-ink'
          : 'bg-cw-canvas text-cw-ink border-cw-rule hover:border-cw-ink',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function NumberLine({ value, onChange, suffix, testid }) {
  return (
    <div className="flex items-baseline justify-between border-b-2 border-cw-ink pb-1">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        data-testid={testid}
        className="w-full bg-transparent font-display italic text-[34px] leading-none tracking-tight text-cw-ink focus:outline-none"
      />
      {suffix && <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-cw-ink-mute pl-3 whitespace-nowrap">{suffix}</span>}
    </div>
  );
}

export default function NewSession() {
  const nav = useNavigate();
  const [clientId, setClientId] = React.useState('cli_01');
  const [jurisdiction, setJurisdiction] = React.useState('US');
  const [risk, setRisk] = React.useState('Moderate');
  const [objectives, setObjectives] = React.useState(['Retirement', 'Tax']);
  const [age, setAge] = React.useState(62);
  const [retireAge, setRetireAge] = React.useState(65);
  const [horizon, setHorizon] = React.useState(30);
  const [need, setNeed] = React.useState(140000);
  const [heldAway, setHeldAway] = React.useState(true);
  const [prompt, setPrompt] = React.useState(
    "The client approaches retirement with assets of $2.3M distributed across taxable, traditional IRA, and Roth accounts. She wishes tax-efficient income with lower sequence-of-returns risk across the first ten years. Please evaluate staged Roth conversions, Social Security timing, and a bond-tent glidepath."
  );

  const client = CLIENTS.find((c) => c.id === clientId);
  const canSubmit = prompt.trim().length >= 20 && clientId && objectives.length > 0 && jurisdiction;

  const toggle = (o) => setObjectives((p) => p.includes(o) ? p.filter((x) => x !== o) : [...p, o]);
  const onSubmit = (e) => { e.preventDefault(); if (canSubmit) nav('/council/live/CW-2041'); };

  return (
    <PageFrame>
      <PageMasthead
        eyebrow="Docket · New Filing"
        meta="Form CW-001"
        title={<>A new matter is brought <span className="not-italic text-cw-copper">before the council</span>.</>}
        lede="Planning prompts normalised into an AgentQuery are presented to the chambers. All input is tokenised through the Ghost Map before any model access, and the session is bound to the firm by identity; not by payload."
      />

      <Canvas>
        <form onSubmit={onSubmit} className="grid grid-cols-12 gap-12" data-testid="filing-form">
          {/* Filing */}
          <section className="col-span-12 lg:col-span-8">
            <div className="border border-cw-ink bg-cw-canvas p-10 cw-paper-grain">
              <div className="flex items-baseline justify-between pb-4 mb-6 border-b-2 border-cw-ink">
                <div>
                  <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Petition for deliberation</div>
                  <div className="font-display italic text-[28px] leading-tight text-cw-ink mt-1">In re. the matter of {client?.name || '—'}</div>
                </div>
                <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute text-right leading-snug">
                  filing<br/><span className="text-cw-ink">CW-FORM-001</span>
                </div>
              </div>

              <DocLine label="Client of record" required>
                <div className="flex items-end gap-3">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    data-testid="sel-client"
                    className="flex-1 bg-transparent border-b-2 border-cw-ink font-display italic text-[28px] leading-tight text-cw-ink focus:outline-none pb-1 appearance-none"
                  >
                    {CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-cw-ink-mute pb-3">Household · hh_01</span>
                </div>
              </DocLine>

              <div className="grid grid-cols-2 gap-10">
                <DocLine label="Jurisdiction" required>
                  <div className="flex gap-2">
                    {JURISDICTIONS.map((j) => (
                      <Chip key={j} active={j === jurisdiction} onClick={() => setJurisdiction(j)} testid={`chip-juris-${j}`}>{j}</Chip>
                    ))}
                  </div>
                </DocLine>
                <DocLine label="Risk profile" required>
                  <div className="flex gap-2 flex-wrap">
                    {RISK_PROFILES.map((r) => (
                      <Chip key={r} active={r === risk} onClick={() => setRisk(r)} testid={`chip-risk-${r.toLowerCase()}`}>{r}</Chip>
                    ))}
                  </div>
                </DocLine>
              </div>

              <DocLine label="Objectives" required>
                <div className="flex gap-2 flex-wrap">
                  {OBJECTIVES.map((o) => (
                    <Chip key={o} active={objectives.includes(o)} onClick={() => toggle(o)} testid={`chip-obj-${o.toLowerCase()}`}>{o}</Chip>
                  ))}
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cw-ink-mute ml-auto self-center">{objectives.length} selected</span>
                </div>
              </DocLine>

              <DocLine label="Statement of the matter" required>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  data-testid="prompt-editor"
                  rows={5}
                  placeholder="Describe the planning question with sufficient context for fourteen specialist chairs to deliberate…"
                  className="w-full bg-transparent font-display italic text-[20px] leading-[1.5] tracking-tight text-cw-ink focus:outline-none resize-none border-l-2 border-cw-ink pl-5"
                />
                <div className="flex justify-between mt-2 font-mono text-[10.5px] tracking-wide text-cw-ink-mute">
                  <span>Tokens: {prompt.length} / minimum 20</span>
                  <span>Ghost Map · armed</span>
                </div>
              </DocLine>

              <div className="pt-4 pb-1 grid grid-cols-4 gap-6">
                <DocLine label="Current age">
                  <NumberLine value={age} onChange={setAge} suffix="years" testid="num-age" />
                </DocLine>
                <DocLine label="Retirement age">
                  <NumberLine value={retireAge} onChange={setRetireAge} suffix="years" testid="num-retire" />
                </DocLine>
                <DocLine label="Time horizon">
                  <NumberLine value={horizon} onChange={setHorizon} suffix="years" testid="num-horizon" />
                </DocLine>
                <DocLine label="Annual need">
                  <NumberLine value={need} onChange={setNeed} suffix="USD" testid="num-need" />
                </DocLine>
              </div>

              <label className="flex items-center gap-3 mt-2 cursor-pointer" data-testid="toggle-held-away">
                <input type="checkbox" checked={heldAway} onChange={(e) => setHeldAway(e.target.checked)} className="w-4 h-4 accent-cw-fiduciary" />
                <span className="text-[13px] text-cw-ink-soft">Include held-away assets as disclosed through Plaid aggregation.</span>
              </label>
            </div>

            {/* Signatures row */}
            <div className="mt-8 pt-6 border-t border-cw-ink flex items-center justify-between">
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute leading-snug">
                Fan-out <span className="text-cw-ink">7 chairs</span> · Sentinel <span className="text-cw-fiduciary">armed</span> · Historian <span className="text-cw-fiduciary">persisting</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" data-testid="btn-draft" className="h-11 px-5 border border-cw-ink text-cw-ink font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-masthead">
                  Save as draft
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  data-testid="btn-submit"
                  className="h-11 px-7 bg-cw-fiduciary text-cw-canvas font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-fiduciary-deep disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-3"
                >
                  File & convene <span className="font-display italic text-[14px] -translate-y-[1px]">⟶</span>
                </button>
              </div>
            </div>
          </section>

          {/* Annotations column */}
          <aside className="col-span-12 lg:col-span-4">
            <SectionRule label="Counsel's annotations" />
            <div className="border-t border-cw-ink pt-5 mb-8">
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">Client of record</div>
              {client && (
                <div className="mt-3 space-y-1.5 text-[14px]">
                  {[
                    ['Name', client.name],
                    ['Age', client.age, true],
                    ['Risk', client.risk],
                    ['Jurisdiction', client.jurisdiction, true],
                    ['AUM', `$${(client.aum/1e6).toFixed(2)}M`, true],
                    ['Target income', `$${(client.need/1000).toFixed(0)}k / yr`, true],
                  ].map((r) => (
                    <div key={r[0]} className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1">
                      <span className="text-cw-ink-soft">{r[0]}</span>
                      <span className={r[2] ? 'font-mono text-cw-ink' : 'font-display text-cw-ink'}>{r[1]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-cw-ink pt-5 mb-8">
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">Governance preflight</div>
              <ul className="mt-3 space-y-2 text-[13px]">
                {[
                  ['PII sanitised · Ghost Map armed', true],
                  ['Jurisdiction · US · Reg BI + FINRA 2111', true],
                  ['Historian trace persistence · on', true],
                  ['Debater agent · disputed-only', false],
                  ['WORM export · eligible', true],
                ].map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`w-1.5 h-1.5 mt-2 ${r[1] ? 'bg-cw-fiduciary' : 'bg-cw-copper'}`} />
                    <span className="text-cw-ink">{r[0]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-cw-ink pt-5">
              <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">Cost estimate</div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="font-display text-[44px] italic leading-none text-cw-ink">2.4</span>
                <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-cw-ink-mute">credits (est.)</span>
              </div>
              <div className="font-mono text-[10.5px] text-cw-ink-mute mt-2">7 chairs · ~12 s · Scholar RAG on</div>
            </div>
          </aside>
        </form>
      </Canvas>
    </PageFrame>
  );
}
