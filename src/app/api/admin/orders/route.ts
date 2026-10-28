import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((o: any) => ({
      id: o.id,
      order_number: o.order_number,
      user_id: o.user_id,
      email: o.email || o.shipping_address_snapshot?.email || '',
      phone: o.phone || o.shipping_address_snapshot?.phone || '',
      status: o.status,
      payment_status: o.payment_status || 'paid',
      currency: o.currency || 'INR',
      subtotal: Number(o.subtotal),
      shipping_amount: Number(o.shipping_amount),
      discount_amount: Number(o.discount_amount || 0),
      tax_amount: Number(o.tax_amount || 0),
      total_amount: Number(o.total_amount),
      shipping_address_snapshot: o.shipping_address_snapshot,
      billing_address_snapshot: o.billing_address_snapshot,
      payment_provider: o.payment_provider || 'Razorpay',
      payment_reference: o.payment_reference,
      created_at: o.created_at,
      updated_at: o.updated_at,
      items: (o.items || []).map((it: any) => ({
        id: it.id,
        order_id: it.order_id,
        product_id: it.product_id,
        variant_id: it.variant_id,
        product_name_snapshot: it.product_name_snapshot,
        sku_snapshot: it.sku_snapshot,
        variant_snapshot: it.variant_snapshot,
        unit_price: Number(it.unit_price),
        quantity: Number(it.quantity),
        line_total: Number(it.line_total),
      })),
    }));

    return NextResponse.json({ orders: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
