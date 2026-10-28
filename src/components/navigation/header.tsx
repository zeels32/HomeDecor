'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/features/cart/cart-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { useAuth } from '@/features/auth/auth-context';
import { SearchModal } from './search-modal';

export function Header() {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navCategories = [
    { name: 'Shop All', href: '/shop' },
    {
      name: 'Flower Pots',
      href: '/collections/flower-pots',
      hasMega: true,
      subcategories: [
        { name: 'Ceramic Planters', href: '/shop?category=flower-pots&material=ceramic' },
        { name: 'Terracotta Pots', href: '/shop?category=flower-pots&material=terracotta' },
        { name: 'Indoor Ribbed Pots', href: '/shop?category=flower-pots' },
      ],
      featuredImage:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
      featuredTitle: 'Living Greenery',
    },
    {
      name: 'Flower Vases',
      href: '/collections/flower-vases',
      hasMega: true,
      subcategories: [
        { name: 'Sculptural Ceramic Vases', href: '/shop?category=flower-vases&material=ceramic' },
        { name: 'Mouth-Blown Glass Vases', href: '/shop?category=flower-vases&material=glass' },
        { name: 'Minimalist Bud Vases', href: '/shop?category=flower-vases' },
      ],
      featuredImage:
        'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
      featuredTitle: 'Artisanal Vessels',
    },
    { name: 'Tabletop Decor', href: '/collections/tabletop-decor' },
    { name: 'Living Room', href: '/collections/living-room' },
    { name: 'Office Decor', href: '/collections/office-decor' },
    { name: 'New Arrivals', href: '/shop?sort=newest', highlight: true },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <aside aria-label="Announcement" className="bg-forest text-ivory text-xs py-2 px-4 text-center font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-sage-200" />
          <p>
            Thoughtfully chosen pieces for beautiful spaces. <span className="opacity-90">Complimentary delivery across India on orders over ₹2,999.</span>
          </p>
        </div>
      </aside>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-subtle-border transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-charcoal hover:text-forest transition-colors rounded-sm"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link href="/" className="group flex flex-col items-center lg:items-start">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] text-charcoal font-semibold group-hover:text-forest transition-colors">
                  TERRA & FORM
                </span>
                <span className="text-[9px] uppercase tracking-[0.35em] text-muted-gray -mt-1 font-sans">
                  Atelier & Decor
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navCategories.map((item) => (
                <div
                  key={item.name}
                  className="relative py-7"
                  onMouseEnter={() => item.hasMega && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`text-[13px] tracking-wider uppercase font-medium transition-colors inline-flex items-center gap-1 ${
                      item.highlight
                        ? 'text-forest font-semibold'
                        : pathname === item.href
                        ? 'text-forest'
                        : 'text-charcoal hover:text-forest'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasMega && <ChevronDown className="w-3 h-3 text-muted-gray" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {item.hasMega && activeDropdown === item.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-white border border-subtle-border shadow-elevated rounded-sm p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
                          Explore {item.name}
                        </p>
                        <ul className="space-y-2.5">
                          {item.subcategories?.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className="text-xs text-muted-gray hover:text-forest transition-colors block py-0.5"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                          <li className="pt-2 border-t border-subtle-border">
                            <Link
                              href={item.href}
                              className="text-xs font-medium text-forest hover:underline"
                            >
                              View All in Category →
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {item.featuredImage && (
                        <div className="relative rounded-sm overflow-hidden bg-sand/20 aspect-4/5 group/card">
                          <Image
                            src={item.featuredImage}
                            alt={item.name}
                            fill
                            sizes="240px"
                            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-4">
                            <p className="text-white text-xs font-serif font-medium tracking-wide">
                              {item.featuredTitle}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions: Search, Account, Wishlist, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-charcoal hover:text-forest transition-colors rounded-full hover:bg-sand/30"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href={user ? '/account' : '/login'}
                className="p-2 text-charcoal hover:text-forest transition-colors rounded-full hover:bg-sand/30"
                aria-label={user ? 'Customer account' : 'Sign in'}
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className="p-2 text-charcoal hover:text-forest transition-colors rounded-full hover:bg-sand/30 relative"
                aria-label={`Wishlist (${wishlistCount})`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-sage-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openDrawer}
                className="p-2 text-charcoal hover:text-forest transition-colors rounded-full hover:bg-sand/30 relative"
                aria-label={`Shopping bag (${itemCount})`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-forest text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-20 z-40 bg-white border-t border-subtle-border flex flex-col overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-4">
              {navCategories.map((item) => (
                <div key={item.name} className="border-b border-subtle-border pb-3">
                  <Link
                    href={item.href}
                    className="text-base font-serif font-medium text-charcoal hover:text-forest flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                  </Link>
                  {item.subcategories && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block text-xs text-muted-gray hover:text-forest py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-subtle-border space-y-3">
              <Link
                href="/about"
                className="block text-sm text-muted-gray hover:text-charcoal"
              >
                Our Brand Story
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-gray hover:text-charcoal"
              >
                Concierge & Contact
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-muted-gray hover:text-charcoal"
              >
                Frequently Asked Questions
              </Link>
              {user ? (
                <Link
                  href="/account"
                  className="block text-sm font-medium text-forest pt-2"
                >
                  My Account ({user.email})
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm font-medium text-forest pt-2"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
