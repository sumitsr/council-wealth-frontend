import React from 'react';
import { X, Brain, BookOpen, ChartLineUp, Quotes, FileCode, Lightning } from '@phosphor-icons/react';
import StateBadge from '@/components/shared/StateBadge';
import { AGENT_DETAILS } from '@/data/mockData';

// Agent drill-down modal — shows rationale, citations, metrics, trace excerpt
export default function AgentDrillModal({ agent, state, confidence, summary, trace = [], onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!agent) return null;
  const det = AGENT_DETAILS[agent.name] || { model: '—', mission: agent.role, citations: [], metrics: {} };
  const myTrace = trace.filter((t) => t.agent === agent.name);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-8 cw-scrim-in bg-black/75 backdrop-blur-sm"
         onClick={onClose}
         data-testid="agent-modal-scrim">
      <div
        onClick={(e) => e.stopPropagation()}
        className="cw-modal-in w-[940px] max-w-[94vw] max-h-[86vh] bg-[#0e0e0e] border border-white/15 rounded-sm overflow-hidden flex flex-col shadow-[0_40px_120px_-16px_rgba(0,0,0,0.85)]"
        data-testid={`agent-modal-${agent.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/15 bg-[#0a0a0a] flex items-center justify-center">
              <span className="font-display text-[14px] font-semibold text-white/95">{agent.name.slice(0, 2)}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-[20px] tracking-tight text-white/95">{agent.name}</h2>
                <StateBadge state={state || 'QUEUED'} size="sm" pulse={state === 'RUNNING'} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase mt-0.5">
                {agent.layer} layer · {det.model}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="agent-modal-close"
            className="h-8 w-8 flex items-center justify-center border border-white/10 rounded-sm text-white/60 hover:text-white hover:border-white/25"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto cw-ambient-bg">
          {/* Mission + metrics */}
          <div className="grid grid-cols-[1fr_280px] gap-6 px-6 py-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain size={12} className="text-cw-running" weight="duotone" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Mission</span>
              </div>
              <p className="text-[13.5px] text-white/85 leading-relaxed max-w-xl">{det.mission}</p>

              {summary && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Quotes size={12} className="text-cw-archived" weight="duotone" />
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Latest utterance</span>
                  </div>
                  <div className="text-[13px] text-white/80 leading-relaxed border-l-2 border-white/20 pl-4 italic">
                    "{summary}"
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <ChartLineUp size={12} className="text-cw-approved" weight="duotone" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Operating metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Latency" value={det.metrics.latency || '—'} />
                <Metric label="Tokens"  value={det.metrics.tokens?.toLocaleString() || '—'} />
                <Metric label="Confidence" value={confidence != null ? confidence.toFixed(2) : (det.metrics.confidence != null ? det.metrics.confidence.toFixed(2) : '—')} accent="cw-approved" />
                <Metric label="Model" value={det.model.split(' ')[0]} />
              </div>
            </div>
          </div>

          {/* Citations */}
          <div className="px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={12} className="text-cw-waiting" weight="duotone" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Retrieved evidence · {det.citations.length} citations</span>
            </div>
            {det.citations.length === 0 ? (
              <div className="text-[12px] text-white/40 italic">This agent does not perform retrieval.</div>
            ) : (
              <ul className="space-y-2">
                {det.citations.map((c, i) => (
                  <li key={i} className="flex gap-3 rounded-sm border border-white/10 bg-[#111] px-3 py-2.5" data-testid={`citation-${i}`}>
                    <span className="font-mono text-[10px] tracking-wider text-cw-waiting shrink-0 pt-0.5 w-[120px]">{c.id}</span>
                    <span className="text-[12px] text-white/75 leading-snug">{c.passage}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Trace excerpts */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-3">
              <FileCode size={12} className="text-cw-running" weight="duotone" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">Trace excerpts · {myTrace.length} entries</span>
            </div>
            {myTrace.length === 0 ? (
              <div className="text-[12px] text-white/40 italic">No trace entries yet. Awaiting activation.</div>
            ) : (
              <div className="space-y-2 font-mono text-[11.5px]">
                {myTrace.map((t, i) => (
                  <div key={i} className="flex gap-3 border border-white/10 rounded-sm px-3 py-2 bg-[#0a0a0a]">
                    <span className="text-white/40 w-[80px] shrink-0">{String(i + 1).padStart(2, '0')} · {t.stepType}</span>
                    <span className="text-white/80 leading-relaxed">{t.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center gap-3 font-mono text-[10px] text-white/45">
            <span className="flex items-center gap-1.5"><Lightning size={10} className="text-cw-waiting" /> ghost-map redacted · 100%</span>
            <span>•</span>
            <span>historian persisted</span>
          </div>
          <span className="font-mono text-[10px] text-white/30">ESC to close</span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent = 'white/95' }) {
  return (
    <div className="rounded-sm border border-white/10 bg-[#111] px-3 py-2">
      <div className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-white/40">{label}</div>
      <div className={`font-mono text-[14px] text-${accent} mt-0.5 truncate`}>{value}</div>
    </div>
  );
}
