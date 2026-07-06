import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const capabilities = [
  {
    label: 'Accounts',
    detail: 'Email + password registration with bcrypt hashing and unique-email enforcement.'
  },
  {
    label: 'Sessions',
    detail: 'Short-lived access tokens paired with 7-day refresh tokens, rotated on login.'
  },
  {
    label: 'Roles',
    detail: 'user and admin roles, enforced server-side on every protected route.'
  },
  {
    label: 'Recovery',
    detail: 'Time-boxed, single-use reset tokens delivered by email.'
  }
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge tone="amber">Authentication microservice</Badge>
          <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-paper-100 sm:text-5xl">
            One quiet service that decides
            <span className="italic text-amber-300"> who&apos;s allowed in.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
            WEDET issues, verifies, and revokes credentials so the rest of your
            stack never has to. Express, Postgres, and JWTs underneath - a clean
            login screen on top.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-300"
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-paper-100 transition-colors hover:border-amber-400/60 hover:text-amber-300"
            >
              Log in
            </Link>
          </div>
        </div>

        <Card tab="Session verified">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Decoded access token
          </p>
          <dl className="mt-4 space-y-3 font-mono text-sm">
            {[
              ['sub', 'usr_84f1c2a0'],
              ['role', 'admin'],
              ['iat', '1751792400'],
              ['exp', '+ 1h from issue']
            ].map(([key, value]) => (
              <div
                key={key}
                className="flex items-baseline justify-between border-b border-dashed border-slate-800 pb-2"
              >
                <dt className="text-slate-500">{key}</dt>
                <dd className="text-paper-100">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-slate-500">
            Signed with <span className="text-amber-300">HS256</span>. Refresh
            tokens live server-side so a logout actually revokes access.
          </p>
        </Card>
      </section>

      <section className="mt-24 grid gap-6 border-t border-slate-800 pt-12 sm:grid-cols-2">
        {capabilities.map((item) => (
          <div key={item.label} className="flex gap-4">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-amber-300">
                {item.label}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
