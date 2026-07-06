import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  tab?: string;
}

export function Card({ children, className = '', tab }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-slate-800 bg-ink-900/70 p-8 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-sm ${className}`}
    >
      {tab && (
        <span className="absolute -top-3 left-8 rounded-full border border-amber-400/40 bg-ink-950 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-300">
          {tab}
        </span>
      )}
      {children}
    </div>
  );
}
