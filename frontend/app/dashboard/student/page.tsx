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
    .select('role, full_name')
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
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm text-zinc-500 mb-1">
          Hola, {profile?.full_name || user.email} 👋
        </p>
        <h1 className="text-3xl font-bold">Mis Cursos</h1>
      </div>

      {!enrollments?.length && (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4 text-2xl">
            🎓
          </div>
          <p className="text-zinc-600 font-medium mb-1">Aún no estás inscrito en ningún curso.</p>
          <p className="text-zinc-400 text-sm mb-5">¡Explora el catálogo y empieza a aprender!</p>
          <Link
            href="/"
            className="inline-block bg-[#5B4FFF] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4A3EE0] transition-all shadow-md shadow-[#5B4FFF]/20"
          >
            Explorar cursos
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-grid">
        {enrollments?.map((enrollment) => {
          const course = enrollment.course;
          if (!course) return null;
          return (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-semibold text-base mb-2 line-clamp-2 leading-snug">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="text-zinc-500 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
                    {course.description}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mb-4">
                  por {course.instructor?.full_name || 'N/A'}
                </p>
                <Link
                  href={`/learn/${course.id}`}
                  className="block text-center bg-[#5B4FFF] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4A3EE0] transition-all shadow-sm shadow-[#5B4FFF]/20 hover:shadow-[#5B4FFF]/30 active:scale-[0.98]"
                >
                  Continuar →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
