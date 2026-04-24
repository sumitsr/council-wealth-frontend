import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Lightning, FileText, ShieldCheck, ChartDonut, ArrowRight } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { CLIENTS, CLIENT_SESSIONS, CLIENT_SPARKS, PORTFOLIOS } from '@/data/mockData';

const ALLOC_COLORS = {
  eq:   { label: 'Equities',    color: '#3b82f6' },
  fi:   { label: 'Fixed inc.',  color: '#10b981' },
  alt:  { label: 'Alternatives',color: '#a855f7' },
  cash: { label: 'Cash',        color: '#94a3b8' },
};

function DonutSVG({ data, size = 120, stroke = 14 }) {
  // data: array of {key, pct, color}
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {data.map((d, i) => {
        const len = (d.pct / 100) * c;
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${len} ${c}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

function Spark({ data, color = '#3b82f6', w = 320, h = 60 }) {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / rng) * (h - 4) - 2}`);
  const lineD = 'M ' + pts.join(' L ');
  const areaD = `${lineD} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} className="cw-spark" style={{ color }}>
      <defs>
        <linearGradient id="cw-spark-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#cw-spark-area)" />
      <path d={lineD} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ClientProfile() {
  const { clientId } = useParams();
  const client = CLIENTS.find((c) => c.id === clientId);
  if (!client) return <Navigate to="/clients" replace />;

  const sessions = CLIENT_SESSIONS[client.id] || [];
  const portfolio = PORTFOLIOS[client.id];
  const spark = CLIENT_SPARKS[client.id] || [];

  const totalAlloc = portfolio?.holdings.reduce(
    (acc, h) => {
      Object.entries(h.alloc).forEach(([k, v]) => { acc[k] = (acc[k] || 0) + (v * h.allocation); });
      return acc;
    },
    {}
  ) || {};
  const donutData = Object.keys(ALLOC_COLORS).map((k) => ({
    key: k,
    pct: totalAlloc[k] || 0,
    color: ALLOC_COLORS[k].color,
  }));

  const pct = spark.length ? (((spark[spark.length - 1] - spark[0]) / spark[0]) * 100) : 0;

  return (
    <AppShell
      title={client.name}
      subtitle="Client profile"
      rightRail={
        <>
          <RailSection label="Compliance history" icon={ShieldCheck}>
            <div className="space-y-2 text-[12px]">
              {[
                { d: '2026-04-28', e: 'Sentinel review initiated', st: 'RUNNING' },
                { d: '2026-03-14', e: 'Reg BI disclosure renewed', st: 'APPROVED' },
                { d: '2026-02-01', e: 'Annual suitability review', st: 'APPROVED' },
                { d: '2025-11-08', e: 'Tax-loss harvesting audit', st: 'APPROVED' },
              ].map((r, i) => (
                <div key={i} className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-white/45">{r.d}</div>
                    <div className="text-[12px] text-white/85 leading-tight">{r.e}</div>
                  </div>
                  <StateBadge state={r.st} size="sm" />
                </div>
              ))}
            </div>
          </RailSection>
          <RailSection label="Quick actions">
            <div className="space-y-2">
              <Link to={`/council/new?client=${client.id}`} data-testid="profile-cta-new"
                className="w-full flex items-center justify-between h-9 px-3 rounded-sm bg-white text-black text-[12px] font-semibold hover:bg-white/90">
                <span className="flex items-center gap-2"><Lightning size={12} weight="fill" /> New council</span>
                <ArrowRight size={11} weight="bold" />
              </Link>
              <button className="w-full flex items-center justify-between h-9 px-3 rounded-sm border border-white/10 bg-cw-elevated hover:border-white/25 text-[12px] text-white/85">
                <span className="flex items-center gap-2"><FileText size={12} /> Export dossier</span>
              </button>
            </div>
          </RailSection>
        </>
      }
    >
      {/* Breadcrumb back */}
      <div className="mb-5 flex items-center gap-3 cw-reveal">
        <Link to="/clients" className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-wider uppercase text-white/50 hover:text-white">
          <ArrowLeft size={11} /> All clients
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-mono text-[10.5px] tracking-wider uppercase text-white/70">{client.householdId}</span>
      </div>

      {/* Hero */}
      <section className="rounded-sm border border-white/10 bg-cw-surface overflow-hidden cw-reveal mb-6" data-testid="profile-hero">
        <div className="grid grid-cols-[1fr_360px]">
          <div className="p-7 cw-ambient-bg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Household {client.householdId}</span>
              <span className="w-1 h-1 rounded-full bg-white/25" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cw-approved">
                Active client · onboarded 2021
              </span>
            </div>
            <h2 className="font-display text-[34px] tracking-tight leading-[1.05] text-white/95 mb-2">{client.name}</h2>
            <p className="text-[13px] text-white/55 max-w-xl leading-relaxed">
              {client.risk} risk · {client.jurisdiction} jurisdiction · Age {client.age}, targeting retirement at {client.retireAge}.
              Target annual income ${client.need.toLocaleString()}.
            </p>

            <div className="grid grid-cols-4 gap-0 mt-6 border-t border-white/10">
              <Field label="AUM" value={`$${(client.aum/1e6).toFixed(2)}M`} />
              <Field label="Sessions" value={sessions.length} />
              <Field label="Avg confidence" value={avgConfidence(sessions)} />
              <Field label="Open approvals" value={sessions.filter(s => s.status === 'WAITING_APPROVAL').length} />
            </div>
          </div>

          {/* Performance chart */}
          <div className="border-l border-white/10 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">24-mo performance</span>
              <span className={`font-mono text-[14px] ${pct >= 0 ? 'text-cw-approved' : 'text-cw-vetoed'}`}>
                {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
              </span>
            </div>
            <div className="flex-1 flex items-end">
              <Spark data={spark} color="#3b82f6" w={300} h={110} />
            </div>
            <div className="flex justify-between font-mono text-[9.5px] text-white/40 pt-2 border-t border-dotted border-white/10">
              <span>2024-04</span>
              <span>2025-04</span>
              <span>2026-04</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two-col: portfolio + sessions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Portfolio */}
        <section className="col-span-5 cw-reveal" style={{ animationDelay: '0.08s' }} data-testid="profile-portfolio">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ChartDonut size={12} className="text-cw-archived" weight="duotone" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Portfolio composition</span>
            </div>
            <span className="font-mono text-[11px] text-white/55">total ${(portfolio?.total / 1e6).toFixed(2)}M</span>
          </div>

          {/* Donut + legend */}
          <div className="rounded-sm border border-white/10 bg-cw-surface p-5">
            <div className="flex items-center gap-6">
              <div className="relative">
                <DonutSVG data={donutData} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-[9.5px] tracking-[0.25em] text-white/40 uppercase">Blend</span>
                  <span className="font-display text-[20px] text-white/95">
                    {Math.round(donutData[0].pct)}/{Math.round(donutData[1].pct)}
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {donutData.map((d) => (
                  <div key={d.key} className="flex items-center gap-3 text-[12px]">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-white/85 flex-1">{ALLOC_COLORS[d.key].label}</span>
                    <span className="font-mono text-white/95">{d.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Holdings */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-2">Accounts</div>
              <div className="space-y-1.5">
                {portfolio?.holdings.map((h) => (
                  <div key={h.acc} className="flex items-center gap-3 py-1 text-[12px] cw-dotted-leader">
                    <span className="text-white/85">{h.acc}</span>
                    <span className="font-mono text-white/95">${(h.value/1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sessions */}
        <section className="col-span-7 cw-reveal" style={{ animationDelay: '0.12s' }} data-testid="profile-sessions">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FileText size={12} className="text-cw-running" weight="duotone" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Session history</span>
            </div>
            <span className="font-mono text-[11px] text-white/55">{sessions.length} total</span>
          </div>
          <div className="rounded-sm border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[110px_1fr_140px_90px] gap-3 px-4 py-2.5 bg-[#111] border-b border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              <span>Session</span>
              <span>Headline</span>
              <span>Status</span>
              <span className="text-right">Confidence</span>
            </div>
            {sessions.map((s) => (
              <Link
                key={s.id}
                to={`/council/live/${s.id}`}
                data-testid={`profile-session-${s.id}`}
                className="grid grid-cols-[110px_1fr_140px_90px] gap-3 items-center px-4 py-3 border-b border-white/[0.06] hover:bg-cw-elevated"
              >
                <span className="font-mono text-[12px] text-white/70">{s.id}</span>
                <div className="min-w-0">
                  <div className="text-[13px] text-white/95 truncate">{s.headline}</div>
                  <div className="font-mono text-[10.5px] text-white/45 mt-0.5">{s.date}</div>
                </div>
                <StateBadge state={s.status} size="sm" pulse={s.status === 'RUNNING'} />
                <span className="font-mono text-[12px] text-right text-white/85">
                  {s.confidence != null ? s.confidence.toFixed(2) : <span className="text-white/30">—</span>}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function avgConfidence(sessions) {
  const c = sessions.filter((s) => s.confidence != null);
  if (!c.length) return '—';
  return (c.reduce((a, b) => a + b.confidence, 0) / c.length).toFixed(2);
}

function Field({ label, value }) {
  return (
    <div className="py-4 px-4 border-r border-white/10 last:border-r-0">
      <div className="font-mono text-[9.5px] tracking-[0.25em] uppercase text-white/45">{label}</div>
      <div className="font-mono text-[20px] text-white/95 mt-1">{value}</div>
    </div>
  );
}
