import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export async function createClient() {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');

  // Soporta Bearer token para curl/API, cookies para browser
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      }
    );
  }

  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handle in middleware
          }
        },
      },
    }
  );
}

// Helper para obtener el usuario desde cookies O Bearer token
export async function getAuthUser() {
  const headersList = await headers();
  const authHeader = headersList.get('Authorization');
  const supabase = await createClient();

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return supabase.auth.getUser(token);
  }

  return supabase.auth.getUser();
}
