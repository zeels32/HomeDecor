'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RefreshCw, Store, Menu, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../admin-context';
import { useAuth } from '@/features/auth/auth-context';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const pathname = usePathname();
  const { isLoading, refreshAll } = useAdmin();
  const { profile } = useAuth();

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Executive Dashboard';
    if (pathname.includes('/products')) return 'Product Catalog & Inventory';
    if (pathname.includes('/orders')) return 'Orders & Fulfillment';
    if (pathname.includes('/users')) return 'Customers & Personnel';
    if (pathname.includes('/categories')) return 'Catalog Taxonomies & Collections';
    if (pathname.includes('/reviews')) return 'Review Moderation';
    if (pathname.includes('/settings')) return 'Store Configuration & Policies';
    return 'Admin Portal';
  };

  return (
    <header className="sticky top-0 z-30 bg-charcoal text-white border-b border-charcoal-light shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 text-ivory/80 hover:text-white hover:bg-white/10 rounded-xs"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-base sm:text-lg font-semibold tracking-wide text-white">
                {getPageTitle()}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-forest/80 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider text-white">
                <ShieldCheck className="w-3 h-3" />
                <span>Active Portal</span>
              </span>
            </div>
            <p className="text-[11px] text-ivory/60 hidden sm:block">
              Connected to live commerce database & inventory engine
            </p>
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <button
            onClick={() => refreshAll()}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-ivory/90 hover:text-white rounded-xs transition-colors disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sage-300' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 bg-forest hover:bg-forest-light text-white rounded-xs transition-colors font-medium"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>

          <div className="hidden md:flex flex-col text-right pl-2 border-l border-white/15 text-[11px]">
            <span className="font-semibold text-white">
              {profile?.full_name || 'Staff Administrator'}
            </span>
            <span className="text-ivory/60 text-[10px]">
              {profile?.email || 'admin@terraandform.com'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
