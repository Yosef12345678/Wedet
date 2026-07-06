import { ReactNode } from 'react';

type BadgeTone = 'amber' | 'teal' | 'slate';

const tones: Record<BadgeTone, string> = {
  amber: 'border-amber-400/40 bg-amber-400/10 text-amber-300',
  teal: 'border-teal-400/40 bg-teal-400/10 text-teal-300',
  slate: 'border-slate-600 bg-slate-800/60 text-slate-300'
};

export function Badge({ tone = 'slate', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
