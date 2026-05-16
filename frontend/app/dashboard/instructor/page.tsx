import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CreateCourseForm from './_components/create-course-form';

interface EnrollmentCount {
  count: number;
}

interface Course {
  id: string;
  title: string;
  price: number;
  is_published: boolean;
  created_at: string;
  enrollments: EnrollmentCount[];
}

export default async function InstructorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'instructor') redirect('/dashboard/student');

  const [{ data: courses }, { data: categories }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, price, is_published, created_at, enrollments(count)')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Course[]>(),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  const totalStudents = courses?.reduce(
    (sum, c) => sum + (c.enrollments?.[0]?.count ?? 0),
    0
  ) ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-sm text-zinc-500 mb-1">
            Hola, {profile?.full_name || user.email} 👋
          </p>
          <h1 className="text-3xl font-bold">Mis Cursos</h1>
        </div>
        <CreateCourseForm categories={categories || []} />
      </div>

      {/* Stats */}
      {!!courses?.length && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">Cursos</p>
            <p className="text-3xl font-bold text-[#5B4FFF]">{courses.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">Estudiantes</p>
            <p className="text-3xl font-bold text-[#5B4FFF]">{totalStudents}</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">Publicados</p>
            <p className="text-3xl font-bold text-[#5B4FFF]">
              {courses.filter((c) => c.is_published).length}
            </p>
          </div>
        </div>
      )}

      {!courses?.length && (
        <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
          <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4 text-2xl">
            ✏️
          </div>
          <p className="text-zinc-600 font-medium mb-1">Aún no has creado ningún curso.</p>
          <p className="text-sm text-zinc-400">Usa el botón &quot;+ Nuevo Curso&quot; para comenzar.</p>
        </div>
      )}

      <div className="space-y-3">
        {courses?.map((course) => {
          const enrollCount = course.enrollments?.[0]?.count ?? 0;
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-black/5 shadow-sm flex items-center justify-between gap-4 px-5 py-4 hover:shadow-md hover:border-[#5B4FFF]/10 transition-all group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-semibold text-sm group-hover:text-[#5B4FFF] transition-colors truncate">
                    {course.title}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium shrink-0 ${
                      course.is_published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-600">${course.price}</span>
                  {' · '}
                  {enrollCount} {enrollCount === 1 ? 'estudiante' : 'estudiantes'}
                </p>
              </div>
              <Link
                href={`/dashboard/instructor/courses/${course.id}`}
                className="text-sm border border-[#5B4FFF]/30 text-[#5B4FFF] px-4 py-2 rounded-xl hover:bg-[#F0EEFF] transition-all whitespace-nowrap shrink-0 font-medium"
              >
                Editar
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
