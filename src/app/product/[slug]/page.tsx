import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/data/products';
import { ProductDetailView } from '@/components/product/product-detail-view';

interface Props {
  params: {
    slug: string;
  };
}


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Piece Not Found',
    };
  }

  return {
    title: product.seo_title || `${product.name} | Terra & Form`,
    description: product.seo_description || product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || '',
      images: product.images[0]?.image_url ? [{ url: product.images[0].image_url }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
