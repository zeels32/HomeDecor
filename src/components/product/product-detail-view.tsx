'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  Maximize2,
  X,
  Check,
  ChevronDown,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Product, ProductVariant, Review } from '@/types';
import { formatCurrency } from '@/lib/pricing';
import { useCart } from '@/features/cart/cart-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { ProductCard } from '@/components/product/product-card';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);

  // Variant & Quantity state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Accordion open/close state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    dimensions: true,
    materials: false,
    shipping: false,
    returns: false,
  });

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = product.images.length > 0
    ? product.images
    : [{ id: 'default', product_id: product.id, image_url: '', alt_text: product.name, sort_order: 0, is_primary: true }];

  const currentImage = images[selectedImageIndex] || images[0];
  const inWishlist = isInWishlist(product.id);

  // Active price & stock based on selected variant
  const currentPrice = selectedVariant?.price_override ?? product.base_price;
  const comparePrice = selectedVariant?.compare_at_price ?? product.compare_at_price;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const isSoldOut = currentStock <= 0;

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    if (isSoldOut) return;
    setIsAdding(true);
    addToCart(product, selectedVariant, quantity);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBody.trim() || !reviewName.trim()) return;

    const newRev: Review = {
      id: 'rev_' + Date.now(),
      product_id: product.id,
      author_name: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || null,
      body: reviewBody.trim(),
      is_verified_purchase: false,
      created_at: new Date().toISOString(),
    };

    setReviews([newRev, ...reviews]);
    setReviewSuccess(true);
    setTimeout(() => {
      setIsReviewFormOpen(false);
      setReviewSuccess(false);
      setReviewName('');
      setReviewTitle('');
      setReviewBody('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-muted-gray">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-charcoal transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/collections/${product.category.slug}`}
              className="hover:text-charcoal transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Presentation (Two Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/5 w-full bg-sand/20 rounded-sm overflow-hidden border border-subtle-border group">
            {currentImage.image_url ? (
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-gray">
                No image available
              </div>
            )}

            {/* Prev / Next controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-all opacity-80 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-all opacity-80 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Zoom Trigger */}
            <button
              type="button"
              onClick={() => setIsFullscreenZoom(true)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-all"
              aria-label="Enlarge image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xs overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-forest ring-1 ring-forest'
                      : 'border-subtle-border opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || `${product.name} view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Information & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            {product.category && (
              <Link
                href={`/collections/${product.category.slug}`}
                className="text-xs uppercase tracking-widest text-forest font-semibold hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium leading-tight">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex items-center space-x-4 pt-1 text-xs">
              {product.rating_summary && product.rating_summary.review_count > 0 ? (
                <div className="flex items-center space-x-1.5">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(product.rating_summary!.average_rating)
                            ? 'fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-charcoal">
                    {product.rating_summary.average_rating.toFixed(1)}
                  </span>
                  <a href="#reviews" className="text-muted-gray hover:underline">
                    ({product.rating_summary.review_count} customer reviews)
                  </a>
                </div>
              ) : (
                <span className="text-muted-gray">Authentic atelier creation</span>
              )}

              {product.sku && (
                <span className="text-muted-gray border-l border-subtle-border pl-4">
                  SKU: {selectedVariant?.sku || product.sku}
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 py-3 border-y border-subtle-border">
            <span className="font-serif text-3xl font-semibold text-charcoal">
              {formatCurrency(currentPrice)}
            </span>
            {comparePrice && comparePrice > currentPrice && (
              <>
                <span className="text-base text-muted-gray line-through">
                  {formatCurrency(comparePrice)}
                </span>
                <span className="text-xs font-semibold text-forest uppercase tracking-wider bg-sage-50 px-2 py-0.5 rounded-xs border border-sage-200">
                  Save {Math.round(((comparePrice - currentPrice) / comparePrice) * 100)}%
                </span>
              </>
            )}
            <span className="text-xs text-muted-gray ml-auto">Taxes included</span>
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              {product.short_description}
            </p>
          )}

          {/* Variants Selector (if any) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-charcoal uppercase tracking-wider">
                  Select Option
                </span>
                <span className="text-muted-gray">
                  {selectedVariant?.name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`py-2.5 px-3 rounded-xs border text-xs text-left transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-forest bg-forest/5 text-forest font-semibold ring-1 ring-forest'
                        : 'border-subtle-border bg-white text-charcoal hover:border-muted-gray'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{v.name}</span>
                      {selectedVariant?.id === v.id && <Check className="w-3.5 h-3.5" />}
                    </div>
                    {v.price_override && (
                      <p className="text-[11px] text-muted-gray mt-0.5">
                        {formatCurrency(v.price_override)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isSoldOut
                  ? 'bg-red-500'
                  : currentStock <= 5
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            />
            <span className="font-medium text-charcoal">
              {isSoldOut
                ? 'Currently Out of Stock'
                : currentStock <= 5
                ? `Only ${currentStock} pieces remaining in this batch`
                : 'In Stock — Ready to ship'}
            </span>
          </div>

          {/* Quantity and Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex space-x-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-subtle-border bg-white rounded-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isSoldOut}
                  className="p-3 text-muted-gray hover:text-charcoal disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock || isSoldOut}
                  className="p-3 text-muted-gray hover:text-charcoal disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut || isAdding}
                className="flex-1 py-3.5 px-6 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:bg-muted-gray disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : isSoldOut ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 border rounded-xs transition-colors ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-subtle-border bg-white text-charcoal hover:bg-sand/30'
                }`}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now CTA */}
            {!isSoldOut && (
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 px-6 bg-sand text-charcoal border border-subtle-border text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-sand/60 transition-colors"
              >
                Buy Now
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-subtle-border grid grid-cols-2 gap-4 text-xs text-charcoal">
            <div className="flex items-start space-x-2">
              <Truck className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Complimentary Shipping</p>
                <p className="text-muted-gray text-[11px]">Free over ₹2,999</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RotateCcw className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">7-Day Free Returns</p>
                <p className="text-muted-gray text-[11px]">Safe packaging pickup</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">100% Transit Insured</p>
                <p className="text-muted-gray text-[11px]">Breakage replaced immediately</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Artisanal Quality</p>
                <p className="text-muted-gray text-[11px]">Hand-finished stoneware</p>
              </div>
            </div>
          </div>

          {/* Product Accordions */}
          <div className="border-t border-subtle-border divide-y divide-subtle-border pt-4 text-xs">
            {/* 1. Full Description */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full flex justify-between items-center font-semibold text-charcoal text-left py-1"
              >
                <span>Description & Story</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.description ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.description && (
                <div className="pt-2 text-muted-gray leading-relaxed font-sans">
                  <p>{product.description || product.short_description}</p>
                </div>
              )}
            </div>

            {/* 2. Dimensions & Weight */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('dimensions')}
                className="w-full flex justify-between items-center font-semibold text-charcoal text-left py-1"
              >
                <span>Dimensions & Weight</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.dimensions ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.dimensions && (
                <div className="pt-2 text-muted-gray space-y-1.5 font-sans">
                  {product.height && (
                    <div className="flex justify-between py-1 border-b border-subtle-border/50">
                      <span>Height:</span>
                      <span className="font-medium text-charcoal">{product.height} {product.dimensions_unit}</span>
                    </div>
                  )}
                  {product.width && (
                    <div className="flex justify-between py-1 border-b border-subtle-border/50">
                      <span>Width:</span>
                      <span className="font-medium text-charcoal">{product.width} {product.dimensions_unit}</span>
                    </div>
                  )}
                  {product.depth && (
                    <div className="flex justify-between py-1 border-b border-subtle-border/50">
                      <span>Depth:</span>
                      <span className="font-medium text-charcoal">{product.depth} {product.dimensions_unit}</span>
                    </div>
                  )}
                  {product.diameter && (
                    <div className="flex justify-between py-1 border-b border-subtle-border/50">
                      <span>Diameter:</span>
                      <span className="font-medium text-charcoal">{product.diameter} {product.dimensions_unit}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-1 border-b border-subtle-border/50">
                      <span>Net Weight:</span>
                      <span className="font-medium text-charcoal">{product.weight} {product.weight_unit}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Materials & Finish */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('materials')}
                className="w-full flex justify-between items-center font-semibold text-charcoal text-left py-1"
              >
                <span>Materials & Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.materials ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.materials && (
                <div className="pt-2 text-muted-gray space-y-2 leading-relaxed">
                  <p>
                    <strong className="text-charcoal font-medium">Material:</strong> {product.material || 'Artisanal Stoneware Clay'}
                  </p>
                  <p>
                    <strong className="text-charcoal font-medium">Color:</strong> {product.color || 'Natural Stone'}
                  </p>
                  <p>
                    <strong className="text-charcoal font-medium">Care:</strong> {product.care_instructions || 'Wipe gently with damp cloth.'}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Shipping & Returns */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center font-semibold text-charcoal text-left py-1"
              >
                <span>Delivery & Return Policy</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordions.shipping ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.shipping && (
                <div className="pt-2 text-muted-gray space-y-2 leading-relaxed">
                  <p>
                    Orders are processed within 24–48 hours from our Mumbai studio. Standard metro transit takes 2–4 business days.
                  </p>
                  <p>
                    Complimentary white-glove shipping on orders above ₹2,999. In the rare case of transit damage, photos sent within 48 hours ensure an immediate priority replacement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="border-t border-subtle-border pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Customer Reviews & Feedback
            </h2>
            <p className="text-xs text-muted-gray mt-1">
              Verified collector opinions from genuine interior spaces.
            </p>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-subtle-border text-xs font-semibold uppercase tracking-wider text-charcoal rounded-xs hover:bg-sand/30 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Review Submission Form */}
        {isReviewFormOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft max-w-xl space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-serif text-lg font-medium text-charcoal">
              Share Your Experience
            </h3>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-sm text-xs font-medium flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Thank you. Your review has been submitted successfully!</span>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Maya S."
                    className="w-full text-xs p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Review Headline</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Stunning texture on our sideboard"
                    className="w-full text-xs p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Review Body</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Share how this piece fits into your home, its material, and your thoughts."
                    className="w-full text-xs p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
                  >
                    Post Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="px-4 py-2.5 border border-subtle-border text-xs text-muted-gray hover:text-charcoal rounded-xs"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.is_verified_purchase && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Collector
                    </span>
                  )}
                </div>

                {rev.title && (
                  <h4 className="font-serif text-sm font-semibold text-charcoal">
                    {rev.title}
                  </h4>
                )}

                <p className="text-xs text-muted-gray leading-relaxed font-sans">
                  "{rev.body}"
                </p>

                <div className="text-[11px] text-muted-gray pt-2 border-t border-subtle-border/50 flex justify-between">
                  <span className="font-medium text-charcoal">{rev.author_name}</span>
                  <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-8 text-center bg-white border border-subtle-border rounded-sm p-6 text-xs text-muted-gray">
              No published reviews yet. Be the first to share your experience with this piece.
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-subtle-border pt-12 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              Curated Harmonies
            </p>
            <h2 className="font-serif text-2xl text-charcoal mt-1">
              Pieces That Pair Beautifully
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-subtle-border p-3 flex items-center justify-between shadow-2xl">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-charcoal">{formatCurrency(currentPrice)}</p>
          <p className="text-[10px] text-muted-gray">{isSoldOut ? 'Sold out' : 'In stock'}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm disabled:bg-muted-gray"
        >
          {isSoldOut ? 'Sold Out' : 'Add to Bag'}
        </button>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isFullscreenZoom && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            aria-label="Close enlarged view"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            {currentImage.image_url && (
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || product.name}
                fill
                className="object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
