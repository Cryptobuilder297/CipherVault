---
name: CipherVault Auth Setup
description: Clerk auth setup, user provisioning, admin role, and key architectural decisions for CipherVault
---

# CipherVault Auth Architecture

## Auth: Replit-managed Clerk
- Provisioned via `setupClerkWhitelabelAuth()` — keys auto-set as CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY
- Server: `@clerk/express` clerkMiddleware in app.ts, proxy via clerkProxyMiddleware
- Client: `@clerk/react` + `@clerk/themes` + `@clerk/react/internal`

## User Provisioning (JIT)
- `UserSyncer` component in App.tsx calls `POST /api/users/sync` on every sign-in
- Users table stores: clerkId (unique), email, username, role (user/admin), balance
- `requireAuth` middleware fetches localUser from DB and attaches to `req.localUser`

## Admin Role
- Role is `users.role` field — default "user"
- To make a user admin: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'`
- `requireAdmin` middleware enforces role check

## Key DB Tables
- users, deposits, withdrawals, investment_plans, user_investments
- Existing tables (holdings, transactions, watchlist) are NOT yet user-scoped — they show all data globally

**Why:** Auth was added after the initial build. User-scoping existing tables would require migration.
**How to apply:** If asked to scope portfolio/holdings/transactions to per-user, add userId column to those tables and push schema.

## Investment Plans (seeded)
- 4 plans: Starter (8%/30d/$100min), Growth (15%/60d/$5000min), Premium (25%/90d/$25000min), Elite (40%/120d/$100000min)
- Investing deducts from user.balance immediately
