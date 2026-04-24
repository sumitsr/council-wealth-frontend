import React from 'react';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import StateTag from '@/components/shared/StateTag';
import { INTEGRATIONS } from '@/data/mockData';

const SYNC_HISTORY = [
  { id: 'r1', provider: 'Orion Advisor',     at: '14:02:14', entities: '1,284 position snapshots', status: 'RUNNING',  duration: '…' },
  { id: 'r2', provider: 'Wealthbox',          at: '14:00:11', entities: '420 contacts · 92 tasks',  status: 'APPROVED', duration: '38s' },
  { id: 'r3', provider: 'Black Diamond',      at: '13:58:44', entities: '612 positions',           status: 'APPROVED', duration: '27s' },
  { id: 'r4', provider: 'Morningstar Direct', at: '13:55:01', entities: '12 market ticks',         status: 'APPROVED', duration: '2s' },
  { id: 'r5', provider: 'Salesforce FSC',     at: '13:41:02', entities: '—',                        status: 'WAITING_APPROVAL', duration: '—' },
  { id: 'r6', provider: 'Plaid',              at: '12:04:19', entities: 'aborted · token invalid', status: 'FAILED',   duration: '14s' },
];

export default function Integrations() {
  const [selected, setSelected] = React.useState('Orion Advisor');

  return (
    <PageFrame>
      <PageMasthead
        eyebrow="Gazette · Ingestion Channels"
        meta="CRM · PMS · Aggregator · Market"
        title={<>The council's <span className="not-italic text-cw-copper">correspondents in the field</span>.</>}
        lede="Every external channel is tenant-scoped, encrypted at rest, and run as a Temporal-durable workflow. A failed sync does not fail silently — it is persisted, retried, and disclosed in the nightly gazette below."
      />

      <Canvas>
        <div className="grid grid-cols-12 gap-10 mb-10">
          {/* Provider cards — ledger cells */}
          <section className="col-span-12 lg:col-span-8" data-testid="provider-grid">
            <SectionRule label="Correspondents" tail={`${INTEGRATIONS.length} CHANNELS`} />
            <div className="grid grid-cols-2 border-t-2 border-l-2 border-cw-ink">
              {INTEGRATIONS.map((p) => {
                const active = selected === p.provider;
                return (
                  <div
                    key={p.provider}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(p.provider)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p.provider); } }}
                    data-testid={`provider-${p.provider}`}
                    className={[
                      'border-r-2 border-b-2 border-cw-ink p-6 cursor-pointer transition-colors',
                      active ? 'bg-cw-masthead' : 'bg-cw-canvas hover:bg-cw-masthead/60',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-cw-ink-mute">{p.category}</span>
                      <StateTag state={p.status} size="sm" uppercase />
                    </div>
                    <h3 className="font-display italic text-[28px] leading-tight tracking-tight text-cw-ink mb-4">{p.provider}</h3>
                    <div className="border-t border-cw-ink/30 pt-3 grid grid-cols-2 gap-4 text-[12.5px]">
                      <div>
                        <div className="font-mono text-[10px] tracking-wider uppercase text-cw-ink-mute">Last sync</div>
                        <div className="font-mono text-cw-ink mt-1">{p.lastSync}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] tracking-wider uppercase text-cw-ink-mute">Cursor</div>
                        <div className="font-mono text-cw-ink mt-1 truncate">{p.cursor}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-dotted border-cw-rule">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[10px] tracking-wider uppercase text-cw-ink-mute">Health</span>
                        <span className={[
                          'font-mono text-[14px]',
                          p.health > 95 ? 'text-cw-fiduciary' : p.health > 80 ? 'text-cw-copper' : 'text-cw-vetoed',
                        ].join(' ')}>{p.health.toFixed(1)}%</span>
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-soft border-b border-cw-ink/30 hover:border-cw-ink hover:text-cw-ink pb-0.5"
                        data-testid={`btn-sync-${p.provider}`}
                      >
                        Dispatch sync
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4" data-testid="integ-sidebar">
            <SectionRule label="Counsel's note" />
            <div className="border-t border-cw-ink pt-5 mb-6">
              <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">Correspondent · {selected}</div>
              <h3 className="font-display italic text-[28px] leading-tight text-cw-ink mt-2 mb-4">Under correspondence</h3>
              <div className="space-y-1.5 text-[13.5px]">
                {[
                  ['Scheme', 'OAuth 2.0 · PKCE'],
                  ['Credentials', 'encrypted at rest'],
                  ['Workflow', 'Temporal-durable'],
                  ['Retries', 'exponential · 5 attempts'],
                  ['Schedule', 'nightly · manual dispatch'],
                  ['Firm scope', 'firm_aq_us'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1">
                    <span className="text-cw-ink-soft">{k}</span>
                    <span className="font-mono text-cw-ink">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-cw-ink pt-5 mb-6">
              <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute mb-3">Tenant rate limit</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display italic text-[48px] leading-none text-cw-ink">1,240</span>
                <span className="font-mono text-[11px] text-cw-ink-mute">/ 5,000 rpm</span>
              </div>
              <div className="h-[6px] bg-cw-masthead border border-cw-rule mt-3 relative">
                <div className="h-full bg-cw-fiduciary" style={{ width: '24.8%' }} />
              </div>
            </div>

            <div className="border-t border-cw-ink pt-5">
              <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute mb-3">Upcoming refreshes</div>
              <ul className="space-y-2 text-[13px]">
                <li className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1"><span className="text-cw-ink-soft">Salesforce token</span><span className="font-mono text-cw-copper">~46 h</span></li>
                <li className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1"><span className="text-cw-ink-soft">Plaid re-link</span><span className="font-mono text-cw-vetoed">overdue</span></li>
                <li className="flex items-baseline justify-between border-b border-dotted border-cw-rule pb-1"><span className="text-cw-ink-soft">Orion schedule</span><span className="font-mono text-cw-ink">00:15</span></li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Gazette: sync history */}
        <SectionRule label="Gazette of sync runs" tail="TEMPORAL-DURABLE · RETRIES ARMED" />
        <div className="border-t-2 border-cw-ink mb-4" data-testid="sync-history">
          <div className="grid grid-cols-[180px_1fr_160px_100px_110px] gap-4 px-2 py-2 border-b border-cw-ink font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">
            <span>Correspondent</span>
            <span>Entities</span>
            <span>Standing</span>
            <span>Duration</span>
            <span className="text-right">Time</span>
          </div>
          {SYNC_HISTORY.map((r) => (
            <div key={r.id} data-testid={`sync-row-${r.id}`}
                 className="grid grid-cols-[180px_1fr_160px_100px_110px] gap-4 items-center px-2 py-4 border-b border-cw-rule hover:bg-cw-masthead/60">
              <span className="font-display text-[16px] italic text-cw-ink">{r.provider}</span>
              <span className="text-[13px] text-cw-ink-soft">{r.entities}</span>
              <StateTag state={r.status} size="sm" uppercase />
              <span className="font-mono text-[12px] text-cw-ink">{r.duration}</span>
              <span className="font-mono text-[11px] text-right text-cw-ink-mute">{r.at}</span>
            </div>
          ))}
        </div>
      </Canvas>
    </PageFrame>
  );
}
