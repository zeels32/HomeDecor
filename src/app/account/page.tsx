'use client';

import React from 'react';
import Link from 'next/link';
import { Package, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-context';
import { useOrders } from '@/features/orders/orders-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { formatCurrency } from '@/lib/pricing';

export default function AccountOverviewPage() {
  const { profile } = useAuth();
  const { orders, addresses } = useOrders();
  const { wishlistCount } = useWishlist();

  const recentOrders = orders.slice(0, 3);
  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-forest-50 text-forest flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-semibold text-charcoal">{orders.length}</p>
            <p className="text-xs text-muted-gray">Total Orders Placed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-sand-100 text-charcoal flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-semibold text-charcoal">{wishlistCount}</p>
            <p className="text-xs text-muted-gray">Saved in Wishlist</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-serif font-semibold text-charcoal">{addresses.length}</p>
            <p className="text-xs text-muted-gray">Saved Delivery Addresses</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
        <div className="flex justify-between items-center border-b border-subtle-border pb-3">
          <h2 className="font-serif text-lg font-medium text-charcoal">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-forest hover:underline">
            View All ({orders.length}) →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-subtle-border text-xs">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="font-semibold text-charcoal">{order.order_number}</p>
                  <p className="text-muted-gray">
                    Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 1} items
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-charcoal">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {order.status}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="text-forest hover:underline font-medium"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-gray space-y-2">
            <p>You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="inline-block text-forest font-semibold hover:underline"
            >
              Start Shopping the Collection →
            </Link>
          </div>
        )}
      </div>

      {/* Primary Saved Address Card */}
      <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
        <div className="flex justify-between items-center border-b border-subtle-border pb-3">
          <h2 className="font-serif text-lg font-medium text-charcoal">Primary Shipping Address</h2>
          <Link href="/account/addresses" className="text-xs font-semibold text-forest hover:underline">
            Manage Addresses →
          </Link>
        </div>

        {defaultAddress ? (
          <div className="text-xs text-charcoal space-y-1">
            <p className="font-semibold">{defaultAddress.full_name}</p>
            <p className="text-muted-gray">{defaultAddress.phone}</p>
            <p className="text-muted-gray">
              {defaultAddress.address_line_1}
              {defaultAddress.address_line_2 && `, ${defaultAddress.address_line_2}`}
            </p>
            <p className="text-muted-gray">
              {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postal_code}
            </p>
            <p className="text-muted-gray">{defaultAddress.country}</p>
          </div>
        ) : (
          <p className="text-xs text-muted-gray">No saved addresses yet.</p>
        )}
      </div>
    </div>
  );
}
