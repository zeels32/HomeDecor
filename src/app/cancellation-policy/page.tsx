import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'Guidelines on order modifications, cancellations before dispatch, and refund timelines.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-charcoal">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl">Cancellation Policy</h1>
        <p className="text-xs text-muted-gray mt-1">Last updated: October 2024</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">1. Cancellation Window</h2>
          <p>
            Orders can be cancelled free of charge prior to dispatch from our Mumbai atelier (usually within 12 to 24 hours of placing the order).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">2. How to Request Cancellation</h2>
          <p>
            To cancel an order, log in to your account and select "Cancel Order" on the order details page, or contact our concierge team at <strong>concierge@terraandform.com</strong> or call <strong>+91 (080) 4123-8899</strong> quoting your Order ID.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">3. Post-Dispatch Cancellation</h2>
          <p>
            Once an order has been picked up by our courier partners, it cannot be stopped in mid-transit. In such cases, please decline delivery when the courier attempts delivery, or receive the parcel and initiate a standard 7-day return.
          </p>
        </section>
      </div>
    </div>
  );
}
