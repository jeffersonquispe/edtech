'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEnroll() {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('enrollments').insert({
      course_id: courseId,
      student_id: user.id,
    });

    if (error?.code === '23505') {
      setError('Ya estás inscrito en este curso.');
    } else if (error) {
      setError('Error al inscribirse. Intenta de nuevo.');
    } else {
      router.push(`/learn/${courseId}`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-[#5B4FFF] text-white py-3 rounded-xl font-semibold hover:bg-[#4A3EE0] disabled:opacity-50 transition-all shadow-md shadow-[#5B4FFF]/25 hover:shadow-[#5B4FFF]/40 active:scale-[0.98]"
      >
        {loading ? 'Inscribiendo...' : 'Inscribirse al curso'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2 text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
