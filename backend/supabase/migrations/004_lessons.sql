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
