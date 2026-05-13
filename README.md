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

## ⚡ Quick Start

### 1. Aplicar Migraciones

✅ **Ya configuradas**: backend/.env y frontend/.env tienen Supabase URL + keys

Ahora aplica las 6 migraciones SQL:

**Opción A (Recomendado):**
- Lee [SETUP_SUPABASE.md](./SETUP_SUPABASE.md)
- Copia el SQL en Supabase Studio > SQL Editor > Run

**Opción B (CLI):**
```bash
cd backend
supabase db push
```

### 2. Generar Tipos TypeScript

Una vez que las tablas existan:

```bash
cd backend
npx supabase gen types typescript --project-id [tu-project-id] > types/database.ts
cp types/database.ts ../frontend/types/database.ts
```

### 3. Correr Backend

```bash
cd backend
npm run dev
```

Servidor en http://localhost:3001. Prueba:
```bash
curl http://localhost:3001/api/courses
```

### 4. Correr Frontend

En otra terminal:
```bash
cd frontend
npm run dev
```

Servidor en http://localhost:3000

---

## 📚 Documentación

- **[DATA_MODEL.md](./DATA_MODEL.md)** — Diagrama y detalle de todas las tablas (6 tablas, RLS, flujos)
- **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)** — Guía paso a paso para aplicar migraciones
- **[CLAUDE.md](./CLAUDE.md)** — Especificación técnica del proyecto

---

## 🛠 Tech Stack

| Componente | Tecnología |
|---|---|
| Backend API | Next.js 14 Route Handlers |
| Frontend UI | Next.js 14 + Tailwind + shadcn/ui |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth |
| Deployment | (TBD) |

---

## 📂 Estructura

```
edtech/
├── backend/
│   ├── app/api/courses/          # 5 endpoints
│   ├── lib/supabase/server.ts    # Cliente Supabase
│   ├── lib/errors.ts             # Mapeo Postgres → HTTP
│   └── supabase/migrations/      # 6 migraciones SQL
├── frontend/
│   ├── app/                      # Páginas (TBD)
│   ├── components/               # shadcn/ui (TBD)
│   └── lib/supabase/             # Clientes browser + server
├── DATA_MODEL.md                 # Esquema visualmente explicado
├── SETUP_SUPABASE.md             # Guía migraciones
└── CLAUDE.md                      # Especificación técnica
```

---

## 🚀 Próximas Tareas (Fase 3)

- [ ] Instalar shadcn/ui (requiere Node 20+)
- [ ] Páginas: /login, /signup, /, /courses/[id], /dashboard/student, /dashboard/instructor
- [ ] Flujo de autenticación (Supabase Auth)
- [ ] CRUD de cursos (instructor)
- [ ] Inscripción y visualización de lecciones (estudiante)
- [ ] Sistema de reviews
