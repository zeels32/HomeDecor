'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X, ChevronRight, Check } from 'lucide-react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { formatCurrency } from '@/lib/pricing';

interface ShopCatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
  currentCategorySlug?: string;
  title: string;
  description?: string;
}

export function ShopCatalogView({
  initialProducts,
  categories,
  currentCategorySlug,
  title,
  description,
}: ShopCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategorySlug || searchParams.get('category') || ''
  );
  const [selectedMaterial, setSelectedMaterial] = useState<string>(
    searchParams.get('material') || ''
  );
  const [priceRange, setPriceRange] = useState<number>(
    searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 25000
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    searchParams.get('inStock') === 'true'
  );
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'featured'
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available materials from product list
  const materials = [
    'All Materials',
    'Ceramic',
    'Terracotta',
    'Glass',
    'Wood',
    'Stone',
    'Brass',
  ];

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    if (selectedMaterial && selectedMaterial !== 'All Materials') {
      result = result.filter((p) =>
        p.material?.toLowerCase().includes(selectedMaterial.toLowerCase())
      );
    }

    result = result.filter((p) => p.base_price <= priceRange);

    if (inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.base_price - b.base_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.base_price - a.base_price);
        break;
      case 'rating':
        result.sort(
          (a, b) =>
            (b.rating_summary?.average_rating || 0) -
            (a.rating_summary?.average_rating || 0)
        );
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [
    initialProducts,
    selectedCategory,
    selectedMaterial,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory(currentCategorySlug || '');
    setSelectedMaterial('');
    setPriceRange(25000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(selectedCategory && selectedCategory !== currentCategorySlug) ||
    Boolean(selectedMaterial && selectedMaterial !== 'All Materials') ||
    priceRange < 25000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-muted-gray">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-charcoal transition-colors">
          Shop
        </Link>
        {currentCategorySlug && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal font-medium capitalize">
              {title}
            </span>
          </>
        )}
      </nav>

      {/* Header Banner */}
      <div className="border-b border-subtle-border pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal">{title}</h1>
        {description && (
          <p className="text-sm text-muted-gray max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Control Bar: Product Count, Mobile Filter Button, Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-subtle-border gap-4">
        <div className="flex items-center space-x-4">
          <p className="text-xs text-muted-gray font-medium">
            Showing <span className="text-charcoal font-semibold">{filteredProducts.length}</span> pieces
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-forest hover:underline font-medium flex items-center gap-1"
            >
              <span>Clear filters</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center space-x-2 px-3 py-2 bg-white border border-subtle-border text-xs font-medium text-charcoal rounded-sm hover:bg-sand/30 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-forest" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-xs text-muted-gray font-medium hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-subtle-border text-xs text-charcoal rounded-sm px-3 py-2 focus:outline-none focus:border-forest"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar Filter (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-sm border border-subtle-border sticky top-28">
          <div className="flex justify-between items-center border-b border-subtle-border pb-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal">
              Refine Collection
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-forest hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          {!currentCategorySlug && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-charcoal">Category</p>
              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block text-left w-full py-1 ${
                    selectedCategory === ''
                      ? 'text-forest font-semibold'
                      : 'text-muted-gray hover:text-charcoal'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block text-left w-full py-1 ${
                      selectedCategory === c.slug
                        ? 'text-forest font-semibold'
                        : 'text-muted-gray hover:text-charcoal'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material Filter */}
          <div className="space-y-2.5 border-t border-subtle-border pt-4">
            <p className="text-xs font-semibold text-charcoal">Material</p>
            <div className="space-y-1.5 text-xs">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat === 'All Materials' ? '' : mat)}
                  className={`block text-left w-full py-1 ${
                    (mat === 'All Materials' && !selectedMaterial) ||
                    selectedMaterial === mat
                      ? 'text-forest font-semibold'
                      : 'text-muted-gray hover:text-charcoal'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 border-t border-subtle-border pt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-charcoal">Max Price</span>
              <span className="font-mono text-charcoal">{formatCurrency(priceRange)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-gray">
              <span>₹1,000</span>
              <span>₹25,000</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="border-t border-subtle-border pt-4">
            <label className="flex items-center space-x-2 text-xs text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-xs accent-forest text-forest focus:ring-forest"
              />
              <span>In stock items only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-sm border border-subtle-border p-12 text-center space-y-4">
              <p className="font-serif text-lg text-charcoal">No matching products found</p>
              <p className="text-xs sm:text-sm text-muted-gray max-w-sm mx-auto">
                We couldn't find any decor items matching your active filter criteria. Try adjusting your price or clearing filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-subtle-border pb-4">
                <h3 className="font-serif text-lg font-medium text-charcoal">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-muted-gray hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              {!currentCategorySlug && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-charcoal uppercase">Category</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left text-xs py-1.5 ${
                        selectedCategory === '' ? 'text-forest font-bold' : 'text-muted-gray'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.slug)}
                        className={`block w-full text-left text-xs py-1.5 ${
                          selectedCategory === c.slug ? 'text-forest font-bold' : 'text-muted-gray'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Materials */}
              <div className="space-y-2 border-t border-subtle-border pt-4">
                <p className="text-xs font-semibold text-charcoal uppercase">Material</p>
                <div className="space-y-1">
                  {materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat === 'All Materials' ? '' : mat)}
                      className={`block w-full text-left text-xs py-1.5 ${
                        (mat === 'All Materials' && !selectedMaterial) ||
                        selectedMaterial === mat
                          ? 'text-forest font-bold'
                          : 'text-muted-gray'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2 border-t border-subtle-border pt-4">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-charcoal">Max Price</span>
                  <span>{formatCurrency(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-forest"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-subtle-border space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 text-xs text-muted-gray hover:text-charcoal"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
