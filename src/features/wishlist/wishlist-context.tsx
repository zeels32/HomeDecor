'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'terra_form_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlistProducts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse wishlist from local storage:', e);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistProducts));
      } catch (e) {
        console.error('Failed to save wishlist to local storage:', e);
      }
    }
  }, [wishlistProducts, isMounted]);

  const isInWishlist = (productId: string) => {
    return wishlistProducts.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlistProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearWishlist = () => {
    setWishlistProducts([]);
  };

  const wishlistIds = wishlistProducts.map((p) => p.id);
  const wishlistCount = wishlistProducts.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
