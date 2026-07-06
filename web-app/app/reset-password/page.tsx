'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('No reset token provided. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const data = await resetPassword(token as string, password);
      setMessage(data.message);
      setTimeout(() => router.push('/login'), 2200);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <Card tab="Invalid link">
        <h1 className="font-serif text-2xl font-medium text-rose-300">Invalid reset link</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          No reset token was provided. Request a new password reset to continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm text-amber-300 hover:underline"
        >
          Request a new reset link
        </Link>
      </Card>
    );
  }

  return (
    <Card tab="Recovery">
      <h1 className="font-serif text-2xl font-medium text-paper-100">Create a new password</h1>
      <p className="mt-1 text-sm text-slate-400">Choose something you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
        />

        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link href="/login" className="text-amber-300 hover:underline">
          Back to login
        </Link>
      </p>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <Suspense
        fallback={<p className="text-center text-sm text-slate-500">Loading...</p>}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
