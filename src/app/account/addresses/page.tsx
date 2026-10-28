'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, MapPin, X } from 'lucide-react';
import { useOrders } from '@/features/orders/orders-context';
import { Address } from '@/types';

export default function AccountAddressesPage() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useOrders();
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine1 || !city || !postalCode) return;

    addAddress({
      full_name: fullName,
      phone,
      address_line_1: addressLine1,
      address_line_2: addressLine2 || null,
      city,
      state,
      postal_code: postalCode,
      country: 'India',
      is_default: isDefault,
    });

    setIsAdding(false);
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setPostalCode('');
    setIsDefault(false);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-subtle-border pb-4 gap-2">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Saved Delivery Addresses</h2>
          <p className="text-xs text-muted-gray mt-0.5">
            Manage your personal and office shipping destinations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add Address Form Modal / Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-ivory rounded-sm border border-subtle-border space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center border-b border-subtle-border pb-2">
            <h3 className="font-serif text-base font-medium text-charcoal">
              Add New Address
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-muted-gray hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Zeel Solanki"
                className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">Contact Mobile *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-charcoal">Address Line 1 *</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="402, Lotus Grandeur, 14th Road"
                className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-charcoal">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Near Khar Gymkhana, Khar West"
                className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-charcoal">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-charcoal">State *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                >
                  {['Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Telangana', 'Other'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">PIN Code *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400052"
                  className="w-full p-2.5 bg-white border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded-xs accent-forest"
            />
            <span className="text-charcoal">Set as default delivery address</span>
          </label>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2.5 border border-subtle-border text-xs text-muted-gray hover:text-charcoal rounded-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-xs border text-xs space-y-3 relative transition-all ${
              addr.is_default
                ? 'border-forest bg-forest/[0.02] ring-1 ring-forest'
                : 'border-subtle-border bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-charcoal text-sm">{addr.full_name}</p>
                <p className="text-muted-gray">{addr.phone}</p>
              </div>

              {addr.is_default && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest text-white">
                  Default
                </span>
              )}
            </div>

            <p className="text-muted-gray leading-relaxed">
              {addr.address_line_1}
              {addr.address_line_2 && `, ${addr.address_line_2}`}<br />
              {addr.city}, {addr.state} - {addr.postal_code}<br />
              {addr.country}
            </p>

            <div className="pt-2 border-t border-subtle-border flex justify-between items-center">
              {!addr.is_default ? (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-forest hover:underline font-semibold"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-muted-gray text-[11px]">Primary Address</span>
              )}

              {addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-muted-gray hover:text-red-600 transition-colors p-1"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
