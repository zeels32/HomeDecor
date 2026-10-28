import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/image';
import { ArrowRight, Compass, Shield, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Atelier Craftsmanship',
  description:
    'Discover the vision behind Terra & Form. Honoring natural stoneware, mouth-blown glass, and quiet architectural simplicity for modern living.',
};

export default function AboutPage() {
  return (
    <div className="pb-20 space-y-16 sm:space-y-24">
      {/* Hero */}
      <section className="bg-sand/30 border-b border-subtle-border py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-forest font-semibold">
            The Atelier Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal leading-tight">
            Designed for Quiet Living.
          </h1>
          <p className="text-sm sm:text-base text-muted-gray leading-relaxed max-w-xl mx-auto">
            We curate decor not to fill spaces, but to give them pause, proportion, and texture.
          </p>
        </div>
      </section>

      {/* Main Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-4/5 rounded-sm overflow-hidden border border-subtle-border shadow-soft bg-white">
            <Image
              src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan ceramicist shaping clay on wheel"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
              Honest Materials Over Trend Cycles
            </h2>
            <p>
              Founded in 2024, Terra & Form began with a simple observation: modern living spaces were increasingly crowded with artificial resins, hollow plastic molds, and disposable decor.
            </p>
            <p>
              We took inspiration from classical Mediterranean pottery, Japanese ceramics, and modernist architecture. We work directly with master artisans in Rajasthan, Uttar Pradesh, and Tuscany who respect high-firing techniques and hand-applied mineral glazes.
            </p>
            <p>
              When you touch a Terra & Form vase or planter, you feel the true weight of stoneware, the raw porous breath of terracotta, and the crystalline clarity of mouth-blown glass.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div id="craftsmanship" className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-subtle-border">
          <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-2">
            <Compass className="w-5 h-5 text-forest" />
            <h3 className="font-serif text-base font-semibold text-charcoal">Proportion First</h3>
            <p className="text-xs text-muted-gray leading-relaxed">
              Every curve, neck diameter, and pedestal height is tested in actual residential settings to ensure effortless visual harmony.
            </p>
          </div>

          <div id="sustainability" className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-2">
            <Shield className="w-5 h-5 text-forest" />
            <h3 className="font-serif text-base font-semibold text-charcoal">Zero-Plastic Transit</h3>
            <p className="text-xs text-muted-gray leading-relaxed">
              We pack entirely in custom-molded recycled paper pulp, honeycomb paper cushioning, and natural linen bindings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-2">
            <HeartHandshake className="w-5 h-5 text-forest" />
            <h3 className="font-serif text-base font-semibold text-charcoal">Artisanal Dignity</h3>
            <p className="text-xs text-muted-gray leading-relaxed">
              We pay ethical artisan wages and guarantee safe, well-ventilated studio workshops that honor heritage craftsmanship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
