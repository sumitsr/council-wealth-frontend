import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendUp, TrendDown, Lightning, ArrowUpRight, Plugs, ShieldWarning,
  CheckCircle, Sparkle, Timer, Broadcast
} from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { KPIS, RECENT_SESSIONS, INTEGRATIONS, INTRADAY_SESSIONS, INTRADAY_VETOS, INTRADAY_LATENCY, WEEK_HEATMAP } from '@/data/mockData';

function Sparkline({ data, color = '#3b82f6', width = 100, height = 28, area = true }) {
  if (!data?.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`);
  const lineD = 'M ' + points.join(' L ');
  const areaD = area ? `${lineD} L ${width},${height} L 0,${height} Z` : null;
  const gid = `spark-${color.replace('#','')}`;
  return (
    <svg width={width} height={height} className="cw-spark" style={{ color }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={areaD} fill={`url(#${gid})`} />}
      <path d={lineD} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Bars({ data, color = '#dc2626', width = 100, height = 28 }) {
  const max = Math.max(...data, 1);
  const bw = width / data.length - 1.5;
  return (
    <svg width={width} height={height} className="cw-spark">
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        return <rect key={i} x={i * (bw + 1.5)} y={height - h} width={bw} height={h} fill={v > 0 ? color : 'rgba(255,255,255,0.08)'} opacity={v > 0 ? 0.85 : 1} />;
      })}
    </svg>
  );
}

function Heatmap({ data }) {
  // 7 rows x 24 cols
  const max = Math.max(...data.flat(), 1);
  const daysLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-[2px] pt-0.5 font-mono text-[9px] text-white/35 tracking-wider">
        {daysLabels.map((d, i) => <span key={i} className="h-[14px] leading-[14px]">{d}</span>)}
      </div>
      <div className="flex-1">
        <div className="grid grid-rows-7 grid-cols-24 gap-[2px]" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
          {data.map((row, ri) =>
            row.map((v, ci) => {
              const intensity = v / max;
              const bg = v === 0
                ? 'rgba(255,255,255,0.03)'
                : `rgba(59,130,246,${0.15 + intensity * 0.8})`;
              return (
                <div
                  key={`${ri}-${ci}`}
                  className="h-[14px] cw-heat-cell"
                  style={{ backgroundColor: bg }}
                  title={`day ${ri} · hour ${ci} · ${v} sessions`}
                />
              );
            })
          )}
        </div>
        <div className="flex justify-between mt-1 font-mono text-[9px] tracking-wider text-white/35">
          <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
        </div>
      </div>
    </div>
  );
}

function KpiTile({ label, value, unit, delta, sparkData, sparkColor, bars, testid }) {
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
        <div className="opacity-85">
          {bars
            ? <Bars data={sparkData} color={sparkColor} />
            : <Sparkline data={sparkData} color={sparkColor} />}
        </div>
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
      <section className="grid grid-cols-5 gap-3 mb-8 cw-stagger" data-testid="kpi-strip">
        <KpiTile testid="kpi-sessions" label="Sessions · 24h" value={KPIS.sessions24h} unit="council runs" delta={KPIS.sessions24hDelta}
          sparkData={INTRADAY_SESSIONS} sparkColor="#3b82f6" />
        <KpiTile testid="kpi-veto" label="Veto Rate" value={`${KPIS.vetoRate}%`} unit="SentinelCompliance" delta={KPIS.vetoRateDelta} bars
          sparkData={INTRADAY_VETOS} sparkColor="#dc2626" />
        <KpiTile testid="kpi-sync" label="Sync Health" value={`${KPIS.syncHealth}%`} unit="CRM · PMS · Aggregator" delta={KPIS.syncHealthDelta}
          sparkData={[96.0, 96.2, 96.9, 96.5, 97.1, 97.0, 97.2]} sparkColor="#10b981" />
        <KpiTile testid="kpi-latency" label="Avg Latency" value={`${KPIS.avgLatency}s`} unit="p50 deliberation" delta={KPIS.avgLatencyDelta}
          sparkData={INTRADAY_LATENCY} sparkColor="#a855f7" />
        <KpiTile testid="kpi-approvals" label="Open Approvals" value={KPIS.openApprovals} unit="HITL · Temporal" delta={undefined}
          sparkData={[4, 5, 3, 6, 5, 7, 7]} sparkColor="#f59e0b" />
      </section>

      {/* Activity heatmap + intraday */}
      <section className="grid grid-cols-12 gap-3 mb-8 cw-reveal" style={{ animationDelay: '0.2s' }} data-testid="activity-analytics">
        <div className="col-span-8 rounded-sm border border-white/10 bg-cw-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Broadcast size={12} className="text-cw-running" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Council activity · past 7 days</span>
            </div>
            <span className="font-mono text-[10px] text-white/40 tracking-wider">peak Thu 13:00 · 12 runs</span>
          </div>
          <Heatmap data={WEEK_HEATMAP} />
        </div>
        <div className="col-span-4 rounded-sm border border-white/10 bg-cw-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Timer size={12} className="text-cw-archived" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Intraday latency · sessions</span>
            </div>
          </div>
          <div className="relative h-[96px]">
            <svg viewBox="0 0 320 96" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cw-latency-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cw-session-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const w = 320, h = 96, pad = 4;
                const s = INTRADAY_SESSIONS;
                const sMax = Math.max(...s);
                const sPts = s.map((v, i) => `${(i * (w - pad*2)) / (s.length - 1) + pad},${h - (v / sMax) * (h - 10) - 2}`);
                const l = INTRADAY_LATENCY;
                const lMin = Math.min(...l), lMax = Math.max(...l);
                const lPts = l.map((v, i) => `${(i * (w - pad*2)) / (l.length - 1) + pad},${h - ((v - lMin) / (lMax - lMin || 1)) * (h - 10) - 2}`);
                const sArea = `M ${sPts.join(' L ')} L ${w - pad},${h} L ${pad},${h} Z`;
                const lArea = `M ${lPts.join(' L ')} L ${w - pad},${h} L ${pad},${h} Z`;
                return (
                  <g>
                    <path d={sArea} fill="url(#cw-session-area)" />
                    <path d={`M ${sPts.join(' L ')}`} fill="none" stroke="#3b82f6" strokeWidth="1.25" />
                    <path d={lArea} fill="url(#cw-latency-area)" />
                    <path d={`M ${lPts.join(' L ')}`} fill="none" stroke="#a855f7" strokeWidth="1.25" />
                  </g>
                );
              })()}
            </svg>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-white/10 font-mono text-[10px] text-white/50">
            <span className="flex items-center gap-1.5"><span className="w-2 h-[3px] bg-cw-running" /> sessions</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-[3px] bg-cw-archived" /> p50 latency</span>
            <span>24 buckets · hourly</span>
          </div>
        </div>
      </section>

      {/* Two-col split */}
      <div className="grid grid-cols-12 gap-6 mb-8 cw-reveal" style={{ animationDelay: '0.3s' }}>
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
