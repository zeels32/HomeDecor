'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RotateCcw, Clock } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setIsSubscribed(true);
    // In production, syncs with Supabase newsletter_subscribers table
  };

  return (
    <footer className="bg-charcoal text-ivory/80 pt-16 pb-12 border-t border-charcoal-light">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-charcoal-light/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <Truck className="w-5 h-5 text-sage-300 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Insured White-Glove Shipping</p>
              <p className="text-xs text-muted-gray mt-0.5">Complimentary over ₹2,999</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <ShieldCheck className="w-5 h-5 text-sage-300 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Artisanal Integrity</p>
              <p className="text-xs text-muted-gray mt-0.5">Authentic high-fired stoneware</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <RotateCcw className="w-5 h-5 text-sage-300 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">7-Day Return Policy</p>
              <p className="text-xs text-muted-gray mt-0.5">Hassle-free return service</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <Clock className="w-5 h-5 text-sage-300 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Dedicated Concierge</p>
              <p className="text-xs text-muted-gray mt-0.5">Personal styling assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <span className="font-serif text-2xl tracking-[0.16em] text-white font-semibold">
                TERRA & FORM
              </span>
              <p className="text-xs text-ivory/70 leading-relaxed max-w-sm">
                Curating quiet architectural warmth and sculptural balance for contemporary homes, studios, and sanctuaries.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                A Little Inspiration, Delivered
              </p>
              {isSubscribed ? (
                <div className="p-3 bg-forest-700/50 border border-forest-500 rounded-sm text-xs text-sage-100 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-300" />
                  <span>Welcome. We look forward to sharing new curated releases.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex max-w-sm">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="bg-charcoal-light/70 border border-charcoal-light px-3.5 py-2 text-xs text-white placeholder:text-muted-gray focus:outline-none focus:border-sage-300 w-full rounded-l-sm"
                    />
                    <button
                      type="submit"
                      className="bg-sage-400 hover:bg-sage-500 text-charcoal px-3.5 py-2 text-xs font-semibold rounded-r-sm transition-colors flex items-center justify-center flex-shrink-0"
                      aria-label="Subscribe to newsletter"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {error && <p className="text-[11px] text-red-300">{error}</p>}
                  <p className="text-[11px] text-muted-gray">
                    By subscribing you accept our Privacy Policy. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Group 1: Shop */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Shop</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections/flower-pots" className="hover:text-white transition-colors">
                  Flower Pots & Planters
                </Link>
              </li>
              <li>
                <Link href="/collections/flower-vases" className="hover:text-white transition-colors">
                  Artisan Flower Vases
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=newest" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=featured" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/collections/decor-sets" className="hover:text-white transition-colors">
                  Decor Sets & Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 2: Customer Care */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Customer Care</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3: About */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">About</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-white transition-colors">
                  Craftsmanship & Materials
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="hover:text-white transition-colors">
                  Sustainable Packaging
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Trade & Interior Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 4: Legal */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white">Legal</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Delivery Guidelines
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-gray hover:text-white transition-colors">
                  Store Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-charcoal-light/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-gray">
        <p>© {new Date().getFullYear()} TERRA & FORM. All rights reserved.</p>

        {/* Payment Methods */}
        <div className="flex items-center space-x-3">
          <span className="text-[11px] uppercase tracking-wider">Secure Payment via</span>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-ivory/80">
            <span className="px-2 py-0.5 bg-charcoal-light rounded border border-charcoal-light/80">UPI</span>
            <span className="px-2 py-0.5 bg-charcoal-light rounded border border-charcoal-light/80">VISA</span>
            <span className="px-2 py-0.5 bg-charcoal-light rounded border border-charcoal-light/80">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-charcoal-light rounded border border-charcoal-light/80">NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
