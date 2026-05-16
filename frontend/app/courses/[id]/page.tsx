import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EnrollButton from './_components/enroll-button';

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from('courses')
    .select(
      'id, title, description, price, is_published, instructor:profiles!instructor_id(full_name), category:categories(name)'
    )
    .eq('id', id)
    .single();

  if (!course || !course.is_published) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  let isStudent = false;
  let isOwner = false;

  if (user) {
    const [{ data: enrollment }, { data: profile }] = await Promise.all([
      supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', id)
        .maybeSingle(),
      supabase.from('profiles').select('role').eq('id', user.id).single(),
    ]);
    isEnrolled = !!enrollment;
    isStudent = profile?.role === 'student';

    const { data: courseOwner } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', id)
      .eq('instructor_id', user.id)
      .maybeSingle();
    isOwner = !!courseOwner;
  }

  const instructor = course.instructor as { full_name: string | null } | null;
  const category = course.category as { name: string } | null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {category && (
            <span className="inline-block text-xs font-semibold text-[#5B4FFF] bg-[#F0EEFF] px-3 py-1 rounded-lg">
              {category.name}
            </span>
          )}
          <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
          {course.description && (
            <p className="text-zinc-600 text-lg leading-relaxed">{course.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-zinc-500 pt-2 border-t border-black/5">
            <span className="w-7 h-7 rounded-full bg-[#F0EEFF] flex items-center justify-center text-xs font-bold text-[#5B4FFF]">
              {instructor?.full_name?.[0] ?? 'I'}
            </span>
            <span>
              Instructor:{' '}
              <span className="font-medium text-zinc-700">{instructor?.full_name || 'N/A'}</span>
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-lg shadow-black/5 overflow-hidden h-fit">
          <div className="h-1.5 bg-gradient-to-r from-[#5B4FFF] to-[#9B8FFF]" />
          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">Precio</p>
              <p className="text-4xl font-bold text-[#5B4FFF]">${course.price}</p>
            </div>

            {!user && (
              <Link
                href="/login"
                className="block w-full text-center bg-[#5B4FFF] text-white py-3 rounded-xl font-semibold hover:bg-[#4A3EE0] transition-all shadow-md shadow-[#5B4FFF]/25 hover:shadow-[#5B4FFF]/40 active:scale-[0.98]"
              >
                Inicia sesión para inscribirte
              </Link>
            )}

            {user && isEnrolled && (
              <Link
                href={`/learn/${id}`}
                className="block w-full text-center bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/25 active:scale-[0.98]"
              >
                Ir a las lecciones →
              </Link>
            )}

            {user && isStudent && !isEnrolled && <EnrollButton courseId={id} />}

            {user && isOwner && (
              <Link
                href={`/dashboard/instructor/courses/${id}`}
                className="block w-full text-center border-2 border-[#5B4FFF] text-[#5B4FFF] py-3 rounded-xl font-semibold hover:bg-[#F0EEFF] transition-all active:scale-[0.98]"
              >
                Editar curso
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
