'use client';

import React from 'react';
import { AuthProvider } from '@/features/auth/auth-context';
import { CartProvider } from '@/features/cart/cart-context';
import { WishlistProvider } from '@/features/wishlist/wishlist-context';
import { OrdersProvider } from '@/features/orders/orders-context';
import { CartDrawer } from '@/components/cart/cart-drawer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrdersProvider>
            {children}
            <CartDrawer />
          </OrdersProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
