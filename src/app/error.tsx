'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-2xl text-charcoal">Something Went Wrong</h1>
        <p className="text-xs sm:text-sm text-muted-gray max-w-sm mx-auto">
          We encountered an unexpected error while loading this page. Please try refreshing.
        </p>
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-white border border-subtle-border text-charcoal text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-sand/30 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
