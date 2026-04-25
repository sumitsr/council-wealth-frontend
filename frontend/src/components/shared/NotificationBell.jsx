import React from 'react';
import {
  Bell,
  Check,
  ArrowRight,
  X,
  Funnel,
  ShieldWarning,
  CircleNotch,
  Plug,
  Archive,
  ChartLineUp,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './NotificationProvider';

const SEVERITY = {
  CRITICAL: { color: '#f43f5e' },
  WARN:     { color: '#f59e0b' },
  INFO:     { color: '#3b82f6' },
};

const CATEGORY = {
  COMPLIANCE:  { label: 'Compliance', icon: ShieldWarning },
  SESSION:     { label: 'Session',    icon: CircleNotch },
  INTEGRATION: { label: 'Integration', icon: Plug },
  AUDIT:       { label: 'Audit',      icon: Archive },
  PLAN:        { label: 'Plan',       icon: ChartLineUp },
};

const FILTERS = ['ALL', 'COMPLIANCE', 'SESSION', 'INTEGRATION', 'AUDIT', 'PLAN'];

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('ALL');
  const wrapRef = React.useRef(null);

  // Close on outside click / ESC
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const filtered =
    filter === 'ALL' ? notifications : notifications.filter((n) => n.category === filter);

  const handleOpen = (n) => {
    markRead(n.id);
    if (n.route) navigate(n.route);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        data-testid="header-alerts"
        aria-label="Notifications"
        className={[
          'relative h-9 w-9 rounded-sm border bg-cw-surface flex items-center justify-center transition-colors',
          open
            ? 'border-white/30 bg-cw-elevated'
            : 'border-white/10 hover:bg-cw-elevated hover:border-white/20',
        ].join(' ')}
      >
        <Bell size={15} className="text-white/70" weight="duotone" />
        {unreadCount > 0 && (
          <span
            data-testid="header-alerts-badge"
            className="absolute -top-1 -right-1 min-w-[16px] h-[16px] rounded-sm bg-cw-vetoed text-[9px] font-mono font-semibold text-white flex items-center justify-center px-1 cw-pulse"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          data-testid="notification-panel"
          className="absolute top-11 right-0 w-[400px] rounded-sm border border-white/15 bg-[#0a0a0a] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0e0e0e]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display text-[13px] font-medium text-white/95">Notifications</span>
              <span className="font-mono text-[9.5px] tracking-[0.2em] text-white/35 uppercase truncate">
                {unreadCount} new · {notifications.length} total
              </span>
            </div>
            <button
              onClick={markAllRead}
              data-testid="ntf-mark-all"
              disabled={unreadCount === 0}
              className="font-mono text-[10px] tracking-wider uppercase text-white/55 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
            >
              <Check size={11} /> Mark all read
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 overflow-x-auto">
            <Funnel size={11} className="text-white/35 shrink-0" />
            {FILTERS.map((f) => {
              const isActive = filter === f;
              const count = f === 'ALL'
                ? notifications.length
                : notifications.filter((n) => n.category === f).length;
              return (
                <button
                  key={f}
                  data-testid={`ntf-filter-${f.toLowerCase()}`}
                  onClick={() => setFilter(f)}
                  className={[
                    'h-6 px-2 rounded-sm border font-mono text-[9.5px] tracking-wider uppercase transition-colors shrink-0 flex items-center gap-1.5',
                    isActive
                      ? 'border-white/40 bg-white/10 text-white'
                      : 'border-white/10 bg-cw-surface text-white/55 hover:text-white hover:border-white/20',
                  ].join(' ')}
                >
                  <span>{f === 'ALL' ? 'All' : CATEGORY[f].label}</span>
                  <span className="text-white/35">{count}</span>
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="max-h-[480px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center" data-testid="ntf-empty">
                <div className="w-10 h-10 mx-auto rounded-sm border border-white/10 bg-cw-surface flex items-center justify-center mb-3">
                  <Bell size={16} className="text-white/30" />
                </div>
                <div className="font-display text-[13px] text-white/75">No alerts</div>
                <div className="font-mono text-[10px] tracking-wider text-white/35 mt-1">
                  The council is quiet.
                </div>
              </div>
            ) : (
              filtered.map((n) => {
                const sev = SEVERITY[n.severity] || SEVERITY.INFO;
                const cat = CATEGORY[n.category] || CATEGORY.SESSION;
                const Icon = cat.icon;
                return (
                  <div
                    key={n.id}
                    data-testid={`ntf-item-${n.id}`}
                    onClick={() => handleOpen(n)}
                    className={[
                      'group relative flex gap-3 px-4 py-3 border-b border-white/5 cursor-pointer transition-colors',
                      n.read
                        ? 'bg-transparent hover:bg-white/[0.03]'
                        : 'bg-white/[0.02] hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    {/* Unread accent bar */}
                    {!n.read && (
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{ backgroundColor: sev.color }}
                      />
                    )}

                    {/* Severity dot + category icon */}
                    <div className="flex flex-col items-center pt-1 gap-1.5 shrink-0">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: sev.color,
                          boxShadow: !n.read ? `0 0 6px ${sev.color}99` : 'none',
                        }}
                      />
                      <Icon size={11} className="text-white/30" />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span
                          className={[
                            'font-display text-[12.5px] truncate',
                            n.read ? 'text-white/70 font-normal' : 'text-white/95 font-medium',
                          ].join(' ')}
                        >
                          {n.title}
                        </span>
                        <span className="font-mono text-[9px] tracking-wider uppercase text-white/30 shrink-0">
                          {n.category}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-white/55 leading-snug line-clamp-2">
                        {n.body}
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="font-mono text-[9px] tracking-wider text-white/30">
                          {n.time}
                        </span>
                        {n.cta && (
                          <span className="flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase text-white/45 group-hover:text-white">
                            {n.cta} <ArrowRight size={9} />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                      data-testid={`ntf-dismiss-${n.id}`}
                      className="opacity-0 group-hover:opacity-100 self-start h-5 w-5 rounded-sm border border-white/10 bg-cw-surface text-white/40 hover:text-white hover:border-white/25 flex items-center justify-center transition-opacity"
                      title="Dismiss"
                    >
                      <X size={9} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/10 bg-[#0e0e0e] flex items-center justify-between">
            <span className="font-mono text-[9.5px] tracking-[0.2em] text-white/35 uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cw-running cw-pulse" />
              Live · WS pending (Phase 3)
            </span>
            <button
              onClick={() => { setOpen(false); navigate('/compliance/audit'); }}
              data-testid="ntf-view-all"
              className="font-mono text-[10px] tracking-wider uppercase text-white/55 hover:text-white"
            >
              Open audit log →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
