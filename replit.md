# CipherVault

A full-stack cryptocurrency investment platform where users can manage deposits, invest in yield plans, and track their portfolio — all with admin approval workflows and real-time balance management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ciphervault run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (`artifacts/api-server`)
- Frontend: React + Vite + Tailwind v4 + shadcn/ui + wouter (`artifacts/ciphervault`)
- Auth: Replit-managed Clerk (`@clerk/express` + `@clerk/react`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema.ts` — source of truth for all DB tables
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all API types)
- `lib/api-client-react/src/generated/` — generated hooks + Zod schemas (do not edit by hand)
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/middlewares/requireAuth.ts` — `requireAuth` + `requireAdmin` middleware
- `artifacts/ciphervault/src/pages/` — all frontend page components
- `artifacts/ciphervault/src/components/layout.tsx` — sidebar + header shell

## Architecture decisions

- **Contract-first API**: OpenAPI spec → Orval codegen → typed React Query hooks used everywhere in the frontend. Never call `fetch` directly.
- **JIT user provisioning**: On every Clerk sign-in, the frontend calls `POST /api/users/sync` which upserts the user record in the local DB. Auth middleware attaches `req.localUser` from the DB row.
- **Balance is a string in DB, float in API**: `users.balance` is stored as `numeric` (string from Drizzle) but serialized as a JS `number` in all API responses.
- **Withdrawal balance held immediately**: When a user submits a withdrawal request, the balance is deducted at request time. If admin rejects, it is refunded. This prevents double-spending.
- **Investment maturity auto-processed**: When a user loads `/investments`, the server checks for any active investments past their maturity date, marks them completed, and credits the expected return to the user's balance — no cron job needed.

## Product

- **Dashboard** — vault balance display, portfolio stats, quick actions (Deposit / Invest / Portfolio / My Returns)
- **Deposits** — request deposits (bank transfer, crypto, card); pending admin approval to credit balance
- **Withdrawals** — request withdrawals; balance held immediately; refunded on rejection
- **Investment Plans** — 4 tiered plans (Starter 8%/30d, Growth 15%/60d, Premium 25%/90d, Elite 40%/120d); investing deducts balance and locks until maturity
- **My Investments** — shows active/completed investments with progress bar, days remaining, and "Return Credited" confirmation
- **Market** — live market coin listing
- **Portfolio** — holdings tracker
- **Transactions** — buy/sell transaction log
- **Watchlist** — tracked coins
- **Admin Console** — stats overview, user management (role + active toggle), deposit/withdrawal approval queue with pending badges, investment oversight

## Admin setup

To promote a user to admin, run this SQL against the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do not run `pnpm dev` at workspace root — use workflow restart or `pnpm --filter` commands.
- After any schema change run `pnpm --filter @workspace/db run push` and then `pnpm --filter @workspace/api-spec run codegen` if any API types change.
- `holdings`, `transactions`, and `watchlist` tables are not user-scoped — they display global seeded data for all users.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.agents/memory/ciphervault-auth.md` for Clerk wiring details
