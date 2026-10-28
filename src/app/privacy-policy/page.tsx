import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Terra & Form collects, protects, and respects customer personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-charcoal">
      <div className="border-b border-subtle-border pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl">Privacy Policy</h1>
        <p className="text-xs text-muted-gray mt-1">Last updated: October 2024</p>
      </div>

      <div className="bg-white p-8 rounded-sm border border-subtle-border shadow-soft space-y-6 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">1. Information We Collect</h2>
          <p>
            When you purchase decor pieces or create an account, we collect necessary transactional details such as your name, billing and delivery addresses, email, and phone number. We never store payment card credentials, CVVs, or bank net-banking passwords.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">2. How Your Data is Used</h2>
          <p>
            Your information is used strictly to fulfill orders, process payments via RBI-authorized gateways (Razorpay), communicate delivery status updates, and occasionally send curated newsletters if you opt in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">3. Data Protection & Security</h2>
          <p>
            All customer records and sessions are encrypted using industry-standard TLS/SSL encryption and stored on Supabase PostgreSQL databases with strict Row Level Security (RLS) policies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">4. Contact Our Data Officer</h2>
          <p>
            If you wish to review, update, or request deletion of your stored customer records, email <strong>concierge@terraandform.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
