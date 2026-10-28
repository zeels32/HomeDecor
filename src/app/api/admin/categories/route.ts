import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: products } = await supabase.from('products').select('id, category_id');
    const countsMap = new Map<string, number>();
    (products || []).forEach((p: any) => {
      if (p.category_id) {
        countsMap.set(p.category_id, (countsMap.get(p.category_id) || 0) + 1);
      }
    });

    const formatted = (categories || []).map((cat: any) => ({
      ...cat,
      product_count: countsMap.get(cat.id) || 0,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data, error } = await (supabase as any)
      .from('categories')
      .insert([
        {
          name: body.name,
          slug,
          description: body.description || null,
          image_url: body.image_url || null,
          sort_order: Number(body.sort_order ?? 0),
          is_active: body.is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Purge cached storefront paths so new category immediately appears
    try {
      revalidatePath('/shop');
      revalidatePath('/');
      revalidatePath('/collections/[slug]', 'page');
      revalidatePath('/search');
      revalidatePath('/sitemap.xml');
    } catch (revalErr) {
      console.warn('Path revalidation warning:', revalErr);
    }

    return NextResponse.json({ success: true, category: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
