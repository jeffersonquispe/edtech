import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import EditCourseForm from './_components/edit-course-form';
import LessonsManager from './_components/lessons-manager';

interface Lesson {
  id: string;
  title: string;
  content_md: string | null;
  video_url: string | null;
  position: number;
}

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: course }, { data: lessons }, { data: categories }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, description, price, is_published, category_id')
      .eq('id', id)
      .eq('instructor_id', user.id)
      .single(),
    supabase
      .from('lessons')
      .select('id, title, content_md, video_url, position')
      .eq('course_id', id)
      .order('position')
      .returns<Lesson[]>(),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  if (!course) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <Link
          href="/dashboard/instructor"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Mis cursos
        </Link>
        <h1 className="text-3xl font-bold mt-2">Editar Curso</h1>
      </div>

      <EditCourseForm course={course} categories={categories || []} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Lecciones</h2>
        <LessonsManager courseId={id} lessons={lessons || []} />
      </div>
    </div>
  );
}
