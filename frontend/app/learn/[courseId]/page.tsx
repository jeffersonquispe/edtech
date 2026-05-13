import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  content_md: string | null;
  video_url: string | null;
  position: number;
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: course } = await supabase
    .from('courses')
    .select('id, title')
    .eq('id', courseId)
    .single();

  if (!course) notFound();

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, content_md, video_url, position')
    .eq('course_id', courseId)
    .order('position')
    .returns<Lesson[]>();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/dashboard/student" className="text-sm text-gray-500 hover:underline">
          ← Mis cursos
        </Link>
        <h1 className="text-3xl font-bold mt-2">{course.title}</h1>
      </div>

      {!enrollment && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            No estás inscrito en este curso.{' '}
            <Link href={`/courses/${courseId}`} className="font-medium underline">
              Inscribirte
            </Link>
          </p>
        </div>
      )}

      {!lessons?.length ? (
        <div className="text-center py-16 border rounded-xl bg-white">
          <p className="text-gray-500">Este curso aún no tiene lecciones.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="border rounded-xl overflow-hidden bg-white">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <span className="text-xs text-gray-400 font-medium block">Lección {i + 1}</span>
                <h2 className="font-semibold text-lg">{lesson.title}</h2>
              </div>
              <div className="p-6 space-y-4">
                {lesson.video_url && (
                  <div className="aspect-video">
                    <iframe
                      src={lesson.video_url}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                )}
                {lesson.content_md && (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {lesson.content_md}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
