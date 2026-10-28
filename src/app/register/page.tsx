'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Please accept the Terms & Privacy Policy to create your account.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, fullName);
      if (result.success) {
        router.push('/account');
      } else {
        setError(result.error || 'Failed to register account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
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
        <h1 className="font-serif text-2xl text-charcoal font-medium">Create Customer Account</h1>
        <p className="text-xs text-muted-gray">
          Enjoy streamlined orders, address book, and private collection previews.
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
            <label className="font-semibold text-charcoal">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Zeel Solanki"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
              <User className="w-4 h-4 text-muted-gray absolute left-3 top-3" />
            </div>
          </div>

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
            <label className="font-semibold text-charcoal">Password (Min. 6 characters)</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
              <Lock className="w-4 h-4 text-muted-gray absolute left-3 top-3" />
            </div>
          </div>

          <label className="flex items-start space-x-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded-xs accent-forest"
            />
            <span className="text-[11px] text-muted-gray leading-tight">
              I agree to the{' '}
              <Link href="/terms" className="text-forest underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-forest underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:bg-muted-gray"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-subtle-border pt-4 text-center text-xs text-muted-gray">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-forest hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
