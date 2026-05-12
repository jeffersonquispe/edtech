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
