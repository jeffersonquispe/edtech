'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Lesson {
  id: string;
  title: string;
  content_md: string | null;
  video_url: string | null;
  position: number;
}

export default function LessonsManager({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from('lessons').insert({
      course_id: courseId,
      title: form.get('title') as string,
      content_md: (form.get('content_md') as string) || null,
      video_url: (form.get('video_url') as string) || null,
      position: lessons.length,
    });

    if (error) {
      setError(error.message);
    } else {
      setShowForm(false);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleDelete(lessonId: string) {
    if (!confirm('¿Eliminar esta lección?')) return;
    const supabase = createClient();
    await supabase.from('lessons').delete().eq('id', lessonId);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, i) => (
        <div
          key={lesson.id}
          className="border rounded-xl p-4 bg-white flex items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <span className="text-xs text-gray-400 font-medium">Lección {i + 1}</span>
            <h3 className="font-medium truncate">{lesson.title}</h3>
            {lesson.video_url && (
              <p className="text-xs text-blue-600 mt-0.5 truncate">{lesson.video_url}</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(lesson.id)}
            className="text-sm text-red-500 hover:underline whitespace-nowrap shrink-0"
          >
            Eliminar
          </button>
        </div>
      ))}

      {showForm ? (
        <form onSubmit={handleCreate} className="border rounded-xl p-5 bg-white space-y-3">
          <h3 className="font-medium">Nueva Lección</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              name="title"
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              URL del Video (YouTube embed u otro)
            </label>
            <input
              name="video_url"
              type="url"
              placeholder="https://www.youtube.com/embed/..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contenido (Markdown)</label>
            <textarea
              name="content_md"
              rows={6}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Agregar Lección'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed rounded-xl py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Agregar Lección
        </button>
      )}
    </div>
  );
}
