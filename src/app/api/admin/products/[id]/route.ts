import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const productId = params.id;
    const body = await request.json();

    const updatePayload: any = {};
    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.slug !== undefined) updatePayload.slug = body.slug;
    if (body.category_id !== undefined) updatePayload.category_id = body.category_id;
    if (body.sku !== undefined) updatePayload.sku = body.sku;
    if (body.base_price !== undefined) updatePayload.base_price = Number(body.base_price);
    if (body.compare_at_price !== undefined)
      updatePayload.compare_at_price = body.compare_at_price ? Number(body.compare_at_price) : null;
    if (body.stock_quantity !== undefined)
      updatePayload.stock_quantity = Number(body.stock_quantity);
    if (body.short_description !== undefined) updatePayload.short_description = body.short_description;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.material !== undefined) updatePayload.material = body.material;
    if (body.color !== undefined) updatePayload.color = body.color;
    if (body.size_label !== undefined) updatePayload.size_label = body.size_label;
    if (body.height !== undefined) updatePayload.height = body.height ? Number(body.height) : null;
    if (body.width !== undefined) updatePayload.width = body.width ? Number(body.width) : null;
    if (body.depth !== undefined) updatePayload.depth = body.depth ? Number(body.depth) : null;
    if (body.diameter !== undefined) updatePayload.diameter = body.diameter ? Number(body.diameter) : null;
    if (body.weight !== undefined) updatePayload.weight = body.weight ? Number(body.weight) : null;
    if (body.care_instructions !== undefined) updatePayload.care_instructions = body.care_instructions;
    if (body.is_active !== undefined) updatePayload.is_active = Boolean(body.is_active);
    if (body.is_featured !== undefined) updatePayload.is_featured = Boolean(body.is_featured);
    if (body.is_new_arrival !== undefined) updatePayload.is_new_arrival = Boolean(body.is_new_arrival);
    if (body.is_best_seller !== undefined) updatePayload.is_best_seller = Boolean(body.is_best_seller);

    const { data: updated, error } = await (supabase as any)
      .from('products')
      .update(updatePayload)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (Array.isArray(body.images)) {
      await (supabase as any).from('product_images').delete().eq('product_id', productId);

      if (body.images.length > 0) {
        const imageRows = body.images.map((img: any, idx: number) => ({
          product_id: productId,
          image_url: img.image_url,
          alt_text: img.alt_text || updated.name,
          sort_order: idx,
          is_primary: idx === 0 || !!img.is_primary,
        }));
        await (supabase as any).from('product_images').insert(imageRows);
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const productId = params.id;
    const { error } = await supabase.from('products').delete().eq('id', productId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try { revalidatePath('/shop'); revalidatePath('/'); revalidatePath('/collections/[slug]', 'page'); revalidatePath('/product/[slug]', 'page'); revalidatePath('/search'); } catch(e){} 
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
