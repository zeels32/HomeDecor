'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/features/cart/cart-context';
import { formatCurrency } from '@/lib/pricing';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shippingAmount,
    totalAmount,
    isFreeShipping,
    amountNeededForFreeShipping,
    updateQuantity,
    removeItem,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sand/40 mx-auto flex items-center justify-center text-forest">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-charcoal">Your Shopping Bag is Empty</h1>
          <p className="text-sm text-muted-gray max-w-sm mx-auto">
            Your next favorite piece is waiting to be discovered.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">Shopping Bag</h1>
        <p className="text-xs text-muted-gray mt-1">
          Review your selected pieces ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Complimentary Shipping Progress */}
          <div className="p-4 bg-sand-50 rounded-sm border border-subtle-border text-xs text-charcoal">
            {isFreeShipping ? (
              <p className="font-semibold text-forest flex items-center gap-1.5">
                <span>✓</span> You qualify for complimentary insured white-glove delivery across India!
              </p>
            ) : (
              <div>
                <p>
                  Add <span className="font-semibold text-forest">{formatCurrency(amountNeededForFreeShipping)}</span> more of decor pieces to unlock complimentary shipping.
                </p>
                <div className="w-full bg-sand-200 h-2 rounded-full mt-2 overflow-hidden">
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

          {/* Items Table */}
          <div className="bg-white rounded-sm border border-subtle-border overflow-hidden divide-y divide-subtle-border">
            {items.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-4">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-sand/30 rounded-xs overflow-hidden flex-shrink-0 border border-subtle-border">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-gray">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-serif text-base font-medium text-charcoal hover:text-forest transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-muted-gray">{item.variant.name}</p>
                    )}
                    <p className="text-sm font-semibold text-charcoal sm:hidden pt-1">
                      {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:space-x-8 pt-2 sm:pt-0 border-t sm:border-0 border-subtle-border">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-subtle-border rounded-xs bg-ivory">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-muted-gray hover:text-charcoal"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-muted-gray hover:text-charcoal"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-sm font-semibold text-charcoal">
                      {formatCurrency(item.line_total)}
                    </p>
                    <p className="text-[11px] text-muted-gray hidden sm:block">
                      {formatCurrency(item.unit_price)} each
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-muted-gray hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/shop"
              className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
            >
              <span>← Continue Browsing</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-6 sticky top-28">
          <h2 className="font-serif text-xl text-charcoal font-medium">Order Summary</h2>

          <div className="space-y-3 text-xs border-b border-subtle-border pb-4">
            <div className="flex justify-between text-muted-gray">
              <span>Subtotal</span>
              <span className="font-medium text-charcoal">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-gray">
              <span>Estimated Delivery</span>
              <span className="font-medium text-charcoal">
                {isFreeShipping ? 'Complimentary' : formatCurrency(shippingAmount)}
              </span>
            </div>
            <div className="flex justify-between text-muted-gray">
              <span>Taxes</span>
              <span className="font-medium text-charcoal">Included</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline text-base font-semibold text-charcoal">
            <span>Estimated Total</span>
            <span className="font-serif text-xl">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="space-y-2">
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2 text-[11px] text-muted-gray pt-2 border-t border-subtle-border">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0" />
              <span>Transit insurance included with every shipment</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-forest flex-shrink-0" />
              <span>7-day door-step return & exchange guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-forest flex-shrink-0" />
              <span>Dispatched within 24–48 hours from Mumbai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
