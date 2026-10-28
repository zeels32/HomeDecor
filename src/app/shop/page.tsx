import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/data/products';
import { ShopCatalogView } from '@/components/collection/shop-catalog-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Decor Products | Curated Ceramics, Vases & Planters',
  description:
    'Browse our comprehensive catalog of handcrafted ceramic flower pots, architectural vases, tabletop objects, and modern decor.',
};

interface Props {
  searchParams?: {
    category?: string;
    material?: string;
    sort?: string;
    maxPrice?: string;
    inStock?: string;
    q?: string;
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <ShopCatalogView
      initialProducts={products}
      categories={categories}
      title="All Home & Office Decor"
      description="Quiet architectural presence and honest materials. Explore our complete collection of vases, planters, sculptures, and tabletop accents."
    />
  );
}
