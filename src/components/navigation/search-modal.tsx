'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '@/types';
import { searchProducts } from '@/lib/data/products';
import { formatCurrency } from '@/lib/pricing';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const matching = await searchProducts(query);
        setResults(matching.slice(0, 6));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start bg-charcoal/50 backdrop-blur-sm">
      <div
        className="w-full bg-white border-b border-subtle-border shadow-xl py-6 px-4 sm:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header & input */}
          <div className="flex items-center justify-between pb-4 border-b border-subtle-border">
            <form onSubmit={handleSubmit} className="flex-1 flex items-center space-x-3">
              <Search className="w-5 h-5 text-muted-gray flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ceramic vases, terracotta pots, console stands..."
                className="w-full bg-transparent text-base sm:text-lg text-charcoal placeholder:text-muted-gray focus:outline-none font-sans"
              />
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-forest" />}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-muted-gray hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-muted-gray hover:text-charcoal rounded-full hover:bg-sand/30"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Links / Suggestions */}
          {!query && (
            <div className="py-6 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-gray font-medium">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Ceramic Vases',
                  'Terracotta Planters',
                  'Amber Glass',
                  'TV Unit',
                  'Desk Organizers',
                  'Stone Sculptures',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-ivory text-xs font-medium text-charcoal rounded-full border border-subtle-border hover:border-forest hover:text-forest transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Preview */}
          {query && (
            <div className="py-6">
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-muted-gray">
                    <span>{results.length} suggested products</span>
                    <button
                      onClick={handleSubmit}
                      className="text-forest hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>View all matching results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="group flex space-x-3 p-2 rounded-sm hover:bg-ivory border border-transparent hover:border-subtle-border transition-all"
                      >
                        <div className="relative w-16 h-20 bg-sand/20 rounded-sm overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images[0]?.image_url || ''}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-gray">{product.category?.name}</p>
                          <h4 className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs font-semibold text-charcoal mt-1">
                            {formatCurrency(product.base_price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                !isLoading && (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-sm text-charcoal font-medium">No products found for "{query}"</p>
                    <p className="text-xs text-muted-gray">
                      Try searching with broader terms like 'vase', 'pot', or 'sculpture'.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
