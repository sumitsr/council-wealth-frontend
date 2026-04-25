import React from 'react';
import { TENANT, COMPLIANCE_ALERTS, INTEGRATIONS, QUOTAS, RECENT_SESSIONS } from '@/data/mockData';

// NotificationProvider — central event bus for the alert bell.
// Sources (Phase 1, mock-driven; Phase 3 will wire WS):
//   • Live council session events (deliberation start, recommendation, VETO, audit)
//   • Compliance alerts (Sentinel verdicts, policy drift)
//   • Integration health (token expiring, disconnects)
//   • Audit / WORM lifecycle
//   • Plan & seat consumption (approaching tier ceilings)

const NotificationCtx = React.createContext({
  notifications: [],
  unreadCount: 0,
  push: () => {},
  markRead: () => {},
  markAllRead: () => {},
  remove: () => {},
  clearAll: () => {},
});

export const useNotifications = () => React.useContext(NotificationCtx);

let _seq = 1;
const mkId = () => `ntf_${Date.now().toString(36)}_${(_seq++).toString(36)}`;

const STATUS_LABEL = {
  TOKEN_EXPIRING: 'token expiring',
  DISCONNECTED:  'disconnected',
  SYNC_RUNNING:  'sync running',
};

// Build the seed feed from existing mock data so the bell is meaningful on first paint.
const buildSeed = () => {
  const items = [];

  // 1) Compliance VETO + warnings
  COMPLIANCE_ALERTS.forEach((a) => {
    if (a.severity === 'CRITICAL') {
      items.push({
        id: mkId(),
        severity: 'CRITICAL',
        category: 'COMPLIANCE',
        title: `Sentinel VETO · ${a.code}`,
        body: a.message,
        time: a.time,
        read: false,
        route: '/council/live/CW-2040',
        cta: 'Review session',
      });
    } else if (a.severity === 'WARN') {
      items.push({
        id: mkId(),
        severity: 'WARN',
        category: 'COMPLIANCE',
        title: a.code,
        body: a.message,
        time: a.time,
        read: false,
        route: '/compliance/audit',
        cta: 'Open audit log',
      });
    } else if (a.severity === 'INFO') {
      items.push({
        id: mkId(),
        severity: 'INFO',
        category: 'AUDIT',
        title: 'WORM archive · queued',
        body: a.message,
        time: a.time,
        read: true,
        route: '/compliance/audit',
        cta: 'View archive status',
      });
    }
  });

  // 2) Integration health issues
  INTEGRATIONS.filter((i) => i.status === 'DISCONNECTED' || i.status === 'TOKEN_EXPIRING').forEach((i) => {
    items.push({
      id: mkId(),
      severity: i.status === 'DISCONNECTED' ? 'CRITICAL' : 'WARN',
      category: 'INTEGRATION',
      title: `${i.provider} · ${STATUS_LABEL[i.status] || i.status.toLowerCase()}`,
      body:
        i.status === 'DISCONNECTED'
          ? `Connector down. Last sync ${i.lastSync}. Account aggregation paused for this firm.`
          : `OAuth token nearing expiry. Re-authenticate to maintain CRM sync (last sync ${i.lastSync}).`,
      time: i.lastSync,
      read: false,
      route: '/integrations',
      cta: 'Manage integration',
    });
  });

  // 3) Plan / seat consumption — surface anything ≥60% used
  QUOTAS.forEach((q) => {
    const pct = Math.round((q.used / q.limit) * 100);
    if (pct >= 60) {
      const sev = pct >= 85 ? 'WARN' : 'INFO';
      items.push({
        id: mkId(),
        severity: sev,
        category: 'PLAN',
        title: `${q.label} · ${pct}% used`,
        body: `${q.used.toLocaleString()} / ${q.limit.toLocaleString()} consumed on ${TENANT.plan}.${
          pct >= 85 ? ' Approaching plan ceiling — consider upgrading tier.' : ''
        }`,
        time: 'now',
        read: pct < 70,
        route: '/admin/tenant',
        cta: pct >= 85 ? 'Upgrade plan' : 'Open admin',
      });
    }
  });

  // 4) Live running session
  const running = RECENT_SESSIONS.find((s) => s.status === 'RUNNING');
  if (running) {
    items.push({
      id: mkId(),
      severity: 'INFO',
      category: 'SESSION',
      title: `Council deliberating · ${running.id}`,
      body: running.headline,
      time: running.startedAt,
      read: false,
      route: `/council/live/${running.id}`,
      cta: 'Join live',
    });
  }

  // 5) Approval queue waiter (HITL)
  items.push({
    id: mkId(),
    severity: 'WARN',
    category: 'SESSION',
    title: 'HITL approval waiting · CW-2038',
    body: 'Stewart, Miriam · Gifting exceeds $50k — human-in-the-loop required.',
    time: '12:58',
    read: false,
    route: '/council/live/CW-2038',
    cta: 'Review',
  });

  return items;
};

// Synthetic live event rotation — emulates Phase-3 WebSocket stream until the Java
// Spring Boot backend is wired. New event every 35s.
const LIVE_EVENTS = [
  {
    severity: 'INFO',
    category: 'SESSION',
    title: 'Recommendation ready · CW-2041',
    body: 'RetirementPlanner finalized 4.2% drawdown plan with bond-tent glidepath.',
    route: '/council/live/CW-2041',
    cta: 'View',
  },
  {
    severity: 'INFO',
    category: 'AUDIT',
    title: 'Trace persisted · CW-2041',
    body: '16 deliberation steps + 7 votes written to WORM ledger. trace_id=7af1-c02.',
    route: '/compliance/audit',
    cta: 'Open audit',
  },
  {
    severity: 'INFO',
    category: 'SESSION',
    title: 'Council convened · CW-2042',
    body: 'Cross-border SIPP allocation review · jurisdiction=UK.',
    route: '/council/live/CW-2042',
    cta: 'Join',
  },
  {
    severity: 'WARN',
    category: 'COMPLIANCE',
    title: 'Concentration drift · cli_04',
    body: 'Hollingsworth, J. — single-position weighting at 14% (policy ceiling 12%). Sentinel monitoring.',
    route: '/compliance/audit',
    cta: 'Investigate',
  },
  {
    severity: 'INFO',
    category: 'INTEGRATION',
    title: 'Orion Advisor · sync complete',
    body: '428 holdings refreshed across 7 households. Cursor advanced to snap_0429.',
    route: '/integrations',
    cta: 'View sync log',
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = React.useState(buildSeed);

  const push = React.useCallback((n) => {
    setNotifications((prev) => [{ id: mkId(), read: false, time: 'now', ...n }, ...prev].slice(0, 60));
  }, []);

  const markRead = React.useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = React.useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = React.useCallback(() => setNotifications([]), []);

  // Periodic synthetic event injection — Phase-3 WS placeholder.
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const evt = LIVE_EVENTS[i % LIVE_EVENTS.length];
      push(evt);
      i += 1;
    }, 35000);
    return () => clearInterval(id);
  }, [push]);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value = React.useMemo(
    () => ({ notifications, unreadCount, push, markRead, markAllRead, remove, clearAll }),
    [notifications, unreadCount, push, markRead, markAllRead, remove, clearAll]
  );

  return <NotificationCtx.Provider value={value}>{children}</NotificationCtx.Provider>;
}
