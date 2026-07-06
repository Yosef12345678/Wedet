import { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'info';

const styles: Record<AlertVariant, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  error: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  info: 'border-sky-500/30 bg-sky-500/10 text-sky-300'
};

export function Alert({ variant, children }: { variant: AlertVariant; children: ReactNode }) {
  return (
    <div className={`rounded-lg border px-3.5 py-2.5 text-sm ${styles[variant]}`} role="status">
      {children}
    </div>
  );
}
