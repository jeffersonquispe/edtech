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
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/student"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mb-3"
        >
          ← Mis cursos
        </Link>
        <h1 className="text-3xl font-bold">{course.title}</h1>
      </div>

      {!enrollment && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <p className="text-amber-800 text-sm">
            No estás inscrito en este curso.{' '}
            <Link href={`/courses/${courseId}`} className="font-semibold underline hover:no-underline">
              Inscribirte
            </Link>
          </p>
        </div>
      )}

      {!lessons?.length ? (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4 text-2xl">
            📝
          </div>
          <p className="text-zinc-500 font-medium">Este curso aún no tiene lecciones.</p>
        </div>
      ) : (
        <div className="space-y-5 stagger-grid">
          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#F0EEFF] to-white px-6 py-4 border-b border-black/5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-[#5B4FFF] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <span className="text-xs text-[#5B4FFF] font-semibold uppercase tracking-wider block">
                    Lección {i + 1}
                  </span>
                  <h2 className="font-semibold text-base leading-tight">{lesson.title}</h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {lesson.video_url && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900">
                    <iframe
                      src={lesson.video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={lesson.title}
                    />
                  </div>
                )}
                {lesson.content_md && (
                  <pre className="whitespace-pre-wrap text-sm text-zinc-600 font-sans leading-relaxed bg-zinc-50/60 rounded-xl p-4 border border-black/5">
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
