import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './logout-button';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { role: string; full_name: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <header className="border-b border-black/5 bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#5B4FFF] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-[#5B4FFF]/30 group-hover:shadow-[#5B4FFF]/50 transition-shadow">
            E
          </div>
          <span className="font-bold text-xl tracking-tight">EdTech</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-zinc-400 hidden sm:block truncate max-w-[160px]">
                {profile?.full_name || user.email}
              </span>
              {profile?.role === 'instructor' ? (
                <Link
                  href="/dashboard/instructor"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/student"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Mis Cursos
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-[#5B4FFF] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#4A3EE0] transition-all shadow-md shadow-[#5B4FFF]/20 hover:shadow-[#5B4FFF]/35 active:scale-95"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
