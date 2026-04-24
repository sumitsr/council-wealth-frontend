import React from 'react';

// Radial Committee Diagram — 14 nodes on an outer ring around a central consensus hub.
// Ink edges are drawn from each spoken agent to the hub. A running node pulses.
// Fully dark-terminal aesthetic — no cream. Ships as an inline SVG.

const W = 720;
const H = 520;
const CX = W / 2;
const CY = H / 2 + 6;
const R = 208; // ring radius
const LABEL_R = 238;

function pos(i, n) {
  // Full 360° ring, starting at top (-90°), clockwise
  const deg = -90 + (360 / n) * i;
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + R * Math.cos(rad),
    y: CY + R * Math.sin(rad),
    lx: CX + LABEL_R * Math.cos(rad),
    ly: CY + LABEL_R * Math.sin(rad),
    deg,
  };
}

const STATE_STYLE = {
  QUEUED:    { fill: 'rgba(148,163,184,0.12)', stroke: '#94a3b8', core: '#94a3b8', text: 'rgba(255,255,255,0.4)' },
  RUNNING:   { fill: 'rgba(59,130,246,0.20)',  stroke: '#3b82f6', core: '#60a5fa', text: '#bfdbfe' },
  COMPLETED: { fill: 'rgba(16,185,129,0.18)',  stroke: '#10b981', core: '#34d399', text: '#a7f3d0' },
  VETOED:    { fill: 'rgba(220,38,38,0.22)',   stroke: '#dc2626', core: '#f87171', text: '#fecaca' },
  FAILED:    { fill: 'rgba(244,63,94,0.18)',   stroke: '#f43f5e', core: '#fb7185', text: '#fda4af' },
};

export default function RadialCommittee({ agents, agentStates, vetoed, consensus, completedCount, onAgentClick, sessionId = 'CW-2041' }) {
  return (
    <div className="relative" data-testid="radial-committee">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="cw-hub-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={vetoed ? '#f87171' : '#3b82f6'} stopOpacity="0.35" />
            <stop offset="70%" stopColor={vetoed ? '#dc2626' : '#1e3a8a'} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cw-node-hi" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hub atmosphere */}
        <circle cx={CX} cy={CY} r={170} fill="url(#cw-hub-grad)" />

        {/* Outer dashed ring */}
        <circle cx={CX} cy={CY} r={R + 24} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" strokeDasharray="2 5" />
        {/* Inner reference ring */}
        <circle cx={CX} cy={CY} r={R - 16} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Ring ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i * 6 * Math.PI) / 180;
          const x1 = CX + (R + 20) * Math.cos(a);
          const y1 = CY + (R + 20) * Math.sin(a);
          const x2 = CX + (R + 26) * Math.cos(a);
          const y2 = CY + (R + 26) * Math.sin(a);
          const major = i % 5 === 0;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={major ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)'} strokeWidth={major ? 0.8 : 0.4} />
          );
        })}

        {/* Edges: spoken agents → hub */}
        {agents.map((a, i) => {
          const p = pos(i, agents.length);
          const st = agentStates[a.name]?.state || 'QUEUED';
          if (st === 'QUEUED') return null;
          const color = st === 'VETOED' ? '#dc2626' : st === 'RUNNING' ? '#3b82f6' : '#10b981';
          return (
            <g key={`edge-${a.name}`}>
              <line
                x1={p.x} y1={p.y} x2={CX} y2={CY}
                stroke={color}
                strokeWidth={st === 'VETOED' ? 1.3 : 0.8}
                opacity={st === 'RUNNING' ? 0.85 : 0.45}
                className={st === 'RUNNING' ? 'cw-edge-flow' : ''}
              />
            </g>
          );
        })}

        {/* Layer arcs — subtle arcs grouping agents by layer (decorative) */}

        {/* Nodes */}
        {agents.map((a, i) => {
          const p = pos(i, agents.length);
          const st = agentStates[a.name]?.state || 'QUEUED';
          const ss = STATE_STYLE[st] || STATE_STYLE.QUEUED;
          const running = st === 'RUNNING';
          const labelDeg = p.deg + 90; // tangential
          const flipLabel = p.deg > 90 && p.deg < 270;
          return (
            <g key={a.name} className="cw-node-draw" style={{ animationDelay: `${i * 30}ms`, cursor: 'pointer' }}
               onClick={() => onAgentClick?.(a)}
               data-testid={`radial-node-${a.name}`}>
              {/* halo for running */}
              {running && (
                <circle cx={p.x} cy={p.y} r={22} fill="none" stroke={ss.stroke} strokeWidth="0.6" opacity="0.55" className="cw-pulse" />
              )}
              {/* core node */}
              <g style={{ cursor: 'pointer' }} onClick={() => onAgentClick?.(a)}>
                <circle cx={p.x} cy={p.y} r={15} fill={ss.fill} stroke={ss.stroke} strokeWidth="1.2" />
                <circle cx={p.x} cy={p.y} r={15} fill="url(#cw-node-hi)" />
                <circle cx={p.x} cy={p.y} r={5} fill={ss.core} opacity={running ? 1 : st === 'QUEUED' ? 0.5 : 0.92} />
              </g>

              {/* abbreviation inside */}
              <text x={p.x} y={p.y + 29} textAnchor="middle"
                    fontFamily="Cabinet Grotesk, sans-serif" fontWeight="600" fontSize="10" letterSpacing="0.5"
                    fill={ss.text}>
                {a.name}
              </text>
              {/* seat number */}
              <text x={p.x} y={p.y - 22} textAnchor="middle"
                    fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="1.2"
                    fill="rgba(255,255,255,0.35)">
                SEAT {String(i + 1).padStart(2, '0')}
              </text>
            </g>
          );
        })}

        {/* Hub */}
        <g>
          {vetoed && (
            <circle cx={CX} cy={CY} r={68} fill="none" stroke="#dc2626" strokeWidth="1.2" opacity="0.6" />
          )}
          <circle cx={CX} cy={CY} r={60} fill="#0A0A0A" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={60} fill="url(#cw-node-hi)" />
          <text x={CX} y={CY - 22} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="2.5" fill="rgba(255,255,255,0.5)">
            CONSENSUS
          </text>
          <text x={CX} y={CY + 6} textAnchor="middle"
                fontFamily="Cabinet Grotesk, sans-serif" fontWeight="700" fontSize="30" letterSpacing="-1"
                fill={vetoed ? '#f87171' : '#ffffff'}>
            {vetoed ? '0.42' : consensus.toFixed(2)}
          </text>
          <text x={CX} y={CY + 26} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="rgba(255,255,255,0.5)">
            {completedCount} / {agents.length} · {sessionId}
          </text>
        </g>

        {/* Legend bottom-left */}
        <g transform="translate(16, 484)">
          {[
            { l: 'QUEUED',    c: '#94a3b8' },
            { l: 'RUNNING',   c: '#3b82f6' },
            { l: 'COMPLETED', c: '#10b981' },
            { l: 'VETOED',    c: '#dc2626' },
          ].map((le, i) => (
            <g key={le.l} transform={`translate(${i * 110}, 0)`}>
              <circle cx={4} cy={4} r={3.5} fill={le.c} />
              <text x={14} y={7} fontFamily="IBM Plex Mono" fontSize="9" letterSpacing="1.2" fill="rgba(255,255,255,0.55)">{le.l}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* hint */}
      <div className="absolute top-2 right-3 font-mono text-[9.5px] tracking-wider text-white/35 flex items-center gap-1.5">
        <span>click a seat for agent brief</span>
      </div>
    </div>
  );
}
