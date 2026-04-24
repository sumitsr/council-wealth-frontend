import React from 'react';

// Fiduciary archival palette for each state
const TOKEN = {
  QUEUED:          { bg: '#EBE9E0', text: '#5E635A', border: '#D4D2C9', dot: '#8A8F85' },
  RUNNING:         { bg: '#F5EFE6', text: '#A85B42', border: '#D8BCA4', dot: '#A85B42' },
  WAITING_APPROVAL:{ bg: '#EAE5D9', text: '#876538', border: '#C7B9A3', dot: '#876538' },
  APPROVED:        { bg: '#E5EBE6', text: '#1E3B2D', border: '#B0C4B6', dot: '#1E3B2D' },
  VETOED:          { bg: '#F2E6E6', text: '#8B2E2E', border: '#D4A5A5', dot: '#8B2E2E' },
  FAILED:          { bg: '#E0E0E0', text: '#1C1E1A', border: '#A3A3A3', dot: '#1C1E1A' },
  ARCHIVED:        { bg: '#F4F3ED', text: '#8A8F85', border: '#D4D2C9', dot: '#8A8F85' },
  COMPLETED:       { bg: '#E5EBE6', text: '#1E3B2D', border: '#B0C4B6', dot: '#1E3B2D' },
  CONNECTED:       { bg: '#E5EBE6', text: '#1E3B2D', border: '#B0C4B6', dot: '#1E3B2D' },
};

const LABEL = {
  QUEUED: 'Queued',
  RUNNING: 'Running',
  WAITING_APPROVAL: 'Awaiting approval',
  APPROVED: 'Approved',
  VETOED: 'Vetoed',
  FAILED: 'Failed',
  ARCHIVED: 'Archived',
  COMPLETED: 'Completed',
  CONNECTED: 'Connected',
};

export default function StateTag({ state, dot = true, size = 'md', className = '', uppercase = false, ...rest }) {
  const t = TOKEN[state] || TOKEN.QUEUED;
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10.5px]' : 'px-2 py-1 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono border ${pad} ${uppercase ? 'uppercase tracking-[0.14em]' : 'tracking-wider'} ${className}`}
      style={{ color: t.text, backgroundColor: t.bg, borderColor: t.border }}
      data-testid={`state-tag-${state.toLowerCase()}`}
      {...rest}
    >
      {dot && <span className="inline-block w-1.5 h-1.5" style={{ backgroundColor: t.dot, borderRadius: '50%' }} />}
      {LABEL[state] || state}
    </span>
  );
}

export { TOKEN as STATE_TOKEN, LABEL as STATE_LABEL };
