'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Settings,
  Store,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useAdmin } from '../admin-context';

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const { stats, orders, reviews } = useAdmin();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;
  const lowStockCount = stats?.lowStockCount || 0;
  const pendingReviewsCount = reviews.filter((r) => !r.is_published).length;

  const navItems = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
      exact: true,
    },
    {
      name: 'Products & Stock',
      href: '/admin/products',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      name: 'Orders & Fulfillment',
      href: '/admin/orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : null,
      badgeColor: 'bg-forest-50 text-forest border-forest-200',
    },
    {
      name: 'Customers & Staff',
      href: '/admin/users',
      icon: Users,
      badge: null,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      badge: null,
    },
    {
      name: 'Product Reviews',
      href: '/admin/reviews',
      icon: Star,
      badge: pendingReviewsCount > 0 ? String(pendingReviewsCount) : null,
      badgeColor: 'bg-sand-200 text-charcoal border-sand-300',
    },
    {
      name: 'Store Settings',
      href: '/admin/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-subtle-border">
      {/* Brand Header */}
      <div className="p-5 border-b border-subtle-border flex items-center justify-between">
        <div>
          <span className="font-serif text-lg tracking-wider font-semibold text-charcoal block">
            TERRA & FORM
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-forest font-semibold">
            Atelier Backoffice
          </span>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-muted-gray hover:text-charcoal rounded-full hover:bg-sand/40 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-gray">
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-forest text-white shadow-xs font-semibold'
                  : 'text-charcoal hover:bg-sand-50/80 hover:text-forest'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-muted-gray'}`} />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono font-semibold ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Storefront Link */}
      <div className="p-3 border-t border-subtle-border space-y-2">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 border border-subtle-border rounded-xs text-xs font-medium text-charcoal hover:bg-ivory transition-colors"
        >
          <Store className="w-3.5 h-3.5 text-muted-gray" />
          <span>View Live Storefront</span>
        </Link>
        <Link
          href="/account"
          className="flex items-center justify-center space-x-2 w-full py-1.5 text-[11px] text-muted-gray hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Back to Customer Profile</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-20 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
