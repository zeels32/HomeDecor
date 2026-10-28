'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Truck,
  Store,
  Megaphone,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { StoreSettings } from '../types';

export function AdminSettingsView() {
  const { settings, updateSettings, isSaving } = useAdmin();

  const [form, setForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(form);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Store Configuration & Policies
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Configure global brand parameters, shipping thresholds, concierge contact channels, and site announcement banners.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
          <div className="flex items-center space-x-2 border-b border-subtle-border pb-3">
            <Store className="w-4 h-4 text-forest" />
            <h2 className="font-serif text-base font-semibold text-charcoal">
              Brand & Concierge Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Storefront Name</label>
              <input
                type="text"
                value={form.brand_info.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand_info: { ...form.brand_info, name: e.target.value },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Brand Subtitle / Tagline</label>
              <input
                type="text"
                value={form.brand_info.tagline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand_info: { ...form.brand_info, tagline: e.target.value },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Concierge Support Email</label>
              <input
                type="email"
                value={form.brand_info.support_email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand_info: { ...form.brand_info, support_email: e.target.value },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Direct Telephone Line</label>
              <input
                type="text"
                value={form.brand_info.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    brand_info: { ...form.brand_info, phone: e.target.value },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
          <div className="flex items-center space-x-2 border-b border-subtle-border pb-3">
            <Truck className="w-4 h-4 text-forest" />
            <h2 className="font-serif text-base font-semibold text-charcoal">
              White-Glove Shipping & Delivery Rules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">
                Complimentary Shipping Threshold (INR)
              </label>
              <input
                type="number"
                min="0"
                value={form.shipping_policy.free_shipping_threshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shipping_policy: {
                      ...form.shipping_policy,
                      free_shipping_threshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs font-semibold focus:outline-none focus:border-forest"
              />
              <p className="text-[10px] text-muted-gray">Orders exceeding this amount receive complimentary insured shipping.</p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">
                Standard Shipping Flat Rate (INR)
              </label>
              <input
                type="number"
                min="0"
                value={form.shipping_policy.standard_shipping_rate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shipping_policy: {
                      ...form.shipping_policy,
                      standard_shipping_rate: Number(e.target.value),
                    },
                  })
                }
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs font-semibold focus:outline-none focus:border-forest"
              />
              <p className="text-[10px] text-muted-gray">Applied to cart totals under the complimentary threshold.</p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Store Currency</label>
              <input
                type="text"
                disabled
                value={form.shipping_policy.currency}
                className="w-full p-2 bg-sand-100 border border-subtle-border rounded-xs font-mono text-muted-gray"
              />
              <p className="text-[10px] text-muted-gray">Locked to Indian Rupee (INR ₹).</p>
            </div>
          </div>
        </div>

        {/* Storefront Announcement Bar */}
        <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
          <div className="flex items-center space-x-2 border-b border-subtle-border pb-3">
            <Megaphone className="w-4 h-4 text-forest" />
            <h2 className="font-serif text-base font-semibold text-charcoal">
              Top Announcement Banner
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Announcement Copy</label>
              <input
                type="text"
                value={form.announcement.text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, text: e.target.value },
                  })
                }
                placeholder="e.g. Complimentary insured white-glove shipping on orders over ₹2,999."
                className="w-full p-2 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={form.announcement.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, enabled: e.target.checked },
                  })
                }
                className="rounded text-forest focus:ring-forest"
              />
              <span className="font-semibold text-charcoal">
                Display announcement banner at top of storefront
              </span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Preferences...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
