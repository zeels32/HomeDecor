'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Package,
} from 'lucide-react';
import { useCart } from '@/features/cart/cart-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { useAuth } from '@/features/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types';
import { SearchModal } from './search-modal';

interface SubCategory {
  name: string;
  href: string;
  description?: string;
}

interface NavCategory {
  name: string;
  href: string;
  highlight?: boolean;
  hasMega?: boolean;
  subcategories?: SubCategory[];
  featuredImage?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
}

// Pre-configured rich mega menu settings for core signature collections
const knownMegaCategories: Record<string, Partial<NavCategory>> = {
  'flower-pots': {
    name: 'Flower Pots',
    href: '/collections/flower-pots',
    hasMega: true,
    subcategories: [
      {
        name: 'Ceramic Planters',
        href: '/shop?category=flower-pots&material=ceramic',
        description: 'High-fired stoneware with matte glazes',
      },
      {
        name: 'Terracotta Pots',
        href: '/shop?category=flower-pots&material=terracotta',
        description: 'Breathable porous natural earthenware',
      },
      {
        name: 'Indoor Ribbed Pots',
        href: '/shop?category=flower-pots',
        description: 'Textured architectural silhouettes',
      },
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Living Botanical Collection',
    featuredSubtitle: 'Hand-thrown earthen pottery for healthy plants',
  },
  'flower-vases': {
    name: 'Flower Vases',
    href: '/collections/flower-vases',
    hasMega: true,
    subcategories: [
      {
        name: 'Sculptural Ceramic Vases',
        href: '/shop?category=flower-vases&material=ceramic',
        description: 'Organic undulating curves & raw textures',
      },
      {
        name: 'Mouth-Blown Glass Vases',
        href: '/shop?category=flower-vases&material=glass',
        description: 'Warm amber, smoke, and olive tones',
      },
      {
        name: 'Minimalist Bud Vases',
        href: '/shop?category=flower-vases',
        description: 'Intimate single-stem display pieces',
      },
    ],
    featuredImage:
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
    featuredTitle: 'Artisanal Vessel Edit',
    featuredSubtitle: 'Quiet architectural accents for fresh blooms',
  },
};

const defaultCollectionsList: NavCategory[] = [
  {
    name: 'Flower Pots',
    href: '/collections/flower-pots',
    hasMega: true,
    subcategories: knownMegaCategories['flower-pots'].subcategories,
    featuredImage: knownMegaCategories['flower-pots'].featuredImage,
    featuredTitle: knownMegaCategories['flower-pots'].featuredTitle,
    featuredSubtitle: knownMegaCategories['flower-pots'].featuredSubtitle,
  },
  {
    name: 'Flower Vases',
    href: '/collections/flower-vases',
    hasMega: true,
    subcategories: knownMegaCategories['flower-vases'].subcategories,
    featuredImage: knownMegaCategories['flower-vases'].featuredImage,
    featuredTitle: knownMegaCategories['flower-vases'].featuredTitle,
    featuredSubtitle: knownMegaCategories['flower-vases'].featuredSubtitle,
  },
  { name: 'Tabletop Decor', href: '/collections/tabletop-decor' },
  { name: 'Living Room', href: '/collections/living-room' },
  { name: 'Office Decor', href: '/collections/office-decor' },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, profile } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaDropdown, setActiveMegaDropdown] = useState<string | null>(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({
    'Flower Pots': true, // Open first category by default for discoverability
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  // Fetch active categories from Supabase on mount and route changes
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setDbCategories(data as Category[]);
        }
      });
  }, [pathname]);

  // Construct complete collection items merging dynamic categories with rich mega menu data
  const allCollections: NavCategory[] = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) {
      return defaultCollectionsList;
    }

    return dbCategories.map((cat) => {
      const mega = knownMegaCategories[cat.slug];
      if (mega) {
        return {
          name: cat.name.replace(/ & Planters$/, ''),
          href: `/collections/${cat.slug}`,
          hasMega: true,
          subcategories: mega.subcategories,
          featuredImage: mega.featuredImage || cat.image_url || undefined,
          featuredTitle: mega.featuredTitle,
          featuredSubtitle: mega.featuredSubtitle,
        };
      }

      return {
        name: cat.name,
        href: `/collections/${cat.slug}`,
      };
    });
  }, [dbCategories]);

  // Strictly limit visible collections in the menu bar to at most 3:
  const visibleCollections = useMemo(() => {
    return allCollections.slice(0, 3);
  }, [allCollections]);

  // Remaining collections (from index 3 onwards) will be shown inside "More":
  const remainingCollections = useMemo(() => {
    return allCollections.slice(3);
  }, [allCollections]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaDropdown(null);
  }, [pathname]);

  // Handle scroll state for elevated shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveMegaDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMobileCategory = useCallback((name: string) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  return (
    <>
      {/* 1. Announcement Bar - Responsive on all screen sizes */}
      <aside
        aria-label="Announcement"
        className="bg-forest text-ivory text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-sans tracking-wide border-b border-forest-600 transition-colors"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-sage-200 flex-shrink-0" />
          <p className="truncate sm:overflow-visible sm:whitespace-normal">
            <span className="hidden md:inline">Thoughtfully chosen pieces for beautiful spaces. </span>
            <span className="font-medium text-white">Complimentary delivery</span> across India on orders over ₹2,999.
          </p>
        </div>
      </aside>

      {/* 2. Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-subtle-border transition-all duration-200 ${
          isScrolled ? 'shadow-soft' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-2 sm:gap-4">
            
            {/* Left Section: Mobile/Tablet Hamburger & Search */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:hidden flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-1 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline text-xs font-medium uppercase tracking-wider text-charcoal">
                  Menu
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo - Left-aligned on desktop, flex-shrink-0 so it never collapses */}
            <div className="flex-1 lg:flex-none flex-shrink-0 flex items-center justify-center lg:justify-start pr-2 xl:pr-6">
              <Link
                href="/"
                className="group flex flex-col items-center lg:items-start text-center lg:text-left py-1"
              >
                <span className="font-serif text-lg sm:text-2xl lg:text-2xl xl:text-3xl tracking-[0.14em] sm:tracking-[0.18em] text-charcoal font-semibold group-hover:text-forest transition-colors leading-none">
                  TERRA & FORM
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.26em] sm:tracking-[0.35em] text-muted-gray mt-0.5 sm:mt-1 font-sans">
                  Atelier & Decor
                </span>
              </Link>
            </div>

            {/* Desktop / Laptop Navigation Bar (Limit 3 collections + Shop All + More) */}
            <nav className="hidden lg:flex items-center justify-center flex-1 min-w-0 lg:gap-3 xl:gap-5 2xl:gap-7 px-2">
              {/* Shop All */}
              <div className="relative py-6 xl:py-7 flex-shrink-0">
                <Link
                  href="/shop"
                  className={`text-[11px] xl:text-[12px] 2xl:text-[13px] tracking-wider uppercase font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap py-1 ${
                    pathname === '/shop'
                      ? 'text-forest font-semibold border-b-2 border-forest -mb-0.5'
                      : 'text-charcoal hover:text-forest'
                  }`}
                >
                  <span>Shop All</span>
                </Link>
              </div>

              {/* Up to 3 Collections */}
              {visibleCollections.map((item) => (
                <div
                  key={item.name}
                  className="relative py-6 xl:py-7 group flex-shrink-0"
                  onMouseEnter={() => item.hasMega && setActiveMegaDropdown(item.name)}
                  onMouseLeave={() => setActiveMegaDropdown(null)}
                  onFocus={() => item.hasMega && setActiveMegaDropdown(item.name)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setActiveMegaDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`text-[11px] xl:text-[12px] 2xl:text-[13px] tracking-wider uppercase font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap py-1 ${
                      pathname === item.href
                        ? 'text-forest font-semibold border-b-2 border-forest -mb-0.5'
                        : 'text-charcoal hover:text-forest'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasMega && (
                      <ChevronDown
                        className={`w-3 h-3 text-muted-gray transition-transform duration-200 ${
                          activeMegaDropdown === item.name ? 'rotate-180 text-forest' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Desktop Mega Menu Dropdown */}
                  {item.hasMega && activeMegaDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 xl:left-1/2 xl:-translate-x-1/2 w-[480px] max-w-[calc(100vw-2rem)] bg-white border border-subtle-border shadow-elevated rounded-sm p-6 grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                      role="menu"
                    >
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-3">
                            Explore {item.name}
                          </p>
                          <ul className="space-y-3">
                            {item.subcategories?.map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={sub.href}
                                  className="group/sub block text-xs transition-colors"
                                >
                                  <span className="font-medium text-charcoal group-hover/sub:text-forest block">
                                    {sub.name}
                                  </span>
                                  {sub.description && (
                                    <span className="text-[10px] text-muted-gray block mt-0.5">
                                      {sub.description}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-subtle-border mt-3">
                          <Link
                            href={item.href}
                            className="text-xs font-semibold text-forest hover:text-forest-600 flex items-center gap-1 group/link"
                          >
                            <span>Browse All in Category</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>

                      {item.featuredImage && (
                        <div className="relative rounded-sm overflow-hidden bg-sand/20 aspect-4/5 group/card">
                          <Image
                            src={item.featuredImage}
                            alt={item.name}
                            fill
                            sizes="220px"
                            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex flex-col justify-end p-3.5 text-white">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-sage-200 mb-0.5">
                              Spotlight
                            </span>
                            <p className="text-xs font-serif font-medium leading-tight">
                              {item.featuredTitle}
                            </p>
                            {item.featuredSubtitle && (
                              <p className="text-[10px] text-ivory/80 mt-1 line-clamp-1">
                                {item.featuredSubtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* More Dropdown: Shows remaining collections & New Arrivals */}
              <div
                className="relative py-6 xl:py-7 group flex-shrink-0"
                onMouseEnter={() => setActiveMegaDropdown('more-collections')}
                onMouseLeave={() => setActiveMegaDropdown(null)}
                onFocus={() => setActiveMegaDropdown('more-collections')}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setActiveMegaDropdown(null);
                  }
                }}
              >
                <button
                  type="button"
                  className={`text-[11px] xl:text-[12px] 2xl:text-[13px] tracking-wider uppercase font-medium transition-colors inline-flex items-center gap-1 whitespace-nowrap py-1 ${
                    activeMegaDropdown === 'more-collections' ||
                    remainingCollections.some((c) => pathname === c.href)
                      ? 'text-forest font-semibold'
                      : 'text-charcoal hover:text-forest'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3 h-3 text-muted-gray transition-transform duration-200 ${
                      activeMegaDropdown === 'more-collections' ? 'rotate-180 text-forest' : ''
                    }`}
                  />
                </button>

                {activeMegaDropdown === 'more-collections' && (
                  <div
                    className="absolute top-full right-0 w-64 bg-white border border-subtle-border shadow-elevated rounded-sm p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
                    role="menu"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-subtle-border mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-gray">
                        More Collections
                      </span>
                      {remainingCollections.length > 0 && (
                        <span className="text-[10px] font-mono text-muted-gray bg-sand-100 px-1.5 py-0.5 rounded">
                          {remainingCollections.length} more
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                      {remainingCollections.length > 0 ? (
                        remainingCollections.map((col) => (
                          <Link
                            key={col.href}
                            href={col.href}
                            className={`flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xs transition-colors ${
                              pathname === col.href
                                ? 'text-forest font-semibold bg-forest/5'
                                : 'text-charcoal hover:text-forest hover:bg-sand/30 font-medium'
                            }`}
                          >
                            <span>{col.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-gray" />
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-muted-gray py-2 px-1 italic">
                          Explore our full curated catalog
                        </p>
                      )}
                    </div>

                    <div className="pt-2 mt-2 border-t border-subtle-border space-y-1">
                      <Link
                        href="/shop?sort=newest"
                        className="flex items-center justify-between px-2.5 py-1.5 text-xs text-forest hover:bg-forest/5 rounded-xs font-semibold transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-forest" />
                          <span>New Arrivals</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-forest text-white px-1.5 py-0.5 rounded-full font-bold">
                          New
                        </span>
                      </Link>

                      <Link
                        href="/shop"
                        className="block px-2.5 py-1 text-[11px] text-muted-gray hover:text-charcoal transition-colors font-medium text-center"
                      >
                        Browse All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Icons: Search (Desktop), Account, Wishlist, Cart */}
            {/* flex-shrink-0, pl-2, and z-10 ensures it is ALWAYS visible and never overlapped */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2 flex-shrink-0 pl-2 xl:pl-4 z-10">
              {/* Search Icon (Desktop only, as mobile has it in left group) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex p-2 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Customer Account (Tablet & Desktop, hidden on small mobile) */}
              <Link
                href={user ? '/account' : '/login'}
                className="hidden sm:flex p-2 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label={user ? 'Customer account' : 'Sign in'}
                title={user ? `Signed in as ${profile?.full_name || user.email}` : 'Sign In'}
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-forest rounded-full ring-2 ring-white" />
                )}
              </Link>

              {/* Staff Administrator Icon (Tablet & Desktop) */}
              {profile?.is_admin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex p-2 text-forest hover:text-forest-dark hover:bg-forest-50 rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-forest"
                  title="Admin Backoffice"
                  aria-label="Admin Backoffice"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-forest rounded-full animate-pulse" />
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-2 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-sage-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon */}
              <button
                type="button"
                onClick={openDrawer}
                className="p-2 text-charcoal hover:text-forest hover:bg-sand/30 rounded-full transition-colors relative focus:outline-none focus:ring-1 focus:ring-forest"
                aria-label={`Shopping bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-forest text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Off-Canvas Slide Navigation Drawer (Mobile & Tablet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sliding Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs sm:max-w-sm md:max-w-md bg-ivory shadow-2xl flex flex-col border-r border-subtle-border animate-in slide-in-from-left duration-300">
              
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-subtle-border bg-white flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col"
                >
                  <span className="font-serif text-lg sm:text-xl tracking-[0.16em] text-charcoal font-semibold leading-tight">
                    TERRA & FORM
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-gray font-sans">
                    Atelier & Decor
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-muted-gray hover:text-charcoal hover:bg-sand/40 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Search Quick-Bar */}
              <div className="p-3.5 sm:p-4 border-b border-subtle-border bg-sand-50/70">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white rounded-sm border border-subtle-border text-xs text-muted-gray hover:text-charcoal hover:border-forest/40 transition-colors shadow-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <Search className="w-4 h-4 text-forest" />
                    <span>Search vases, planters, decor...</span>
                  </div>
                  <kbd className="text-[10px] font-mono bg-sand-100 text-charcoal/70 px-1.5 py-0.5 rounded">
                    Search
                  </kbd>
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5">
                
                {/* Main Collections Navigation with Accordions */}
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-gray px-1 pb-2">
                    Collections & Catalog
                  </p>

                  {/* Shop All */}
                  <div className="border-b border-subtle-border/60 pb-1">
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-2 text-sm sm:text-base font-serif font-medium transition-colors rounded-xs ${
                        pathname === '/shop'
                          ? 'text-forest font-semibold bg-forest/5'
                          : 'text-charcoal hover:text-forest hover:bg-sand/30'
                      }`}
                    >
                      <span>Shop All</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-gray" />
                    </Link>
                  </div>

                  {/* All Collections (with accordions for subcategories) */}
                  {allCollections.map((item) => {
                    const isExpanded = !!expandedMobileCategories[item.name];
                    const hasSub = !!item.subcategories?.length;

                    return (
                      <div
                        key={item.name}
                        className="border-b border-subtle-border/60 last:border-b-0 pb-1"
                      >
                        {hasSub ? (
                          <>
                            <div className="flex items-center justify-between">
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex-1 py-2.5 px-2 text-sm sm:text-base font-serif font-medium transition-colors ${
                                  pathname === item.href
                                    ? 'text-forest font-semibold'
                                    : 'text-charcoal hover:text-forest'
                                }`}
                              >
                                {item.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleMobileCategory(item.name)}
                                className="p-2 text-muted-gray hover:text-forest hover:bg-sand/30 rounded-sm transition-colors"
                                aria-label={`Toggle ${item.name} subcategories`}
                                aria-expanded={isExpanded}
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-180 text-forest' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Accordion Subcategories List */}
                            {isExpanded && (
                              <div className="pl-3 pr-2 py-2 space-y-1 bg-white/70 rounded-sm mb-2 border-l-2 border-forest animate-in fade-in duration-200">
                                {item.subcategories?.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex flex-col py-1.5 px-2 rounded-xs hover:bg-sand-50 text-xs text-charcoal hover:text-forest transition-colors"
                                  >
                                    <span className="font-medium">{sub.name}</span>
                                    {sub.description && (
                                      <span className="text-[10px] text-muted-gray">
                                        {sub.description}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                                <Link
                                  href={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center justify-between text-xs font-semibold text-forest pt-2 px-2 hover:underline"
                                >
                                  <span>View all {item.name}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between py-2.5 px-2 text-sm sm:text-base font-serif font-medium transition-colors rounded-xs ${
                              pathname === item.href
                                ? 'text-forest font-semibold bg-forest/5'
                                : 'text-charcoal hover:text-forest hover:bg-sand/30'
                            }`}
                          >
                            <span>{item.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-gray" />
                          </Link>
                        )}
                      </div>
                    );
                  })}

                  {/* New Arrivals */}
                  <div className="pt-2">
                    <Link
                      href="/shop?sort=newest"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-2 text-sm sm:text-base font-serif font-medium text-charcoal hover:text-forest hover:bg-sand/30 transition-colors rounded-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-forest" />
                        <span>New Arrivals</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-forest text-white px-2 py-0.5 rounded-full font-semibold">
                        New
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Featured Editorial Card */}
                <div className="relative rounded-sm overflow-hidden bg-sand/30 aspect-16/9 sm:aspect-2/1 p-4 flex flex-col justify-end border border-subtle-border">
                  <Image
                    src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80"
                    alt="Atelier Crafts"
                    fill
                    sizes="350px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent" />
                  <div className="relative text-white z-10 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sage-200">
                      Curated Sanctuary
                    </span>
                    <p className="font-serif text-base font-medium">Quiet architectural accents</p>
                    <p className="text-[11px] text-ivory/80 line-clamp-2">
                      Handcrafted earthenware designed to elevate daily spaces with natural warmth.
                    </p>
                  </div>
                </div>

                {/* Secondary Customer Utilities inside Drawer */}
                <div className="pt-2 border-t border-subtle-border/70 space-y-1 text-xs">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-gray px-1 pb-1">
                    Account & Concierge
                  </p>

                  <Link
                    href={user ? '/account' : '/login'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-2 rounded-xs text-charcoal hover:bg-sand/40 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <User className="w-4 h-4 text-forest" />
                      <span>{user ? 'My Profile & Orders' : 'Sign in to Account'}</span>
                    </div>
                    {user && (
                      <span className="text-[10px] bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-2 rounded-xs text-charcoal hover:bg-sand/40 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Heart className="w-4 h-4 text-forest" />
                      <span>Saved Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="text-[10px] bg-sage-500 text-white px-2 py-0.5 rounded-full font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {profile?.is_admin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-2 rounded-xs text-forest font-semibold bg-forest/5 hover:bg-forest/10 transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <ShieldCheck className="w-4 h-4 text-forest" />
                        <span>Staff Administration</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-forest text-white px-2 py-0.5 rounded">
                        Admin
                      </span>
                    </Link>
                  )}

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-2 rounded-xs text-charcoal hover:bg-sand/40 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Package className="w-4 h-4 text-forest" />
                      <span>Care & Shipping Support</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Status */}
              <div className="p-4 border-t border-subtle-border bg-white text-[11px] text-muted-gray flex items-center justify-between">
                <span>Pan-India Delivery</span>
                <span className="font-mono text-forest font-medium">Over ₹2,999 Free</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
