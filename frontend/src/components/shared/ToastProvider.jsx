import React from 'react';

const ToastCtx = React.createContext({ push: () => {} });
export const useToast = () => React.useContext(ToastCtx);

const VARIANTS = {
  default:  { color: '#ffffff', border: 'rgba(255,255,255,0.18)', bg: '#141414', dot: '#3b82f6' },
  success:  { color: '#10b981', border: 'rgba(16,185,129,0.35)', bg: '#0f1a15', dot: '#10b981' },
  danger:   { color: '#f43f5e', border: 'rgba(244,63,94,0.40)',  bg: '#1a1012', dot: '#f43f5e' },
  warning:  { color: '#f59e0b', border: 'rgba(245,158,11,0.38)', bg: '#1a1510', dot: '#f59e0b' },
  info:     { color: '#3b82f6', border: 'rgba(59,130,246,0.35)', bg: '#0f121a', dot: '#3b82f6' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = `tst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const duration = t.duration ?? 4200;
    setToasts((prev) => [...prev, { id, variant: 'default', ...t, _closing: false }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.map((x) => x.id === id ? { ...x, _closing: true } : x));
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 220);
      }, duration);
    }
  }, []);
  const dismiss = (id) => setToasts((prev) => prev.map((x) => x.id === id ? { ...x, _closing: true } : x));

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none" data-testid="toast-tray">
        {toasts.map((t) => {
          const v = VARIANTS[t.variant] || VARIANTS.default;
          return (
            <div
              key={t.id}
              data-testid={`toast-${t.id}`}
              onClick={() => dismiss(t.id)}
              className={[
                'cw-toast-in pointer-events-auto cursor-pointer w-[340px] rounded-sm border px-4 py-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] font-body',
                t._closing ? 'cw-toast-out' : '',
              ].join(' ')}
              style={{ backgroundColor: v.bg, borderColor: v.border, color: v.color }}
            >
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 cw-pulse" style={{ backgroundColor: v.dot }} />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[13px] font-medium" style={{ color: v.color }}>{t.title}</div>
                  {t.desc && <div className="text-[12px] leading-snug text-white/65 mt-0.5">{t.desc}</div>}
                </div>
                <span className="font-mono text-[9px] tracking-wider text-white/30">ESC</span>
              </div>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
