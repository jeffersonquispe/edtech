'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  is_published: boolean;
  category_id: string | null;
}

export default function EditCourseForm({
  course,
  categories,
}: {
  course: Course;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const categoryId = form.get('category_id') as string;

    const { error } = await supabase
      .from('courses')
      .update({
        title: form.get('title') as string,
        description: (form.get('description') as string) || null,
        price: parseFloat(form.get('price') as string) || 0,
        category_id: categoryId || null,
        is_published: form.get('is_published') === 'on',
      })
      .eq('id', course.id);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-xl p-6 bg-white space-y-4">
      <h2 className="text-xl font-semibold">Información del Curso</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Título *</label>
        <input
          name="title"
          required
          defaultValue={course.title}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={course.description ?? ''}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={course.price}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            name="category_id"
            defaultValue={course.category_id ?? ''}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          defaultChecked={course.is_published}
          className="rounded"
        />
        <label htmlFor="is_published" className="text-sm font-medium cursor-pointer">
          Publicar curso (visible para estudiantes)
        </label>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {saved && <p className="text-green-600 text-sm">¡Cambios guardados correctamente!</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
