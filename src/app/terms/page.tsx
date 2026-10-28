import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing the purchase of home decor pieces from Terra & Form.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-charcoal">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl">Terms and Conditions</h1>
        <p className="text-xs text-muted-gray mt-1">Last updated: October 2024</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">1. Atelier Presentation & Handcrafted Variations</h2>
          <p>
            Terra & Form specializes in handmade ceramics, mouth-blown glassware, and solid timber. Because each item is shaped and glazed by hand, subtle variations in surface tone, mineral specks, and slight dimensions (±5%) are characteristic of authentic craftsmanship and are not considered defects.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">2. Pricing & Currency</h2>
          <p>
            All listed prices are displayed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to correct typographical errors prior to shipping confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">3. Order Acceptance & Inventory Validation</h2>
          <p>
            Your receipt of an order confirmation signifies our receipt of your order; it does not constitute final acceptance until dispatch from our atelier. In the unlikely event of an inventory discrepancy, you will be notified immediately and refunded in full.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">4. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising in connection with orders shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.
          </p>
        </section>
      </div>
    </div>
  );
}
