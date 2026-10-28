'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/features/cart/cart-context';
import { formatCurrency } from '@/lib/pricing';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    isFreeShipping,
    amountNeededForFreeShipping,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-ivory shadow-2xl flex flex-col border-l border-subtle-border">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-subtle-border bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="text-lg font-serif font-medium text-charcoal">
                Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-muted-gray hover:text-charcoal transition-colors rounded-full hover:bg-sand/40"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-sand-50 border-b border-subtle-border text-xs text-charcoal">
            {isFreeShipping ? (
              <p className="font-medium text-forest flex items-center gap-1.5">
                <span>✓</span> You qualify for complimentary white-glove shipping!
              </p>
            ) : (
              <div>
                <p>
                  Add <span className="font-semibold text-forest">{formatCurrency(amountNeededForFreeShipping)}</span> more for complimentary shipping.
                </p>
                <div className="w-full bg-sand-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-forest h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (subtotal / (subtotal + amountNeededForFreeShipping)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-subtle-border/60">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand/50 flex items-center justify-center text-forest/60">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg text-charcoal">Your bag is empty</p>
                  <p className="text-sm text-muted-gray max-w-xs">
                    Your next favorite piece is waiting to be discovered.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forest text-white text-sm font-medium rounded-sm hover:bg-forest-600 transition-colors shadow-sm"
                >
                  <span>Explore the Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-sand/30 rounded-sm overflow-hidden flex-shrink-0 border border-subtle-border">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-gray">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="text-sm font-medium text-charcoal hover:text-forest transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-gray hover:text-red-700 transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <p className="text-xs text-muted-gray mt-0.5">
                          {item.variant.name}
                        </p>
                      )}

                      <p className="text-sm font-medium text-charcoal mt-1">
                        {formatCurrency(item.unit_price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-subtle-border bg-white rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-gray hover:text-charcoal hover:bg-sand/30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-medium text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-gray hover:text-charcoal hover:bg-sand/30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-medium text-charcoal">
                        {formatCurrency(item.line_total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {items.length > 0 && (
            <div className="border-t border-subtle-border bg-white p-6 space-y-4 shadow-lg">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-gray">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-gray">
                  <span>Estimated Shipping</span>
                  <span>{isFreeShipping ? 'Complimentary' : 'Calculated at checkout'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-forest text-white text-sm font-medium rounded-sm hover:bg-forest-600 transition-colors shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-ivory text-charcoal border border-subtle-border text-sm font-medium rounded-sm hover:bg-sand/40 transition-colors"
                >
                  View Full Bag
                </Link>
              </div>

              <p className="text-center text-[11px] text-muted-gray">
                Taxes included. Carbon-neutral eco delivery across India.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
