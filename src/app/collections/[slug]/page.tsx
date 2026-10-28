import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/data/products';
import { ShopCatalogView } from '@/components/collection/shop-catalog-view';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: `${category.name} | Terra & Form Collection`,
    description: category.description || `Shop our curated ${category.name.toLowerCase()} collection.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const [category, categories, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
    getProductsByCategory(params.slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <ShopCatalogView
      initialProducts={products}
      categories={categories}
      currentCategorySlug={params.slug}
      title={category.name}
      description={category.description || ''}
    />
  );
}
