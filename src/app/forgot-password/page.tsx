'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await resetPassword(email);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Failed to send recovery email.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="font-serif text-2xl tracking-[0.16em] text-charcoal font-semibold">
          TERRA & FORM
        </span>
        <h1 className="font-serif text-2xl text-charcoal font-medium">Reset Password</h1>
        <p className="text-xs text-muted-gray">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-forest-50 text-forest mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-xs text-charcoal">
              If an account exists for <strong className="text-forest">{email}</strong>, a reset link has been dispatched.
            </p>
            <Link
              href="/login"
              className="inline-block text-xs font-semibold text-forest hover:underline"
            >
              Return to Sign In →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

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

            <button
              type="submit"
              className="w-full py-3 px-4 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="border-t border-subtle-border pt-4 text-center">
              <Link href="/login" className="text-xs text-muted-gray hover:text-charcoal">
                Remember your password? Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
