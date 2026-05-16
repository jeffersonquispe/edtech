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
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1341] via-[#2D2075] to-[#5B4FFF] py-20 px-4">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-16 w-72 h-72 rounded-full bg-[#FF6C3D]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-8 left-1/2 w-64 h-64 rounded-full bg-[#9B8FFF]/10 blur-2xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#FF9F7A] uppercase mb-4">
            Plataforma de aprendizaje
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Aprende sin<br />
            <span className="text-[#C4B9FF]">límites.</span>
          </h1>
          <p className="text-lg text-white/65 max-w-lg leading-relaxed">
            Domina nuevas habilidades con cursos de alta calidad impartidos por expertos.
          </p>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Cursos disponibles</h2>
            <p className="text-zinc-500 text-sm mt-1">Aprende con los mejores instructores</p>
          </div>
          {!!courses?.length && (
            <span className="text-sm text-zinc-400 tabular-nums">{courses.length} cursos</span>
          )}
        </div>

        {!courses?.length && (
          <div className="text-center py-20 border border-dashed border-black/10 rounded-2xl bg-white">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mx-auto mb-4 text-2xl">
              📚
            </div>
            <p className="text-zinc-500 font-medium">No hay cursos publicados aún.</p>
            <p className="text-zinc-400 text-sm mt-1">Vuelve pronto.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-grid">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group block bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-xl hover:shadow-[#5B4FFF]/8 hover:-translate-y-1.5 transition-all duration-200 overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#5B4FFF] to-[#9B8FFF]" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-semibold text-base leading-snug group-hover:text-[#5B4FFF] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <span className="text-sm font-bold text-[#5B4FFF] bg-[#F0EEFF] px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">
                    ${course.price}
                  </span>
                </div>
                {course.description && (
                  <p className="text-zinc-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap pt-1 border-t border-black/4">
                  {course.category && (
                    <span className="bg-[#F0EEFF] text-[#5B4FFF] px-2 py-0.5 rounded-md font-medium mt-1">
                      {course.category.name}
                    </span>
                  )}
                  <span className="mt-1">{course.instructor?.full_name || 'Instructor'}</span>
                  <span className="ml-auto mt-1 font-medium">
                    {course.enrollments?.[0]?.count ?? 0} inscritos
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
