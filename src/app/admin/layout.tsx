'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, ShieldAlert, Store } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useAuth();

  return (
    <div className="bg-sand-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Bar */}
        <div className="bg-charcoal text-white p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-lg tracking-wider font-semibold">
              TERRA & FORM
            </span>
            <span className="bg-forest px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest text-white">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-ivory/70">
              Admin: <strong className="text-white">{profile?.full_name || 'Staff User'}</strong>
            </span>
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-sage-200 hover:text-white transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
