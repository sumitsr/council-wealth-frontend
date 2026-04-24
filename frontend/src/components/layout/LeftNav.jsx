import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  GridFour, Binoculars, Users, Plugs, ShieldCheck, Buildings, Gear,
  CircleNotch, Lightning
} from '@phosphor-icons/react';

const NAV_GROUPS = [
  {
    label: 'WORKSPACE',
    items: [
      { key: 'dashboard',   to: '/',                label: 'Dashboard',           icon: GridFour,     testid: 'nav-dashboard' },
      { key: 'new-session', to: '/council/new',     label: 'New Council Session', icon: Lightning,    testid: 'nav-new-session', accent: true },
      { key: 'live',        to: '/council/live/CW-2041', label: 'Live Session',   icon: CircleNotch,  testid: 'nav-live-session', live: true },
    ],
  },
  {
    label: 'CLIENTELE',
    items: [
      { key: 'clients',      to: '/clients',        label: 'Clients',           icon: Users,        testid: 'nav-clients' },
    ],
  },
  {
    label: 'GOVERNANCE',
    items: [
      { key: 'audit',        to: '/compliance/audit', label: 'Audit & Replay',  icon: Binoculars,   testid: 'nav-audit' },
      { key: 'compliance',   to: '/compliance',       label: 'Compliance',      icon: ShieldCheck,  testid: 'nav-compliance' },
    ],
  },
  {
    label: 'PLATFORM',
    items: [
      { key: 'integrations', to: '/integrations',   label: 'Integrations',      icon: Plugs,        testid: 'nav-integrations' },
      { key: 'admin',        to: '/admin/tenant',   label: 'Tenant Admin',      icon: Buildings,    testid: 'nav-admin' },
      { key: 'settings',     to: '/settings',       label: 'Settings',          icon: Gear,         testid: 'nav-settings' },
    ],
  },
];

export default function LeftNav() {
  return (
    <aside
      className="w-64 border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col bg-[#0A0A0A] z-50"
      data-testid="left-nav"
    >
      {/* Brand */}
      <div className="h-16 border-b border-white/10 flex items-center gap-3 px-5">
        <div
          className="w-7 h-7 rounded-sm bg-white flex items-center justify-center"
          style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.06)' }}
        >
          <span className="font-display text-[15px] font-bold text-black leading-none">C</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-[15px] font-medium tracking-tight text-white/95">Council Wealth</span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">Advisor Terminal</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5" data-testid="left-nav-links">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="px-2 mb-1.5 font-mono text-[10px] tracking-[0.25em] text-white/30">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.key === 'dashboard'}
                  data-testid={item.testid}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 px-2.5 py-2 rounded-sm text-[13px] transition-colors border border-transparent',
                      isActive
                        ? 'bg-white/[0.06] text-white border-white/10'
                        : 'text-white/60 hover:text-white/95 hover:bg-white/[0.04] hover:border-white/10',
                    ].join(' ')
                  }
                >
                  <item.icon size={16} weight="duotone" className="shrink-0 opacity-80" />
                  <span className="flex-1">{item.label}</span>
                  {item.live && (
                    <span className="flex items-center gap-1 font-mono text-[9px] tracking-wider text-cw-running">
                      <span className="w-1.5 h-1.5 rounded-full bg-cw-running cw-pulse" />
                      LIVE
                    </span>
                  )}
                  {item.accent && !item.live && (
                    <span className="font-mono text-[9px] tracking-wider text-white/30">⌘N</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Tenant footer */}
      <div className="border-t border-white/10 p-3">
        <div className="rounded-sm border border-white/10 bg-cw-surface px-3 py-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase">Tenant</span>
            <span className="font-mono text-[9px] tracking-wider text-cw-approved">ENTERPRISE</span>
          </div>
          <div className="font-display text-[13px] font-medium text-white/95 truncate">Aldrich & Quinn Wealth</div>
          <div className="font-mono text-[10px] text-white/40 mt-0.5">firm_aq_us · us-east-1</div>
        </div>
      </div>
    </aside>
  );
}
