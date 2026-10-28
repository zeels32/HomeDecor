import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy',
  description: 'Learn about our complimentary white-glove shipping, packaging standards, and pan-India transit timelines.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-charcoal">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl">Shipping & Delivery Policy</h1>
        <p className="text-xs text-muted-gray mt-1">Last updated: October 2024</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">1. Pan-India Delivery Coverage</h2>
          <p>
            Terra & Form delivers to over 19,000 PIN codes across India through premium surface and air express couriers (Blue Dart, Delhivery Express, DTDC Premium). We provide tracking numbers immediately upon dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">2. Delivery Charges & Thresholds</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Complimentary White-Glove Shipping:</strong> Orders valued at ₹2,999 and above receive zero delivery charges.</li>
            <li><strong>Standard Shipping:</strong> A flat ₹199 fee applies to orders below ₹2,999 to cover insured multi-layer protective packaging.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">3. Processing & Transit Timelines</h2>
          <p>
            Every decor object undergoes hand inspection and quality check at our Mumbai atelier before packaging.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Order Processing:</strong> 24 to 48 business hours.</li>
            <li><strong>Metro Transit:</strong> 2 to 4 business days.</li>
            <li><strong>Non-Metro & Regional:</strong> 4 to 6 business days.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">4. Transit Insurance Guarantee</h2>
          <p>
            Home decor ceramics, glass, and furniture are inherently fragile. To give you peace of mind, all shipments are 100% transit-insured by Terra & Form. If any piece is damaged during transit, we replace it at no expense.
          </p>
        </section>
      </div>
    </div>
  );
}
