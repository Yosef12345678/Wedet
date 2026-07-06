'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="h-6 w-6 text-amber-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <Card tab="Session">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-medium text-paper-100">Your profile</h1>
            <p className="mt-1 text-sm text-slate-400">Everything the token knows about you.</p>
          </div>
          <Badge tone={user.role === 'admin' ? 'amber' : 'teal'}>{user.role}</Badge>
        </div>

        <dl className="mt-6 divide-y divide-slate-800 border-y border-slate-800">
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">User ID</dt>
            <dd className="font-mono text-sm text-paper-100">{user.id}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">Email</dt>
            <dd className="text-sm text-paper-100">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">Role</dt>
            <dd className="text-sm text-paper-100">
              {user.role === 'admin' ? 'Administrator' : 'Standard user'}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          {user.role === 'admin' && (
            <Link href="/admin">
              <Button variant="secondary">Open admin dashboard</Button>
            </Link>
          )}
          <Button variant="danger" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
}
