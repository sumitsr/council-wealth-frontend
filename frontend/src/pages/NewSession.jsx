import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lightning, FloppyDisk, CaretDown, FileText, Info } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import { RailSection } from '@/components/layout/RightRail';
import { CLIENTS, OBJECTIVES, JURISDICTIONS, RISK_PROFILES } from '@/data/mockData';

function Field({ label, hint, children, required, testid }) {
  return (
    <div data-testid={testid}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45">
          {label}{required && <span className="text-cw-vetoed ml-1">*</span>}
        </label>
        {hint && <span className="font-mono text-[10px] text-white/30">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, testid }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testid}
        className="w-full h-10 pl-3 pr-8 rounded-sm border border-white/10 bg-cw-surface hover:border-white/20 focus:border-cw-running/70 focus:outline-none text-[13px] text-white/95 appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o} className="bg-cw-bg">{o.label ?? o}</option>)}
      </select>
      <CaretDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  );
}

function NumberInput({ value, onChange, suffix, testid }) {
  return (
    <div className="relative flex items-center border border-white/10 bg-cw-surface hover:border-white/20 focus-within:border-cw-running/70 rounded-sm h-10">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testid}
        className="flex-1 bg-transparent px-3 font-mono text-[13px] text-white/95 focus:outline-none"
      />
      {suffix && <span className="px-3 font-mono text-[11px] text-white/40 border-l border-white/10 h-full flex items-center">{suffix}</span>}
    </div>
  );
}

export default function NewSession() {
  const nav = useNavigate();
  const [clientId, setClientId] = React.useState('cli_01');
  const [jurisdiction, setJurisdiction] = React.useState('US');
  const [risk, setRisk] = React.useState('MODERATE');
  const [objectives, setObjectives] = React.useState(['Retirement', 'Tax']);
  const [age, setAge] = React.useState(62);
  const [retireAge, setRetireAge] = React.useState(65);
  const [horizon, setHorizon] = React.useState(30);
  const [need, setNeed] = React.useState(140000);
  const [heldAway, setHeldAway] = React.useState(true);
  const [prompt, setPrompt] = React.useState(
    "Client approaching retirement with $2.3M across taxable, traditional IRA, and Roth. Primary objective is tax-efficient income with lower sequence-of-returns risk during the first 10 years. Evaluate staged Roth conversions, SSA timing, and bond-tent glidepath."
  );

  const toggleObjective = (o) => {
    setObjectives((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]);
  };

  const canSubmit = prompt.trim().length >= 20 && clientId && objectives.length > 0 && jurisdiction;

  const handleRun = () => {
    if (!canSubmit) return;
    nav('/council/live/CW-2041');
  };

  const client = CLIENTS.find((c) => c.id === clientId);

  return (
    <AppShell
      title="New Council Session"
      subtitle="Planning Intake"
      rightRail={
        <>
          <RailSection label="Cost Estimate">
            <div className="rounded-sm border border-white/10 bg-cw-surface p-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] text-white/40">Credits (est.)</span>
                <span className="font-mono text-[20px] text-white/95">2.4</span>
              </div>
              <div className="font-mono text-[10px] text-white/40 mt-1">7 agents · ~12s · Scholar RAG on</div>
            </div>
          </RailSection>
          <RailSection label="Governance Preflight">
            <ul className="space-y-2 text-[12px] text-white/75">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /> PII sanitization active · Ghost Map</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /> Jurisdiction = US · Reg BI + FINRA 2111</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /> Historian trace persistence ON</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cw-waiting mt-1.5" /> Debater agent: disputed-only</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cw-approved mt-1.5" /> WORM export eligible</li>
            </ul>
          </RailSection>
          <RailSection label="Client Snapshot" icon={FileText}>
            {client ? (
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-white/50">Name</span><span className="text-white/95">{client.name}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Age</span><span className="font-mono text-white/95">{client.age}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Risk</span><span className="font-mono text-white/95">{client.risk}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Jurisdiction</span><span className="font-mono text-white/95">{client.jurisdiction}</span></div>
                <div className="flex justify-between"><span className="text-white/50">AUM</span><span className="font-mono text-white/95">${(client.aum/1e6).toFixed(2)}M</span></div>
                <div className="flex justify-between"><span className="text-white/50">Target need</span><span className="font-mono text-white/95">${(client.need/1000).toFixed(0)}k/yr</span></div>
              </div>
            ) : <div className="text-[12px] text-white/50">Select a client</div>}
          </RailSection>
        </>
      }
    >
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="font-display text-[30px] tracking-tight leading-tight text-white/95 mb-1.5">Compose a council deliberation</h1>
          <p className="text-[13px] text-white/55 max-w-2xl leading-relaxed">
            Normalized planning intake. Required: client, jurisdiction, ≥1 objective, prompt ≥ 20 chars. Every answer will be audited,
            PII-sanitized before model access, and subject to SentinelCompliance veto.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleRun(); }} data-testid="session-form">
          {/* Row 1: core identifiers */}
          <div className="grid grid-cols-4 gap-4">
            <Field testid="field-client" label="Client" required>
              <Select testid="select-client" value={clientId} onChange={setClientId}
                options={CLIENTS.map((c) => ({ value: c.id, label: c.name }))} />
            </Field>
            <Field testid="field-household" label="Household">
              <Select testid="select-household" value="hh_01" onChange={() => {}}
                options={[{ value: 'hh_01', label: 'Wilson-Brady HH' }, { value: 'hh_02', label: 'Carter HH' }]} />
            </Field>
            <Field testid="field-jurisdiction" label="Jurisdiction" required>
              <Select testid="select-jurisdiction" value={jurisdiction} onChange={setJurisdiction} options={JURISDICTIONS} />
            </Field>
            <Field testid="field-risk" label="Risk Profile" required>
              <Select testid="select-risk" value={risk} onChange={setRisk} options={RISK_PROFILES} />
            </Field>
          </div>

          {/* Row 2: Objectives */}
          <Field testid="field-objectives" label="Planning Objectives" hint={`${objectives.length} selected`} required>
            <div className="flex flex-wrap gap-2">
              {OBJECTIVES.map((o) => {
                const active = objectives.includes(o);
                return (
                  <button
                    type="button"
                    key={o}
                    data-testid={`objective-${o.toLowerCase()}`}
                    onClick={() => toggleObjective(o)}
                    className={[
                      'h-9 px-4 rounded-sm text-[12px] font-medium tracking-wide border transition-colors',
                      active
                        ? 'bg-white text-black border-white'
                        : 'bg-cw-surface text-white/80 border-white/10 hover:border-white/30 hover:bg-cw-elevated',
                    ].join(' ')}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Row 3: Prompt */}
          <Field
            testid="field-prompt"
            label="Planning Prompt"
            required
            hint={`${prompt.length} chars · min 20`}
          >
            <div className="rounded-sm border border-white/10 bg-cw-surface focus-within:border-cw-running/70 transition-colors">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                <span className="font-mono text-[10px] tracking-wider text-cw-running">&gt;</span>
                <span className="font-mono text-[10px] text-white/40">council.prompt</span>
              </div>
              <textarea
                data-testid="prompt-editor"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full bg-transparent px-4 py-3 font-body text-[13px] leading-relaxed text-white/95 focus:outline-none resize-none"
                placeholder="Describe the planning question with enough context for 14 specialist agents to deliberate…"
              />
            </div>
          </Field>

          {/* Row 4: scenario */}
          <div className="rounded-sm border border-white/10 bg-cw-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/45 uppercase">Scenario Inputs</span>
              <span className="font-mono text-[10px] text-white/30">Normalized → AgentQuery.context</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Field testid="field-age" label="Current Age">
                <NumberInput value={age} onChange={setAge} suffix="yrs" testid="input-age" />
              </Field>
              <Field testid="field-retire-age" label="Retirement Age">
                <NumberInput value={retireAge} onChange={setRetireAge} suffix="yrs" testid="input-retire-age" />
              </Field>
              <Field testid="field-horizon" label="Time Horizon">
                <NumberInput value={horizon} onChange={setHorizon} suffix="yrs" testid="input-horizon" />
              </Field>
              <Field testid="field-need" label="Annual Need">
                <NumberInput value={need} onChange={setNeed} suffix="USD" testid="input-need" />
              </Field>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer" data-testid="toggle-held-away">
                <input type="checkbox" checked={heldAway} onChange={(e) => setHeldAway(e.target.checked)}
                  className="w-3.5 h-3.5 accent-white" />
                <span className="text-[12px] text-white/80">Include held-away assets (Plaid)</span>
              </label>
              <div className="flex items-center gap-2 text-[11px] text-white/50">
                <Info size={12} />
                Inputs are tokenized via Ghost Map before model access.
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="font-mono text-[11px] text-white/40">
              Council fan-out: <span className="text-white/80">7 agents</span> · Sentinel veto: <span className="text-cw-approved">armed</span> · Historian: <span className="text-cw-approved">on</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" data-testid="btn-save-draft"
                className="h-10 px-4 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/25 text-[12px] text-white/85 flex items-center gap-2">
                <FloppyDisk size={13} weight="duotone" /> Save draft
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                data-testid="btn-run-council"
                className="h-10 px-5 rounded-sm bg-white text-black text-[12px] font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Lightning size={13} weight="fill" /> Run Council
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
