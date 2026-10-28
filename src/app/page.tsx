import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Compass, Shield, Award } from 'lucide-react';
import { getFeaturedProducts, getNewArrivals, getCategories } from '@/lib/data/products';
import { ProductCard } from '@/components/product/product-card';

export default async function HomePage() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(4),
    getCategories(),
  ]);

  const spaces = [
    {
      name: 'Living Room',
      description: 'Sculptural centerpieces, low plinths, and warm ceramics.',
      image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      href: '/collections/living-room',
    },
    {
      name: 'Study & Work Desk',
      description: 'Solid brass pen rests and serene stone catchalls.',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      href: '/collections/office-decor',
    },
    {
      name: 'Entryway Console',
      description: 'Inviting floral vessels and botanical statements.',
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
      href: '/collections/flower-vases',
    },
    {
      name: 'Shelves & Corners',
      description: 'Tactile stoneware planters and botanical textures.',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      href: '/collections/flower-pots',
    },
  ];

  const stylingTips = [
    {
      title: 'Styling a Low Console Table',
      category: 'Proportion & Balance',
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      excerpt: 'How to combine a tall ceramic bud vase with flat art books and a shallow stone dish for visual rhythm.',
    },
    {
      title: 'Bringing Greenery to Small Spaces',
      category: 'Botanical Living',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Selecting porous terracotta and ribbed planters that thrive beside morning light without cluttering floors.',
    },
    {
      title: 'Minimal Decor for Focused Workspaces',
      category: 'Studio Living',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Tactile brass and honed travertine accessories that replace plastic clutter with calming permanence.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-sand/30 border-b border-subtle-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 lg:pr-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/80 border border-subtle-border rounded-full text-xs font-medium text-forest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The 2024 Atelier Collection</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal font-normal tracking-tight leading-[1.12]">
                Little Details. <br />
                <span className="italic font-normal">Beautiful Spaces.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-gray max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Discover thoughtfully selected decor that brings warmth, character, and personality to every corner of your home.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 bg-forest text-white text-sm font-medium rounded-xs hover:bg-forest-600 transition-colors shadow-sm text-center"
                >
                  Shop the Collection
                </Link>
                <Link
                  href="/shop?sort=newest"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-charcoal border border-subtle-border text-sm font-medium rounded-xs hover:bg-sand/40 transition-colors text-center"
                >
                  Explore New Arrivals
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 border-t border-subtle-border grid grid-cols-3 gap-4 text-xs text-charcoal font-medium">
                <div>
                  <p className="font-semibold text-forest text-sm">100%</p>
                  <p className="text-muted-gray text-[11px]">Solid Stoneware & Brass</p>
                </div>
                <div>
                  <p className="font-semibold text-forest text-sm">Eco-Packed</p>
                  <p className="text-muted-gray text-[11px]">Plastic-Free Wrapping</p>
                </div>
                <div>
                  <p className="font-semibold text-forest text-sm">Pan-India</p>
                  <p className="text-muted-gray text-[11px]">Insured White Glove</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] w-full rounded-sm overflow-hidden shadow-elevated border border-subtle-border bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=85"
                  alt="Curated living room styled with ceramic vases, sandstone bowls, and warm oak decor"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xs border border-subtle-border flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-gray font-medium">
                      Featured Interior
                    </p>
                    <p className="text-sm font-serif font-medium text-charcoal">
                      The Sculpted Ivory & Travertine Study
                    </p>
                  </div>
                  <Link
                    href="/product/sculpted-ivory-ceramic-vase"
                    className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              Curated Collections
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group flex flex-col rounded-sm overflow-hidden bg-white border border-subtle-border hover:shadow-card transition-all"
            >
              <div className="relative aspect-square w-full bg-sand/30 overflow-hidden">
                <Image
                  src={category.image_url || ''}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-serif text-sm font-medium text-charcoal group-hover:text-forest transition-colors truncate">
                  {category.name}
                </h3>
                <p className="text-[11px] text-muted-gray mt-0.5">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              Signature Pieces
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
          >
            <span>View All Products ({featuredProducts.length}+)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY BANNER */}
      <section className="bg-sand/40 border-y border-subtle-border py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden border border-subtle-border shadow-soft bg-white">
              <Image
                src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80"
                alt="Artisan ceramic vessels and pottery tools"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6 lg:pl-6 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-forest font-semibold">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal leading-tight">
                Make Room for Beautiful Things.
              </h2>
              <p className="text-sm sm:text-base text-muted-gray leading-relaxed font-sans">
                At Terra & Form, we believe a home should feel grounded, calm, and deeply personal. We collaborate with master ceramicists, glassblowers, and stonemasons across India and the Mediterranean to create decor that values proportion over ornament and raw texture over fleeting trends.
              </p>
              <p className="text-sm sm:text-base text-muted-gray leading-relaxed font-sans">
                Each piece is formed from honest materials—high-fired stoneware, mouth-blown borosilicate glass, raw Tuscan terracotta, and solid American oak—designed to live gracefully in everyday spaces.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY SPACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
            Spatial Inspiration
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">
            Shop by Space
          </h2>
          <p className="text-xs sm:text-sm text-muted-gray">
            Envision how honest textures and sculptural silhouettes elevate each room of your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spaces.map((space) => (
            <Link
              key={space.name}
              href={space.href}
              className="group relative aspect-[3/4] rounded-sm overflow-hidden border border-subtle-border shadow-soft flex flex-col justify-end p-6"
            >
              <Image
                src={space.image}
                alt={space.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent" />
              <div className="relative z-10 space-y-1 text-white">
                <h3 className="font-serif text-xl font-medium tracking-wide">
                  {space.name}
                </h3>
                <p className="text-xs text-ivory/80 line-clamp-2">
                  {space.description}
                </p>
                <p className="text-[11px] font-semibold text-sage-300 pt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore room</span>
                  <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              Fresh Off the Wheel
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
          >
            <span>Explore All New Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. STYLING INSPIRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
            Editorial & Notes
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">
            Styling Inspiration
          </h2>
          <p className="text-xs sm:text-sm text-muted-gray">
            Guides and ideas for arranging ceramics, stems, and sculptural surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stylingTips.map((tip) => (
            <article
              key={tip.title}
              className="bg-white rounded-sm border border-subtle-border overflow-hidden shadow-soft flex flex-col"
            >
              <div className="relative aspect-video w-full bg-sand/30 overflow-hidden">
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-forest font-semibold">
                    {tip.category}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-charcoal">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-muted-gray leading-relaxed">
                    {tip.excerpt}
                  </p>
                </div>
                <Link
                  href="/about"
                  className="text-xs font-semibold text-charcoal hover:text-forest transition-colors inline-flex items-center gap-1 pt-2"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. SOCIAL PROOF / BRAND REVIEWS */}
      <section className="bg-sand-50 border-y border-subtle-border py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
              Collector Notes
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal">
              Appreciated in Quiet Homes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-3">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-charcoal leading-relaxed font-serif italic">
                "The Sculpted Ivory Vase has a wonderful, chalky stoneware tactile feel. Catches the morning window light beautifully without being gaudy."
              </p>
              <p className="text-[11px] font-medium text-muted-gray">
                — Ananya S., Mumbai
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-3">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-charcoal leading-relaxed font-serif italic">
                "The packaging alone is extraordinary—zero plastic bubble wrap, just heavy molded paper pulp and linen string. The planter arrived pristine."
              </p>
              <p className="text-[11px] font-medium text-muted-gray">
                — Rohan K., Bengaluru
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-3">
              <div className="text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs text-charcoal leading-relaxed font-serif italic">
                "Finding small TV credenzas with real tambour ash wood doors is difficult. Terra & Form nailed the scale for modern city apartments."
              </p>
              <p className="text-[11px] font-medium text-muted-gray">
                — Vikramaditya N., New Delhi
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
