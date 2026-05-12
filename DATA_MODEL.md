# Modelo de Datos - EdTech

## Diagrama de Relaciones

```
┌─────────────────────────────────────────────────────────────────────┐
│                         auth.users (Supabase)                       │
│  id (uuid) | email | password | created_at                         │
└────────────────────┬──────────────────────────────────────────────┘
                     │ 1:1 (ON DELETE CASCADE)
                     │
                     ▼
        ┌──────────────────────────┐
        │      profiles            │
        ├──────────────────────────┤
        │ id (uuid) PK [FK auth]   │
        │ role (student/instructor)│
        │ full_name                │
        │ avatar_url               │
        │ created_at               │
        └────┬─────────────────────┘
             │ 1:N
             ├──────────────────┬─────────────────────┐
             │                  │                     │
             ▼                  ▼                     ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │    courses       │  │   enrollments    │  │    reviews       │
    ├──────────────────┤  ├──────────────────┤  ├──────────────────┤
    │ id (uuid) PK     │  │ id (uuid) PK     │  │ id (uuid) PK     │
    │ instructor_id FK │  │ student_id FK    │  │ course_id FK     │
    │ category_id FK   │  │ course_id FK     │  │ student_id FK    │
    │ title            │  │ created_at       │  │ rating (1-5)     │
    │ description      │  │ UNIQUE(student,  │  │ comment          │
    │ price            │  │        course)   │  │ created_at       │
    │ is_published     │  └──────────────────┘  │ UNIQUE(student,  │
    │ created_at       │                        │        course)   │
    └────┬─────────────┘                        └──────────────────┘
         │ N:1
         │
         ▼
    ┌──────────────────┐
    │   categories     │
    ├──────────────────┤
    │ id (uuid) PK     │
    │ name (UNIQUE)    │
    │ slug (UNIQUE)    │
    │ created_at       │
    └──────────────────┘
         ▲
         │ 1:N
         │
    ┌────┴─────────────┐
    │   lessons        │
    ├──────────────────┤
    │ id (uuid) PK     │
    │ course_id FK     │
    │ title            │
    │ content_md       │
    │ video_url        │
    │ position         │
    │ created_at       │
    └──────────────────┘
```

## Tablas Detalladas

### 1. `profiles`
Perfil extendido de usuarios, vinculado 1:1 con `auth.users`.

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, FK(auth.users.id) ON DELETE CASCADE | ID del usuario (heredado de Auth) |
| `role` | text | CHECK(role IN ('student','instructor')), DEFAULT 'student' | Rol del usuario |
| `full_name` | text | - | Nombre completo |
| `avatar_url` | text | - | URL del avatar |
| `created_at` | timestamptz | DEFAULT now() | Fecha de creación |

**Índices**: PK en `id`  
**RLS**: SELECT abierto, UPDATE solo si `auth.uid() = id`  
**Trigger**: `on_auth_user_created` crea profile automático al registrarse

---

### 2. `categories`
Categorías de cursos (creadas manualmente por admin).

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| `name` | text | UNIQUE NOT NULL | Nombre de la categoría |
| `slug` | text | UNIQUE NOT NULL | Slug para URLs |
| `created_at` | timestamptz | DEFAULT now() | Fecha de creación |

**Índices**: PK en `id`, UNIQUE en `name` y `slug`  
**RLS**: SELECT abierto, INSERT/UPDATE/DELETE solo `service_role`

---

### 3. `courses`
Cursos creados por instructores.

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| `instructor_id` | uuid | FK(profiles.id) ON DELETE RESTRICT NOT NULL | Instructor propietario |
| `category_id` | uuid | FK(categories.id) ON DELETE SET NULL | Categoría (opcional) |
| `title` | text | NOT NULL | Título del curso |
| `description` | text | - | Descripción larga |
| `price` | numeric(10,2) | DEFAULT 0 | Precio (sin pagos reales) |
| `is_published` | boolean | DEFAULT false | Visible públicamente si true |
| `created_at` | timestamptz | DEFAULT now() | Fecha de creación |

**Índices**: 
- `instructor_id` (búsquedas por instructor)
- `category_id` (filtrado por categoría)
- `is_published` (listados públicos)

**RLS**:
- SELECT: `is_published = true OR instructor_id = auth.uid()`
- INSERT: `auth.uid() = instructor_id AND role = 'instructor'`
- UPDATE/DELETE: `instructor_id = auth.uid()`

---

### 4. `lessons`
Lecciones dentro de un curso (solo visible a inscritos o instructor).

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| `course_id` | uuid | FK(courses.id) ON DELETE CASCADE NOT NULL | Curso propietario |
| `title` | text | NOT NULL | Título de la lección |
| `content_md` | text | - | Contenido en markdown |
| `video_url` | text | - | URL de video externo (YouTube/Vimeo) |
| `position` | int | DEFAULT 0 | Orden dentro del curso |
| `created_at` | timestamptz | DEFAULT now() | Fecha de creación |

**Índices**: `course_id`  
**RLS**:
- SELECT: Visible si usuario inscrito en curso O es instructor
- INSERT/UPDATE/DELETE: Solo instructor del curso

---

### 5. `enrollments`
Relación N:N entre estudiantes y cursos (inscripciones).

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| `student_id` | uuid | FK(profiles.id) ON DELETE CASCADE NOT NULL | Estudiante inscrito |
| `course_id` | uuid | FK(courses.id) ON DELETE CASCADE NOT NULL | Curso |
| `created_at` | timestamptz | DEFAULT now() | Fecha de inscripción |
| - | - | UNIQUE(student_id, course_id) | Una inscripción por estudiante/curso |

**Índices**: `student_id`, `course_id`, UNIQUE(student_id, course_id)  
**RLS**:
- SELECT: Estudiante ve sus propias inscripciones, instructor ve las de su curso
- INSERT: Estudiante solo cursos publicados (→ 409 si duplicado)
- DELETE: Estudiante desuscribe

---

### 6. `reviews`
Reseñas de estudiantes sobre cursos (solo inscritos pueden escribir).

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | ID único |
| `course_id` | uuid | FK(courses.id) ON DELETE CASCADE NOT NULL | Curso reseñado |
| `student_id` | uuid | FK(profiles.id) ON DELETE CASCADE NOT NULL | Autor (estudiante) |
| `rating` | int | CHECK(rating BETWEEN 1 AND 5) NOT NULL | Calificación 1-5 |
| `comment` | text | - | Comentario opcional |
| `created_at` | timestamptz | DEFAULT now() | Fecha |
| - | - | UNIQUE(student_id, course_id) | Una reseña por estudiante/curso |

**Índices**: `course_id`, `student_id`, UNIQUE(student_id, course_id)  
**RLS**:
- SELECT: Abierto (reseñas públicas)
- INSERT: Solo estudiante inscrito en el curso
- UPDATE/DELETE: Solo el autor

---

## Flujos de Datos Principales

### Instructor crea curso
```
1. POST /api/courses { title, description, category_id, price }
2. RLS valida: auth.uid() = instructor_id AND role = 'instructor'
3. INSERT courses con instructor_id = auth.uid()
4. Curso creado pero is_published = false (privado)
```

### Instructor publica curso
```
1. PATCH /api/courses/[id] { is_published: true }
2. RLS valida: instructor_id = auth.uid()
3. UPDATE courses.is_published = true
4. Ahora visible en GET /api/courses (abierto)
```

### Estudiante se inscribe
```
1. POST /api/courses/[id]/enroll
2. RLS valida: student_id = auth.uid() AND course.is_published = true
3. INSERT enrollments (student_id, course_id)
4. Si duplicado: Postgres 23505 → HTTP 409 Conflict
```

### Estudiante accede a lecciones
```
1. GET /api/courses/[id]/lessons
2. RLS valida: course_id IN (SELECT course_id FROM enrollments WHERE student_id = auth.uid())
3. Devuelve [] si no inscrito (no 403, per CLAUDE.md §5)
4. Devuelve lecciones ordenadas por position si inscrito
```

### Estudiante escribe reseña
```
1. POST /api/reviews { course_id, rating, comment }
2. RLS valida: student_id = auth.uid() AND EXISTS enrollment
3. INSERT reviews
4. Si ya escribió: Postgres 23505 → HTTP 409 Conflict
```

---

## Decisiones de Diseño

| Aspecto | Decisión | Razón |
|--------|----------|-------|
| **Auth** | Supabase Auth + RLS | Autorización en DB, no en código |
| **Rol** | Campo `role` en `profiles` | Validable en policies RLS |
| **Precio** | Numérico sin pagos | MVP sin Stripe (puede extenderse) |
| **Lecciones** | Markdown + URL | Flexible, sin dependencia Storage |
| **Inscripción duplicada** | UNIQUE constraint → 409 | Postgres maneja, API mapea error |
| **Enrollments vacío** | Devuelve `[]` no `403` | RLS retorna array vacío naturalmente |
| **Índices FK** | Explícitos | Evitar N+1 en queries lentas |

---

## Seed de Ejemplo (manual)

```sql
-- Insertar categorías (solo service_role)
INSERT INTO categories (name, slug) VALUES
  ('Desarrollo Web', 'desarrollo-web'),
  ('Data Science', 'data-science'),
  ('Diseño UI/UX', 'diseño-ui-ux');

-- Los usuarios se crean vía Auth
-- Los profiles se crean automáticamente via trigger
-- Instructores crean cursos vía API POST /api/courses
-- Estudiantes se inscriben vía API POST /api/courses/[id]/enroll
```
