---
name: project-api-auth-pattern
description: Backend createClient supports dual auth: Bearer token (curl/API) and cookie (browser); RLS is sole authorization layer
metadata:
  type: project
---

`backend/lib/supabase/server.ts` exposes two helpers:

1. `createClient()` — detects `Authorization: Bearer <token>` header; if present, creates a supabase-js client with that token injected. Falls back to cookie-based `createServerClient` from @supabase/ssr.
2. `getAuthUser()` — mirrors the same logic to call `supabase.auth.getUser(token)` for Bearer, or `getUser()` for cookie session.

**Pattern in Route Handlers:**
- Always call `getAuthUser()` only when the endpoint needs the user identity for the INSERT (e.g., setting `instructor_id` or `student_id`).
- Never duplicate RLS-level permission checks in TypeScript. If Supabase returns empty data, return 200 + empty array, not 403.
- `mapPostgresError` in `backend/lib/errors.ts` translates Postgres error codes: `23505` → 409 Conflict, `23503` → 400 Bad Request, default → 500.

**Why:** Dual auth allows the same Route Handlers to be called from both a browser session and programmatic API clients (e.g., the Edy Python agent calling the backend REST API with a token).

**How to apply:** New endpoints should import `createClient` and `getAuthUser` from `@/lib/supabase/server`. Use `mapPostgresError` for all Supabase error handling. Do not add manual permission checks for actions already covered by RLS policies.
