import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendUp, TrendDown, Lightning, ArrowUpRight, Plugs, ShieldWarning,
  CheckCircle, Sparkle, Timer, Broadcast
} from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { KPIS, RECENT_SESSIONS, INTEGRATIONS } from '@/data/mockData';

function Sparkline({ data, color = '#3b82f6', width = 100, height = 28 }) {
  if (!data?.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} className="cw-spark" style={{ color }}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiTile({ label, value, unit, delta, sparkData, sparkColor, testid }) {
  const isUp = delta > 0;
  const deltaColor = isUp ? 'text-cw-approved' : delta < 0 ? 'text-cw-vetoed' : 'text-white/40';
  return (
    <div className="rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/20 transition-colors p-5 relative overflow-hidden" data-testid={testid}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">{label}</span>
        {delta !== undefined && (
          <span className={`font-mono text-[11px] flex items-center gap-1 ${deltaColor}`}>
            {isUp ? <TrendUp size={11} /> : <TrendDown size={11} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[32px] leading-none tracking-tight text-white/95">{value}</div>
          {unit && <div className="font-mono text-[11px] text-white/40 mt-1.5">{unit}</div>}
        </div>
        <div className="opacity-80"><Sparkline data={sparkData} color={sparkColor} /></div>
      </div>
    </div>
  );
}

function SectionHeader({ label, right }) {
  return (
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{label}</span>
      </div>
      {right}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppShell title="Command Center" subtitle="Overview / Last 24h" headerActions={null}>
      {/* KPI Strip */}
      <section className="grid grid-cols-5 gap-3 mb-8" data-testid="kpi-strip">
        <KpiTile testid="kpi-sessions" label="Sessions · 24h" value={KPIS.sessions24h} unit="council runs" delta={KPIS.sessions24hDelta}
          sparkData={[42, 51, 48, 63, 59, 72, 81, 76, 84, 92, 88, 142]} sparkColor="#3b82f6" />
        <KpiTile testid="kpi-veto" label="Veto Rate" value={`${KPIS.vetoRate}%`} unit="SentinelCompliance" delta={KPIS.vetoRateDelta}
          sparkData={[5.6, 5.4, 5.8, 5.1, 4.9, 5.2, 4.9, 4.8]} sparkColor="#dc2626" />
        <KpiTile testid="kpi-sync" label="Sync Health" value={`${KPIS.syncHealth}%`} unit="CRM · PMS · Aggregator" delta={KPIS.syncHealthDelta}
          sparkData={[96.0, 96.2, 96.9, 96.5, 97.1, 97.0, 97.2]} sparkColor="#10b981" />
        <KpiTile testid="kpi-latency" label="Avg Latency" value={`${KPIS.avgLatency}s`} unit="p50 deliberation" delta={KPIS.avgLatencyDelta}
          sparkData={[14.2, 13.8, 13.1, 12.6, 12.2, 11.9, 11.4]} sparkColor="#a855f7" />
        <KpiTile testid="kpi-approvals" label="Open Approvals" value={KPIS.openApprovals} unit="HITL · Temporal" delta={undefined}
          sparkData={[4, 5, 3, 6, 5, 7, 7]} sparkColor="#f59e0b" />
      </section>

      {/* Two-col split */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Recent sessions table */}
        <section className="col-span-8" data-testid="recent-sessions">
          <SectionHeader
            label="Recent Council Sessions"
            right={
              <Link to="/council/new" data-testid="cta-new-session"
                className="group flex items-center gap-2 h-8 px-3 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/20 transition-colors">
                <Lightning size={12} weight="duotone" className="text-cw-running" />
                <span className="text-[12px] text-white/90">New Session</span>
                <span className="font-mono text-[10px] text-white/40">⌘N</span>
              </Link>
            }
          />
          <div className="rounded-sm border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[110px_1fr_130px_110px_90px_90px] gap-3 px-4 py-2.5 border-b border-white/10 bg-[#111] font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              <span>Session</span>
              <span>Client · Headline</span>
              <span>Advisor</span>
              <span>Status</span>
              <span className="text-right">Confidence</span>
              <span className="text-right">Started</span>
            </div>
            <div>
              {RECENT_SESSIONS.map((s) => (
                <Link
                  key={s.id}
                  to={`/council/live/${s.id}`}
                  data-testid={`session-row-${s.id}`}
                  className="grid grid-cols-[110px_1fr_130px_110px_90px_90px] gap-3 items-center px-4 py-3 border-b border-white/[0.06] hover:bg-cw-elevated hover:border-white/15 transition-colors group"
                >
                  <span className="font-mono text-[12px] text-white/70">{s.id}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] text-white/95 truncate">{s.clientName}</div>
                    <div className="text-[11px] text-white/50 truncate">{s.headline}</div>
                  </div>
                  <span className="text-[12px] text-white/60">{s.advisorName}</span>
                  <StateBadge state={s.status} size="sm" pulse={s.status === 'RUNNING'} />
                  <span className="font-mono text-[12px] text-right text-white/85">
                    {s.confidence != null ? s.confidence.toFixed(2) : <span className="text-white/30">—</span>}
                  </span>
                  <span className="font-mono text-[11px] text-right text-white/50">{s.startedAt}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Integration health grid */}
        <section className="col-span-4" data-testid="integration-health">
          <SectionHeader
            label="Integration Health"
            right={<Link to="/integrations" className="font-mono text-[10px] tracking-wider text-white/50 hover:text-white flex items-center gap-1">Manage <ArrowUpRight size={10} /></Link>}
          />
          <div className="grid grid-cols-2 gap-2">
            {INTEGRATIONS.map((i) => (
              <div key={i.provider} className="rounded-sm border border-white/10 bg-cw-surface p-3 hover:border-white/20 hover:bg-cw-elevated transition-colors" data-testid={`integration-tile-${i.provider}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase">{i.category}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${i.status === 'SYNC_RUNNING' ? 'cw-pulse' : ''}`}
                    style={{
                      backgroundColor:
                        i.status === 'CONNECTED' ? '#10b981'
                        : i.status === 'SYNC_RUNNING' ? '#3b82f6'
                        : i.status === 'TOKEN_EXPIRING' ? '#f59e0b'
                        : i.status === 'DISCONNECTED' ? '#f43f5e' : '#94a3b8',
                    }}
                  />
                </div>
                <div className="text-[13px] text-white/95 font-medium truncate">{i.provider}</div>
                <div className="font-mono text-[10px] text-white/40 mt-0.5">last sync {i.lastSync}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Highlight row */}
      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-8 rounded-sm border border-white/10 bg-cw-surface overflow-hidden" data-testid="highlight-council">
          <div className="grid grid-cols-[1fr_260px]">
            <div className="p-6 cw-grid-bg">
              <div className="flex items-center gap-2 mb-3">
                <Broadcast size={12} className="text-cw-running" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-cw-running uppercase">Live Council · CW-2041</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cw-running cw-pulse" />
              </div>
              <h2 className="font-display text-[26px] leading-tight tracking-tight text-white/95 mb-2">
                Retirement-income drawdown with staged Roth conversions
              </h2>
              <p className="text-[13px] text-white/55 leading-relaxed max-w-xl mb-5">
                Wilson, J. · Age 62 · AUM $2.3M · Target $140k/yr · Moderate. Committee deliberating across Retirement,
                Tax, Risk, and Actuarial. Sentinel review pending.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/council/live/CW-2041" data-testid="cta-enter-live"
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-sm bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors">
                  Enter live session <ArrowUpRight size={12} weight="bold" />
                </Link>
                <button className="inline-flex items-center gap-2 h-9 px-4 rounded-sm border border-white/15 bg-cw-elevated hover:border-white/25 text-[12px] text-white/85">
                  <Timer size={12} /> Schedule review
                </button>
              </div>
            </div>
            <div className="border-l border-white/10 p-5 space-y-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-1">Consensus</div>
                <div className="font-mono text-[30px] leading-none text-white/95">0.84<span className="text-white/30 text-[14px]">/1.00</span></div>
                <div className="h-1 mt-2 bg-white/[0.06] rounded-sm overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cw-running to-cw-approved" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                  <div className="font-mono text-[10px] text-white/40">Agents</div>
                  <div className="font-mono text-[15px] text-white/95">7 / 14</div>
                </div>
                <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                  <div className="font-mono text-[10px] text-white/40">Veto</div>
                  <div className="font-mono text-[15px] text-cw-approved">none</div>
                </div>
                <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                  <div className="font-mono text-[10px] text-white/40">Elapsed</div>
                  <div className="font-mono text-[15px] text-white/95">01:48</div>
                </div>
                <div className="rounded-sm border border-white/10 bg-cw-bg p-2">
                  <div className="font-mono text-[10px] text-white/40">Trace</div>
                  <div className="font-mono text-[11px] text-white/70">7af1…c02</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-span-4 rounded-sm border border-white/10 bg-cw-surface p-5" data-testid="governance-card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldWarning size={12} className="text-cw-vetoed" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-cw-vetoed uppercase">Governance</span>
          </div>
          <h3 className="font-display text-[18px] tracking-tight text-white/95 mb-1">1 blocking veto in review</h3>
          <p className="text-[12px] text-white/55 mb-4 leading-relaxed">
            CW-2040 · Carter, H. · Sentinel blocked for FINRA 2111 suitability mismatch and concentration breach.
          </p>
          <Link to="/council/live/CW-2040" data-testid="cta-review-veto"
            className="inline-flex items-center gap-2 h-8 px-3 rounded-sm border border-cw-vetoed/40 text-cw-vetoed text-[12px] hover:bg-cw-vetoed/10">
            Review veto <ArrowUpRight size={12} />
          </Link>

          <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5">
            {[
              { ico: CheckCircle, color: 'text-cw-approved', label: 'All PII sanitizations passed', sub: '100% Ghost Map integrity' },
              { ico: Sparkle, color: 'text-cw-archived', label: 'WORM export window open', sub: '2,104 sessions ready · SEC 17a-4' },
              { ico: Plugs, color: 'text-cw-waiting', label: 'Salesforce token expiring', sub: 'Refresh in ≤ 48h' },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <r.ico size={14} className={r.color} weight="duotone" />
                <div className="flex-1">
                  <div className="text-[12px] text-white/85 leading-tight">{r.label}</div>
                  <div className="font-mono text-[10px] text-white/40 mt-0.5">{r.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
