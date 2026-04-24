import React from 'react';

// State → color mapping per design guidelines
const STATE_STYLES = {
  QUEUED:          { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.25)' },
  RUNNING:         { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)' },
  WAITING_APPROVAL:{ color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.30)' },
  APPROVED:        { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)' },
  VETOED:          { color: '#dc2626', bg: 'rgba(220,38,38,0.14)',   border: 'rgba(220,38,38,0.40)' },
  FAILED:          { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.30)' },
  ARCHIVED:        { color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.30)' },
  COMPLETED:       { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)' },
  CONNECTED:       { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.28)' },
  DISCONNECTED:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.30)' },
  SYNC_RUNNING:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)' },
  TOKEN_EXPIRING:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.30)' },
  PENDING:         { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.28)' },
  CRITICAL:        { color: '#dc2626', bg: 'rgba(220,38,38,0.14)',   border: 'rgba(220,38,38,0.40)' },
  WARN:            { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.30)' },
  INFO:            { color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.28)' },
  ACTIVE:          { color: '#10b981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)' },
};

export default function StateBadge({ state, dot = true, className = '', size = 'md', pulse = false, ...rest }) {
  const s = STATE_STYLES[state] || STATE_STYLES.QUEUED;
  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border rounded-sm ${padding} ${className}`}
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
      data-testid={`state-badge-${state.toLowerCase()}`}
      {...rest}
    >
      {dot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${pulse ? 'cw-pulse' : ''}`}
          style={{ backgroundColor: s.color }}
        />
      )}
      {state.replace('_', ' ')}
    </span>
  );
}

export { STATE_STYLES };
