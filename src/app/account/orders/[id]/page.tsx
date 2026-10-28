'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Printer } from 'lucide-react';
import { useOrders } from '@/features/orders/orders-context';
import { formatCurrency } from '@/lib/pricing';

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { getOrderById } = useOrders();
  const order = getOrderById(params.id);

  if (!order) {
    return (
      <div className="bg-white p-8 rounded-sm border border-subtle-border text-center space-y-4">
        <h2 className="font-serif text-xl text-charcoal">Order Not Found</h2>
        <p className="text-xs text-muted-gray">
          We could not locate this order in your customer record.
        </p>
        <Link
          href="/account/orders"
          className="inline-block text-xs font-semibold text-forest hover:underline"
        >
          ← Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-subtle-border pb-6 gap-4">
        <div className="space-y-1">
          <Link
            href="/account/orders"
            className="text-xs text-forest hover:underline inline-flex items-center gap-1 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-2xl text-charcoal">
              Order {order.order_number}
            </h2>
            <span className="capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-muted-gray">
            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-subtle-border text-xs font-semibold text-charcoal rounded-xs hover:bg-ivory transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Snapshot Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Shipping Address */}
        <div className="p-4 bg-ivory rounded-xs border border-subtle-border space-y-1.5">
          <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
            Delivery Destination
          </p>
          <p className="font-medium text-charcoal">{order.shipping_address_snapshot.full_name}</p>
          <p className="text-muted-gray">{order.shipping_address_snapshot.phone}</p>
          <p className="text-muted-gray">
            {order.shipping_address_snapshot.address_line_1}
            {order.shipping_address_snapshot.address_line_2 && `, ${order.shipping_address_snapshot.address_line_2}`}
          </p>
          <p className="text-muted-gray">
            {order.shipping_address_snapshot.city}, {order.shipping_address_snapshot.state} - {order.shipping_address_snapshot.postal_code}
          </p>
          <p className="text-muted-gray">{order.shipping_address_snapshot.country}</p>
        </div>

        {/* Payment Summary */}
        <div className="p-4 bg-ivory rounded-xs border border-subtle-border space-y-1.5">
          <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
            Payment & Fulfillment
          </p>
          <p className="text-muted-gray">
            <strong className="text-charcoal font-medium">Provider:</strong> {order.payment_provider}
          </p>
          <p className="text-muted-gray">
            <strong className="text-charcoal font-medium">Payment Status:</strong>{' '}
            <span className="capitalize text-emerald-700 font-semibold">{order.payment_status}</span>
          </p>
          <p className="text-muted-gray">
            <strong className="text-charcoal font-medium">Reference:</strong>{' '}
            <span className="font-mono text-charcoal">{order.payment_reference || 'N/A'}</span>
          </p>
          <p className="text-muted-gray">
            <strong className="text-charcoal font-medium">Billing Email:</strong> {order.email}
          </p>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="border border-subtle-border rounded-xs overflow-hidden">
        <div className="bg-sand-50 px-4 py-2.5 text-xs font-semibold text-charcoal flex justify-between border-b border-subtle-border">
          <span>Item</span>
          <span>Line Total</span>
        </div>
        <div className="divide-y divide-subtle-border text-xs">
          {order.items?.map((item) => (
            <div key={item.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-charcoal">{item.product_name_snapshot}</p>
                <p className="text-muted-gray text-[11px]">
                  Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                </p>
              </div>
              <p className="font-semibold text-charcoal">{formatCurrency(item.line_total)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Breakdown */}
      <div className="border-t border-subtle-border pt-4 max-w-xs ml-auto space-y-2 text-xs">
        <div className="flex justify-between text-muted-gray">
          <span>Subtotal</span>
          <span className="text-charcoal font-medium">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-gray">
          <span>Insured Shipping</span>
          <span className="text-charcoal font-medium">
            {order.shipping_amount === 0 ? 'Complimentary' : formatCurrency(order.shipping_amount)}
          </span>
        </div>
        <div className="flex justify-between text-muted-gray">
          <span>Taxes</span>
          <span className="text-charcoal font-medium">Included</span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-charcoal pt-2 border-t border-subtle-border">
          <span>Total Paid</span>
          <span className="font-serif text-lg">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
}
