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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {category && (
            <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-block">
              {category.name}
            </span>
          )}
          <h1 className="text-4xl font-bold leading-tight">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
          )}
          <p className="text-sm text-gray-500">
            Instructor: <span className="font-medium">{instructor?.full_name || 'N/A'}</span>
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-white shadow-sm h-fit space-y-4">
          <p className="text-3xl font-bold">${course.price}</p>

          {!user && (
            <Link
              href="/login"
              className="block w-full text-center bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Inicia sesión para inscribirte
            </Link>
          )}

          {user && isEnrolled && (
            <Link
              href={`/learn/${id}`}
              className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
            >
              Ir a las lecciones →
            </Link>
          )}

          {user && isStudent && !isEnrolled && <EnrollButton courseId={id} />}

          {user && isOwner && (
            <Link
              href={`/dashboard/instructor/courses/${id}`}
              className="block w-full text-center border py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Editar curso
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
