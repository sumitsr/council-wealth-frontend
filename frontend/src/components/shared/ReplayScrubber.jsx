import React from 'react';
import { Play, Pause, Rewind, FastForward, ArrowsClockwise } from '@phosphor-icons/react';
import { LIVE_STREAM_SCRIPT } from '@/data/mockData';

const STEP_COLOR = {
  THOUGHT:     '#a855f7',
  ACTION:      '#3b82f6',
  OBSERVATION: '#f59e0b',
  RESPONSE:    '#10b981',
};

// Replay scrubber — drag across deliberation history, nodes light up in sequence.
// `streamIndex` is the current cursor (0..script.length). `paused` controls auto-advance.
export default function ReplayScrubber({
  script = LIVE_STREAM_SCRIPT,
  streamIndex,
  setStreamIndex,
  paused,
  setPaused,
  vetoed,
}) {
  const total = script.length;
  const trackRef = React.useRef(null);
  const [hover, setHover] = React.useState(null); // index hovered

  const onSeek = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * total);
    setPaused(true);
    setStreamIndex(idx);
  };

  const onTrackDown = (e) => { onSeek(e.clientX); document.addEventListener('mousemove', onTrackMove); document.addEventListener('mouseup', onTrackUp); };
  const onTrackMove = (e) => onSeek(e.clientX);
  const onTrackUp = () => { document.removeEventListener('mousemove', onTrackMove); document.removeEventListener('mouseup', onTrackUp); };

  const elapsedSec = streamIndex * 4; // 4 seconds per event in our script timing
  const totalSec = total * 4;
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const stepBack = () => { setPaused(true); setStreamIndex(Math.max(0, streamIndex - 1)); };
  const stepForward = () => { setPaused(true); setStreamIndex(Math.min(total, streamIndex + 1)); };
  const restart = () => { setPaused(true); setStreamIndex(0); };
  const togglePlay = () => {
    if (streamIndex >= total) { setStreamIndex(0); setPaused(false); }
    else setPaused((p) => !p);
  };

  const cursor = hover ?? streamIndex;
  const cursorEvent = script[Math.max(0, Math.min(total - 1, cursor - 1))] || script[0];

  return (
    <div className="border border-white/10 bg-cw-surface rounded-sm" data-testid="replay-scrubber">
      {/* Top row: transport + clock */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#0e0e0e]">
        <div className="flex items-center gap-1.5">
          <button onClick={restart} data-testid="scrub-restart"
            className="h-7 w-7 rounded-sm border border-white/10 bg-cw-elevated text-white/75 hover:text-white hover:border-white/25 flex items-center justify-center"
            title="Restart">
            <ArrowsClockwise size={11} />
          </button>
          <button onClick={stepBack} data-testid="scrub-back"
            className="h-7 w-7 rounded-sm border border-white/10 bg-cw-elevated text-white/75 hover:text-white hover:border-white/25 flex items-center justify-center"
            title="Step back">
            <Rewind size={11} weight="fill" />
          </button>
          <button onClick={togglePlay} data-testid="scrub-play"
            className={[
              'h-7 px-3 rounded-sm border flex items-center gap-1.5 text-[11px] font-medium transition-colors',
              paused
                ? 'border-cw-running bg-cw-running/10 text-cw-running hover:bg-cw-running/15'
                : 'border-white/15 bg-cw-elevated text-white/85 hover:border-white/25',
            ].join(' ')}>
            {paused ? <Play size={11} weight="fill" /> : <Pause size={11} weight="fill" />}
            {streamIndex >= total ? 'Replay' : paused ? 'Play' : 'Pause'}
          </button>
          <button onClick={stepForward} data-testid="scrub-forward"
            className="h-7 w-7 rounded-sm border border-white/10 bg-cw-elevated text-white/75 hover:text-white hover:border-white/25 flex items-center justify-center"
            title="Step forward">
            <FastForward size={11} weight="fill" />
          </button>
          <span className="font-mono text-[10px] tracking-wider text-white/45 ml-2">
            {streamIndex} / {total}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-wider text-white/45">
            {paused ? 'PAUSED' : streamIndex >= total ? 'COMPLETE' : 'PLAYING'}
          </span>
          <span className="font-mono text-[12px] text-white/85 tabular-nums">
            {fmt(elapsedSec)} <span className="text-white/30">/ {fmt(totalSec)}</span>
          </span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hover != null && hover > 0 && (
        <div className="px-4 py-2 border-b border-white/10 bg-[#0a0a0a] flex items-center gap-3" data-testid="scrub-hover">
          <span className="font-mono text-[9.5px] tracking-[0.22em] text-white/40 uppercase">{String(hover).padStart(2,'0')}</span>
          <span className="font-mono text-[11px] text-white/95 truncate max-w-[140px]">{script[hover - 1].agent}</span>
          <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase" style={{ color: STEP_COLOR[script[hover - 1].stepType] }}>
            {script[hover - 1].stepType}
          </span>
          <span className="text-[12px] text-white/70 truncate flex-1">{script[hover - 1].content}</span>
        </div>
      )}

      {/* Track */}
      <div className="px-4 py-4">
        <div
          ref={trackRef}
          onMouseDown={onTrackDown}
          onMouseLeave={() => setHover(null)}
          className="relative h-10 cursor-pointer select-none"
          data-testid="scrub-track"
        >
          {/* Base rule */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
          {/* Filled progress */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-px ${vetoed ? 'bg-cw-vetoed' : 'bg-gradient-to-r from-cw-running to-cw-approved'}`}
            style={{ width: `${(streamIndex / total) * 100}%` }}
          />

          {/* Event markers */}
          {script.map((e, i) => {
            const x = ((i + 0.5) / total) * 100;
            const past = i < streamIndex;
            const isCursor = i === cursor - 1 && hover != null;
            const color = STEP_COLOR[e.stepType];
            return (
              <div
                key={i}
                onMouseEnter={() => setHover(i + 1)}
                onMouseDown={(ev) => ev.stopPropagation()}
                onClick={(ev) => { ev.stopPropagation(); setPaused(true); setStreamIndex(i + 1); }}
                data-testid={`scrub-marker-${i}`}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group"
                style={{ left: `${x}%` }}
              >
                <div
                  className={[
                    'w-[7px] h-[7px] rounded-sm transition-all',
                    isCursor ? 'scale-150' : 'group-hover:scale-125',
                  ].join(' ')}
                  style={{
                    backgroundColor: past ? color : '#1a1a1a',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: past ? color : 'rgba(255,255,255,0.20)',
                    boxShadow: past ? `0 0 6px ${color}66` : 'none',
                  }}
                />
              </div>
            );
          })}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 -translate-x-1/2 pointer-events-none"
            style={{ left: `${(streamIndex / total) * 100}%` }}
          >
            <div className="w-px h-full bg-white/85" />
            <div className="w-2 h-2 -ml-[3.5px] -mt-1 bg-white" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.18)' }} />
          </div>
        </div>

        {/* Legend strip */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dotted border-white/10">
          <div className="flex items-center gap-3 font-mono text-[9.5px] tracking-wider text-white/55">
            {Object.entries(STEP_COLOR).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: c }} />{k}
              </span>
            ))}
          </div>
          <div className="font-mono text-[9.5px] tracking-wider text-white/40">
            {cursorEvent && cursor > 0 ? `${cursorEvent.agent.toUpperCase()} · ${cursorEvent.stepType}` : 'PRE-DELIBERATION'}
          </div>
        </div>
      </div>
    </div>
  );
}
