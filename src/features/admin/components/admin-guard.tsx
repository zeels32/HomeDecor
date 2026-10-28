'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, ArrowLeft, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50/60 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft max-w-sm w-full text-center space-y-4">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
          <div>
            <h2 className="font-serif text-lg font-semibold text-charcoal">
              Verifying Authorization
            </h2>
            <p className="text-xs text-muted-gray mt-1">
              Checking administrative credentials with security gate...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Not logged in)
  if (!user) {
    return (
      <div className="min-h-screen bg-sand-50/60 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-elevated max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-sand-100 text-charcoal flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-forest" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-forest font-semibold bg-forest-50 px-2 py-0.5 rounded">
              Restricted Area
            </span>
            <h1 className="font-serif text-2xl font-semibold text-charcoal pt-1">
              Authentication Required
            </h1>
            <p className="text-xs text-muted-gray leading-relaxed">
              The Backoffice Portal contains sensitive order, catalog, and customer data. You must sign in with an authorized administrator account to continue.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 border border-subtle-border rounded-xs text-xs font-semibold text-charcoal hover:bg-sand-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
            <Link
              href="/login?redirectTo=/admin"
              className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-forest hover:bg-forest-light rounded-xs text-xs font-semibold text-white transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Admin Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but NOT an Admin (is_admin !== true)
  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-sand-50/60 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm border border-red-200 shadow-elevated max-w-md w-full text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-semibold bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
              Access Denied (403 Forbidden)
            </span>
            <h1 className="font-serif text-2xl font-semibold text-charcoal pt-1">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-muted-gray leading-relaxed">
              Your account (<strong className="text-charcoal font-medium">{user.email}</strong>) is registered as a customer and does not possess administrator permissions.
            </p>
          </div>

          <div className="p-3 bg-sand-50/80 rounded-xs border border-subtle-border text-[11px] text-muted-gray text-left space-y-1">
            <p className="font-semibold text-charcoal">Need administrative access?</p>
            <p>
              Please contact the primary store owner or ask an active administrator to upgrade your account role from the Personnel panel.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 border border-subtle-border rounded-xs text-xs font-semibold text-charcoal hover:bg-sand-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push('/login?redirectTo=/admin');
              }}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-charcoal hover:bg-forest rounded-xs text-xs font-semibold text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Administrator
  return <>{children}</>;
}
