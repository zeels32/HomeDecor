import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-28 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-sand/40 text-forest mx-auto flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-forest font-semibold">
          404 Error
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
          This Piece or Page Has Moved
        </h1>
        <p className="text-xs sm:text-sm text-muted-gray max-w-sm mx-auto leading-relaxed">
          The requested decor item, collection, or URL could not be found in our current catalog.
        </p>
      </div>

      <div className="flex justify-center space-x-3 pt-2">
        <Link
          href="/"
          className="px-6 py-3 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="px-6 py-3 bg-white border border-subtle-border text-charcoal text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-sand/30 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
}
