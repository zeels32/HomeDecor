'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { formatCurrency } from '@/lib/pricing';

export function AdminDashboardView() {
  const { stats, orders, products, updateStock, isLoading } = useAdmin();

  if (isLoading && !stats) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="inline-block animate-spin w-8 h-8 border-2 border-forest border-t-transparent rounded-full" />
        <p className="text-xs text-muted-gray">Loading commerce analytics...</p>
      </div>
    );
  }

  const orderStats = stats?.ordersByStatus || {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const lowStockItems = stats?.lowStockProducts || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
            Store Performance & Operations
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Real-time telemetry across orders, artisan inventory, customer accounts, and fulfillment.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/admin/products?new=true"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Product</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-sand-100 hover:bg-sand-200 text-charcoal text-xs font-semibold rounded-xs transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Review Orders</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted-gray">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-forest-50 text-forest flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-semibold text-charcoal">
            {formatCurrency(stats?.totalRevenue || 0)}
          </p>
          <div className="flex items-center space-x-1.5 text-[11px] text-forest font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{stats?.ordersCount || 0} lifetime orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted-gray">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Orders Count</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-semibold text-charcoal">
            {stats?.ordersCount || 0}
          </p>
          <p className="text-[11px] text-muted-gray">
            Avg Order Value: <strong>{formatCurrency(stats?.averageOrderValue || 0)}</strong>
          </p>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted-gray">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Live Catalog</span>
            <div className="w-8 h-8 rounded-full bg-sand-100 text-charcoal flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-serif font-semibold text-charcoal">
            {stats?.totalProducts || products.length}
          </p>
          <p className="text-[11px] text-muted-gray">
            Across handcrafted collections
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft space-y-2">
          <div className="flex items-center justify-between text-muted-gray">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Low Stock SKUs</span>
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-serif font-semibold ${
            (stats?.lowStockCount || 0) > 0 ? 'text-amber-600' : 'text-charcoal'
          }`}>
            {stats?.lowStockCount || 0}
          </p>
          <p className="text-[11px] text-muted-gray">
            Threshold ≤ 10 units in warehouse
          </p>
        </div>
      </div>

      {/* Fulfillment Pipeline Breakdown */}
      <div className="bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-serif text-lg font-semibold text-charcoal">
              Order Fulfillment Pipeline
            </h2>
            <p className="text-xs text-muted-gray mt-0.5">
              Live status across all received customer orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xs">
            <div className="flex items-center space-x-1.5 text-amber-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending</span>
            </div>
            <p className="text-xl font-serif font-semibold text-charcoal mt-1">
              {orderStats.pending}
            </p>
            <p className="text-[10px] text-muted-gray">Awaiting confirmation</p>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xs">
            <div className="flex items-center space-x-1.5 text-blue-800 text-xs font-semibold">
              <Package className="w-3.5 h-3.5" />
              <span>Processing</span>
            </div>
            <p className="text-xl font-serif font-semibold text-charcoal mt-1">
              {orderStats.processing}
            </p>
            <p className="text-[10px] text-muted-gray">Packing & workshop QC</p>
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-xs">
            <div className="flex items-center space-x-1.5 text-purple-800 text-xs font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Shipped</span>
            </div>
            <p className="text-xl font-serif font-semibold text-charcoal mt-1">
              {orderStats.shipped}
            </p>
            <p className="text-[10px] text-muted-gray">In white-glove transit</p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xs">
            <div className="flex items-center space-x-1.5 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Delivered</span>
            </div>
            <p className="text-xl font-serif font-semibold text-charcoal mt-1">
              {orderStats.delivered}
            </p>
            <p className="text-[10px] text-muted-gray">Completed orders</p>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xs">
            <div className="flex items-center space-x-1.5 text-muted-gray text-xs font-semibold">
              <span>Cancelled</span>
            </div>
            <p className="text-xl font-serif font-semibold text-charcoal mt-1">
              {orderStats.cancelled}
            </p>
            <p className="text-[10px] text-muted-gray">Refunded or voided</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Low Inventory Restock & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
          <div className="flex justify-between items-center border-b border-subtle-border pb-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Recent Orders
              </h2>
              <p className="text-xs text-muted-gray">Last transactions across all customers</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-forest hover:underline"
            >
              Open Orders Hub →
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="divide-y divide-subtle-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-muted-gray font-semibold">
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-sand-50/50">
                      <td className="py-3 font-mono font-medium text-charcoal">
                        {o.order_number}
                      </td>
                      <td className="py-3">
                        <p className="font-medium text-charcoal leading-tight">
                          {o.shipping_address_snapshot?.full_name || 'Customer'}
                        </p>
                        <p className="text-[10px] text-muted-gray">{o.email}</p>
                      </td>
                      <td className="py-3 font-semibold text-charcoal">
                        {formatCurrency(o.total_amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            o.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : o.status === 'shipped'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : o.status === 'processing'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : o.status === 'cancelled'
                              ? 'bg-gray-100 text-gray-700 border border-gray-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders?inspect=${o.id}`}
                          className="text-forest hover:underline font-semibold text-[11px]"
                        >
                          Fulfill →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted-gray">
              No orders placed yet. Place a test order via the storefront checkout.
            </div>
          )}
        </div>

        {/* Right Column: Low Inventory Fast Restock Widget */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-subtle-border shadow-soft space-y-4">
          <div className="flex justify-between items-center border-b border-subtle-border pb-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Inventory Alerts
              </h2>
              <p className="text-xs text-muted-gray">SKUs requiring stock replenishment</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-forest hover:underline"
            >
              All SKUs →
            </Link>
          </div>

          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-sand-50/50 border border-subtle-border rounded-xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-charcoal truncate">{prod.name}</p>
                    <p className="text-[10px] text-muted-gray">
                      SKU: <span className="font-mono">{prod.sku || 'N/A'}</span> • Current:{' '}
                      <strong className={prod.stock_quantity === 0 ? 'text-red-600' : 'text-amber-600'}>
                        {prod.stock_quantity} units
                      </strong>
                    </p>
                  </div>

                  {/* Fast restock buttons */}
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateStock(prod.id, prod.stock_quantity + 5)}
                      className="px-2 py-1 bg-white border border-subtle-border hover:border-forest text-[10px] font-semibold text-charcoal rounded-xs transition-colors"
                      title="Add 5 units to stock"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateStock(prod.id, prod.stock_quantity + 10)}
                      className="px-2 py-1 bg-forest hover:bg-forest-light text-[10px] font-semibold text-white rounded-xs transition-colors"
                      title="Add 10 units to stock"
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-muted-gray space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-charcoal">All inventory is healthy</p>
              <p className="text-[11px]">No items currently below minimum threshold of 10 units.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
