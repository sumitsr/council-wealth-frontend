import React from 'react';
import Masthead from './Masthead';
import PinnedDrawer from './PinnedDrawer';

export default function PageFrame({ children, folio, onTitle }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-cw-paper text-cw-ink">
      <Masthead onOpenDrawer={() => setDrawerOpen(true)} drawerOpen={drawerOpen} />
      <PinnedDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main data-testid="app-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-cw-rule mt-16 bg-cw-masthead/60" data-testid="footer">
      <div className="max-w-[1480px] mx-auto px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">
          <span>Council Wealth</span>
          <span className="w-1 h-1 bg-cw-ink-mute rounded-full" />
          <span>Chambers of Fiduciary Deliberation</span>
          <span className="w-1 h-1 bg-cw-ink-mute rounded-full" />
          <span>Vol. IV · No. 04</span>
        </div>
        <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-cw-ink-mute">
          SEC 17a-4 · FINRA 2111 · Reg BI · MiFID II
        </div>
      </div>
    </footer>
  );
}

/** A big editorial title block used as the top of each page canvas. */
export function PageMasthead({ eyebrow, title, lede, meta, right }) {
  return (
    <section className="pt-12 pb-10 border-b border-cw-ink relative" data-testid="page-masthead">
      <div className="max-w-[1480px] mx-auto px-10 grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8">
          <div className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-cw-ink-mute mb-5 flex items-center gap-3">
            <span>{eyebrow}</span>
            <span className="inline-block w-8 h-px bg-cw-ink/40" />
            {meta && <span>{meta}</span>}
          </div>
          <h1 className="font-display italic text-[56px] leading-[1.02] tracking-tight text-cw-ink" data-testid="page-title">
            {title}
          </h1>
          {lede && <p className="mt-5 text-[15px] leading-relaxed text-cw-ink-soft max-w-2xl font-body">{lede}</p>}
        </div>
        {right && (
          <div className="col-span-12 lg:col-span-4 flex items-end justify-end">
            {right}
          </div>
        )}
      </div>
    </section>
  );
}

export function Canvas({ children, className = '' }) {
  return (
    <div className={`max-w-[1480px] mx-auto px-10 py-10 ${className}`}>{children}</div>
  );
}

export function SectionRule({ label, tail }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="font-display italic text-[20px] text-cw-ink">{label}</span>
      <span className="flex-1 h-px bg-cw-ink/30" />
      {tail && <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-cw-ink-mute">{tail}</span>}
    </div>
  );
}
