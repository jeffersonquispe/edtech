# Setup Supabase - Aplicar Migraciones

Tu proyecto Supabase ya está creado. Ahora necesitas aplicar las 6 migraciones SQL en el orden correcto.

## Opción A: Usando Supabase Studio (Recomendado)

1. Abre https://app.supabase.com y selecciona tu proyecto
2. Ve a **SQL Editor** (en la barra izquierda)
3. Haz clic en **+ New Query**
4. Copia y pega **TODO el contenido** de abajo (los 6 bloques SQL)
5. Haz clic en **▶ Run** (o Ctrl+Enter)

Si todo va bien, deberías ver: ✅ All success  

---

## SQL a ejecutar (copiar y pegar todo)

```sql
-- ============================================
-- 001_profiles.sql
-- ============================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('instructor', 'student')) NOT NULL DEFAULT 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 002_categories.sql
-- ============================================
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert/update/delete categories"
  ON categories FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only service role can update categories"
  ON categories FOR UPDATE
  WITH CHECK (false);

CREATE POLICY "Only service role can delete categories"
  ON categories FOR DELETE
  USING (false);

-- ============================================
-- 003_courses.sql
-- ============================================
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_courses_is_published ON courses(is_published);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published courses are readable by anyone"
  ON courses FOR SELECT
  USING (is_published = true OR instructor_id = auth.uid());

CREATE POLICY "Instructors can insert courses"
  ON courses FOR INSERT
  WITH CHECK (
    auth.uid() = instructor_id
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'instructor'
  );

CREATE POLICY "Instructors can update their own courses"
  ON courses FOR UPDATE
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete their own courses"
  ON courses FOR DELETE
  USING (instructor_id = auth.uid());

-- ============================================
-- 004_lessons.sql
-- ============================================
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_md text,
  video_url text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lessons visible to enrolled students or course instructor"
  ON lessons FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
    OR course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (
    course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  );

CREATE POLICY "Instructors can update lessons"
  ON lessons FOR UPDATE
  USING (
    course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  )
  WITH CHECK (
    course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  );

CREATE POLICY "Instructors can delete lessons"
  ON lessons FOR DELETE
  USING (
    course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  );

-- ============================================
-- 005_enrollments.sql
-- ============================================
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see their own enrollments, instructors see their course enrollments"
  ON enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR course_id IN (SELECT id FROM courses WHERE instructor_id = auth.uid())
  );

CREATE POLICY "Students can enroll in published courses"
  ON enrollments FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND course_id IN (SELECT id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Students can delete their own enrollments"
  ON enrollments FOR DELETE
  USING (student_id = auth.uid());

-- ============================================
-- 006_reviews.sql
-- ============================================
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_student_id ON reviews(student_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Enrolled students can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.student_id = auth.uid()
        AND enrollments.course_id = reviews.course_id
    )
  );

CREATE POLICY "Students can update their own reviews"
  ON reviews FOR UPDATE
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete their own reviews"
  ON reviews FOR DELETE
  USING (student_id = auth.uid());
```

---

## Verificación

Después de ejecutar, verifica que las tablas existan:

1. Ve a **Table Editor** (en la barra izquierda)
2. Deberías ver las 6 tablas:
   - `profiles`
   - `categories`
   - `courses`
   - `lessons`
   - `enrollments`
   - `reviews`

---

## Paso siguiente: Generar tipos TypeScript

Una vez que las migraciones estén aplicadas, genera los tipos para TypeScript:

```bash
cd backend
npx supabase gen types typescript --project-id tu-project-ref > types/database.ts
```

Reemplaza `tu-project-ref` con el ID de tu proyecto (visible en Supabase Settings).

Luego copia el archivo a frontend:
```bash
cp backend/types/database.ts frontend/types/database.ts
```

---

## Opción B: Usando supabase-js (Programaticamente)

Si prefieres ejecutar las migraciones desde Node.js:

```bash
cd backend
node migrate.js
```

(Requiere que tengas `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`)

---

## Troubleshooting

- **Error: "exec_sql is not found"** → Supabase no tiene ese RPC. Usa Opción A (SQL Editor).
- **Error: FK constraint violation** → Verifica el orden (001 → 006).
- **Error: Role 'postgres' does not exist** → Es normal en Supabase Cloud, ignora.

---

## Siguiente: Seed de ejemplo (opcional)

Para probar, puedes insertar categorías de ejemplo:

```sql
INSERT INTO categories (name, slug) VALUES
  ('Desarrollo Web', 'desarrollo-web'),
  ('Data Science', 'data-science'),
  ('Diseño UI/UX', 'diseño-ui-ux');
```

Luego crea usuarios vía Supabase Auth y ellos pueden crear cursos.
