---
name: project-edy-widget
description: Edy AI voice assistant widget — LiveKit integration added in commit 98dc111, requires 3 new env vars
metadata:
  type: project
---

Edy is a Spanish-language AI voice assistant integrated as a floating widget on every page of the frontend.

**Added in commit 98dc111 (2026-05-15):**
- `frontend/app/_components/edy-widget.tsx` — Client component; uses `livekit-client` (dynamic import for SSR safety); manages Room lifecycle, mic toggle, status states
- `frontend/app/api/edy/token/route.ts` — POST endpoint; verifies Supabase session then issues signed LiveKit JWT (TTL 10 min); room name is `edy-{userId}` (one room per user)
- `.agents/skills/frontend-design/` — design skill installed for future UI work

**New environment variables required (frontend):**
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL` (e.g. `wss://your-project.livekit.cloud`)

**Authorization:** Token endpoint validates Supabase session (`supabase.auth.getUser()`). No role restriction — any authenticated user (instructor or student) can connect to Edy.

**Why:** Proposal in INTEGRATION_PROPOSAL.md describes Edy as a Python/LiveKit Agents service running separately; the widget bridges it into the Next.js frontend. The backend Edy agent connects to the same LiveKit room and handles voice processing.

**How to apply:** If asked about Edy or voice features, the token endpoint is at `/api/edy/token` (frontend, not backend). The widget is mounted globally in `frontend/app/layout.tsx`.
