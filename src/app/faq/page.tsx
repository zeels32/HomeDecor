'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are your ceramic flower vases watertight for fresh flowers?',
      a: 'Yes. All Terra & Form ceramic and mouth-blown glass flower vases are high-fired and sealed with interior ceramic enamel glaze, making them 100% watertight for fresh bouquets and water arrangements. For vessels with raw unglazed exteriors (like the Sculpted Ivory Vase), wipe away any droplets on the exterior surface.',
    },
    {
      q: 'Do your flower pots include drainage holes and matching saucers?',
      a: 'Our indoor planters (such as the Textured Sage Green Planter) feature internal drainage reservoirs with flush-fitting matching saucers to protect wooden credenzas and console tables from moisture rings. Some large planters come with removable silicone drainage plugs for versatile indoor placement.',
    },
    {
      q: 'How are delicate ceramics and glass pieces protected during shipping?',
      a: 'Every item is packed in custom-engineered, multi-layer molded recycled paper pulp, honeycomb buffer sleeves, and rigid cardboard double-boxing. We avoid plastic bubble wrap in favor of sustainable, high-impact paper engineering. All shipments are 100% transit insured.',
    },
    {
      q: 'What if a piece arrives cracked or damaged in transit?',
      a: 'In the rare event of transit damage, simply email concierge@terraandform.com with a photo of the box and product within 48 hours of delivery. We will immediately dispatch an expedited replacement at zero cost without requiring you to return the broken shards.',
    },
    {
      q: 'What is your delivery timeframe across India?',
      a: 'Orders are processed from our Mumbai atelier within 24–48 hours. Metro deliveries (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata) generally arrive within 2–4 business days. Regional destinations take 4–6 business days.',
    },
    {
      q: 'Can I return a product if it does not fit my room aesthetic?',
      a: 'Yes. We offer a 7-day hassle-free return policy. As long as the item is in its original, undamaged condition with all packaging, our logistics partner will arrange a door-step pickup. See our Return Policy for details.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
          Help Center
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted-gray max-w-md mx-auto">
          Common queries regarding care, materials, delivery, and return processes.
        </p>
      </div>

      <div className="bg-white rounded-sm border border-subtle-border shadow-soft divide-y divide-subtle-border">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={faq.q} className="p-6">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left space-x-4"
              >
                <span className="font-serif text-base font-medium text-charcoal">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-forest flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pt-3 text-xs sm:text-sm text-muted-gray leading-relaxed font-sans animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
