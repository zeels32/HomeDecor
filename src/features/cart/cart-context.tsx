'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { calculateCartTotals } from '@/lib/pricing';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'terra_form_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to local storage:', e);
      }
    }
  }, [items, isMounted]);

  const addToCart = (
    product: Product,
    variant: ProductVariant | null = null,
    quantity = 1
  ) => {
    const variantId = variant?.id || null;
    const cartItemId = `${product.id}_${variantId || 'base'}`;
    const unitPrice = variant?.price_override ?? product.base_price;
    const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

    if (maxStock <= 0) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: nextQty, line_total: nextQty * unitPrice }
            : item
        );
      } else {
        const validQty = Math.min(quantity, maxStock);
        const newItem: CartItem = {
          id: cartItemId,
          product_id: product.id,
          variant_id: variantId,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            base_price: product.base_price,
            image_url: product.images[0]?.image_url || '',
            stock_quantity: product.stock_quantity,
            dimensions_unit: product.dimensions_unit,
          },
          variant: variant
            ? {
                id: variant.id,
                name: variant.name,
                price: unitPrice,
                stock_quantity: variant.stock_quantity,
                options: variant.options,
              }
            : null,
          quantity: validQty,
          unit_price: unitPrice,
          line_total: validQty * unitPrice,
        };
        return [...prev, newItem];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.variant?.stock_quantity ?? item.product.stock_quantity;
          const clampedQty = Math.min(newQuantity, maxStock);
          return {
            ...item,
            quantity: clampedQty,
            line_total: clampedQty * item.unit_price,
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const { itemCount, subtotal, shippingAmount, totalAmount, isFreeShipping, amountNeededForFreeShipping } =
    useMemo(() => {
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      const totals = calculateCartTotals(items);
      return {
        itemCount: count,
        ...totals,
      };
    }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingAmount,
        totalAmount,
        isFreeShipping,
        amountNeededForFreeShipping,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
