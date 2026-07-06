'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-amber-400 text-ink-950 hover:bg-amber-300 focus-visible:outline-amber-400 disabled:bg-amber-400/40',
  secondary:
    'bg-transparent border border-slate-600 text-paper-100 hover:border-amber-400/70 hover:text-amber-300 focus-visible:outline-slate-400 disabled:opacity-40',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-500 disabled:bg-rose-600/40',
  ghost:
    'bg-transparent text-slate-300 hover:text-paper-100 focus-visible:outline-slate-400'
};

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
