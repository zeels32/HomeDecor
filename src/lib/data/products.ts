import { Product, Category, FilterOptions, Review } from '@/types';
import { getPublicSupabase } from '@/lib/supabase/public';

/**
 * Normalizes Supabase relational output into strict TypeScript Product model
 */
function formatProductRecord(raw: any): Product {
  const images = (raw.images || []).sort(
    (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const variants = (raw.variants || []).sort(
    (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  const reviews = (raw.reviews || []).filter((r: any) => r.is_published !== false);
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0) / totalReviews
      : 0;

  return {
    id: raw.id,
    category_id: raw.category_id,
    category: raw.category || undefined,
    name: raw.name,
    slug: raw.slug,
    short_description: raw.short_description || null,
    description: raw.description || null,
    base_price: Number(raw.base_price),
    compare_at_price: raw.compare_at_price ? Number(raw.compare_at_price) : null,
    sku: raw.sku || null,
    material: raw.material || null,
    color: raw.color || null,
    size_label: raw.size_label || null,
    height: raw.height ? Number(raw.height) : null,
    width: raw.width ? Number(raw.width) : null,
    depth: raw.depth ? Number(raw.depth) : null,
    diameter: raw.diameter ? Number(raw.diameter) : null,
    weight: raw.weight ? Number(raw.weight) : null,
    dimensions_unit: raw.dimensions_unit || 'cm',
    weight_unit: raw.weight_unit || 'kg',
    care_instructions: raw.care_instructions || null,
    stock_quantity: Number(raw.stock_quantity ?? 0),
    is_active: Boolean(raw.is_active),
    is_featured: Boolean(raw.is_featured),
    is_new_arrival: Boolean(raw.is_new_arrival),
    is_best_seller: Boolean(raw.is_best_seller),
    seo_title: raw.seo_title || null,
    seo_description: raw.seo_description || null,
    images: images.map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      variant_id: img.variant_id || null,
      image_url: img.image_url,
      alt_text: img.alt_text || null,
      sort_order: Number(img.sort_order ?? 0),
      is_primary: Boolean(img.is_primary),
    })),
    variants: variants.map((v: any) => ({
      id: v.id,
      product_id: v.product_id,
      sku: v.sku || null,
      name: v.name,
      options: v.options || {},
      price_override: v.price_override ? Number(v.price_override) : null,
      compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
      stock_quantity: Number(v.stock_quantity ?? 0),
      is_active: Boolean(v.is_active),
    })),
    reviews: reviews.map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      author_name: r.author_name,
      rating: Number(r.rating),
      title: r.title || null,
      body: r.body,
      is_verified_purchase: Boolean(r.is_verified_purchase),
      created_at: r.created_at,
    })),
    rating_summary: {
      average_rating: avgRating ? Math.round(avgRating * 10) / 10 : 0,
      review_count: totalReviews,
    },
  };
}

/**
 * Fetch all active categories from Supabase
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      console.error('Supabase categories error:', error);
      return [];
    }

    return data as Category[];
  } catch (err) {
    console.error('Failed to get categories from Supabase:', err);
    return [];
  }
}

/**
 * Fetch a single category by slug from Supabase
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as Category;
  } catch (err) {
    console.error('Failed to get category by slug:', err);
    return null;
  }
}

/**
 * Fetch featured products directly from Supabase
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(limit);

    if (error || !data) {
      console.error('Supabase featured products error:', error);
      return [];
    }

    return data.map(formatProductRecord);
  } catch (err) {
    console.error('Failed to get featured products from Supabase:', err);
    return [];
  }
}

/**
 * Fetch new arrivals directly from Supabase
 */
export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('is_active', true)
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('Supabase new arrivals error:', error);
      return [];
    }

    return data.map(formatProductRecord);
  } catch (err) {
    console.error('Failed to get new arrivals from Supabase:', err);
    return [];
  }
}

/**
 * Fetch products with optional filtering and sorting from Supabase
 */
export async function getProducts(options?: FilterOptions): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('is_active', true);

    if (options?.category) {
      const cat = await getCategoryBySlug(options.category);
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (options?.minPrice !== undefined) {
      query = query.gte('base_price', options.minPrice);
    }

    if (options?.maxPrice !== undefined) {
      query = query.lte('base_price', options.maxPrice);
    }

    if (options?.material) {
      query = query.ilike('material', `%${options.material}%`);
    }

    if (options?.color) {
      query = query.ilike('color', `%${options.color}%`);
    }

    if (options?.inStockOnly) {
      query = query.gt('stock_quantity', 0);
    }

    // Sort order at database level when applicable
    if (options?.sort === 'price-asc') {
      query = query.order('base_price', { ascending: true });
    } else if (options?.sort === 'price-desc') {
      query = query.order('base_price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Supabase getProducts error:', error);
      return [];
    }

    let products = data.map(formatProductRecord);

    // Text search filter if query specified
    if (options?.query) {
      const q = options.query.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.color?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    // Rating sort
    if (options?.sort === 'rating') {
      products.sort(
        (a, b) =>
          (b.rating_summary?.average_rating || 0) -
          (a.rating_summary?.average_rating || 0)
      );
    }

    return products;
  } catch (err) {
    console.error('Failed to get products from Supabase:', err);
    return [];
  }
}

/**
 * Fetch a single product by slug from Supabase
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return formatProductRecord(data);
  } catch (err) {
    console.error('Failed to get product by slug:', err);
    return null;
  }
}

/**
 * Fetch a single product by ID from Supabase
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return formatProductRecord(data);
  } catch (err) {
    console.error('Failed to get product by ID:', err);
    return null;
  }
}

/**
 * Fetch products by category slug from Supabase
 */
export async function getProductsByCategory(
  categorySlug: string,
  options?: Omit<FilterOptions, 'category'>
): Promise<Product[]> {
  return getProducts({ ...options, category: categorySlug });
}

/**
 * Search products by query string from Supabase
 */
export async function searchProducts(
  query: string,
  options?: Omit<FilterOptions, 'query'>
): Promise<Product[]> {
  if (!query || !query.trim()) return [];
  return getProducts({ ...options, query });
}

/**
 * Fetch published reviews for a product from Supabase
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Review[];
  } catch (err) {
    console.error('Failed to get product reviews:', err);
    return [];
  }
}

/**
 * Fetch related products from same category from Supabase
 */
export async function getRelatedProducts(
  currentProductId: string,
  categoryId?: string | null,
  limit = 4
): Promise<Product[]> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return [];

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*),
        reviews:reviews(*)
      `)
      .eq('is_active', true)
      .neq('id', currentProductId);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.limit(limit);
    if (error || !data) return [];

    return data.map(formatProductRecord);
  } catch (err) {
    console.error('Failed to get related products from Supabase:', err);
    return [];
  }
}

/**
 * Fetch site settings from Supabase
 */
export async function getSiteSettings(): Promise<Record<string, any>> {
  try {
    const supabase = getPublicSupabase();
    if (!supabase) return {};

    const { data, error } = await supabase.from('site_settings').select('*');
    if (error || !data) return {};

    const settingsMap: Record<string, any> = {};
    data.forEach((row: any) => {
      settingsMap[row.key] = row.value;
    });

    return settingsMap;
  } catch (err) {
    console.error('Failed to get site settings:', err);
    return {};
  }
}
