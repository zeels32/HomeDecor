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

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*, product:products(name, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (reviews || []).map((r: any) => ({
      ...r,
      product_name: r.product?.name || 'Artisan Decor Piece',
      product_slug: r.product?.slug || '',
      rating: Number(r.rating),
      is_published: Boolean(r.is_published),
    }));

    return NextResponse.json({ reviews: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}
