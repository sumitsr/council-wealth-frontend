import React from 'react';
import { Buildings, KeyReturn, ShieldCheck, Users, Gauge, Archive, Globe } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { FEATURE_FLAGS, USERS, QUOTAS, TENANT } from '@/data/mockData';

const TABS = [
  { k: 'profile', label: 'Profile', icon: Buildings },
  { k: 'quotas', label: 'Plan & Quotas', icon: Gauge },
  { k: 'flags', label: 'Feature Flags', icon: ShieldCheck },
  { k: 'users', label: 'User Access', icon: Users },
  { k: 'sso', label: 'SSO · SAML', icon: KeyReturn },
  { k: 'retention', label: 'Retention', icon: Archive },
];

export default function TenantAdmin() {
  const [tab, setTab] = React.useState('profile');
  const [flags, setFlags] = React.useState(FEATURE_FLAGS);
  const toggle = (k) => setFlags((f) => f.map((x) => x.key === k ? { ...x, enabled: !x.enabled } : x));

  return (
    <AppShell
      title="Tenant Admin"
      subtitle={`${TENANT.name} · ${TENANT.firmId}`}
      rightRail={
        <>
          <RailSection label="Tenant Status" icon={Buildings}>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between"><span className="text-white/50">Plan</span><span className="font-mono text-cw-approved">{TENANT.plan}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Status</span><StateBadge state="ACTIVE" size="sm" /></div>
              <div className="flex justify-between"><span className="text-white/50">Region</span><span className="font-mono text-white/90">{TENANT.region}</span></div>
              <div className="flex justify-between"><span className="text-white/50">Firm ID</span><span className="font-mono text-white/90">{TENANT.firmId}</span></div>
              <div className="flex justify-between"><span className="text-white/50">RLS</span><span className="font-mono text-cw-approved">enforced</span></div>
            </div>
          </RailSection>
          <RailSection label="Rate Limit">
            <div className="rounded-sm border border-white/10 bg-cw-surface p-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] text-white/40">Requests · rpm</span>
                <span className="font-mono text-[11px] text-cw-approved">normal</span>
              </div>
              <div className="font-mono text-[22px] text-white/95 mt-1">1,240 <span className="text-white/30 text-[12px]">/ 5,000</span></div>
              <div className="h-1 mt-2 bg-white/[0.06] rounded-sm overflow-hidden">
                <div className="h-full bg-cw-running" style={{ width: '24.8%' }} />
              </div>
            </div>
          </RailSection>
          <RailSection label="Identity" icon={KeyReturn}>
            <ul className="space-y-2 text-[12px]">
              <li className="flex justify-between"><span className="text-white/50">Auth0</span><StateBadge state="CONNECTED" size="sm" /></li>
              <li className="flex justify-between"><span className="text-white/50">SAML 2.0</span><StateBadge state="APPROVED" size="sm" /></li>
              <li className="flex justify-between"><span className="text-white/50">MFA required</span><span className="font-mono text-cw-approved">yes</span></li>
              <li className="flex justify-between"><span className="text-white/50">SCIM</span><span className="font-mono text-white/60">optional</span></li>
            </ul>
          </RailSection>
        </>
      }
    >
      <div className="grid grid-cols-[220px_1fr] gap-6">
        {/* Left tab rail */}
        <nav data-testid="admin-tabs" className="border-r border-white/10 pr-4">
          <div className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-3">Settings</div>
          <ul className="space-y-0.5">
            {TABS.map((t) => (
              <li key={t.k}>
                <button
                  onClick={() => setTab(t.k)}
                  data-testid={`admin-tab-${t.k}`}
                  className={[
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-[12px] border border-transparent transition-colors',
                    tab === t.k ? 'bg-white/[0.06] text-white border-white/10' : 'text-white/60 hover:text-white/95 hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <t.icon size={14} weight="duotone" className="opacity-80" />
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right content */}
        <div className="min-w-0" data-testid="admin-content">
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'quotas' && <QuotasPanel />}
          {tab === 'flags' && <FlagsPanel flags={flags} toggle={toggle} />}
          {tab === 'users' && <UsersPanel />}
          {tab === 'sso' && <SsoPanel />}
          {tab === 'retention' && <RetentionPanel />}
        </div>
      </div>
    </AppShell>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-[22px] tracking-tight text-white/95">{title}</h2>
        {sub && <p className="text-[12px] text-white/55 mt-1 max-w-2xl leading-relaxed">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function ProfilePanel() {
  return (
    <Panel title="Tenant Profile" sub="Identity and organizational metadata. All firm-scoped data is row-level secured and tagged with firm_id at every hop.">
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: 'Firm name', v: TENANT.name },
          { k: 'Firm ID', v: TENANT.firmId, mono: true },
          { k: 'Tenant ID', v: TENANT.id, mono: true },
          { k: 'Plan', v: TENANT.plan, mono: true },
          { k: 'Jurisdiction', v: TENANT.jurisdiction, mono: true },
          { k: 'Region', v: TENANT.region, mono: true },
          { k: 'Created', v: '2025-08-22 · 90d ago' },
          { k: 'Primary compliance officer', v: 'Priya Rao' },
        ].map((r) => (
          <div key={r.k} className="rounded-sm border border-white/10 bg-cw-surface px-4 py-3">
            <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">{r.k}</div>
            <div className={`mt-1 ${r.mono ? 'font-mono text-[13px] text-white/95' : 'text-[14px] text-white/95'}`}>{r.v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QuotasPanel() {
  return (
    <Panel title="Plan & Quotas" sub="ENTERPRISE plan · elastic ceilings. Consumption resets monthly.">
      <div className="grid grid-cols-2 gap-3">
        {QUOTAS.map((q) => {
          const pct = (q.used / q.limit) * 100;
          const hot = pct > 80;
          return (
            <div key={q.label} className="rounded-sm border border-white/10 bg-cw-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">{q.label}</span>
                <span className={`font-mono text-[11px] ${hot ? 'text-cw-waiting' : 'text-cw-approved'}`}>{pct.toFixed(1)}%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[24px] text-white/95">{q.used.toLocaleString()}</span>
                <span className="font-mono text-[12px] text-white/40">/ {q.limit.toLocaleString()}</span>
              </div>
              <div className="h-1 mt-2 bg-white/[0.06] rounded-sm overflow-hidden">
                <div className={`h-full ${hot ? 'bg-cw-waiting' : 'bg-cw-running'}`} style={{ width: `${pct}%` }} />
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
    <Panel title="Feature Flags" sub="Tenant-scoped capability control. Changes are cached in Redis and audited in Historian.">
      <div className="rounded-sm border border-white/10 overflow-hidden">
        {flags.map((f, i) => (
          <div key={f.key} data-testid={`flag-${f.key}`}
               className="grid grid-cols-[1fr_auto] gap-6 items-center px-4 py-3 border-b border-white/[0.06] last:border-b-0 bg-cw-surface hover:bg-cw-elevated">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-white/95">{f.key}</span>
                <StateBadge state={f.enabled ? 'APPROVED' : 'QUEUED'} size="sm" />
              </div>
              <div className="text-[12px] text-white/55 mt-0.5">{f.desc}</div>
            </div>
            <button
              onClick={() => toggle(f.key)}
              data-testid={`flag-toggle-${f.key}`}
              className={[
                'relative w-10 h-6 rounded-sm border transition-colors',
                f.enabled ? 'bg-cw-approved/20 border-cw-approved/40' : 'bg-white/[0.04] border-white/10',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 left-0.5 w-4 h-4 rounded-sm bg-white transition-all',
                  f.enabled ? 'translate-x-4 bg-cw-approved' : 'translate-x-0 bg-white/60',
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
    <Panel title="User Access" sub="Role-based access aligned with Auth0 identity. All actions are tenant-tagged in MDC logs.">
      <div className="rounded-sm border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_120px_110px_90px] gap-3 px-4 py-2.5 bg-[#111] border-b border-white/10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          <span>Name</span><span>Email</span><span>Role</span><span>Last login</span><span>Status</span>
        </div>
        {USERS.map((u) => (
          <div key={u.id} data-testid={`user-row-${u.id}`} className="grid grid-cols-[1fr_1fr_120px_110px_90px] gap-3 items-center px-4 py-3 border-b border-white/[0.06] last:border-b-0 hover:bg-cw-elevated">
            <span className="text-[13px] text-white/95">{u.name}</span>
            <span className="font-mono text-[11px] text-white/65 truncate">{u.email}</span>
            <span className="font-mono text-[11px] text-white/90">{u.role}</span>
            <span className="font-mono text-[11px] text-white/60">{u.lastLogin}</span>
            <StateBadge state={u.status} size="sm" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function SsoPanel() {
  return (
    <Panel title="SSO · SAML 2.0" sub="Federated identity. ACS URL, entityID, and metadata are tenant-unique.">
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: 'IdP', v: 'Okta · aldrichquinn.okta.com' },
          { k: 'Entity ID', v: 'urn:councilwealth:aq-us', mono: true },
          { k: 'ACS URL', v: 'https://cw/api/saml/sso/firm_aq_us', mono: true },
          { k: 'Binding', v: 'HTTP-POST', mono: true },
          { k: 'Assertion encryption', v: 'AES-256-GCM', mono: true },
          { k: 'Signing cert', v: 'sha256:ae8f…f09', mono: true },
          { k: 'MFA required', v: 'Yes · TOTP + WebAuthn' },
          { k: 'SCIM 2.0 provisioning', v: 'Enabled', mono: true },
        ].map((r) => (
          <div key={r.k} className="rounded-sm border border-white/10 bg-cw-surface px-4 py-3">
            <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">{r.k}</div>
            <div className={`mt-1 ${r.mono ? 'font-mono text-[12px] text-white/95 break-all' : 'text-[13px] text-white/95'}`}>{r.v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RetentionPanel() {
  return (
    <Panel title="Retention Policy" sub="Regulated records export nightly to immutable WORM storage (S3 Object Lock). Operational data and audit trails are retained per class.">
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: 'Advice sessions', v: '7 years · SEC 17a-4', tag: 'ARCHIVED' },
          { k: 'Compliance decisions', v: '7 years · SEC 17a-4', tag: 'ARCHIVED' },
          { k: 'Audit events', v: '3 years', tag: 'APPROVED' },
          { k: 'PII Ghost Map', v: '90 days · rotated keys', tag: 'WAITING_APPROVAL' },
          { k: 'Temporal workflows', v: '180 days', tag: 'APPROVED' },
          { k: 'Model trace metadata', v: '7 years · per-firm', tag: 'ARCHIVED' },
        ].map((r) => (
          <div key={r.k} className="rounded-sm border border-white/10 bg-cw-surface px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">{r.k}</span>
              <StateBadge state={r.tag} size="sm" />
            </div>
            <div className="text-[13px] text-white/95">{r.v}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
