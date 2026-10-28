'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { useCart } from '@/features/cart/cart-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images[0]?.image_url || '';
  const secondaryImage = product.images[1]?.image_url || primaryImage;
  const isSoldOut = product.stock_quantity <= 0;
  const hasVariants = product.variants && product.variants.length > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) return;

    if (hasVariants) {
      // If product has variants, navigate to detail page to select size/color
      window.location.href = `/product/${product.slug}`;
      return;
    }

    addToCart(product, null, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-sm border border-subtle-border hover:shadow-card transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container (4:5 Aspect Ratio) */}
      <div className="relative aspect-4/5 w-full bg-sand/20 overflow-hidden rounded-t-sm">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.images[0]?.alt_text || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${isSoldOut ? 'opacity-50 grayscale' : 'opacity-100'}`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_new_arrival && (
            <span className="bg-white/95 backdrop-blur-xs text-forest text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs border border-subtle-border">
              New
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-forest text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs">
              Best Seller
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.base_price && (
            <span className="bg-sand text-charcoal text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs">
              Special Price
            </span>
          )}
          {isSoldOut && (
            <span className="bg-charcoal text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-white text-red-500 shadow-md'
              : 'bg-white/80 text-charcoal hover:bg-white hover:text-red-500 shadow-sm opacity-90 group-hover:opacity-100'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay Button on desktop */}
        {!isSoldOut && (
          <div className="absolute bottom-3 inset-x-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAddedRecently}
              className={`w-full py-2.5 px-3 text-xs font-semibold tracking-wider uppercase rounded-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md ${
                isAddedRecently
                  ? 'bg-forest-700 text-white'
                  : 'bg-white/95 text-charcoal hover:bg-forest hover:text-white'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : hasVariants ? (
                <span>Select Options</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {product.category && (
            <p className="text-[11px] uppercase tracking-wider text-muted-gray font-medium">
              {product.category.name}
            </p>
          )}

          <h3 className="font-serif text-sm font-medium text-charcoal line-clamp-1 group-hover:text-forest transition-colors">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Rating */}
          {product.rating_summary && product.rating_summary.review_count > 0 && (
            <div className="flex items-center space-x-1 pt-0.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-charcoal font-medium">
                {product.rating_summary.average_rating.toFixed(1)}
              </span>
              <span className="text-[11px] text-muted-gray">
                ({product.rating_summary.review_count})
              </span>
            </div>
          )}
        </div>

        {/* Price & Mobile Add */}
        <div className="pt-3 flex items-center justify-between border-t border-subtle-border/60 mt-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-semibold text-charcoal">
              {formatCurrency(product.base_price)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.base_price && (
              <span className="text-xs text-muted-gray line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add icon */}
          {!isSoldOut && (
            <button
              onClick={handleQuickAdd}
              className="sm:hidden p-1.5 text-forest hover:bg-forest hover:text-white rounded-full transition-colors border border-subtle-border"
              aria-label="Add to bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
