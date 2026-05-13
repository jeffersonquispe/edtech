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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Cursos</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenido, {profile?.full_name || user.email}</p>
        </div>
        <CreateCourseForm categories={categories || []} />
      </div>

      {!courses?.length && (
        <div className="text-center py-16 border rounded-xl bg-white">
          <p className="text-gray-500 mb-2">Aún no has creado ningún curso.</p>
          <p className="text-sm text-gray-400">Usa el botón &quot;+ Nuevo Curso&quot; para comenzar.</p>
        </div>
      )}

      <div className="space-y-4">
        {courses?.map((course) => {
          const enrollCount = course.enrollments?.[0]?.count ?? 0;
          return (
            <div
              key={course.id}
              className="border rounded-xl p-5 bg-white flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="font-semibold">{course.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      course.is_published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {course.is_published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  ${course.price} · {enrollCount} estudiantes
                </p>
              </div>
              <Link
                href={`/dashboard/instructor/courses/${course.id}`}
                className="text-sm border px-4 py-2 rounded-lg hover:bg-gray-50 whitespace-nowrap shrink-0"
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
