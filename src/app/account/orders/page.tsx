'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight, ExternalLink } from 'lucide-react';
import { useOrders } from '@/features/orders/orders-context';
import { formatCurrency } from '@/lib/pricing';

export default function AccountOrdersPage() {
  const { orders } = useOrders();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
      <div className="border-b border-subtle-border pb-4">
        <h2 className="font-serif text-2xl text-charcoal">Order History</h2>
        <p className="text-xs text-muted-gray mt-0.5">
          Review previous orders, track fulfillment, and view invoices.
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="divide-y divide-subtle-border">
          {orders.map((order) => (
            <div key={order.id} className="py-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-3">
                    <span className="font-serif text-base font-medium text-charcoal">
                      {order.order_number}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.status}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-medium bg-sand/40 text-charcoal">
                      Payment: {order.payment_status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-gray">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-charcoal">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-ivory border border-subtle-border rounded-xs text-xs font-semibold text-forest hover:bg-sand/30 transition-colors"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-ivory/60 p-3 rounded-xs text-xs space-y-1">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-muted-gray">
                    <span>
                      {item.product_name_snapshot} <span className="text-charcoal font-medium">× {item.quantity}</span>
                    </span>
                    <span className="text-charcoal font-medium">{formatCurrency(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-muted-gray space-y-4">
          <Package className="w-10 h-10 text-muted-gray mx-auto opacity-50" />
          <p className="font-serif text-base text-charcoal">No orders placed yet</p>
          <p className="max-w-xs mx-auto">
            Once you complete a purchase, your tracking details and receipts will appear here.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
