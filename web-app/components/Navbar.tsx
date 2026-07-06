'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from './ui/Badge';

export function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="border-b border-slate-800/80 bg-ink-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-paper-100">
            WEDET
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            auth
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {!isLoading && user && (
            <>
              <Link href="/profile" className="text-slate-300 transition-colors hover:text-paper-100">
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-slate-300 transition-colors hover:text-paper-100">
                  Admin
                </Link>
              )}
              <Badge tone={user.role === 'admin' ? 'amber' : 'teal'}>{user.role}</Badge>
              <button
                onClick={() => void logout()}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-400/60 hover:text-rose-300"
              >
                Log out
              </button>
            </>
          )}

          {!isLoading && !user && (
            <>
              <Link href="/login" className="text-slate-300 transition-colors hover:text-paper-100">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-ink-950 transition-colors hover:bg-amber-300"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
