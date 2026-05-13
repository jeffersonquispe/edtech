import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface Instructor { full_name: string | null }
interface Category { name: string }
interface EnrollmentCount { count: number }

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  instructor: Instructor | null;
  category: Category | null;
  enrollments: EnrollmentCount[];
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select(
      'id, title, description, price, instructor:profiles!instructor_id(full_name), category:categories(name), enrollments(count)'
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .returns<Course[]>();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cursos disponibles</h1>
        <p className="text-gray-500 mt-1">Aprende con los mejores instructores</p>
      </div>

      {!courses?.length && (
        <div className="text-center py-16 border rounded-xl bg-white">
          <p className="text-gray-500">No hay cursos publicados aún.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block border rounded-xl p-5 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <h2 className="font-semibold text-lg leading-snug">{course.title}</h2>
              <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded whitespace-nowrap shrink-0">
                ${course.price}
              </span>
            </div>
            {course.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
              {course.category && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {course.category.name}
                </span>
              )}
              <span>{course.instructor?.full_name || 'Instructor'}</span>
              <span className="ml-auto">{course.enrollments?.[0]?.count ?? 0} inscritos</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
