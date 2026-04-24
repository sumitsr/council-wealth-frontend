import React from 'react';
import { Plugs, ArrowsClockwise, Lightning, WarningDiamond, Clock, Link as LinkIcon, KeyReturn } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { INTEGRATIONS } from '@/data/mockData';

const PROVIDER_ACCENT = {
  'Wealthbox': 'from-[#4f46e5]/20 to-[#4f46e5]/5',
  'Salesforce FSC': 'from-[#00a1e0]/20 to-[#00a1e0]/5',
  'Orion Advisor': 'from-[#e11d48]/20 to-[#e11d48]/5',
  'Black Diamond': 'from-[#0f766e]/20 to-[#0f766e]/5',
  'Plaid': 'from-[#60a5fa]/20 to-[#60a5fa]/5',
  'Morningstar Direct': 'from-[#f59e0b]/20 to-[#f59e0b]/5',
};

const SYNC_HISTORY = [
  { id: 'r1', provider: 'Orion Advisor', at: '14:02:14', entities: '1,284 snapshots', status: 'SYNC_RUNNING', duration: '…' },
  { id: 'r2', provider: 'Wealthbox', at: '14:00:11', entities: '420 contacts · 92 tasks', status: 'APPROVED', duration: '38s' },
  { id: 'r3', provider: 'Black Diamond', at: '13:58:44', entities: '612 positions', status: 'APPROVED', duration: '27s' },
  { id: 'r4', provider: 'Morningstar Direct', at: '13:55:01', entities: '12 ticks', status: 'APPROVED', duration: '2s' },
  { id: 'r5', provider: 'Salesforce FSC', at: '13:41:02', entities: '—', status: 'WAITING_APPROVAL', duration: '—' },
  { id: 'r6', provider: 'Plaid', at: '12:04:19', entities: 'aborted', status: 'FAILED', duration: '14s' },
];

export default function Integrations() {
  const [selectedProvider, setSelectedProvider] = React.useState('Orion Advisor');

  return (
    <AppShell
      title="Integrations"
      subtitle="CRM · PMS · Aggregators · Market"
      rightRail={
        <>
          <RailSection label="Health Summary" icon={Plugs}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Tile label="Connected" value="4" color="text-cw-approved" />
              <Tile label="Running" value="1" color="text-cw-running" />
              <Tile label="Warnings" value="1" color="text-cw-waiting" />
              <Tile label="Disconnected" value="1" color="text-cw-vetoed" />
            </div>
          </RailSection>
          <RailSection label="Rate Limit">
            <div className="rounded-sm border border-white/10 bg-cw-surface p-3">
              <div className="font-mono text-[10px] text-white/40 mb-1">Tenant · rpm</div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[22px] text-white/95">1,240</span>
                <span className="font-mono text-[11px] text-white/40">/ 5,000</span>
              </div>
              <div className="h-1 mt-2 bg-white/[0.06] rounded-sm overflow-hidden">
                <div className="h-full bg-cw-running" style={{ width: '24.8%' }} />
              </div>
            </div>
          </RailSection>
          <RailSection label="Upcoming Refreshes">
            <ul className="space-y-2 text-[11px]">
              <li className="flex justify-between"><span className="text-white/80">Salesforce token</span><span className="font-mono text-cw-waiting">~46h</span></li>
              <li className="flex justify-between"><span className="text-white/80">Plaid re-link</span><span className="font-mono text-cw-vetoed">overdue</span></li>
              <li className="flex justify-between"><span className="text-white/80">Orion schedule</span><span className="font-mono text-white/60">00:15</span></li>
            </ul>
          </RailSection>
        </>
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] tracking-tight text-white/95">Data Moat · provider graph</h1>
          <p className="text-[12px] text-white/55 mt-1">Tenant-scoped credentials · encrypted at rest · every sync run is Temporal-durable.</p>
        </div>
        <button className="h-9 px-4 rounded-sm bg-white text-black text-[12px] font-semibold flex items-center gap-2 hover:bg-white/90" data-testid="btn-add-integration">
          <LinkIcon size={13} weight="bold" /> Add integration
        </button>
      </div>

      {/* Provider grid */}
      <section className="grid grid-cols-3 gap-3 mb-8" data-testid="provider-grid">
        {INTEGRATIONS.map((p) => (
          <button
            key={p.provider}
            onClick={() => setSelectedProvider(p.provider)}
            data-testid={`provider-card-${p.provider}`}
            className={[
              'text-left relative rounded-sm border p-4 transition-colors overflow-hidden',
              selectedProvider === p.provider ? 'border-white/30 bg-cw-elevated' : 'border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/20',
            ].join(' ')}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${PROVIDER_ACCENT[p.provider] || 'from-white/5 to-transparent'} opacity-60 pointer-events-none`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{p.category}</div>
                  <div className="font-display text-[18px] text-white/95 tracking-tight mt-0.5">{p.provider}</div>
                </div>
                <StateBadge state={p.status} size="sm" pulse={p.status === 'SYNC_RUNNING'} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="font-mono text-[10px] text-white/40">Last sync</div>
                  <div className="font-mono text-[12px] text-white/90">{p.lastSync}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-white/40">Cursor</div>
                  <div className="font-mono text-[12px] text-white/90 truncate">{p.cursor}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="font-mono text-white/40">health</span>
                  <span className={`font-mono ${p.health > 95 ? 'text-cw-approved' : p.health > 80 ? 'text-cw-waiting' : 'text-cw-vetoed'}`}>
                    {p.health.toFixed(1)}%
                  </span>
                </div>
                <button className="flex items-center gap-1 font-mono text-[10px] text-white/70 hover:text-white">
                  <ArrowsClockwise size={11} /> Sync now
                </button>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Sync history */}
      <section data-testid="sync-history">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-white/40" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">Sync Run History</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/40">
            <span>Temporal-durable</span> · <span className="text-cw-approved">retries armed</span>
          </div>
        </div>
        <div className="rounded-sm border border-white/10 overflow-hidden">
          <div className="grid grid-cols-[160px_1fr_150px_90px_90px] gap-3 px-4 py-2.5 bg-[#111] border-b border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
            <span>Provider</span>
            <span>Entities</span>
            <span>Status</span>
            <span>Duration</span>
            <span className="text-right">Time</span>
          </div>
          {SYNC_HISTORY.map((r) => (
            <div key={r.id} data-testid={`sync-row-${r.id}`}
                 className="grid grid-cols-[160px_1fr_150px_90px_90px] gap-3 items-center px-4 py-3 border-b border-white/[0.06] hover:bg-cw-elevated">
              <span className="text-[13px] text-white/95">{r.provider}</span>
              <span className="text-[12px] text-white/70">{r.entities}</span>
              <StateBadge state={r.status} size="sm" pulse={r.status === 'SYNC_RUNNING'} />
              <span className="font-mono text-[12px] text-white/80">{r.duration}</span>
              <span className="font-mono text-[11px] text-right text-white/50">{r.at}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Tile({ label, value, color = 'text-white/95' }) {
  return (
    <div className="rounded-sm border border-white/10 bg-cw-surface p-2.5">
      <div className="font-mono text-[10px] text-white/40">{label}</div>
      <div className={`font-mono text-[18px] ${color} leading-tight mt-0.5`}>{value}</div>
    </div>
  );
}
