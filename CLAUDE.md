# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. Resumen del proyecto

Plataforma de cursos online estilo Udemy / Gumroad. Dos roles de usuario:

- **Instructor** — crea, edita y publica cursos.
- **Estudiante** — explora, se inscribe y consume contenido.

La autorización **vive en la base de datos** vía Row Level Security (RLS) de
Supabase. El backend (Next.js Route Handlers) **no debe duplicar** validaciones
de permisos que ya están en políticas RLS: solo orquesta, transforma respuestas
y maneja errores.

## 2. Stack técnico

- **Framework:** Next.js 14/15 (App Router, Route Handlers en `app/api/**`)
- **Lenguaje:** TypeScript estricto (`strict: true` en `tsconfig.json`)
- **DB / Auth / Storage:** Supabase (Postgres + RLS + `auth.users`)
- **Cliente Supabase:** `@supabase/ssr` para server, `@supabase/supabase-js` para client
- **Migraciones:** SQL plano en `supabase/migrations/NNN_descripcion.sql` (numeración secuencial)
- **Testing (Backend):** Jest + Supertest
- **Testing (Frontend):** Vitest + React Testing Library + Playwright (E2E)
- **UI:** Tailwind CSS + shadcn/ui + LiveKit (video conferencing)

## 3. Estructura del repositorio

```
edtech/
├── backend/              # Next.js API + server-only code (port 3001)
│   ├── app/
│   │   ├── api/         # Route Handlers
│   │   │   └── courses/
│   │   │       ├── [id]/
│   │   │       │   ├── route.ts (PATCH course)
│   │   │       │   ├── enroll/ (POST enroll)
│   │   │       │   └── lessons/ (GET lessons)
│   │   │       └── route.ts (GET list, POST create)
│   │   └── layout.tsx
│   ├── __tests__/       # Unit tests (Jest)
│   ├── lib/             # Shared utilities
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/            # Next.js client + UI (port 3000)
│   ├── app/
│   │   ├── api/         # Server actions + utility endpoints
│   │   ├── _components/ # Shared components
│   │   ├── courses/     # Public course listing
│   │   ├── dashboard/   # Protected routes
│   │   │   ├── instructor/ (create/edit courses)
│   │   │   └── student/    (enrolled courses)
│   │   ├── learn/       # Course lesson playback
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── e2e/             # Playwright tests
│   ├── package.json
│   └── vitest.config.ts
│
└── CLAUDE.md            # This file
```

## 4. Modelo de datos (6 tablas)

| Tabla | Descripción | Relación clave |
|---|---|---|
| `profiles` | Perfil extendido (rol, nombre, avatar) | 1:1 con `auth.users` |
| `categories` | Categorías de cursos | 1:N con `courses` |
| `courses` | Cursos con precio y estado | N:1 con `profiles` |
| `lessons` | Lecciones de un curso | N:1 con `courses` |
| `enrollments` | Inscripciones estudiante↔curso | N:N |
| `reviews` | Reseñas de estudiantes | N:1 con `courses`, `profiles` |

Reglas comunes a todas las tablas:

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at timestamptz DEFAULT now()`
- RLS **activo** (`ENABLE ROW LEVEL SECURITY`)
- Foreign keys con `REFERENCES` explícito; `ON DELETE` debe ser intencional
  (típicamente `CASCADE` para `lessons`/`enrollments`/`reviews`, `RESTRICT`
  para `courses` cuando borrar un instructor)

`enrollments` lleva `UNIQUE(student_id, course_id)` para evitar inscripciones
duplicadas — el endpoint debe devolver **409 Conflict** cuando Postgres lance
el error de unicidad (`code === '23505'`).

## 5. Políticas RLS — fuente de verdad

La autorización está en SQL, no en TypeScript. Al generar endpoints, **asume
que RLS hace su trabajo** y maneja el comportamiento esperado:

- **Cursos públicos:** lectura libre cuando `is_published = true`. Cualquier
  request, incluso anónimo, puede listarlos.
- **Edición de cursos:** solo el instructor dueño (`auth.uid() = instructor_id`).
- **Lecciones:** solo visibles para usuarios con fila en `enrollments` para ese
  curso. Si un usuario no inscrito consulta, Supabase devuelve **array vacío**,
  no error 403. El endpoint debe devolver `[]` con status 200 — no fingir un 403.
- **Inscripciones:** un usuario solo ve las suyas (`student_id = auth.uid()`).
- **Reviews:** solo estudiantes inscritos pueden insertar.

> Si Claude detecta que necesita validar permisos en código que ya están
> cubiertos por RLS, **detente y pregunta** antes de añadir lógica redundante.

## 6. Endpoints — contrato

| Ruta | Método | Auth | Comportamiento |
|---|---|---|---|
| `/api/courses` | GET | No | Cursos publicados; acepta `?category=uuid`; incluye nombre del instructor, categoría y conteo de inscritos |
| `/api/courses` | POST | Instructor | Valida rol `instructor` en `profiles`; devuelve 201 |
| `/api/courses/[id]` | PATCH | Instructor dueño | Actualización parcial; RLS bloquea si no es dueño |
| `/api/courses/[id]/enroll` | POST | Estudiante | Verifica curso publicado; 409 si ya inscrito |
| `/api/courses/[id]/lessons` | GET | Estudiante inscrito | `[]` si no está inscrito (no 403) |

## 7. Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # SOLO server, jamás expuesta al cliente
```

Reglas duras:

- **Nunca** importar `SUPABASE_SERVICE_ROLE_KEY` en un archivo bajo `app/`
  que pueda terminar en el bundle del cliente. Solo en Route Handlers
  (`route.ts`) o Server Actions.
- **Nunca** commitear `.env.local`. Está en `.gitignore`.
- Si un endpoint requiere bypass de RLS (caso raro, p.ej. job administrativo),
  debe estar explícitamente comentado por qué y usar el cliente con
  `service_role`. Por defecto, **todos los endpoints usan el cliente con sesión
  del usuario** (anon key + cookie).

## 8. Convenciones de código

- TypeScript estricto. Nada de `any` salvo justificación en comentario.
- Tipos de DB se generan con `supabase gen types typescript` y viven en
  `types/database.ts`. Al hacer queries, tipar con `Database['public']['Tables']['nombre']['Row']`.
- Nombres de archivos y carpetas en `kebab-case`; componentes en `PascalCase`.
- Imports absolutos vía alias `@/` (configurado en `tsconfig.json`).
- No usar `console.log` en código de producción; en su lugar `console.error`
  para errores reales o eliminarlos.

## 9. Flujo de trabajo con migraciones

1. Cada cambio de schema es un archivo nuevo en `supabase/migrations/`.
   **Nunca editar una migración ya aplicada.**
2. Numeración secuencial de 3 dígitos: `001_`, `002_`, ...
3. Al generar una migración, incluir:
   - `CREATE TABLE` con todas las columnas y constraints.
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
   - Todas las `CREATE POLICY` necesarias en el mismo archivo.
   - Índices relevantes (FKs sin índice son frecuentes y deben evitarse).
4. Aplicar vía SQL Editor de Supabase o CLI (`supabase db push`).

## 10. Comandos comunes

### Setup inicial
```bash
# Instalar dependencias en ambas carpetas
cd backend && npm install
cd ../frontend && npm install
```

### Desarrollo
```bash
# Terminal 1: Backend (puerto 3001)
cd backend && npm run dev

# Terminal 2: Frontend (puerto 3000)
cd frontend && npm run dev
```

### Build
```bash
cd backend && npm run build
cd frontend && npm run build
```

### Linting
```bash
cd backend && npm run lint
cd frontend && npm run lint
```

### Testing

**Backend (Jest):**
```bash
cd backend && npm run test           # watch mode
cd backend && npm run test:run       # single run
cd backend && npm run test:coverage  # coverage report
```

**Frontend (Vitest):**
```bash
cd frontend && npm run test          # watch mode
cd frontend && npm run test:run      # single run
cd frontend && npm run coverage      # coverage report
```

**E2E (Playwright):**
```bash
cd frontend && npm run test:e2e      # headless
cd frontend && npm run test:e2e:ui   # UI mode
cd frontend && npm run test:e2e:debug # debug mode
```

### Ejecutar un test específico
```bash
# Backend: run single test file
cd backend && npm run test -- lib/errors.test.ts

# Frontend: run single test file
cd frontend && npm run test -- login.test.tsx

# E2E: run single test file
cd frontend && npm run test:e2e -- e2e/auth.spec.ts
```

## 11. Arquitectura de testing

**Backend (Jest + Supertest):**
- Pruebas unitarias en `__tests__/`
- Pruebas de integración usando `supertest` para Route Handlers
- Configuración en `jest.config.js` y `jest.setup.js`

**Frontend (Vitest + Testing Library):**
- Pruebas unitarias/componentes en archivos `.test.tsx`
- Ejecución con `vitest` + jsdom para DOM testing
- Configuración en `vitest.config.ts` y `vitest.setup.ts`

**E2E (Playwright):**
- Pruebas end-to-end en `e2e/`
- Configuración en `playwright.config.ts`
- Cubre flujos reales (login, crear curso, inscribirse, etc.)

> **Nota:** No duplicar lógica entre tests unitarios y E2E. Tests unitarios prueban
> comportamiento de componentes/funciones aisladas; E2E prueba flujos completos.
