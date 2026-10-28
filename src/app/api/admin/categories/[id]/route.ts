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

    const catId = params.id;
    const body = await request.json();

    const updatePayload: any = {};
    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.image_url !== undefined) updatePayload.image_url = body.image_url;
    if (body.sort_order !== undefined) updatePayload.sort_order = Number(body.sort_order);
    if (body.is_active !== undefined) updatePayload.is_active = Boolean(body.is_active);

    const { data: updated, error } = await (supabase as any)
      .from('categories')
      .update(updatePayload)
      .eq('id', catId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: updated });
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

    const catId = params.id;

    // Check if products exist in category
    const { count } = await (supabase as any)
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', catId);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: ${count} product(s) are assigned to it.` },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('categories').delete().eq('id', catId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
