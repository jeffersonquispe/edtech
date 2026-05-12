# EdTech - Plataforma de Cursos Online

Plataforma estilo Udemy/Gumroad construida con Next.js 14 + Supabase.

## Stack

- **Backend**: Next.js 14 (Route Handlers API-only)
- **Frontend**: Next.js 14 + Tailwind CSS + shadcn/ui
- **DB/Auth**: Supabase (Postgres + RLS + Auth)

## Estructura

```
edtech/
├── backend/       # API en puerto 3001
├── frontend/      # UI en puerto 3000
├── CLAUDE.md      # Especificación del proyecto
└── README.md
```

## Fase 0 - Completada ✓

- [x] Git init
- [x] Creación de backend/ y frontend/ como proyectos Next.js independientes
- [x] Instalación de Supabase (@supabase/ssr @supabase/supabase-js)
- [x] Archivos .env.example
- [x] Estructura de carpetas

## Fase 1 - Completada ✓

- [x] 6 migraciones SQL con RLS:
  - 001_profiles.sql
  - 002_categories.sql
  - 003_courses.sql
  - 004_lessons.sql
  - 005_enrollments.sql
  - 006_reviews.sql

## Fase 2 - Completada ✓

- [x] Backend utilities:
  - lib/supabase/server.ts (cliente SSR)
  - lib/errors.ts (mapeo Postgres → HTTP)
- [x] 5 endpoints:
  - GET /api/courses
  - POST /api/courses
  - PATCH /api/courses/[id]
  - POST /api/courses/[id]/enroll
  - GET /api/courses/[id]/lessons

## Fase 3 - En progreso

- [ ] Frontend Supabase clients (server.ts, client.ts, middleware.ts)
- [ ] Páginas y componentes
- [ ] Flujo de auth

## Setup

1. Copiar `.env.example` a `.env.local` en backend/ y frontend/
2. Crear proyecto Supabase, obtener URL y keys
3. Aplicar migraciones: `supabase db push`
4. Generar tipos: `supabase gen types typescript > backend/types/database.ts`
5. `npm run dev` en backend/ y frontend/

## Próximos pasos

- Instalar shadcn/ui (Node 16 no soporta, usar en desarrollo con Node 20+)
- Crear páginas: /login, /signup, /, /courses/[id], /dashboard/student, /dashboard/instructor
- Implementar autenticación y flujos
