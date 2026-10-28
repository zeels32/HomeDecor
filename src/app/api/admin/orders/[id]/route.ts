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

    const orderId = params.id;
    const body = await request.json();

    const updatePayload: any = {};
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.payment_status !== undefined) updatePayload.payment_status = body.payment_status;
    if (body.payment_reference !== undefined) updatePayload.payment_reference = body.payment_reference;
    updatePayload.updated_at = new Date().toISOString();

    const { data: updated, error } = await (supabase as any)
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select('*, items:order_items(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
