import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mapPostgresError } from '@/lib/errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('position', { ascending: true });

  if (error) {
    const { status, message } = mapPostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(data || []);
}
