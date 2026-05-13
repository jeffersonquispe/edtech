import { createClient, getAuthUser } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mapPostgresError } from '@/lib/errors';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: user } = await getAuthUser();
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('courses')
    .update(body)
    .eq('id', id)
    .select();

  if (error) {
    const { status, message } = mapPostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: 'Not found or forbidden' },
      { status: 403 }
    );
  }

  return NextResponse.json(data[0]);
}
