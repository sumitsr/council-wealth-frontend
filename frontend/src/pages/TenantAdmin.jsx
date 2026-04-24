import React from 'react';
import PageFrame, { PageMasthead, Canvas, SectionRule } from '@/components/layout/PageFrame';
import StateTag from '@/components/shared/StateTag';
import { FEATURE_FLAGS, USERS, QUOTAS, TENANT } from '@/data/mockData';

const TABS = [
  { k: 'profile',   label: 'Profile of Chambers' },
  { k: 'quotas',    label: 'Plan & Quotas' },
  { k: 'flags',     label: 'Feature Writs' },
  { k: 'users',     label: 'Bench Access' },
  { k: 'sso',       label: 'Identity · SAML' },
  { k: 'retention', label: 'Retention Policy' },
];

export default function TenantAdmin() {
  const [tab, setTab] = React.useState('profile');
  const [flags, setFlags] = React.useState(FEATURE_FLAGS);
  const toggle = (k) => setFlags((f) => f.map((x) => x.key === k ? { ...x, enabled: !x.enabled } : x));

  return (
    <PageFrame>
      <PageMasthead
        eyebrow="Chambers · Administration"
        meta={TENANT.firmId}
        title={<>The <span className="not-italic text-cw-copper">rules of the house</span>.</>}
        lede="Chambers-level controls for the tenant of record. Identity, quotas, feature writs, retention, and federated access. Every change is tenant-tagged, audited, and cached in Redis for low-latency resolution."
      />

      <Canvas>
        <div className="grid grid-cols-12 gap-10" data-testid="admin-layout">
          {/* Tabs */}
          <nav className="col-span-12 lg:col-span-3" data-testid="admin-tabs">
            <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute mb-3 pb-2 border-b-2 border-cw-ink">Settings</div>
            <ul>
              {TABS.map((t, i) => (
                <li key={t.k}>
                  <button
                    onClick={() => setTab(t.k)}
                    data-testid={`admin-tab-${t.k}`}
                    className={[
                      'w-full flex items-baseline justify-between py-3 border-b border-cw-rule text-left transition-colors',
                      tab === t.k ? 'bg-cw-masthead' : 'hover:bg-cw-masthead/60',
                    ].join(' ')}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10.5px] text-cw-ink-mute w-8">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`font-display italic text-[18px] leading-tight ${tab === t.k ? 'text-cw-ink' : 'text-cw-ink-soft'}`}>{t.label}</span>
                    </span>
                    {tab === t.k && <span className="font-display italic text-[14px] text-cw-copper mr-3">⟶</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-5 border border-cw-ink bg-cw-canvas cw-paper-grain" data-testid="tenant-card">
              <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-cw-ink-mute">{TENANT.seal}</div>
              <div className="font-display italic text-[22px] leading-tight text-cw-ink mt-2">{TENANT.name}</div>
              <div className="font-mono text-[10.5px] text-cw-ink-mute mt-1">{TENANT.firmId} · {TENANT.region}</div>
              <div className="mt-3 pt-3 border-t border-cw-rule flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">Plan</span>
                <StateTag state="APPROVED" size="sm" uppercase className="!tracking-[0.18em]" />
              </div>
            </div>
          </nav>

          {/* Content */}
          <section className="col-span-12 lg:col-span-9" data-testid="admin-content">
            {tab === 'profile' && <ProfilePanel />}
            {tab === 'quotas' && <QuotasPanel />}
            {tab === 'flags' && <FlagsPanel flags={flags} toggle={toggle} />}
            {tab === 'users' && <UsersPanel />}
            {tab === 'sso' && <SsoPanel />}
            {tab === 'retention' && <RetentionPanel />}
          </section>
        </div>
      </Canvas>
    </PageFrame>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div>
      <SectionRule label={title} />
      {sub && <p className="text-[14px] text-cw-ink-soft max-w-2xl mb-8 -mt-2 font-body leading-relaxed">{sub}</p>}
      {children}
    </div>
  );
}

function ProfilePanel() {
  const rows = [
    ['Firm name',                    TENANT.name, false],
    ['Firm ID',                      TENANT.firmId, true],
    ['Tenant ID',                    TENANT.id, true],
    ['Plan',                         TENANT.plan, false],
    ['Jurisdiction of record',       TENANT.jurisdiction, true],
    ['Region',                       TENANT.region, true],
    ['Chartered',                    '2025-08-22 · 90 days ago', false],
    ['Primary compliance officer',  'Priya Rao', false],
  ];
  return (
    <Panel title="Profile of Chambers" sub="Identity and organisational metadata. All firm-scoped data is row-level secured and tagged with firm_id at every hop through the Spring API.">
      <div className="grid grid-cols-2 gap-0 border-t-2 border-l border-cw-ink">
        {rows.map((r, i) => (
          <div key={r[0]} className={`border-r border-b border-cw-ink p-6 ${i % 2 === 0 ? 'bg-cw-canvas' : 'bg-cw-canvas'}`}>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">{r[0]}</div>
            <div className={`mt-2 ${r[2] ? 'font-mono text-[15px] text-cw-ink' : 'font-display italic text-[22px] leading-tight text-cw-ink'}`}>{r[1]}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QuotasPanel() {
  return (
    <Panel title="Plan & Quotas" sub="Elastic ceilings under the Enterprise plan. Consumption resets at the first of the month; per-minute rate limits are computed on rolling windows.">
      <div className="grid grid-cols-2 gap-0 border-t-2 border-l border-cw-ink">
        {QUOTAS.map((q) => {
          const pct = (q.used / q.limit) * 100;
          const hot = pct > 80;
          return (
            <div key={q.label} className="border-r border-b border-cw-ink p-6 bg-cw-canvas">
              <div className="flex items-baseline justify-between mb-3">
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">{q.label}</div>
                <div className={`font-mono text-[12px] ${hot ? 'text-cw-copper' : 'text-cw-fiduciary'}`}>{pct.toFixed(1)}%</div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-display italic text-[44px] leading-none text-cw-ink">{q.used.toLocaleString()}</span>
                <span className="font-mono text-[12px] text-cw-ink-mute">/ {q.limit.toLocaleString()}</span>
              </div>
              <div className="h-[6px] bg-cw-masthead border border-cw-rule mt-4 relative">
                <div className={`h-full ${hot ? 'bg-cw-copper' : 'bg-cw-fiduciary'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function FlagsPanel({ flags, toggle }) {
  return (
    <Panel title="Feature Writs" sub="Tenant-scoped writs control capabilities of the council. Every toggle is cached in Redis and persisted to Historian for audit.">
      <div className="border-t-2 border-cw-ink">
        {flags.map((f) => (
          <div key={f.key} data-testid={`flag-${f.key}`}
               className="grid grid-cols-[1fr_auto] gap-6 items-center py-4 border-b border-cw-rule">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12.5px] text-cw-ink">{f.key}</span>
                <StateTag state={f.enabled ? 'APPROVED' : 'QUEUED'} size="sm" uppercase />
              </div>
              <div className="text-[13px] text-cw-ink-soft mt-0.5">{f.desc}</div>
            </div>
            <button
              onClick={() => toggle(f.key)}
              data-testid={`flag-toggle-${f.key}`}
              className={[
                'relative w-14 h-7 border-2 transition-colors',
                f.enabled ? 'bg-cw-fiduciary border-cw-fiduciary' : 'bg-cw-canvas border-cw-ink',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-[2px] left-[2px] w-5 h-5 transition-all',
                  f.enabled ? 'translate-x-7 bg-cw-canvas' : 'translate-x-0 bg-cw-ink',
                ].join(' ')}
              />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function UsersPanel() {
  return (
    <Panel title="Bench Access" sub="Role-based access aligned with Auth0 identity. Every action is tenant-tagged in MDC logs for audit traceability.">
      <div className="border-t-2 border-cw-ink">
        <div className="grid grid-cols-[1fr_1fr_130px_110px_110px] gap-4 py-3 border-b border-cw-ink font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">
          <span>Name</span><span>Email</span><span>Role</span><span>Last login</span><span>Status</span>
        </div>
        {USERS.map((u) => (
          <div key={u.id} data-testid={`user-${u.id}`} className="grid grid-cols-[1fr_1fr_130px_110px_110px] gap-4 items-center py-4 border-b border-cw-rule hover:bg-cw-masthead/60">
            <span className="font-display italic text-[16px] text-cw-ink">{u.name}</span>
            <span className="font-mono text-[11.5px] text-cw-ink-soft truncate">{u.email}</span>
            <span className="font-mono text-[11.5px] text-cw-ink">{u.role}</span>
            <span className="font-mono text-[11.5px] text-cw-ink-soft">{u.lastLogin}</span>
            <StateTag state={u.status} size="sm" uppercase />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SsoPanel() {
  const rows = [
    ['Identity Provider',          'Okta · aldrichquinn.okta.com', false],
    ['Entity ID',                  'urn:councilwealth:aq-us', true],
    ['Assertion Consumer URL',     'https://cw/api/saml/sso/firm_aq_us', true],
    ['Binding',                    'HTTP-POST', true],
    ['Assertion encryption',       'AES-256-GCM', true],
    ['Signing certificate',        'sha256:ae8f…f09', true],
    ['Multi-factor requirement',   'Yes · TOTP + WebAuthn', false],
    ['SCIM 2.0 provisioning',      'Enabled', true],
  ];
  return (
    <Panel title="Identity · SAML" sub="Federated identity. ACS URL, entityID, and metadata are tenant-unique and rotated on schedule.">
      <div className="grid grid-cols-2 gap-0 border-t-2 border-l border-cw-ink">
        {rows.map((r) => (
          <div key={r[0]} className="border-r border-b border-cw-ink p-6 bg-cw-canvas">
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">{r[0]}</div>
            <div className={`mt-2 ${r[2] ? 'font-mono text-[13px] text-cw-ink break-all' : 'font-display italic text-[20px] leading-tight text-cw-ink'}`}>{r[1]}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RetentionPanel() {
  const rows = [
    ['Advice sessions',        '7 years · SEC 17a-4',   'ARCHIVED'],
    ['Compliance decisions',   '7 years · SEC 17a-4',   'ARCHIVED'],
    ['Audit events',           '3 years',               'APPROVED'],
    ['PII Ghost Map',          '90 days · rotated keys','WAITING_APPROVAL'],
    ['Temporal workflows',     '180 days',              'APPROVED'],
    ['Model trace metadata',   '7 years · per-firm',    'ARCHIVED'],
  ];
  return (
    <Panel title="Retention Policy" sub="Regulated records are exported nightly to immutable WORM storage (S3 Object Lock). Operational data and audit trails are retained per class, on class-specific ceilings.">
      <div className="grid grid-cols-2 gap-0 border-t-2 border-l border-cw-ink">
        {rows.map((r) => (
          <div key={r[0]} className="border-r border-b border-cw-ink p-6 bg-cw-canvas">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-cw-ink-mute">{r[0]}</div>
              <StateTag state={r[2]} size="sm" uppercase />
            </div>
            <div className="font-display italic text-[22px] leading-tight text-cw-ink">{r[1]}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
