# ETE·TAR — Authentication Microservice

A small, self-hosted authentication service: accounts, sessions, roles, and
password recovery, with a Next.js frontend on top.

```
backend/    Express + TypeScript + Sequelize + PostgreSQL API
web-app/    Next.js (App Router) client
```

## How it works

- **Accounts** — email + password registration, passwords hashed with bcrypt.
- **Sessions** — a short-lived (1h) JWT access token plus a 7-day refresh
  token. The refresh token is stored against the user row, so logging out (or
  an admin revoking access) actually invalidates it — it isn't just deleted
  client-side.
- **Roles** — every user has a `role` of `user` or `admin`. Role checks are
  enforced server-side in `authMiddleware.requireRole`, never trusted from the
  client.
- **Recovery** — forgot-password issues a single-use, one-hour token emailed
  via Resend; reset-password consumes it.
- **Auto-refresh** — the frontend's axios instance (`web-app/lib/api.ts`)
  attaches the access token to every request and transparently retries once
  with a refreshed token on a 401, so a session survives the access token
  expiring without forcing a re-login.

## Run locally

**Backend**

```bash
cd backend
cp .env.example .env   # point DATABASE_URL at a running Postgres instance
npm install
npm run dev
```

**Frontend**

```bash
cd web-app
cp .env.example .env.local
npm install
npm run dev
```

The frontend proxies `/api/*` to `BACKEND_URL` (default
`http://localhost:3000`) via `next.config.ts`, so the browser only ever talks
to the frontend's own origin — no CORS juggling in the browser, and no
backend URLs baked into client bundles.

Required environment variables are documented in each service's
`.env.example`. At minimum, set real values for `JWT_SECRET` and
`REFRESH_TOKEN_SECRET` in production — the defaults are placeholders only.

## Routes

**Public**
- `GET /health` — health check
- `POST /api/register`
- `POST /api/login`
- `POST /api/refresh`
- `POST /api/forgot-password`
- `POST /api/reset-password`

**Authenticated** (`Authorization: Bearer <accessToken>`)
- `GET /api/me`
- `POST /api/logout`

**Admin only**
- `GET /api/admin`
- `POST /api/admin/promote` — body `{ "email": "..." }`
