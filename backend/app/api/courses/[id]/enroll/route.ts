import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mapPostgresError } from '@/lib/errors';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('enrollments').insert({
    student_id: user.user.id,
    course_id: id,
  });

  if (error) {
    const { status, message } = mapPostgresError(error);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
