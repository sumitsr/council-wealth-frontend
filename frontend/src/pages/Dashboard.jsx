import React from 'react';
import { Link } from 'react-router-dom';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import StateTag from '@/components/shared/StateTag';
import { KPIS, RECENT_SESSIONS, INTEGRATIONS, COMPLIANCE_ALERTS } from '@/data/mockData';

function KpiEntry({ index, label, value, unit, delta, note }) {
  const up = delta > 0;
  return (
    <div className="col-span-3 border-l border-cw-ink pl-6 py-2" data-testid={`kpi-${index}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[52px] leading-none tracking-tight text-cw-ink">{value}</span>
        {unit && <span className="font-mono text-[12px] text-cw-ink-mute">{unit}</span>}
      </div>
      <div className="mt-3 flex items-center gap-3">
        {delta != null && (
          <span className={`font-mono text-[11px] tracking-wider ${up ? 'text-cw-fiduciary' : 'text-cw-copper'}`}>
            {up ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {note && <span className="font-mono text-[10.5px] text-cw-ink-mute tracking-wide">{note}</span>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <PageFrame>
      <PageMasthead
        eyebrow="Vol. IV · No. 04 · 28 APR MMXXVI"
        meta="The morning post"
        title={<>The committee convened <span className="not-italic text-cw-copper">142 times</span> in the last twenty-four hours.</>}
        lede="A single veto under review. All ingestion channels healthy save for Plaid. The nightly WORM folio is two-thirds bound and will seal at midnight."
        right={
          <Link
            to="/council/new"
            data-testid="cta-convene"
            className="group flex items-center gap-3 h-11 px-6 bg-cw-fiduciary text-cw-canvas font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-fiduciary-deep"
          >
            Convene new session
            <span className="font-display italic text-[14px] -translate-y-[1px]">⟶</span>
          </Link>
        }
      />

      <Canvas>
        {/* KPI ledger row */}
        <section className="grid grid-cols-12 border-t border-b border-cw-ink py-6 mb-12" data-testid="kpi-ledger">
          <KpiEntry index="sessions"  label="Sessions"        value={KPIS.sessions24h}        unit="in 24 h"            delta={KPIS.sessions24hDelta}   note="rolling" />
          <KpiEntry index="veto"      label="Veto rate"       value={`${KPIS.vetoRate}%`}     unit=""                    delta={KPIS.vetoRateDelta}      note="sentinel" />
          <KpiEntry index="sync"      label="Sync health"     value={`${KPIS.syncHealth}%`}   unit=""                    delta={KPIS.syncHealthDelta}    note="ingestion" />
          <KpiEntry index="latency"   label="Avg. deliberation" value={`${KPIS.avgLatency}s`} unit=""                    delta={KPIS.avgLatencyDelta}    note="p50" />
        </section>

        {/* Two-column editorial split */}
        <div className="grid grid-cols-12 gap-12 mb-16">
          {/* Lede: live council */}
          <article className="col-span-12 lg:col-span-8 border-t border-cw-ink pt-6" data-testid="live-lede">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-cw-copper rounded-full" style={{ animation: 'cw-node-pulse 1.6s ease-in-out infinite' }} />
                In chambers now · CW-2041
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">elapsed 01:48</span>
            </div>
            <h2 className="font-display italic text-[40px] leading-[1.05] tracking-tight text-cw-ink mb-5">
              A phased retirement-income drawdown for Mrs. J. Wilson, with staged Roth conversions to age seventy.
            </h2>
            <p className="text-[15px] leading-relaxed text-cw-ink-soft max-w-2xl mb-6 font-body">
              The committee is weighing a four-point-two-percent initial withdrawal against dynamic guardrails of 3.6–4.8%,
              a bond-tent glidepath of fifty to thirty percent, and a Roth conversion schedule sized to avoid IRMAA Tier 2.
              Seven of fourteen chairs have spoken; Sentinel is in review.
            </p>

            <div className="grid grid-cols-3 gap-0 border-t border-b border-cw-ink mb-6">
              {[
                { label: 'Consensus', value: '0.84' },
                { label: 'Chairs spoken', value: '7 / 14' },
                { label: 'Blocking findings', value: 'none', accent: 'text-cw-fiduciary' },
              ].map((c, i) => (
                <div key={i} className={`py-5 px-5 ${i < 2 ? 'border-r border-cw-ink/30' : ''}`}>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute mb-2">{c.label}</div>
                  <div className={`font-display text-[30px] leading-none tracking-tight ${c.accent || 'text-cw-ink'}`}>{c.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/council/live/CW-2041" data-testid="cta-enter-live"
                className="inline-flex items-center gap-3 h-11 px-6 bg-cw-fiduciary text-cw-canvas font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-fiduciary-deep">
                Take my seat <span className="font-display italic">⟶</span>
              </Link>
              <Link to="/compliance/audit" className="h-11 px-5 border border-cw-ink text-cw-ink font-mono text-[11px] tracking-[0.22em] uppercase hover:bg-cw-masthead flex items-center">
                Observe past session
              </Link>
            </div>
          </article>

          {/* Sidenote: governance */}
          <aside className="col-span-12 lg:col-span-4 border-t border-cw-ink pt-6 relative" data-testid="governance-sidenote">
            <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">Sidebar · Governance</span>
            <h3 className="font-display italic text-[26px] leading-[1.1] tracking-tight text-cw-ink mt-3 mb-4">
              One veto awaits the bench's review.
            </h3>
            <p className="text-[14px] leading-relaxed text-cw-ink-soft mb-5 font-body">
              CW-2040 · Mr. H. Carter. Sentinel invoked on grounds of FINRA 2111 suitability mismatch and a single-issuer concentration above 25%.
              Disclosure language was deemed insufficient.
            </p>
            <ul className="space-y-2 border-t border-cw-rule pt-3 mb-6">
              {COMPLIANCE_ALERTS.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-[13px] border-b border-dotted border-cw-rule pb-2">
                  <StateTag state={a.severity} size="sm" uppercase />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-cw-ink-mute">{a.code} · {a.time}</div>
                    <div className="text-cw-ink">{a.message}</div>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/council/live/CW-2040" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-cw-vetoed border-b border-cw-vetoed/50 hover:border-cw-vetoed pb-0.5">
              Review the veto →
            </Link>
          </aside>
        </div>

        {/* Ledger: recent sessions */}
        <SectionRule label="Ledger of recent sessions" tail={`${RECENT_SESSIONS.length} ENTRIES · LAST 24 H`} />
        <div className="border-t-2 border-cw-ink mb-12" data-testid="recent-ledger">
          <div className="grid grid-cols-[110px_1fr_180px_140px_90px_90px] gap-4 px-2 py-2 border-b border-cw-ink font-mono text-[10px] uppercase tracking-[0.22em] text-cw-ink-mute">
            <span>Session</span>
            <span>Matter</span>
            <span>Advisor</span>
            <span>Standing</span>
            <span className="text-right">Consensus</span>
            <span className="text-right">Opened</span>
          </div>
          {RECENT_SESSIONS.map((s) => (
            <Link
              key={s.id}
              to={`/council/live/${s.id}`}
              data-testid={`ledger-row-${s.id}`}
              className="grid grid-cols-[110px_1fr_180px_140px_90px_90px] gap-4 items-center px-2 py-4 border-b border-cw-rule hover:bg-cw-masthead/60 transition-colors"
            >
              <span className="font-mono text-[12px] text-cw-ink">{s.id}</span>
              <div className="min-w-0">
                <div className="font-display text-[16px] italic leading-tight text-cw-ink">{s.clientName}</div>
                <div className="text-[12.5px] text-cw-ink-soft leading-snug mt-0.5 truncate">{s.headline}</div>
              </div>
              <span className="text-[12.5px] text-cw-ink-soft">{s.advisorName}</span>
              <StateTag state={s.status} size="sm" uppercase />
              <span className="font-mono text-[13px] text-right text-cw-ink">
                {s.confidence != null ? s.confidence.toFixed(2) : <span className="text-cw-ink-mute">—</span>}
              </span>
              <span className="font-mono text-[11px] text-right text-cw-ink-mute">{s.startedAt}</span>
            </Link>
          ))}
        </div>

        {/* Gazette: integrations */}
        <SectionRule label="Gazette of external channels" tail="CRM · PMS · AGGREGATOR · MARKET" />
        <section className="grid grid-cols-6 border-t-2 border-l border-cw-ink mb-4" data-testid="integration-gazette">
          {INTEGRATIONS.map((p, i) => (
            <div key={p.provider} className="col-span-3 md:col-span-2 border-r border-b border-cw-ink p-5 bg-cw-canvas" data-testid={`integ-${p.provider}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9.5px] tracking-[0.24em] uppercase text-cw-ink-mute">{p.category}</span>
                <StateTag state={p.status} size="sm" uppercase />
              </div>
              <div className="font-display italic text-[22px] leading-tight text-cw-ink mb-3">{p.provider}</div>
              <div className="flex items-baseline justify-between border-t border-dotted border-cw-rule pt-2 font-mono text-[11px]">
                <span className="text-cw-ink-mute">last sync</span>
                <span className="text-cw-ink">{p.lastSync}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-dotted border-cw-rule pt-2 font-mono text-[11px] mt-1">
                <span className="text-cw-ink-mute">health</span>
                <span className={p.health > 95 ? 'text-cw-fiduciary' : p.health > 80 ? 'text-cw-copper' : 'text-cw-vetoed'}>
                  {p.health.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </section>
        <div className="flex justify-end">
          <Link to="/integrations" className="font-mono text-[11px] tracking-[0.22em] uppercase text-cw-ink-soft border-b border-cw-ink/40 hover:border-cw-ink pb-0.5">
            Open the gazette →
          </Link>
        </div>
      </Canvas>
    </PageFrame>
  );
}
