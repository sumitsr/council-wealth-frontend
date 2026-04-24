import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { TENANT, CURRENT_USER } from '@/data/mockData';

const LINKS = [
  { to: '/',                    label: 'Dashboard',       testid: 'nav-dashboard',    end: true },
  { to: '/council/new',         label: 'New Session',     testid: 'nav-new-session' },
  { to: '/council/live/CW-2041',label: 'Live Council',    testid: 'nav-live',         live: true },
  { to: '/compliance/audit',    label: 'Audit & Replay',  testid: 'nav-audit' },
  { to: '/integrations',        label: 'Integrations',    testid: 'nav-integrations' },
  { to: '/admin/tenant',        label: 'Chambers',        testid: 'nav-admin' },
];

export default function Masthead({ onOpenDrawer, drawerOpen }) {
  const loc = useLocation();
  const [clock, setClock] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(clock.getHours()).padStart(2, '0');
  const mm = String(clock.getMinutes()).padStart(2, '0');

  return (
    <header
      data-testid="masthead"
      className="relative border-b border-cw-rule bg-cw-masthead/85 backdrop-blur-[2px]"
    >
      {/* Hair rule */}
      <div className="absolute inset-x-0 top-0 h-px bg-cw-ink/20" />

      {/* Row 1 — brand + meta */}
      <div className="max-w-[1480px] mx-auto px-10 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-baseline gap-5">
          <NavLink to="/" className="flex items-baseline gap-3" data-testid="brand-link">
            <span className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-cw-ink-mute">No. 04 · MMXXVI</span>
            <span className="font-display italic text-[30px] leading-none text-cw-ink">Council Wealth</span>
          </NavLink>
          <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-cw-ink-mute hidden md:inline">Chambers of Fiduciary Deliberation</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden lg:inline font-mono text-[10.5px] tracking-[0.2em] uppercase text-cw-ink-mute">
            {TENANT.name} · <span className="text-cw-fiduciary">{TENANT.plan}</span>
          </span>
          <span className="hidden md:inline font-mono text-[10.5px] tracking-[0.2em] text-cw-ink-mute">
            {hh}:{mm} · UTC-04
          </span>
          <button
            onClick={onOpenDrawer}
            data-testid="btn-open-drawer"
            className={[
              'h-9 px-4 border font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors',
              drawerOpen
                ? 'bg-cw-fiduciary text-cw-canvas border-cw-fiduciary'
                : 'border-cw-ink text-cw-ink hover:bg-cw-ink hover:text-cw-canvas',
            ].join(' ')}
          >
            Intelligence
          </button>
          {/* User seal */}
          <div className="flex items-center gap-3 pl-4 border-l border-cw-rule">
            <div className="relative cw-seal">
              <div className="w-9 h-9 border border-cw-copper text-cw-copper flex items-center justify-center font-display italic text-[13px]"
                   style={{ borderWidth: 1 }}>{CURRENT_USER.initials}</div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cw-copper" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[14px] text-cw-ink">{CURRENT_USER.name}</span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cw-ink-mute">{CURRENT_USER.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Double rule divider */}
      <div className="h-px bg-cw-ink/60" />
      <div className="h-[2px]" />
      <div className="h-px bg-cw-ink/30" />

      {/* Row 2 — centered nav */}
      <nav className="max-w-[1480px] mx-auto px-10 h-11 flex items-center justify-center gap-8" data-testid="nav-links">
        {LINKS.map((l) => {
          const active =
            l.end ? loc.pathname === '/' :
            loc.pathname.startsWith(l.to.split('/').slice(0, 3).join('/')) ||
            loc.pathname === l.to;
          return (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={l.testid}
              className={[
                'relative font-mono text-[10.5px] tracking-[0.22em] uppercase transition-colors pb-1 flex items-center gap-2',
                active ? 'text-cw-ink' : 'text-cw-ink-mute hover:text-cw-ink',
              ].join(' ')}
            >
              {l.label}
              {l.live && <span className="w-1.5 h-1.5 rounded-full bg-cw-copper" style={{ animation: 'cw-node-pulse 1.6s ease-in-out infinite' }} />}
              {active && <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-cw-ink" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom masthead rule */}
      <div className="h-px bg-cw-ink/30" />
    </header>
  );
}
