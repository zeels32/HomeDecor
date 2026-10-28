import { Metadata } from 'next';
import { searchProducts, getCategories } from '@/lib/data/products';
import { ShopCatalogView } from '@/components/collection/shop-catalog-view';

interface Props {
  searchParams: {
    q?: string;
  };
}

export const metadata: Metadata = {
  title: 'Search Decor Catalog',
  description: 'Search for ceramic vases, terracotta pots, console stands, and accessories.',
};

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const [products, categories] = await Promise.all([
    searchProducts(query),
    getCategories(),
  ]);

  return (
    <ShopCatalogView
      initialProducts={products}
      categories={categories}
      title={query ? `Search results for "${query}"` : 'Search our Catalog'}
      description={
        query
          ? `Showing matching pieces found in our collection.`
          : 'Use the search box above or browse categories below to discover handcrafted pieces.'
      }
    />
  );
}
