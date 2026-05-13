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
    <header className="border-b bg-white sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          EdTech
        </Link>
        <div className="flex items-center gap-5">
          {user ? (
            <>
              <span className="text-sm text-gray-500 hidden sm:block">
                {profile?.full_name || user.email}
              </span>
              {profile?.role === 'instructor' ? (
                <Link href="/dashboard/instructor" className="text-sm hover:underline">
                  Dashboard
                </Link>
              ) : (
                <Link href="/dashboard/student" className="text-sm hover:underline">
                  Mis Cursos
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:underline">
                Ingresar
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800"
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
