import React from 'react';
import { ShieldCheck, Pulse, Brain, Scales, Export } from '@phosphor-icons/react';
import StateBadge from '@/components/shared/StateBadge';
import { COMPLIANCE_ALERTS, APPROVAL_QUEUE } from '@/data/mockData';
import { useToast } from '@/components/shared/ToastProvider';

export default function RightRail({ children, variant = 'default' }) {
  return (
    <aside
      className="w-80 border-l border-white/10 h-screen fixed right-0 top-0 bg-[#0A0A0A] overflow-y-auto pt-16"
      data-testid="right-rail"
    >
      {children || <DefaultRail />}
    </aside>
  );
}

function RailSection({ label, icon: Icon, badge, children }) {
  return (
    <div className="border-b border-white/10 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={12} className="text-white/40" weight="duotone" />}
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{label}</span>
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

function DefaultRail() {
  const { push } = useToast();
  const [queue, setQueue] = React.useState(APPROVAL_QUEUE);

  const handle = (id, action) => {
    const item = queue.find((q) => q.id === id);
    setQueue((prev) => prev.filter((q) => q.id !== id));
    push({
      variant: action === 'approve' ? 'success' : 'warning',
      title: action === 'approve' ? 'Approval ratified' : 'Approval declined',
      desc: `${item?.id} · ${item?.client} — ${action === 'approve' ? 'sent for outbound delivery' : 'sent back for revision'}.`,
    });
  };

  return (
    <div>
      <RailSection
        label="Compliance Pulse"
        icon={ShieldCheck}
        badge={<span className="font-mono text-[10px] text-cw-approved">NOMINAL</span>}
      >
        <div className="space-y-2">
          {COMPLIANCE_ALERTS.map((a) => (
            <div key={a.id} className="rounded-sm border border-white/10 bg-cw-surface px-3 py-2" data-testid={`rail-alert-${a.id}`}>
              <div className="flex items-center justify-between mb-1">
                <StateBadge state={a.severity} size="sm" />
                <span className="font-mono text-[10px] text-white/40">{a.time}</span>
              </div>
              <div className="font-mono text-[10px] text-white/50 mb-0.5">{a.code}</div>
              <div className="text-[12px] text-white/80 leading-snug">{a.message}</div>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection label="Approval Queue" icon={Scales} badge={<span className="font-mono text-[10px] text-cw-waiting">{queue.length} OPEN</span>}>
        <div className="space-y-2">
          {queue.length === 0 && (
            <div className="text-[12px] text-white/40 italic text-center py-4 border border-dashed border-white/10 rounded-sm">
              Queue is clear.
            </div>
          )}
          {queue.map((q) => (
            <div key={q.id} className="rounded-sm border border-white/10 bg-cw-surface px-3 py-2.5" data-testid={`rail-approval-${q.id}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-white/70">{q.id}</span>
                <span className="font-mono text-[10px] text-cw-waiting">⏱ {q.waited}</span>
              </div>
              <div className="text-[12px] text-white/85 font-medium mb-0.5">{q.client}</div>
              <div className="text-[11px] text-white/50 leading-snug">{q.reason}</div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => handle(q.id, 'approve')} data-testid={`rail-approve-${q.id}`} className="flex-1 h-7 rounded-sm border border-white/10 bg-cw-elevated hover:border-cw-approved/40 hover:text-cw-approved text-[11px] text-white/80 font-medium transition-colors">Approve</button>
                <button onClick={() => handle(q.id, 'decline')} data-testid={`rail-decline-${q.id}`} className="flex-1 h-7 rounded-sm border border-white/10 bg-cw-elevated hover:border-cw-vetoed/40 hover:text-cw-vetoed text-[11px] text-white/80 font-medium transition-colors">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </RailSection>

      <RailSection label="Council Activity" icon={Pulse}>
        <ul className="space-y-3">
          {[
            { t: '14:03', txt: 'CW-2041 · Scholar retrieved 8 citations' },
            { t: '14:02', txt: 'CW-2041 · Session started by S. Navarro' },
            { t: '13:58', txt: 'CW-2039 · WORM export completed' },
            { t: '13:44', txt: 'CW-2040 · Sentinel VETO · FINRA 2111' },
            { t: '13:18', txt: 'Orion sync checkpoint snap_0428' },
          ].map((e, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[10px] text-white/40 pt-0.5">{e.t}</span>
              <span className="text-[11px] text-white/70 leading-snug">{e.txt}</span>
            </li>
          ))}
        </ul>
      </RailSection>

      <RailSection label="WORM Archive" icon={Export}>
        <div className="rounded-sm border border-white/10 bg-cw-surface p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-white/60">Nightly batch</span>
            <StateBadge state="PENDING" size="sm" />
          </div>
          <div className="font-mono text-[22px] text-white/95 leading-none">2,104</div>
          <div className="font-mono text-[10px] text-white/40 mt-1">sessions queued · s3://cw-worm/firm_aq_us</div>
          <div className="mt-3 h-1 rounded-sm bg-white/[0.06] overflow-hidden">
            <div className="h-full bg-cw-archived/60" style={{ width: '68%' }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[10px] text-white/40">68% · retained until 2033-04</span>
            <span className="font-mono text-[10px] text-cw-archived">SEC 17a-4</span>
          </div>
        </div>
      </RailSection>

      <RailSection label="Model Ops" icon={Brain}>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-sm border border-white/10 bg-cw-surface p-2.5">
            <div className="font-mono text-[10px] text-white/40">p50 latency</div>
            <div className="font-mono text-[16px] text-white/95 leading-tight">8.4s</div>
          </div>
          <div className="rounded-sm border border-white/10 bg-cw-surface p-2.5">
            <div className="font-mono text-[10px] text-white/40">p95 latency</div>
            <div className="font-mono text-[16px] text-white/95 leading-tight">14.1s</div>
          </div>
          <div className="rounded-sm border border-white/10 bg-cw-surface p-2.5">
            <div className="font-mono text-[10px] text-white/40">PII tokens</div>
            <div className="font-mono text-[16px] text-cw-approved leading-tight">100%</div>
          </div>
          <div className="rounded-sm border border-white/10 bg-cw-surface p-2.5">
            <div className="font-mono text-[10px] text-white/40">Veto rate 24h</div>
            <div className="font-mono text-[16px] text-white/95 leading-tight">4.8%</div>
          </div>
        </div>
      </RailSection>
    </div>
  );
}

export { RailSection };
