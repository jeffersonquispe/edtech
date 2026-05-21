---
name: project-architecture
description: EdTech monorepo structure, migration inventory, and API endpoint contract — full picture as of Fases 0-3
metadata:
  type: project
---

Monorepo split into `backend/` (Next.js Route Handlers, port 3001) and `frontend/` (Next.js UI, port 3000).

**Migrations in `backend/supabase/migrations/`:**
- 001_profiles — auto-creates profile row on auth.users INSERT via trigger
- 002_categories — admin-only writes (INSERT/UPDATE/DELETE policies use `WITH CHECK (false)`)
- 003_courses — indexes on instructor_id, category_id, is_published
- 004_lessons — ordered by `position` column; visible only to enrolled students or course owner
- 005_enrollments — UNIQUE(student_id, course_id) enforces 409 Conflict at Postgres level
- 006_reviews — UNIQUE(student_id, course_id); only enrolled students may insert

**API Endpoints (backend):**
- GET /api/courses — public, includes instructor name + category + enrollment count
- POST /api/courses — instructor only, returns 201
- PATCH /api/courses/[id] — instructor owner only (RLS); returns 403 if empty result
- POST /api/courses/[id]/enroll — student only, returns 409 on duplicate via mapPostgresError
- GET /api/courses/[id]/lessons — no auth check in code; RLS returns [] for non-enrolled users

**Frontend pages added in `first commit` (27ecac4):**
- /login, /signup — Supabase signInWithPassword / signUp
- / (homepage) — public course catalog
- /courses/[id] — course detail with role-aware CTA
- /dashboard/instructor — course list + stats + CreateCourseForm
- /dashboard/instructor/courses/[id] — EditCourseForm + LessonsManager
- /dashboard/student — enrolled courses grid
- /learn/[courseId] — lesson viewer (iframe for video, pre for markdown)

**Why:** Separation of backend/frontend enables independent deployment and clear security boundaries (service role key never touches frontend bundle).

**How to apply:** When suggesting new endpoints, place Route Handlers in `backend/app/api/`. Frontend pages go in `frontend/app/`. Never import SUPABASE_SERVICE_ROLE_KEY from frontend code.
