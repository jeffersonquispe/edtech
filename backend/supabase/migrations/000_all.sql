-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('instructor', 'student')) NOT NULL DEFAULT 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to auto-create profile on user signup
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

-- RLS Policies
CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
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
