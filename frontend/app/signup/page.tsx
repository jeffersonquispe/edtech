'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const role = form.get('role') as string;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.get('email') as string,
      password: form.get('password') as string,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user && role === 'instructor') {
      await supabase
        .from('profiles')
        .update({ role: 'instructor' })
        .eq('id', data.user.id);
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-full flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm bg-white border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Rol
            </label>
            <select
              id="role"
              name="role"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="student">Estudiante</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-black hover:underline">
            Ingresa aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
