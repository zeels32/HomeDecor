'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  FileDown,
  Filter,
  Eye,
  Printer,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  X,
  CreditCard,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { useAdmin } from '../admin-context';
import { AdminOrder } from '../types';
import { formatCurrency } from '@/lib/pricing';
import { PackingSlipModal } from './packing-slip-modal';

export function AdminOrdersView() {
  const searchParams = useSearchParams();
  const { orders, updateOrderStatus, updatePaymentStatus, exportOrdersCSV, isSaving } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid' | 'refunded'>('all');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [packingSlipOrder, setPackingSlipOrder] = useState<AdminOrder | null>(null);

  // Check URL query param ?inspect=orderId
  useEffect(() => {
    const inspectId = searchParams.get('inspect');
    if (inspectId && orders.length > 0) {
      const found = orders.find((o) => o.id === inspectId || o.order_number === inspectId);
      if (found) setSelectedOrder(found);
    }
  }, [searchParams, orders]);

  // Counts for tabs
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      o.order_number.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.shipping_address_snapshot.full_name?.toLowerCase().includes(q) ||
      o.shipping_address_snapshot.city?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Orders & Fulfillment Center
          </h1>
          <p className="text-xs text-muted-gray mt-0.5">
            Process incoming orders, track white-glove dispatch, issue packing slips, and manage payment states.
          </p>
        </div>

        <button
          onClick={exportOrdersCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-subtle-border hover:bg-ivory text-xs font-semibold text-charcoal rounded-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-sm border border-subtle-border shadow-soft overflow-hidden">
        <div className="flex overflow-x-auto border-b border-subtle-border bg-sand-50/50">
          {[
            { key: 'all', label: 'All Orders', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'processing', label: 'Processing', count: counts.processing },
            { key: 'shipped', label: 'In Transit', count: counts.shipped },
            { key: 'delivered', label: 'Delivered', count: counts.delivered },
            { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3.5 text-xs font-semibold uppercase tracking-wider border-b-2 -mb-px transition-colors whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'border-forest text-forest bg-white'
                  : 'border-transparent text-muted-gray hover:text-charcoal'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  statusFilter === tab.key
                    ? 'bg-forest-50 text-forest'
                    : 'bg-sand-200 text-muted-gray'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Secondary Filter */}
        <div className="p-4 border-b border-subtle-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by order number, customer name, email, city..."
              className="w-full pl-8 pr-3 py-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
            />
            <Search className="w-3.5 h-3.5 text-muted-gray absolute left-2.5 top-2.5" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-muted-gray hover:text-charcoal"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-muted-gray">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-subtle-border rounded-xs text-xs text-charcoal focus:outline-none focus:border-forest"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sand-50/70 border-b border-subtle-border text-[11px] font-semibold text-charcoal uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Order Number</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Destination</th>
                <th className="p-3.5">Pieces</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Fulfillment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-ivory/50 transition-colors">
                    {/* Order Number & Date */}
                    <td className="p-3.5">
                      <span className="font-mono font-semibold text-charcoal block">
                        {o.order_number}
                      </span>
                      <span className="text-[10px] text-muted-gray">
                        {new Date(o.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <p className="font-semibold text-charcoal">
                        {o.shipping_address_snapshot.full_name}
                      </p>
                      <p className="text-[10px] text-muted-gray truncate max-w-[180px]">
                        {o.email}
                      </p>
                    </td>

                    {/* Destination */}
                    <td className="p-3.5 text-muted-gray">
                      {o.shipping_address_snapshot.city}, {o.shipping_address_snapshot.state}
                    </td>

                    {/* Items */}
                    <td className="p-3.5 font-medium text-charcoal">
                      {o.items?.reduce((s, i) => s + i.quantity, 0) || o.items?.length || 1} items
                    </td>

                    {/* Total Amount */}
                    <td className="p-3.5 font-semibold text-charcoal">
                      {formatCurrency(o.total_amount)}
                    </td>

                    {/* Payment Status */}
                    <td className="p-3.5">
                      <span
                        className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          o.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.payment_status === 'refunded'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>

                    {/* Fulfillment Status */}
                    <td className="p-3.5">
                      <span
                        className={`capitalize px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : o.status === 'shipped'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : o.status === 'processing'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : o.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-700 border-gray-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1 bg-white border border-subtle-border hover:border-forest text-forest hover:text-forest-dark text-xs font-semibold rounded-xs transition-colors shadow-xs"
                        >
                          Fulfill →
                        </button>
                        <button
                          onClick={() => setPackingSlipOrder(o)}
                          title="Print packing slip & invoice"
                          className="p-1.5 text-muted-gray hover:text-charcoal transition-colors rounded-xs hover:bg-sand/30"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-xs text-muted-gray">
                    No orders matching this criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-sand-50/40 border-t border-subtle-border text-xs text-muted-gray">
          Showing {filteredOrders.length} of {orders.length} total orders
        </div>
      </div>

      {/* Order Detail & Fulfillment Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-sm border border-subtle-border shadow-elevated w-full max-w-3xl my-8 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-subtle-border bg-sand-50/70 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    Order {selectedOrder.order_number}
                  </h3>
                  <span
                    className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : selectedOrder.status === 'shipped'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : selectedOrder.status === 'processing'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : selectedOrder.status === 'cancelled'
                        ? 'bg-gray-100 text-gray-700 border-gray-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-muted-gray mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPackingSlipOrder(selectedOrder)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-subtle-border hover:bg-sand-50 text-xs font-semibold text-charcoal rounded-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Packing Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-muted-gray hover:text-charcoal rounded-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Status Update Progression Bar */}
              <div className="p-4 bg-sand-50/60 border border-subtle-border rounded-xs space-y-3">
                <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                  Fulfillment Status Workflow
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                    disabled={isSaving || selectedOrder.status === 'pending'}
                    className={`px-3 py-1.5 rounded-xs font-semibold text-xs transition-colors ${
                      selectedOrder.status === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white border border-subtle-border text-charcoal hover:bg-ivory'
                    }`}
                  >
                    Mark Pending
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={isSaving || selectedOrder.status === 'processing'}
                    className={`px-3 py-1.5 rounded-xs font-semibold text-xs transition-colors ${
                      selectedOrder.status === 'processing'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-subtle-border text-charcoal hover:bg-ivory'
                    }`}
                  >
                    Mark Processing (Packing)
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={isSaving || selectedOrder.status === 'shipped'}
                    className={`px-3 py-1.5 rounded-xs font-semibold text-xs transition-colors ${
                      selectedOrder.status === 'shipped'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white border border-subtle-border text-charcoal hover:bg-ivory'
                    }`}
                  >
                    Mark Shipped (In Transit)
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={isSaving || selectedOrder.status === 'delivered'}
                    className={`px-3 py-1.5 rounded-xs font-semibold text-xs transition-colors ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-forest text-white shadow-xs'
                        : 'bg-white border border-subtle-border text-charcoal hover:bg-ivory'
                    }`}
                  >
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={isSaving || selectedOrder.status === 'cancelled'}
                    className={`px-3 py-1.5 rounded-xs font-semibold text-xs transition-colors ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white border border-subtle-border text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-subtle-border rounded-xs space-y-2">
                  <div className="flex items-center space-x-2 text-forest font-semibold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>Shipping Address</span>
                  </div>
                  <div className="text-muted-gray space-y-0.5">
                    <p className="font-semibold text-charcoal">
                      {selectedOrder.shipping_address_snapshot.full_name}
                    </p>
                    <p>{selectedOrder.shipping_address_snapshot.address_line_1}</p>
                    {selectedOrder.shipping_address_snapshot.address_line_2 && (
                      <p>{selectedOrder.shipping_address_snapshot.address_line_2}</p>
                    )}
                    <p>
                      {selectedOrder.shipping_address_snapshot.city},{' '}
                      {selectedOrder.shipping_address_snapshot.state} —{' '}
                      {selectedOrder.shipping_address_snapshot.postal_code}
                    </p>
                    <p>{selectedOrder.shipping_address_snapshot.country || 'India'}</p>
                    <p className="font-mono text-charcoal pt-1">
                      Phone: {selectedOrder.shipping_address_snapshot.phone}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white border border-subtle-border rounded-xs space-y-2">
                  <div className="flex items-center space-x-2 text-forest font-semibold text-xs">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Information</span>
                  </div>
                  <div className="text-muted-gray space-y-1">
                    <p>
                      Provider:{' '}
                      <strong className="text-charcoal">{selectedOrder.payment_provider || 'Direct'}</strong>
                    </p>
                    <p>
                      Payment Status:{' '}
                      <strong className="capitalize text-forest">
                        {selectedOrder.payment_status}
                      </strong>
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        onClick={() => updatePaymentStatus(selectedOrder.id, 'paid')}
                        disabled={selectedOrder.payment_status === 'paid'}
                        className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold rounded-xs hover:bg-emerald-100 disabled:opacity-50"
                      >
                        Set Paid
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(selectedOrder.id, 'refunded')}
                        disabled={selectedOrder.payment_status === 'refunded'}
                        className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold rounded-xs hover:bg-amber-100 disabled:opacity-50"
                      >
                        Set Refunded
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="space-y-3">
                <p className="font-semibold text-charcoal uppercase tracking-wider text-[11px]">
                  Consigned Products ({selectedOrder.items?.length || 0})
                </p>
                <div className="border border-subtle-border rounded-xs overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-sand-50 border-b border-subtle-border text-[10px] font-bold uppercase text-charcoal">
                      <tr>
                        <th className="p-3">Piece</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-subtle-border">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((it) => (
                          <tr key={it.id}>
                            <td className="p-3">
                              <span className="font-semibold text-charcoal block">
                                {it.product_name_snapshot}
                              </span>
                              {it.variant_snapshot && (
                                <span className="text-[10px] text-muted-gray">
                                  {Object.entries(it.variant_snapshot)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(', ')}
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-muted-gray">
                              {it.sku_snapshot || '—'}
                            </td>
                            <td className="p-3 text-center font-bold">{it.quantity}</td>
                            <td className="p-3 text-right">{formatCurrency(it.unit_price)}</td>
                            <td className="p-3 text-right font-semibold text-charcoal">
                              {formatCurrency(it.line_total)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-muted-gray">
                            No individual item snapshots registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 p-3 bg-sand-50/50 rounded-xs border border-subtle-border">
                  <div className="flex justify-between text-muted-gray">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-gray">
                    <span>Shipping</span>
                    <span>{formatCurrency(selectedOrder.shipping_amount)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-forest">
                      <span>Discount</span>
                      <span>-{formatCurrency(selectedOrder.discount_amount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal font-bold text-sm pt-2 border-t border-subtle-border">
                    <span>Total Amount</span>
                    <span className="text-forest">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-subtle-border bg-sand-50/50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-charcoal hover:bg-forest text-white text-xs font-semibold rounded-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Packing Slip / Invoice Modal */}
      {packingSlipOrder && (
        <PackingSlipModal
          order={packingSlipOrder}
          onClose={() => setPackingSlipOrder(null)}
        />
      )}
    </div>
  );
}
