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

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((raw: any) => ({
      ...raw,
      base_price: Number(raw.base_price),
      compare_at_price: raw.compare_at_price ? Number(raw.compare_at_price) : null,
      stock_quantity: Number(raw.stock_quantity ?? 0),
      images: (raw.images || []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      variants: raw.variants || [],
      reviews: raw.reviews || [],
      rating_summary: {
        average_rating:
          raw.reviews && raw.reviews.length > 0
            ? Math.round(
                (raw.reviews.reduce((s: number, r: any) => s + Number(r.rating || 0), 0) /
                  raw.reviews.length) *
                  10
              ) / 10
            : 0,
        review_count: raw.reviews ? raw.reviews.length : 0,
      },
    }));

    return NextResponse.json({ products: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
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

    if (!body.name || !body.base_price) {
      return NextResponse.json(
        { error: 'Product name and base price are required.' },
        { status: 400 }
      );
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const productPayload: any = {
      name: body.name,
      slug,
      category_id: body.category_id || null,
      sku: body.sku || null,
      base_price: Number(body.base_price),
      compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : null,
      stock_quantity: Number(body.stock_quantity ?? 0),
      short_description: body.short_description || null,
      description: body.description || null,
      material: body.material || null,
      color: body.color || null,
      size_label: body.size_label || null,
      height: body.height ? Number(body.height) : null,
      width: body.width ? Number(body.width) : null,
      depth: body.depth ? Number(body.depth) : null,
      diameter: body.diameter ? Number(body.diameter) : null,
      weight: body.weight ? Number(body.weight) : null,
      dimensions_unit: body.dimensions_unit || 'cm',
      weight_unit: body.weight_unit || 'kg',
      care_instructions: body.care_instructions || null,
      is_active: body.is_active ?? true,
      is_featured: body.is_featured ?? false,
      is_new_arrival: body.is_new_arrival ?? true,
      is_best_seller: body.is_best_seller ?? false,
    };

    const { data: createdProduct, error: prodError } = await (supabase as any)
      .from('products')
      .insert([productPayload])
      .select()
      .single();

    if (prodError || !createdProduct) {
      return NextResponse.json({ error: prodError?.message || 'Failed to create product' }, { status: 500 });
    }

    if (Array.isArray(body.images) && body.images.length > 0) {
      const imageRows = body.images.map((img: any, idx: number) => ({
        product_id: createdProduct.id,
        image_url: img.image_url,
        alt_text: img.alt_text || createdProduct.name,
        sort_order: idx,
        is_primary: idx === 0 || !!img.is_primary,
      }));

      await (supabase as any).from('product_images').insert(imageRows);
    }

    try { revalidatePath('/shop'); revalidatePath('/'); revalidatePath('/collections/[slug]', 'page'); revalidatePath('/product/[slug]', 'page'); revalidatePath('/search'); } catch(e){} 
    return NextResponse.json({ product: createdProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
