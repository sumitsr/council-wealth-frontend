import React from 'react';
import StateTag from '@/components/shared/StateTag';
import { COMPLIANCE_ALERTS, APPROVAL_QUEUE, CLIENTS } from '@/data/mockData';

// Paper-folio drawer that slides in from the right edge when invoked.
export default function PinnedDrawer({ open, onClose }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const client = CLIENTS[0];

  return (
    <>
      {/* Scrim — paper darkened */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-cw-ink/20"
        data-testid="drawer-scrim"
      />
      {/* Drawer — appears as a pinned folio */}
      <aside
        data-testid="pinned-drawer"
        className="cw-drawer-in fixed top-0 right-0 h-screen w-[420px] bg-cw-canvas border-l border-cw-ink z-50 overflow-y-auto"
      >
        {/* Folio header */}
        <div className="border-b border-cw-ink px-7 py-5 bg-cw-masthead">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-cw-ink-mute">Folio · Live Intelligence</span>
            <button
              onClick={onClose}
              data-testid="btn-close-drawer"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-cw-ink-mute hover:text-cw-ink"
            >
              Close · ESC
            </button>
          </div>
          <h2 className="font-display italic text-[28px] leading-none tracking-tight mt-3 text-cw-ink">Pinned client</h2>
        </div>

        <Section label="Client of record">
          <div className="space-y-2 text-[13px]">
            <Row k="Name" v={client.name} />
            <Row k="Age / retirement" v={`${client.age} / ${client.retireAge}`} mono />
            <Row k="Risk profile" v={client.risk} />
            <Row k="Jurisdiction" v={client.jurisdiction} mono />
            <Row k="Assets under mgmt." v={`$${(client.aum/1e6).toFixed(2)}M`} mono />
            <Row k="Target income" v={`$${(client.need/1000).toFixed(0)}k / yr`} mono />
          </div>
        </Section>

        <Section label="Compliance pulse">
          <ul className="divide-y divide-cw-rule">
            {COMPLIANCE_ALERTS.map((a) => (
              <li key={a.id} className="py-3 flex items-start gap-3" data-testid={`drawer-alert-${a.id}`}>
                <StateTag state={a.severity} size="sm" uppercase />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-cw-ink-mute tracking-wider">{a.code} · {a.time}</div>
                  <div className="text-[13px] text-cw-ink leading-snug">{a.message}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Awaiting counsel">
          <ul className="space-y-3">
            {APPROVAL_QUEUE.map((q) => (
              <li key={q.id} className="border border-cw-rule bg-cw-paper p-4" data-testid={`drawer-approval-${q.id}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cw-ink-mute">{q.id} · {q.sessionId}</span>
                  <span className="font-mono text-[10px] text-cw-copper">waiting {q.waited}</span>
                </div>
                <div className="font-display text-[15px] text-cw-ink leading-tight">{q.client}</div>
                <div className="text-[12px] text-cw-ink-soft mt-0.5 leading-snug">{q.reason}</div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex-1 h-8 bg-cw-fiduciary text-cw-canvas font-mono text-[10.5px] uppercase tracking-[0.18em] hover:bg-cw-fiduciary-deep">Ratify</button>
                  <button className="flex-1 h-8 border border-cw-ink font-mono text-[10.5px] uppercase tracking-[0.18em] text-cw-ink hover:bg-cw-masthead">Decline</button>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="WORM archive">
          <div className="border border-cw-rule bg-cw-paper p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-cw-ink-mute">Nightly folio</span>
              <StateTag state="WAITING_APPROVAL" size="sm" />
            </div>
            <div className="font-display text-[32px] text-cw-ink leading-none">2,104</div>
            <div className="font-mono text-[10.5px] text-cw-ink-mute mt-2">sessions queued · s3://cw-worm/firm_aq_us</div>
            <div className="mt-3 h-[6px] bg-cw-masthead border border-cw-rule relative">
              <div className="h-full bg-cw-fiduciary" style={{ width: '68%' }} />
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-cw-ink-mute">
              <span>68% · retained until 2033-04</span>
              <span className="text-cw-fiduciary">SEC 17a-4</span>
            </div>
          </div>
        </Section>

        <div className="h-12" />
      </aside>
    </>
  );
}

function Section({ label, children }) {
  return (
    <div className="border-b border-cw-rule px-7 py-5">
      <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-cw-ink-mute mb-3">{label}</div>
      {children}
    </div>
  );
}

function Row({ k, v, mono }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dotted border-cw-rule pb-1">
      <span className="text-cw-ink-soft">{k}</span>
      <span className={mono ? 'font-mono text-cw-ink' : 'font-display text-[14px] text-cw-ink'}>{v}</span>
    </div>
  );
}
