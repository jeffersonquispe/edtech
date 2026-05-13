# 📊 Estado del Proyecto EdTech

Última actualización: 2026-05-11

---

## ✅ Completado

### Fase 0: Setup de Monorepo
- [x] Git init + .gitignore
- [x] Estructura: backend/ + frontend/ (2 proyectos Next.js)
- [x] npm install (Supabase, Tailwind, TypeScript)
- [x] .env.example + .env.local con credenciales reales

### Fase 1: Migraciones SQL (6 tablas)
- [x] 001_profiles.sql (trigger auto-create + RLS)
- [x] 002_categories.sql (lectura pública)
- [x] 003_courses.sql (instructor CRUD con RLS)
- [x] 004_lessons.sql (solo visible a inscritos/instructor)
- [x] 005_enrollments.sql (N:N, UNIQUE constraint)
- [x] 006_reviews.sql (UNIQUE, RLS estricto)

**Estado BD**: ⏳ SQL escrito, **PENDIENTE aplicar en Supabase**

### Fase 2: Backend API (5 endpoints)
- [x] `GET /api/courses` — Listado publicado + filtro categoría
- [x] `POST /api/courses` — Crear curso (instructor)
- [x] `PATCH /api/courses/[id]` — Editar curso
- [x] `POST /api/courses/[id]/enroll` — Inscribirse
- [x] `GET /api/courses/[id]/lessons` — Lecciones (solo inscritos)

**Utilities:**
- [x] lib/supabase/server.ts (cliente SSR)
- [x] lib/errors.ts (mapeo Postgres → HTTP)

**Estado Backend**: ✅ Compilable (requiere Node 20+)

### Documentación
- [x] DATA_MODEL.md (diagrama + detalle de tablas)
- [x] SETUP_SUPABASE.md (guía paso a paso)
- [x] REQUIREMENTS.md (versiones necesarias)
- [x] README.md (actualizado)

---

## ⏳ En Progreso

### Fase 3: Frontend

**Clientes Supabase** (preparados, no probados):
- [x] lib/supabase/client.ts (browser)
- [x] lib/supabase/server.ts (SSR)
- [x] lib/supabase/middleware.ts (refresh sesión)
- [x] middleware.ts (NextJS middleware)
- [x] lib/api.ts (fetch wrapper → backend)

**Pendiente:**
- [ ] Instalar shadcn/ui (requiere Node 20+)
- [ ] Páginas:
  - [ ] /login (Supabase Auth)
  - [ ] /signup (Supabase Auth + cambiar rol)
  - [ ] / (listado cursos publicados)
  - [ ] /courses/[id] (detalle + botón inscribirse)
  - [ ] /dashboard/student (mis cursos)
  - [ ] /learn/[courseId] (lecciones)
  - [ ] /dashboard/instructor (gestión)
  - [ ] /dashboard/instructor/courses/[id]/edit (CRUD)

---

## 🚨 Bloqueadores

| Bloqueador | Severidad | Solución |
|---|---|---|
| **Node.js 16.20.0** | 🔴 CRÍTICO | Actualizar a Node 20+ (ver REQUIREMENTS.md) |
| **Migraciones no aplicadas en Supabase** | 🔴 CRÍTICO | Ejecutar SQL en Supabase Studio (ver SETUP_SUPABASE.md) |
| **Tipos TypeScript sin generar** | 🟡 MODERADO | Ejecutar `supabase gen types typescript` |
| **shadcn/ui no instalado** | 🟡 MODERADO | Requiere Node 20+ |

---

## 📋 Checklist para Producción

### Pre-Implementación Fase 3
- [ ] Actualizar Node a 20+
- [ ] Aplicar migraciones en Supabase (SETUP_SUPABASE.md)
- [ ] Generar tipos TypeScript
- [ ] Instalar shadcn/ui
- [ ] Crear `.env.local` en frontend/

### Durante Fase 3 (Páginas)
- [ ] Auth pages (/login, /signup)
- [ ] Homepage listado cursos
- [ ] Detalle curso + inscripción
- [ ] Dashboard estudiante
- [ ] Visor de lecciones (markdown + video)
- [ ] Dashboard instructor
- [ ] CRUD lecciones

### Pruebas
- [ ] Flujo: registrar → crear curso → publicar → inscribir → ver lecciones
- [ ] Verificar RLS (anónimo no ve lecciones)
- [ ] 409 Conflict al inscribirse dos veces
- [ ] Reviews solo de inscritos
- [ ] Instructor solo ve sus cursos

### Deployment
- [ ] Vercel (frontend + backend como functions)
- [ ] O: Railway / Render (backend) + Vercel (frontend)
- [ ] Variables de entorno en producción
- [ ] CORS configurado
- [ ] SSL/HTTPS

---

## 📊 Metrics

```
Líneas de código:
  - Migraciones SQL:    ~500 líneas
  - Endpoints backend:  ~150 líneas
  - Clientes Supabase:  ~100 líneas
  - Total:              ~750 líneas

Tablas creadas: 6
Endpoints creados: 5
Políticas RLS: 20+
Índices: 10+

Documentación:
  - DATA_MODEL.md:      ~300 líneas
  - SETUP_SUPABASE.md:  ~400 líneas
  - REQUIREMENTS.md:    ~150 líneas
  - STATUS.md (this):   ~150 líneas
```

---

## 🗓️ Timeline

| Fase | Estado | Estimado |
|---|---|---|
| 0: Setup | ✅ Completado | 30 min |
| 1: Migraciones | ✅ Completado (no aplicado) | 45 min |
| 2: Backend | ✅ Completado | 60 min |
| 3: Frontend | ⏳ En progreso | 2-3 horas |
| 4: Testing | ⏳ Pendiente | 1 hora |
| 5: Deploy | ⏳ Pendiente | 1 hora |

---

## 🔗 Links Importantes

- **Proyecto Supabase**: https://app.supabase.com
- **GitHub (cuando pushes)**: (TBD)
- **Vercel (cuando deploys)**: (TBD)

---

## 📝 Notas

- Autorización vive en SQL (RLS), no en código
- Backend API-only (sin server-side rendering)
- Frontend consume backend vía apiFetch() wrapper
- Pagos: desactivados por ahora (precio es decorativo)
- Lecciones: markdown + URL de video (no Storage)

---

## 🎯 Próximo Paso Inmediato

1. **Actualiza Node a 20+** (REQUIREMENTS.md)
2. **Aplica migraciones en Supabase** (SETUP_SUPABASE.md)
3. **Genera tipos** con `supabase gen types typescript`
4. **Instala shadcn/ui**: `cd frontend && npx shadcn@latest init`
5. **Comienza Fase 3** (páginas y componentes)

¡Listo! El backend ya está pronto. 🚀
