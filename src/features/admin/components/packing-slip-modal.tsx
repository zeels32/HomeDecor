'use client';

import React from 'react';
import { Printer, X } from 'lucide-react';
import { AdminOrder } from '../types';
import { formatCurrency } from '@/lib/pricing';

interface PackingSlipModalProps {
  order: AdminOrder;
  onClose: () => void;
}

export function PackingSlipModal({ order, onClose }: PackingSlipModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const shipAddr = order.shipping_address_snapshot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-2xl my-8 overflow-hidden print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-forest" />
            <span className="font-serif font-semibold text-charcoal text-sm">
              Invoice & Packing Slip — {order.order_number}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-xs text-charcoal font-sans print:p-4">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-subtle-border pb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-widest text-charcoal">
                TERRA & FORM
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-muted-gray">
                Atelier of Handcrafted Ceramic Vessels & Decor
              </p>
              <p className="text-[11px] text-muted-gray mt-2">
                concierge@terraandform.com • +91 (080) 4123-8899
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-sand-100 text-charcoal font-mono px-2 py-1 rounded text-xs font-bold uppercase">
                {order.order_number}
              </span>
              <p className="text-[11px] text-muted-gray mt-1">
                Date: {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[11px] font-semibold text-forest mt-0.5 capitalize">
                Payment: {order.payment_status} ({order.payment_provider || 'Direct'})
              </p>
            </div>
          </div>

          {/* Delivery & Dispatch Snapshot */}
          <div className="grid grid-cols-2 gap-6 bg-sand-50/50 p-4 rounded-xs border border-subtle-border">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-gray mb-1">
                Ship To Destination:
              </p>
              <p className="font-semibold text-charcoal text-sm">{shipAddr.full_name}</p>
              <p className="text-muted-gray">{shipAddr.address_line_1}</p>
              {shipAddr.address_line_2 && <p className="text-muted-gray">{shipAddr.address_line_2}</p>}
              <p className="text-muted-gray">
                {shipAddr.city}, {shipAddr.state} — {shipAddr.postal_code}
              </p>
              <p className="text-muted-gray">{shipAddr.country || 'India'}</p>
              <p className="text-muted-gray mt-1 font-mono">{shipAddr.phone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-gray mb-1">
                Fulfillment Directive:
              </p>
              <p className="font-semibold text-charcoal">Fragile Artisan Stoneware</p>
              <p className="text-muted-gray">Insured White-Glove Packaging</p>
              <p className="text-muted-gray mt-2">
                Order Status: <strong className="capitalize text-forest">{order.status}</strong>
              </p>
              <p className="text-muted-gray">Contact: {order.email}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-subtle-border rounded-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-subtle-border text-[10px] font-bold uppercase tracking-wider text-charcoal">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle-border">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-3">
                        <span className="font-semibold text-charcoal block">
                          {it.product_name_snapshot}
                        </span>
                        {it.variant_snapshot && (
                          <span className="text-[10px] text-muted-gray">
                            {Object.entries(it.variant_snapshot)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-muted-gray">{it.sku_snapshot || '—'}</td>
                      <td className="p-3 text-center font-bold">{it.quantity}</td>
                      <td className="p-3 text-right">{formatCurrency(it.unit_price)}</td>
                      <td className="p-3 text-right font-semibold">
                        {formatCurrency(it.line_total)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-muted-gray">
                      Single order consignment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-gray">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-gray">
                <span>Shipping</span>
                <span>
                  {order.shipping_amount === 0 ? 'Complimentary' : formatCurrency(order.shipping_amount)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-muted-gray">
                  <span>GST / Tax</span>
                  <span>{formatCurrency(order.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal font-bold text-sm pt-2 border-t border-subtle-border">
                <span>Grand Total</span>
                <span className="text-forest">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Thank You Footer */}
          <div className="pt-6 border-t border-subtle-border text-center text-muted-gray text-[11px] space-y-1">
            <p className="font-medium text-charcoal">
              Thank you for collecting with Terra & Form.
            </p>
            <p>
              Each ceramic vessel is hand-thrown or sculpted. Inquiries or returns: concierge@terraandform.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
