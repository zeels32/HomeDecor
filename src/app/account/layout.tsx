'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard Overview', href: '/account', icon: User },
    { name: 'Order History', href: '/account/orders', icon: Package },
    { name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Profile Settings', href: '/account/profile', icon: User },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-subtle-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">
            Welcome, {profile?.full_name || 'Collector'}
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            {profile?.email || user?.email || 'Customer Account'}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-subtle-border text-xs text-muted-gray hover:text-red-600 rounded-xs transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-sm border border-subtle-border p-3 shadow-soft space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xs text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-forest text-white'
                    : 'text-charcoal hover:bg-ivory'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* Account Content Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
