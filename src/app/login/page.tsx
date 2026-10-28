'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push('/account');
      } else {
        setError(result.error || 'Failed to sign in. Please verify your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-serif text-2xl tracking-[0.16em] text-charcoal font-semibold">
          TERRA & FORM
        </span>
        <h1 className="font-serif text-2xl text-charcoal font-medium">Customer Sign In</h1>
        <p className="text-xs text-muted-gray">
          Access your order history, saved addresses, and wishlist.
        </p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-charcoal">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
              <Mail className="w-4 h-4 text-muted-gray absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-charcoal">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-forest hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
              <Lock className="w-4 h-4 text-muted-gray absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-gray hover:text-charcoal"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:bg-muted-gray pt-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-subtle-border pt-4 text-center text-xs text-muted-gray">
          Don't have an account yet?{' '}
          <Link href="/register" className="font-semibold text-forest hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
