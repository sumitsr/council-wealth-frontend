import React from 'react';
import { Bell, Keyboard, User, Palette, Shield, SignOut } from '@phosphor-icons/react';
import AppShell from '@/components/layout/AppShell';
import StateBadge from '@/components/shared/StateBadge';
import { RailSection } from '@/components/layout/RightRail';
import { useToast } from '@/components/shared/ToastProvider';
import { CURRENT_USER, TENANT } from '@/data/mockData';

const TABS = [
  { k: 'profile',       label: 'Profile',       icon: User,     desc: 'Your name, role, signature, photo' },
  { k: 'notifications', label: 'Notifications', icon: Bell,     desc: 'Email, in-app, and Slack delivery' },
  { k: 'shortcuts',     label: 'Shortcuts',     icon: Keyboard, desc: 'Keyboard chords for power users' },
  { k: 'appearance',    label: 'Appearance',    icon: Palette,  desc: 'Density, contrast, motion' },
  { k: 'security',      label: 'Security',      icon: Shield,   desc: 'Password, MFA, sessions' },
];

export default function Settings() {
  const [tab, setTab] = React.useState('profile');
  const [notifEmail, setNotifEmail] = React.useState(true);
  const [notifSlack, setNotifSlack] = React.useState(true);
  const [notifInApp, setNotifInApp] = React.useState(true);
  const [vetoOnly, setVetoOnly] = React.useState(false);
  const [density, setDensity] = React.useState('comfortable');
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const { push } = useToast();

  const save = () => push({ variant: 'success', title: 'Settings saved', desc: 'Your preferences have been applied for this session.' });

  return (
    <AppShell
      title="Settings"
      subtitle="Personal Preferences"
      rightRail={
        <>
          <RailSection label="Account">
            <div className="space-y-1.5 text-[12px]">
              <Row k="Name" v={CURRENT_USER.name} />
              <Row k="Email" v={CURRENT_USER.email} mono />
              <Row k="Role" v={CURRENT_USER.role} />
              <Row k="Tenant" v={TENANT.name} />
            </div>
            <button data-testid="btn-signout" onClick={() => push({ variant: 'warning', title: 'Sign-out simulated', desc: 'In production this would clear your session.'})} className="mt-3 w-full h-8 rounded-sm border border-white/15 bg-cw-elevated text-[11px] text-white/85 hover:border-white/25 flex items-center justify-center gap-2">
              <SignOut size={11} /> Sign out of all sessions
            </button>
          </RailSection>
          <RailSection label="Quick reference">
            <ul className="space-y-2 text-[11px] text-white/70">
              <li className="flex justify-between"><span>Open command palette</span><span className="cw-kbd">⌘K</span></li>
              <li className="flex justify-between"><span>Convene new session</span><span className="cw-kbd">⌘N</span></li>
              <li className="flex justify-between"><span>Pause / resume stream</span><span className="cw-kbd">SPACE</span></li>
              <li className="flex justify-between"><span>Step replay</span><span className="cw-kbd">←/→</span></li>
              <li className="flex justify-between"><span>Close any modal</span><span className="cw-kbd">ESC</span></li>
            </ul>
          </RailSection>
        </>
      }
    >
      <div className="grid grid-cols-[260px_1fr] gap-8 cw-reveal">
        {/* Tab list */}
        <nav data-testid="settings-tabs">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Personal</div>
          <ul className="space-y-0.5">
            {TABS.map((t) => (
              <li key={t.k}>
                <button
                  onClick={() => setTab(t.k)}
                  data-testid={`settings-tab-${t.k}`}
                  className={[
                    'w-full text-left rounded-sm px-3 py-2.5 border border-transparent transition-colors',
                    tab === t.k ? 'bg-white/[0.06] border-white/15 text-white' : 'hover:bg-white/[0.04] text-white/65 hover:text-white',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5">
                    <t.icon size={13} weight="duotone" className="opacity-80" />
                    <span className="text-[12.5px]">{t.label}</span>
                  </div>
                  <div className="font-mono text-[10px] tracking-wider text-white/40 mt-0.5 pl-[22px]">{t.desc}</div>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 rounded-sm border border-white/10 bg-cw-surface">
            <div className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase mb-1">Looking for tenant settings?</div>
            <p className="text-[12px] text-white/70 leading-snug">Plan, quotas, feature flags, SSO and retention live in <span className="text-white/95">Tenant Admin</span> (Chambers). Personal preferences only here.</p>
          </div>
        </nav>

        {/* Panel */}
        <section data-testid="settings-content">
          {tab === 'profile' && <Panel title="Profile">
            <Field label="Display name"><InputLine defaultValue={CURRENT_USER.name} /></Field>
            <Field label="Email" hint="immutable · managed by SAML"><InputLine defaultValue={CURRENT_USER.email} disabled /></Field>
            <Field label="Role"><InputLine defaultValue={CURRENT_USER.role} disabled /></Field>
            <Field label="Email signature">
              <textarea defaultValue={`Sierra Navarro · Advisor\nAldrich & Quinn Wealth · firm_aq_us`}
                rows={3}
                className="w-full bg-cw-surface border border-white/10 focus:border-cw-running/60 focus:outline-none rounded-sm px-3 py-2 font-mono text-[12px] text-white/95 resize-none" />
            </Field>
          </Panel>}

          {tab === 'notifications' && <Panel title="Notifications">
            <ToggleRow data-testid="toggle-email" label="Email digests" desc="Receive a daily summary at 08:00 in your local time." enabled={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} />
            <ToggleRow data-testid="toggle-slack" label="Slack channel" desc="Cross-post live council notifications to #cw-deliberations." enabled={notifSlack} onToggle={() => setNotifSlack(!notifSlack)} />
            <ToggleRow data-testid="toggle-inapp" label="In-app toasts" desc="Show the bottom-right banners for approvals & vetoes." enabled={notifInApp} onToggle={() => setNotifInApp(!notifInApp)} />
            <ToggleRow data-testid="toggle-veto" label="Veto-only mode" desc="Only send a notification when SentinelCompliance issues a veto." enabled={vetoOnly} onToggle={() => setVetoOnly(!vetoOnly)} />
          </Panel>}

          {tab === 'shortcuts' && <Panel title="Keyboard shortcuts">
            <div className="rounded-sm border border-white/10 overflow-hidden divide-y divide-white/[0.06]">
              {[
                ['Open command palette',     '⌘K'],
                ['Convene new session',      '⌘N'],
                ['Toggle right intelligence rail', '⌘.'],
                ['Pause / resume stream',    'SPACE'],
                ['Step replay back / forward','← / →'],
                ['Open agent modal',         'A'],
                ['Search audit',             '/'],
                ['Close any overlay',        'ESC'],
              ].map(([k, c]) => (
                <div key={k} className="flex items-center justify-between px-4 py-2.5 bg-cw-surface">
                  <span className="text-[13px] text-white/85">{k}</span>
                  <span className="cw-kbd">{c}</span>
                </div>
              ))}
            </div>
          </Panel>}

          {tab === 'appearance' && <Panel title="Appearance">
            <Field label="Density">
              <div className="flex items-center gap-0 border border-white/10 rounded-sm overflow-hidden w-fit">
                {['comfortable', 'compact', 'spacious'].map((d) => (
                  <button key={d} onClick={() => setDensity(d)} data-testid={`density-${d}`}
                    className={[
                      'h-9 px-4 font-mono text-[10.5px] tracking-wider uppercase border-r border-white/10 last:border-r-0',
                      density === d ? 'bg-white/10 text-white/95' : 'text-white/55 hover:bg-white/5',
                    ].join(' ')}>{d}</button>
                ))}
              </div>
            </Field>
            <ToggleRow data-testid="toggle-motion" label="Reduce motion" desc="Disable streaming animations, beam borders, scan lines." enabled={reduceMotion} onToggle={() => setReduceMotion(!reduceMotion)} />
            <ToggleRow data-testid="toggle-contrast" label="Increase contrast" desc="Stronger borders and brighter type for low-light environments." enabled={highContrast} onToggle={() => setHighContrast(!highContrast)} />
          </Panel>}

          {tab === 'security' && <Panel title="Security">
            <Field label="Multi-factor authentication">
              <div className="flex items-center gap-3">
                <StateBadge state="APPROVED" size="sm" />
                <span className="text-[12.5px] text-white/85">TOTP + WebAuthn enrolled · last verified 14:02</span>
              </div>
            </Field>
            <Field label="Active sessions">
              <div className="rounded-sm border border-white/10 divide-y divide-white/[0.06]">
                {[
                  { d: 'MacBook Pro · Chrome 138', l: 'New York, NY · this device', t: 'now' },
                  { d: 'iPhone · CW iOS 4.2',      l: 'New York, NY',                  t: '2h ago' },
                  { d: 'iPad Pro · CW iPadOS 4.2',  l: 'East Hampton, NY',              t: '4d ago' },
                ].map((s, i) => (
                  <div key={i} className="px-4 py-2.5 bg-cw-surface flex items-center justify-between">
                    <div>
                      <div className="text-[13px] text-white/95">{s.d}</div>
                      <div className="font-mono text-[10.5px] text-white/45">{s.l}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-wider text-white/45">{s.t}</span>
                      <button className="font-mono text-[10px] tracking-wider text-cw-vetoed/80 hover:text-cw-vetoed">Revoke</button>
                    </div>
                  </div>
                ))}
              </div>
            </Field>
          </Panel>}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button className="h-9 px-4 rounded-sm border border-white/10 bg-cw-elevated text-[12px] text-white/85 hover:border-white/25">Discard</button>
            <button onClick={save} data-testid="btn-save-settings" className="h-9 px-5 rounded-sm bg-white text-black text-[12px] font-semibold hover:bg-white/90">Save changes</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-[24px] tracking-tight text-white/95 mb-1">{title}</h2>
      <div className="mt-4 space-y-5">{children}</div>
    </div>
  );
}
function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/45">{label}</span>
        {hint && <span className="font-mono text-[10px] text-white/35">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
function InputLine({ disabled, ...rest }) {
  return (
    <input
      {...rest}
      disabled={disabled}
      className={[
        'w-full h-10 px-3 bg-cw-surface border rounded-sm font-body text-[13px]',
        disabled ? 'border-white/[0.08] text-white/40 cursor-not-allowed' : 'border-white/10 text-white/95 focus:border-cw-running/60 focus:outline-none',
      ].join(' ')}
    />
  );
}
function ToggleRow({ label, desc, enabled, onToggle, ...rest }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-white/[0.06]" {...rest}>
      <div>
        <div className="text-[13px] text-white/95">{label}</div>
        <div className="text-[12px] text-white/55 mt-0.5 max-w-md">{desc}</div>
      </div>
      <button
        onClick={onToggle}
        className={[
          'relative w-10 h-6 rounded-sm border transition-colors shrink-0',
          enabled ? 'bg-cw-approved/20 border-cw-approved/40' : 'bg-white/[0.04] border-white/10',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-sm transition-all',
            enabled ? 'translate-x-4 bg-cw-approved' : 'translate-x-0 bg-white/60',
          ].join(' ')}
        />
      </button>
    </div>
  );
}
function Row({ k, v, mono }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-white/50">{k}</span>
      <span className={mono ? 'font-mono text-white/95 truncate' : 'text-white/95 truncate'}>{v}</span>
    </div>
  );
}
