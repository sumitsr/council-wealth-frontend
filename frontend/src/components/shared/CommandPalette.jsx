import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, ArrowRight, Lightning, Users, Plugs, ShieldCheck, Binoculars, Buildings, Cube, FlowArrow, FileText, CircleNotch } from '@phosphor-icons/react';
import { RECENT_SESSIONS, CLIENTS, AGENTS, AUDIT_SESSIONS } from '@/data/mockData';

const CommandCtx = React.createContext({ open: () => {}, close: () => {} });
export const useCommandPalette = () => React.useContext(CommandCtx);

export function CommandPaletteProvider({ children }) {
  const [isOpen, setOpen] = React.useState(false);
  const open = React.useCallback(() => setOpen(true), []);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <CommandCtx.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && <Palette onClose={close} />}
    </CommandCtx.Provider>
  );
}

function Palette({ onClose }) {
  const nav = useNavigate();
  const [q, setQ] = React.useState('');
  const [focus, setFocus] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);

  const items = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    const nav = [
      { kind: 'page', key: 'dash',    label: 'Dashboard',           sub: 'Command Center overview',           icon: Cube,        path: '/' },
      { kind: 'page', key: 'new',     label: 'New Council Session', sub: 'Compose a deliberation',            icon: Lightning,   path: '/council/new' },
      { kind: 'page', key: 'live',    label: 'Live Council',        sub: 'Deliberation in progress',          icon: CircleNotch, path: '/council/live/CW-2041' },
      { kind: 'page', key: 'audit',   label: 'Audit & Replay',      sub: 'Regulator-grade replay',            icon: Binoculars,  path: '/compliance/audit' },
      { kind: 'page', key: 'clients', label: 'Clients',             sub: 'Client index & profiles',           icon: Users,       path: '/clients' },
      { kind: 'page', key: 'integ',   label: 'Integrations',        sub: 'CRM · PMS · Aggregators',           icon: Plugs,       path: '/integrations' },
      { kind: 'page', key: 'admin',   label: 'Tenant Admin',        sub: 'Quotas · flags · SSO · retention',  icon: Buildings,   path: '/admin/tenant' },
      { kind: 'page', key: 'comp',    label: 'Compliance',          sub: 'Policies & approvals',              icon: ShieldCheck, path: '/compliance/audit' },
    ];
    const sessions = RECENT_SESSIONS.concat(AUDIT_SESSIONS).map((s) => ({
      kind: 'session', key: s.id, label: `${s.id} · ${s.clientName}`,
      sub: s.headline || 'Audited session', icon: FlowArrow, path: `/council/live/${s.id}`,
      meta: s.status || s.outcome,
    }));
    const seen = new Set();
    const deduped = sessions.filter((s) => (seen.has(s.key) ? false : (seen.add(s.key), true)));
    const clients = CLIENTS.map((c) => ({
      kind: 'client', key: c.id, label: c.name, sub: `${c.risk} · ${c.jurisdiction} · $${(c.aum/1e6).toFixed(2)}M`,
      icon: Users, path: `/clients/${c.id}`,
    }));
    const agents = AGENTS.map((a) => ({
      kind: 'agent', key: a.name, label: a.name, sub: `${a.layer} · ${a.role}`,
      icon: FileText, path: `/council/live/CW-2041?agent=${a.name}`,
    }));
    const all = [...nav, ...deduped, ...clients, ...agents];
    if (!qq) return all.slice(0, 14);
    return all.filter((it) => it.label.toLowerCase().includes(qq) || it.sub.toLowerCase().includes(qq) || it.key.toLowerCase().includes(qq)).slice(0, 20);
  }, [q]);

  React.useEffect(() => { setFocus(0); }, [q]);

  const handleKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocus((f) => Math.min(f + 1, items.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setFocus((f) => Math.max(f - 1, 0)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const it = items[focus];
      if (it) { nav(it.path); onClose(); }
    }
  };

  const grouped = items.reduce((acc, it) => {
    (acc[it.kind] = acc[it.kind] || []).push(it);
    return acc;
  }, {});

  const GROUP_LABELS = { page: 'Navigation', session: 'Sessions', client: 'Clients', agent: 'Agents' };

  let idx = -1;
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] cw-scrim-in bg-black/70 backdrop-blur-sm"
         onClick={onClose}
         data-testid="cmdk-scrim">
      <div onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}
           className="cw-modal-in w-[640px] max-w-[92vw] bg-[#0e0e0e] border border-white/15 shadow-[0_32px_96px_-12px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden"
           data-testid="cmdk-panel">
        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <MagnifyingGlass size={16} className="text-white/50" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to a page, session, client, or agent…"
            data-testid="cmdk-input"
            className="flex-1 bg-transparent text-[15px] text-white/95 placeholder:text-white/35 focus:outline-none font-body"
          />
          <span className="cw-kbd">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[440px] overflow-y-auto py-2" data-testid="cmdk-results">
          {items.length === 0 && (
            <div className="px-5 py-12 text-center font-mono text-[11px] tracking-wider text-white/35">
              NO MATCH FOR “{q}”
            </div>
          )}
          {Object.entries(grouped).map(([kind, arr]) => (
            <div key={kind}>
              <div className="px-5 pt-3 pb-1 font-mono text-[9.5px] tracking-[0.25em] text-white/35 uppercase">
                {GROUP_LABELS[kind] || kind}
              </div>
              {arr.map((it) => {
                idx += 1;
                const active = idx === focus;
                const Icon = it.icon;
                const myIdx = idx;
                return (
                  <button
                    key={`${it.kind}-${it.key}`}
                    onClick={() => { nav(it.path); onClose(); }}
                    onMouseEnter={() => setFocus(myIdx)}
                    data-testid={`cmdk-item-${it.kind}-${it.key}`}
                    className={[
                      'w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors',
                      active ? 'bg-white/[0.07] text-white/95' : 'text-white/75 hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <Icon size={14} weight="duotone" className={active ? 'text-cw-running' : 'text-white/50'} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] truncate">{it.label}</div>
                      <div className="font-mono text-[10.5px] text-white/45 truncate">{it.sub}</div>
                    </div>
                    {it.meta && (
                      <span className="font-mono text-[9.5px] tracking-wider text-white/50 uppercase">{it.meta}</span>
                    )}
                    {active && <ArrowRight size={12} className="text-cw-running" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer chord hints */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 bg-[#0a0a0a]">
          <div className="flex items-center gap-3 font-mono text-[10px] text-white/45">
            <span className="flex items-center gap-1"><span className="cw-kbd">↑</span><span className="cw-kbd">↓</span> navigate</span>
            <span className="flex items-center gap-1"><span className="cw-kbd">↵</span> open</span>
            <span className="flex items-center gap-1"><span className="cw-kbd">ESC</span> close</span>
          </div>
          <span className="font-mono text-[10px] text-white/30">CW · Command Palette · ⌘K</span>
        </div>
      </div>
    </div>
  );
}
