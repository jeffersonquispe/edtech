import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mapPostgresError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const categoryId = request.nextUrl.searchParams.get('category');

  let query = supabase
    .from('courses')
    .select(
      `*,
       instructor:profiles!instructor_id(full_name),
       category:categories(name),
       enrollments(count)`
    )
    .eq('is_published', true);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    const { status, message } = mapPostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category_id, price } = body;

  const { error } = await supabase.from('courses').insert({
    instructor_id: user.user.id,
    title,
    description,
    category_id,
    price,
  });

  if (error) {
    const { status, message } = mapPostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
