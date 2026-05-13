import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  price: number;
  instructor: { full_name: string | null } | null;
}

interface Enrollment {
  id: string;
  created_at: string;
  course: CourseData | null;
}

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'instructor') redirect('/dashboard/instructor');

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(
      'id, created_at, course:courses!course_id(id, title, description, price, instructor:profiles!instructor_id(full_name))'
    )
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Enrollment[]>();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Mis Cursos</h1>

      {!enrollments?.length && (
        <div className="text-center py-16 border rounded-xl bg-white">
          <p className="text-gray-500 mb-4">Aún no estás inscrito en ningún curso.</p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800"
          >
            Explorar cursos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments?.map((enrollment) => {
          const course = enrollment.course;
          if (!course) return null;
          return (
            <div key={enrollment.id} className="border rounded-xl p-5 bg-white">
              <h2 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h2>
              {course.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
              )}
              <p className="text-xs text-gray-500 mb-4">
                Instructor: {course.instructor?.full_name || 'N/A'}
              </p>
              <Link
                href={`/learn/${course.id}`}
                className="block text-center bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                Continuar →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
