import React from 'react';
import { MagnifyingGlass, CaretDown, Command } from '@phosphor-icons/react';
import { CURRENT_USER } from '@/data/mockData';
import { useCommandPalette } from '@/components/shared/CommandPalette';
import NotificationBell from '@/components/shared/NotificationBell';

export default function HeaderBar({ title, subtitle, actions }) {
  const { open } = useCommandPalette();
  const [clock, setClock] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(clock.getHours()).padStart(2, '0');
  const mm = String(clock.getMinutes()).padStart(2, '0');
  const ss = String(clock.getSeconds()).padStart(2, '0');

  return (
    <header
      className="h-16 border-b border-white/10 fixed top-0 left-64 right-0 bg-[#0A0A0A]/85 backdrop-blur-md z-40 flex items-center justify-between pl-8 pr-6"
      data-testid="header-bar"
    >
      {/* Left: title + breadcrumb */}
      <div className="flex items-center gap-6 min-w-0">
        <div className="min-w-0">
          <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase">{subtitle || 'Command Center'}</div>
          <div className="font-display text-[17px] font-medium text-white/95 truncate" data-testid="header-title">{title}</div>
        </div>
      </div>

      {/* Right: search + clock + alerts + user */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button
          onClick={open}
          data-testid="header-search"
          className="group flex items-center gap-2 h-9 pl-3 pr-2 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/20 transition-colors w-72"
        >
          <MagnifyingGlass size={14} className="text-white/40" />
          <span className="text-[12px] text-white/40 flex-1 text-left">Search clients, sessions, trace IDs…</span>
          <span className="flex items-center gap-0.5 font-mono text-[10px] text-white/40 border border-white/10 rounded-sm px-1.5 py-0.5">
            <Command size={10} /> K
          </span>
        </button>

        {/* Clock */}
        <div className="hidden lg:flex items-center gap-2 border border-white/10 rounded-sm px-3 h-9 bg-cw-surface">
          <span className="w-1.5 h-1.5 rounded-full bg-cw-approved" />
          <span className="font-mono text-[12px] tracking-wider text-white/70" data-testid="header-clock">
            {hh}:{mm}:{ss}
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/30">UTC-04</span>
        </div>

        {/* Alerts */}
        <NotificationBell />

        {/* User */}
        <button
          data-testid="header-user"
          className="flex items-center gap-2.5 h-9 pl-1 pr-2.5 rounded-sm border border-white/10 bg-cw-surface hover:bg-cw-elevated hover:border-white/20"
        >
          <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-cw-running/30 to-cw-archived/30 border border-white/10 flex items-center justify-center">
            <span className="font-display text-[11px] font-semibold text-white">{CURRENT_USER.avatarInitials}</span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[12px] text-white/90">{CURRENT_USER.name.split(' ')[0]}</span>
            <span className="font-mono text-[9px] tracking-wider text-white/40">{CURRENT_USER.role}</span>
          </div>
          <CaretDown size={10} className="text-white/40 ml-0.5" />
        </button>

        {actions}
      </div>
    </header>
  );
}
