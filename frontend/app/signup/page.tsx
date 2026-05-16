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
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/5 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#5B4FFF] to-[#9B8FFF]" />
          <div className="p-8">
            <div className="flex items-center gap-2.5 justify-center mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#5B4FFF] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-[#5B4FFF]/30">
                E
              </div>
              <span className="font-bold text-xl tracking-tight">EdTech</span>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-center">Crea tu cuenta</h1>
            <p className="text-zinc-500 text-sm text-center mb-7">Únete y empieza a aprender hoy</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-zinc-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4FFF]/40 focus:border-[#5B4FFF] transition-all bg-zinc-50/60"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-zinc-700">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B4FFF]/40 focus:border-[#5B4FFF] transition-all bg-zinc-50/60"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1.5 text-zinc-700">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm bg-zinc-50/60 focus:outline-none focus:ring-2 focus:ring-[#5B4FFF]/40 focus:border-[#5B4FFF] transition-all"
                >
                  <option value="student">Estudiante</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5B4FFF] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4A3EE0] disabled:opacity-50 transition-all shadow-md shadow-[#5B4FFF]/25 hover:shadow-[#5B4FFF]/40 active:scale-[0.98] mt-1"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="font-semibold text-[#5B4FFF] hover:text-[#4A3EE0] transition-colors">
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
