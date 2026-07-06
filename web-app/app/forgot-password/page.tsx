'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const data = await forgotPassword(email.trim());
      setMessage(data.message);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <Card tab="Recovery">
        <h1 className="font-serif text-2xl font-medium text-paper-100">Reset your password</h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          We&apos;ll email a one-hour reset link if the address matches an account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alemu@example.com"
            required
          />

          <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
            Send reset link
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link href="/login" className="text-amber-300 hover:underline">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}
