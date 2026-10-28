import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const reviewId = params.id;
    const body = await request.json();

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (body.is_published !== undefined) updatePayload.is_published = Boolean(body.is_published);

    const { data: updated, error } = await (supabase as any)
      .from('reviews')
      .update(updatePayload)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const reviewId = params.id;
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
