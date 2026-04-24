import React from 'react';
import LeftNav from './LeftNav';
import HeaderBar from './HeaderBar';
import RightRail from './RightRail';

export default function AppShell({ title, subtitle, headerActions, rightRail, hideRightRail, children }) {
  return (
    <div className="min-h-screen bg-cw-bg text-white/95 font-body">
      <LeftNav />
      <HeaderBar title={title} subtitle={subtitle} actions={headerActions} />
      {!hideRightRail && <RightRail>{rightRail}</RightRail>}
      <main
        className={[
          'ml-64 min-h-screen pt-16 pb-16',
          hideRightRail ? 'mr-0' : 'mr-80',
        ].join(' ')}
        data-testid="app-main"
      >
        <div className="px-8 pt-8">{children}</div>
      </main>
    </div>
  );
}
