import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Plus, Minus, Lightning, ShieldCheck, Sparkle, Buildings, Globe, ChartLineUp } from '@phosphor-icons/react';
import StateBadge from '@/components/shared/StateBadge';
import { useToast } from '@/components/shared/ToastProvider';
import { PRICING_TIERS, ADD_ONS } from '@/data/pricing';

export default function Onboarding() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { push } = useToast();

  const [step, setStep] = React.useState(1);
  const [tierId, setTierId] = React.useState(params.get('tier') || 'practice');
  const [seats, setSeats] = React.useState(5);
  const [billing, setBilling] = React.useState('monthly'); // monthly | annual
  const [addOns, setAddOns] = React.useState({});

  // Firm details
  const [firmName, setFirmName] = React.useState('');
  const [firmSlug, setFirmSlug] = React.useState('');
  const [jurisdiction, setJurisdiction] = React.useState('US');
  const [aumBand, setAumBand] = React.useState('250m');

  // Admin contact
  const [adminName, setAdminName] = React.useState('');
  const [adminEmail, setAdminEmail] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const tier = PRICING_TIERS.find((t) => t.id === tierId) || PRICING_TIERS[1];
  const monthlyBase = tier.perAdvisorMonth * seats;
  const addOnsTotal = Object.entries(addOns).filter(([, v]) => v).reduce((acc, [id]) => acc + (ADD_ONS.find((a) => a.id === id)?.price || 0), 0);
  const monthlyTotal = monthlyBase + addOnsTotal;
  const annualTotal = Math.round(monthlyTotal * 12 * (1 - tier.annualDiscount));
  const billed = billing === 'annual' ? annualTotal : monthlyTotal;

  const slug = firmSlug || firmName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  const canProceed = {
    1: !!tierId,
    2: seats >= 1 && seats <= 500,
    3: !!firmName && !!slug && !!adminName && !!adminEmail && agreeTerms,
  }[step];

  const submit = () => {
    push({ variant: 'success', title: 'Chambers chartered', desc: `${firmName} · firm_${slug} · ${seats} seats on ${tier.name}. Welcome to Council Wealth.` });
    setTimeout(() => nav('/'), 900);
  };

  return (
    <div className="min-h-screen bg-cw-bg text-white/95 cw-ambient-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-cw-bg/85 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          <Link to="/" data-testid="onboard-brand" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-white text-black flex items-center justify-center font-display text-[14px] font-bold">C</div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-medium tracking-tight text-white/95">Council Wealth</span>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/40">Charter your chambers</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <StepDot n={1} label="Plan" active={step === 1} done={step > 1} />
            <Connector done={step > 1} />
            <StepDot n={2} label="Seats" active={step === 2} done={step > 2} />
            <Connector done={step > 2} />
            <StepDot n={3} label="Firm" active={step === 3} done={step > 3} />
          </div>

          <Link to="/" className="font-mono text-[11px] tracking-wider text-white/55 hover:text-white">
            Already have an account?
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] mx-auto px-8 py-12 w-full">
        {/* Lede */}
        <div className="mb-10 max-w-3xl cw-reveal">
          <span className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-cw-running mb-3 inline-block">Step {step} of 3</span>
          <h1 className="font-display text-[44px] leading-[1.05] tracking-tight text-white/95">
            {step === 1 && (<>Choose the council that <span className="italic text-cw-running">fits your firm</span>.</>)}
            {step === 2 && (<>How many advisors will <span className="italic text-cw-running">take a seat?</span></>)}
            {step === 3 && (<>Identify your firm and <span className="italic text-cw-running">charter the chambers</span>.</>)}
          </h1>
          <p className="text-[14px] text-white/55 mt-4 max-w-2xl">
            {step === 1 && 'Each tier maps to a real RIA archetype. The tier you select dictates which agents convene, how many sessions you may run, and what governance posture is required of your tenant.'}
            {step === 2 && 'Pricing scales per advisor. You can adjust seats at any time from Tenant Admin — billing prorates daily.'}
            {step === 3 && 'You will become the first administrator. We will provision your tenant region, seal your tenant ID, and invite you in.'}
          </p>
        </div>

        {/* Step 1 — Tier selection */}
        {step === 1 && (
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-8 cw-stagger" data-testid="tier-grid">
            {PRICING_TIERS.map((t) => {
              const active = tierId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTierId(t.id)}
                  data-testid={`tier-${t.id}`}
                  className={[
                    'text-left relative rounded-sm border p-5 transition-colors group',
                    active
                      ? 'bg-cw-elevated border-white/35 ring-1 ring-white/15'
                      : 'bg-cw-surface border-white/10 hover:border-white/25 hover:bg-cw-elevated',
                  ].join(' ')}
                  style={{
                    boxShadow: active ? `0 0 0 1px ${t.accent}30, 0 16px 48px -16px ${t.accent}40` : 'none',
                  }}
                >
                  {/* Top stripe */}
                  <div className="h-[3px] -mx-5 -mt-5 mb-4 rounded-t-sm" style={{ backgroundColor: t.accent }} />
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: t.accent }}>{t.badge}</span>
                    {active && <Check size={14} weight="bold" className="text-white/95" />}
                  </div>
                  <div className="font-display text-[22px] tracking-tight text-white/95 mb-0.5">{t.name}</div>
                  <div className="font-mono text-[10.5px] text-white/55 leading-snug mb-3">{t.targetFirm} · {t.aumRange}</div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-mono text-[28px] leading-none text-white/95">${t.perAdvisorMonth}</span>
                    <span className="font-mono text-[11px] text-white/45">/ advisor / mo</span>
                  </div>
                  <p className="text-[12.5px] text-white/65 leading-relaxed mb-4">{t.description}</p>
                  <div className="border-t border-white/10 pt-3 mb-3">
                    <div className="flex items-center justify-between font-mono text-[10.5px] text-white/55 mb-1">
                      <span>Sessions / month</span>
                      <span className="text-white/95">{typeof t.sessions === 'number' ? t.sessions : t.sessions}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[10.5px] text-white/55">
                      <span>Included agents</span>
                      <span className="text-white/95">{t.agents.length} of 14</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {t.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-white/75">
                        <Check size={11} weight="bold" className="text-cw-approved mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {t.features.length > 5 && (
                      <li className="font-mono text-[10.5px] text-white/40 mt-1">+ {t.features.length - 5} more</li>
                    )}
                  </ul>
                </button>
              );
            })}
          </section>
        )}

        {/* Step 2 — Seats + add-ons */}
        {step === 2 && (
          <section className="grid grid-cols-12 gap-6 cw-reveal" data-testid="seats-step">
            <div className="col-span-12 lg:col-span-7 space-y-6">
              {/* Seats */}
              <div className="rounded-sm border border-white/10 bg-cw-surface p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45">Advisor seats</div>
                    <div className="font-display text-[22px] tracking-tight text-white/95">How many will take a seat?</div>
                  </div>
                  <span className="font-mono text-[11px] text-white/40">add or remove freely later</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    data-testid="seats-decrease"
                    className="w-12 h-12 rounded-sm border border-white/15 bg-cw-elevated hover:border-white/30 text-white/85 flex items-center justify-center"
                  >
                    <Minus size={14} weight="bold" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      data-testid="seats-slider"
                      className="w-full accent-white"
                      style={{ accentColor: tier.accent }}
                    />
                    <div className="flex justify-between font-mono text-[9.5px] text-white/35 mt-1">
                      <span>1</span><span>10</span><span>25</span><span>50+</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSeats(Math.min(500, seats + 1))}
                    data-testid="seats-increase"
                    className="w-12 h-12 rounded-sm border border-white/15 bg-cw-elevated hover:border-white/30 text-white/85 flex items-center justify-center"
                  >
                    <Plus size={14} weight="bold" />
                  </button>
                  <div className="rounded-sm border border-white/15 bg-cw-bg px-5 py-3 flex items-baseline gap-1.5 min-w-[120px] justify-end">
                    <span className="font-display text-[36px] leading-none tracking-tight text-white/95" data-testid="seats-display">{seats}</span>
                    <span className="font-mono text-[11px] text-white/45">seats</span>
                  </div>
                </div>
              </div>

              {/* Billing cadence */}
              <div className="rounded-sm border border-white/10 bg-cw-surface p-6">
                <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-3">Billing cadence</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'monthly', label: 'Monthly', desc: 'Bill the card on the 1st of every month.' },
                    { id: 'annual',  label: 'Annual',  desc: `Save ${Math.round(tier.annualDiscount * 100)}% paying twelve months at once.` },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBilling(b.id)}
                      data-testid={`billing-${b.id}`}
                      className={[
                        'text-left rounded-sm border p-4 transition-colors',
                        billing === b.id
                          ? 'border-white/35 bg-cw-elevated'
                          : 'border-white/10 bg-cw-bg hover:border-white/25',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display text-[16px] text-white/95">{b.label}</span>
                        {b.id === 'annual' && <span className="font-mono text-[10px] tracking-wider text-cw-approved">SAVE {Math.round(tier.annualDiscount*100)}%</span>}
                      </div>
                      <div className="text-[12.5px] text-white/55 leading-snug">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div className="rounded-sm border border-white/10 bg-cw-surface p-6">
                <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-3">Add-ons (optional)</div>
                <div className="space-y-2">
                  {ADD_ONS.map((a) => {
                    const on = !!addOns[a.id];
                    return (
                      <label key={a.id}
                        className={[
                          'flex items-center justify-between gap-3 rounded-sm border px-4 py-3 cursor-pointer transition-colors',
                          on ? 'border-white/30 bg-cw-elevated' : 'border-white/10 bg-cw-bg hover:border-white/20',
                        ].join(' ')}
                        data-testid={`addon-${a.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={on} onChange={() => setAddOns({ ...addOns, [a.id]: !on })}
                            className="w-3.5 h-3.5 accent-white" />
                          <span className="text-[13px] text-white/90">{a.label}</span>
                        </div>
                        <span className="font-mono text-[12px] text-white/85">+${a.price}/mo</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <SummaryRail tier={tier} seats={seats} billing={billing} addOns={addOns} monthlyTotal={monthlyTotal} annualTotal={annualTotal} billed={billed} />
          </section>
        )}

        {/* Step 3 — Firm details */}
        {step === 3 && (
          <section className="grid grid-cols-12 gap-6 cw-reveal" data-testid="firm-step">
            <div className="col-span-12 lg:col-span-7 space-y-5">
              <div className="rounded-sm border border-white/10 bg-cw-surface p-6">
                <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-4 flex items-center gap-2"><Buildings size={11} weight="duotone" /> Firm details</div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Firm name" required>
                    <input value={firmName} onChange={(e) => { setFirmName(e.target.value); setFirmSlug(''); }} data-testid="input-firm-name"
                      placeholder="Aldrich & Quinn Wealth"
                      className="w-full h-11 px-3 bg-cw-bg border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm text-[14px] text-white/95" />
                  </FormField>
                  <FormField label="Firm ID" hint="auto · used in tenant URLs">
                    <input value={slug} onChange={(e) => setFirmSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, ''))} data-testid="input-firm-slug"
                      placeholder="firm_aldrich_quinn"
                      className="w-full h-11 px-3 bg-cw-bg border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm font-mono text-[13px] text-white/95" />
                  </FormField>
                  <FormField label="Primary jurisdiction">
                    <div className="flex border border-white/10 rounded-sm overflow-hidden">
                      {['US','UK','EU'].map((j) => (
                        <button key={j} onClick={() => setJurisdiction(j)} data-testid={`juris-${j}`}
                          className={['flex-1 h-11 font-mono text-[12px] tracking-wider uppercase border-r border-white/10 last:border-r-0', jurisdiction === j ? 'bg-white/10 text-white/95' : 'text-white/55 hover:bg-white/5'].join(' ')}>{j}</button>
                      ))}
                    </div>
                  </FormField>
                  <FormField label="AUM band" hint="for benchmarking">
                    <select value={aumBand} onChange={(e) => setAumBand(e.target.value)} data-testid="select-aum"
                      className="w-full h-11 px-3 bg-cw-bg border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm text-[13px] text-white/95">
                      <option value="50m">Under $50M</option>
                      <option value="250m">$50M – $250M</option>
                      <option value="1b">$250M – $1B</option>
                      <option value="1b+">Over $1B</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <div className="rounded-sm border border-white/10 bg-cw-surface p-6">
                <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-4">Administrator account</div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Your name" required>
                    <input value={adminName} onChange={(e) => setAdminName(e.target.value)} data-testid="input-admin-name"
                      placeholder="Sierra Navarro"
                      className="w-full h-11 px-3 bg-cw-bg border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm text-[14px] text-white/95" />
                  </FormField>
                  <FormField label="Work email" required>
                    <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} data-testid="input-admin-email"
                      placeholder="sierra@aldrichquinn.com" type="email"
                      className="w-full h-11 px-3 bg-cw-bg border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm font-mono text-[13px] text-white/95" />
                  </FormField>
                </div>
                <p className="text-[12px] text-white/55 mt-3 leading-relaxed">
                  An invitation is sent to this address with SAML setup instructions. You may add additional advisors directly from the seat picker after charter.
                </p>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 px-1 cursor-pointer" data-testid="agree-terms">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-3.5 h-3.5 mt-1 accent-cw-running" />
                <span className="text-[12.5px] text-white/75 leading-snug max-w-xl">
                  I agree to the <a className="underline">Master Subscription Agreement</a>, <a className="underline">Acceptable-Use Policy</a>, and the
                  Council Wealth <a className="underline">Data Processing Addendum</a>. I confirm I am authorised to bind {firmName || 'my firm'} to these terms.
                </span>
              </label>
            </div>

            <SummaryRail tier={tier} seats={seats} billing={billing} addOns={addOns} monthlyTotal={monthlyTotal} annualTotal={annualTotal} billed={billed} firmName={firmName} slug={slug} jurisdiction={jurisdiction} />
          </section>
        )}

        {/* Footer nav */}
        <div className="mt-10 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} data-testid="btn-back"
              className="h-11 px-5 rounded-sm border border-white/15 bg-cw-elevated text-white/85 text-[12px] tracking-wider uppercase font-mono hover:border-white/30 flex items-center gap-2">
              <ArrowLeft size={12} /> Back
            </button>
          ) : <span />}

          {step < 3 ? (
            <button onClick={() => canProceed && setStep(step + 1)}
              disabled={!canProceed}
              data-testid="btn-next"
              className="h-11 px-6 rounded-sm bg-white text-black text-[12px] tracking-wider uppercase font-mono font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              Continue <ArrowRight size={12} weight="bold" />
            </button>
          ) : (
            <button onClick={() => canProceed && submit()}
              disabled={!canProceed}
              data-testid="btn-submit"
              className="h-11 px-7 rounded-sm bg-cw-approved text-black text-[12px] tracking-wider uppercase font-mono font-semibold hover:bg-cw-approved/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              <Sparkle size={13} weight="fill" /> Charter chambers
            </button>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 mt-12 py-5">
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
          <span>Council Wealth · Charter</span>
          <span>SEC 17a-4 · FINRA 2111 · Reg BI · MiFID II · GDPR · SOC 2 Type II</span>
        </div>
      </footer>
    </div>
  );
}

function StepDot({ n, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div className={[
        'w-7 h-7 rounded-sm border flex items-center justify-center font-mono text-[11px] transition-colors',
        active ? 'bg-white text-black border-white' : done ? 'border-cw-approved text-cw-approved' : 'border-white/20 text-white/45',
      ].join(' ')}>
        {done ? <Check size={11} weight="bold" /> : n}
      </div>
      <span className={[
        'font-mono text-[10.5px] tracking-[0.22em] uppercase transition-colors',
        active ? 'text-white/95' : done ? 'text-cw-approved/85' : 'text-white/40',
      ].join(' ')}>{label}</span>
    </div>
  );
}

function Connector({ done }) {
  return <div className={`w-10 h-px ${done ? 'bg-cw-approved/60' : 'bg-white/15'}`} />;
}

function FormField({ label, hint, required, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45">{label}{required && <span className="text-cw-vetoed ml-1">*</span>}</span>
        {hint && <span className="font-mono text-[10px] text-white/35">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SummaryRail({ tier, seats, billing, addOns, monthlyTotal, annualTotal, billed, firmName, slug, jurisdiction }) {
  return (
    <aside className="col-span-12 lg:col-span-5 lg:sticky lg:top-8 self-start" data-testid="onboard-summary">
      <div className="rounded-sm border bg-cw-surface" style={{ borderColor: tier.accent + '40' }}>
        <div className="h-[3px]" style={{ backgroundColor: tier.accent }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase" style={{ color: tier.accent }}>{tier.badge}</span>
            <Link to={`/signup?tier=${tier.id}`} onClick={(e) => e.preventDefault()} className="font-mono text-[10px] text-white/40">change</Link>
          </div>
          <div className="font-display text-[24px] tracking-tight text-white/95">{tier.name}</div>
          <div className="font-mono text-[10.5px] text-white/55">{tier.targetFirm}</div>

          <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-[12.5px]">
            <Line k={`${seats} advisor seats × $${tier.perAdvisorMonth}`} v={`$${(tier.perAdvisorMonth * seats).toLocaleString()}`} />
            {Object.entries(addOns).filter(([, v]) => v).map(([id]) => {
              const a = ADD_ONS.find((x) => x.id === id);
              return a ? <Line key={id} k={a.label} v={`$${a.price}`} /> : null;
            })}
            {billing === 'annual' && (
              <Line k={`Annual discount ${Math.round(tier.annualDiscount * 100)}%`} v={`-$${Math.round(monthlyTotal * 12 - annualTotal).toLocaleString()}`} accent="text-cw-approved" />
            )}
            <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45">{billing === 'annual' ? 'Billed annually' : 'Billed monthly'}</span>
              <span className="font-mono text-[28px] leading-none text-white/95">${billed.toLocaleString()}</span>
            </div>
            {billing === 'annual' && <div className="text-right font-mono text-[10.5px] text-white/45">~${Math.round(annualTotal / 12).toLocaleString()}/mo equivalent</div>}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-white/45 mb-2">Council composition</div>
            <div className="flex flex-wrap gap-1.5">
              {tier.agents.map((n) => (
                <span key={n} className="font-mono text-[10px] tracking-wider px-1.5 py-0.5 rounded-sm border border-white/10 text-white/75 bg-cw-bg">{n}</span>
              ))}
            </div>
          </div>

          {firmName && (
            <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 text-[12px]">
              <Line k="Firm" v={firmName} />
              <Line k="Tenant ID" v={`firm_${slug}`} mono />
              <Line k="Region" v={jurisdiction === 'EU' ? 'eu-central-1' : jurisdiction === 'UK' ? 'eu-west-2' : 'us-east-1'} mono />
            </div>
          )}

          <ul className="mt-5 pt-4 border-t border-white/10 space-y-1.5">
            {[
              { ico: ShieldCheck, label: 'Sentinel-grade compliance' },
              { ico: Globe,       label: 'Tenant-scoped data isolation' },
              { ico: ChartLineUp, label: 'Live deliberation observability' },
            ].map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-[11.5px] text-white/65">
                <r.ico size={11} weight="duotone" className="text-white/40" />
                {r.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function Line({ k, v, mono, accent = 'text-white/95' }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-white/60">{k}</span>
      <span className={[mono ? 'font-mono' : '', accent].join(' ')}>{v}</span>
    </div>
  );
}
