'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/admin/promote', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Promotion failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="h-6 w-6 text-amber-400" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
        <Card tab="Restricted" className="text-center">
          <h1 className="font-serif text-2xl font-medium text-rose-300">Access denied</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your session doesn&apos;t carry the admin role.
          </p>
          <Link href="/profile" className="mt-6 inline-block text-sm text-amber-300 hover:underline">
            Back to profile
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <Card tab="Admin">
        <h1 className="font-serif text-2xl font-medium text-paper-100">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Grant the admin role to another account.</p>

        <form onSubmit={handlePromote} className="mt-6 flex flex-col gap-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            label="User email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Promote to admin
          </Button>
        </form>

        <div className="mt-8 border-t border-slate-800 pt-6">
          <Link href="/profile" className="text-sm text-amber-300 hover:underline">
            ← Back to profile
          </Link>
        </div>
      </Card>
    </div>
  );
}
