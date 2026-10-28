'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { useCart } from '@/features/cart/cart-context';
import { formatCurrency } from '@/lib/pricing';

export default function WishlistPage() {
  const { wishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sand/40 mx-auto flex items-center justify-center text-forest">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-charcoal">Your Wishlist is Empty</h1>
          <p className="text-sm text-muted-gray max-w-sm mx-auto">
            Save your favorite ceramic vases, planters, and decor objects as you browse.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm"
        >
          <span>Explore the Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-subtle-border pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Saved Wishlist</h1>
          <p className="text-xs text-muted-gray mt-1">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'curated piece' : 'curated pieces'}
          </p>
        </div>
        <Link href="/shop" className="text-xs font-semibold text-forest hover:underline">
          Continue Browsing →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => {
          const isSoldOut = product.stock_quantity <= 0;

          return (
            <div
              key={product.id}
              className="bg-white rounded-sm border border-subtle-border overflow-hidden flex flex-col justify-between group shadow-soft hover:shadow-card transition-all"
            >
              <div className="relative aspect-4/5 w-full bg-sand/20">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                  <Image
                    src={product.images[0]?.image_url || ''}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-charcoal hover:text-red-600 shadow-sm transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {product.category && (
                    <p className="text-[10px] uppercase tracking-wider text-muted-gray">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="font-serif text-sm font-medium text-charcoal line-clamp-1 mt-0.5">
                    <Link href={`/product/${product.slug}`} className="hover:text-forest transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-semibold text-charcoal mt-1">
                    {formatCurrency(product.base_price)}
                  </p>
                </div>

                <div className="pt-2 border-t border-subtle-border">
                  <button
                    onClick={() => {
                      if (!isSoldOut) {
                        addToCart(product, null, 1);
                      }
                    }}
                    disabled={isSoldOut}
                    className="w-full py-2 px-3 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors flex items-center justify-center space-x-1.5 disabled:bg-muted-gray"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isSoldOut ? 'Sold Out' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
