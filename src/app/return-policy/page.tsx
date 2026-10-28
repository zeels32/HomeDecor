import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'Understand our 7-day hassle-free return window, transit damage claim steps, and refund processing guidelines.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-charcoal">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl">Returns & Refund Policy</h1>
        <p className="text-xs text-muted-gray mt-1">Last updated: October 2024</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">1. 7-Day Doorstep Returns</h2>
          <p>
            We want you to love how each piece complements your home. If a piece does not suit your space, you may initiate a return within 7 calendar days of delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">2. Return Eligibility Criteria</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The item must be in its original, uninstalled, and unused condition.</li>
            <li>All original interior packaging, molded paper pulp protectors, tags, and accessories must accompany the piece.</li>
            <li>Custom-ordered furniture or modified items are non-returnable unless defective.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">3. Transit Damage Claims (Instant Priority Replacement)</h2>
          <p>
            If your package shows external damage or a ceramic vessel is cracked upon opening:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Photograph the shipping label and the damaged piece within 48 hours of delivery.</li>
            <li>Email our concierge at <strong>concierge@terraandform.com</strong> with your order number.</li>
            <li>Our team will dispatch a replacement vessel within 24 hours. You do not need to return the broken ceramic fragments.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">4. Refund Settlement</h2>
          <p>
            Once our courier picks up the returned item and inspects its condition at our atelier, refunds are credited back to your original payment method (Bank account, UPI, or Card) within 3 to 5 business days.
          </p>
        </section>
      </div>
    </div>
  );
}
