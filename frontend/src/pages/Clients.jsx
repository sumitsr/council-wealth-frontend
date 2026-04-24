import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MagnifyingGlass, Funnel, ArrowRight } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { CLIENTS, CLIENT_SESSIONS, CLIENT_SPARKS } from '@/data/mockData';

function Spark({ data, color = '#3b82f6', w = 120, h = 28 }) {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / rng) * (h - 4) - 2}`).join(' ');
  const last = data[data.length - 1];
  const first = data[0];
  const pct = ((last - first) / first) * 100;
  return (
    <div className="flex items-center gap-2">
      <svg width={w} height={h} className="cw-spark" style={{ color }}>
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-mono text-[11px] ${pct >= 0 ? 'text-cw-approved' : 'text-cw-vetoed'}`}>
        {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
      </span>
    </div>
  );
}

const JURISDICTIONS = ['ALL', 'US', 'UK', 'EU'];
const RISK_FILTERS = ['ALL', 'CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'];

export default function Clients() {
  const [q, setQ] = React.useState('');
  const [jur, setJur] = React.useState('ALL');
  const [risk, setRisk] = React.useState('ALL');

  const rows = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return CLIENTS.filter((c) => {
      if (jur !== 'ALL' && c.jurisdiction !== jur) return false;
      if (risk !== 'ALL' && c.risk.toUpperCase() !== risk) return false;
      if (qq && !c.name.toLowerCase().includes(qq) && !c.id.toLowerCase().includes(qq)) return false;
      return true;
    });
  }, [q, jur, risk]);

  const totals = {
    total: CLIENTS.length,
    aum: CLIENTS.reduce((a, b) => a + b.aum, 0),
    activeCouncils: 1,
    openApprovals: 2,
  };

  return (
    <AppShell title="Clients" subtitle="Household Index">
      <section className="mb-6 cw-reveal">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-[30px] tracking-tight leading-tight text-white/95">Client households</h1>
            <p className="text-[13px] text-white/55 mt-1 max-w-xl">
              All households under advisement at Aldrich & Quinn. Open any for full session history, portfolio composition, and compliance record.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-right">
            <Stat label="Households" value={totals.total} />
            <Stat label="Total AUM" value={`$${(totals.aum/1e6).toFixed(2)}M`} />
            <Stat label="Active councils" value={totals.activeCouncils} />
            <Stat label="Open approvals" value={totals.openApprovals} />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap" data-testid="clients-filters">
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find by name or household ID…"
              data-testid="clients-search"
              className="w-full h-9 pl-9 pr-3 rounded-sm border border-white/10 bg-cw-surface focus:border-cw-running/60 focus:outline-none text-[12px] text-white/90 placeholder:text-white/30"
            />
          </div>
          <div className="flex items-center gap-0 border border-white/10 rounded-sm overflow-hidden">
            {JURISDICTIONS.map((j) => (
              <button key={j} onClick={() => setJur(j)} data-testid={`clients-jur-${j}`}
                className={[
                  'h-9 px-3 font-mono text-[10px] tracking-wider uppercase border-r border-white/10 last:border-r-0',
                  jur === j ? 'bg-white/10 text-white/95' : 'text-white/55 hover:bg-white/5',
                ].join(' ')}>{j}</button>
            ))}
          </div>
          <div className="flex items-center gap-0 border border-white/10 rounded-sm overflow-hidden">
            {RISK_FILTERS.map((r) => (
              <button key={r} onClick={() => setRisk(r)} data-testid={`clients-risk-${r}`}
                className={[
                  'h-9 px-3 font-mono text-[10px] tracking-wider uppercase border-r border-white/10 last:border-r-0',
                  risk === r ? 'bg-white/10 text-white/95' : 'text-white/55 hover:bg-white/5',
                ].join(' ')}>{r.slice(0, 4)}</button>
            ))}
          </div>
          <div className="ml-auto font-mono text-[10px] tracking-wider text-white/40 uppercase">
            {rows.length} / {CLIENTS.length} shown
          </div>
        </div>
      </section>

      {/* Client cards */}
      <section className="grid grid-cols-2 gap-3 cw-stagger" data-testid="clients-grid">
        {rows.map((c) => {
          const sessions = CLIENT_SESSIONS[c.id] || [];
          const active = sessions.find((s) => s.status === 'RUNNING' || s.status === 'WAITING_APPROVAL');
          const lastSession = sessions[0];
          return (
            <Link
              key={c.id}
              to={`/clients/${c.id}`}
              data-testid={`client-card-${c.id}`}
              className="group rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/25 transition-colors overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/15 bg-[#0c0c0c] flex items-center justify-center">
                    <span className="font-display text-[14px] font-medium text-white/95">
                      {c.name.split(',')[0].slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-[17px] tracking-tight text-white/95 leading-tight">{c.name}</div>
                    <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-white/45 mt-0.5">
                      {c.householdId} · {c.jurisdiction} · {c.risk}
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-white/30 group-hover:text-white/70 transition-colors" />
              </div>
              <div className="grid grid-cols-3 px-5 py-4">
                <Tile label="AUM" value={`$${(c.aum / 1e6).toFixed(2)}M`} />
                <Tile label="Target" value={`$${(c.need / 1000).toFixed(0)}k/y`} />
                <Tile label="Age / retire" value={`${c.age}/${c.retireAge}`} />
              </div>
              <div className="px-5 pb-4 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">24-mo performance</span>
                  <Spark data={CLIENT_SPARKS[c.id]} color="#3b82f6" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dotted border-white/10">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-white/50">
                    {sessions.length} session{sessions.length === 1 ? '' : 's'}
                  </span>
                  {active && <StateBadge state={active.status} size="sm" pulse={active.status === 'RUNNING'} />}
                  {!active && lastSession && <StateBadge state={lastSession.status} size="sm" />}
                  {!lastSession && <span className="text-[10px] text-white/30 font-mono">—</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </AppShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-right">
      <div className="font-mono text-[9.5px] tracking-[0.2em] uppercase text-white/40">{label}</div>
      <div className="font-mono text-[15px] text-white/95 mt-0.5">{value}</div>
    </div>
  );
}
function Tile({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-white/40">{label}</div>
      <div className="font-mono text-[15px] text-white/95 mt-1">{value}</div>
    </div>
  );
}
