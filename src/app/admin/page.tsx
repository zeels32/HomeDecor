'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Check,
  ChevronRight,
  Search,
} from 'lucide-react';
import { getProducts } from '@/lib/data/products';
import { createClient } from '@/lib/supabase/client';
import { useOrders } from '@/features/orders/orders-context';
import { formatCurrency } from '@/lib/pricing';
import { Product } from '@/types';

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'orders'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      const items = await getProducts();
      setProducts(items);
      setIsLoading(false);
    }
    loadCatalog();
  }, []);

  // Total stock & out of stock calculation
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0),
    0
  );
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const lowStockCount = products.filter((p) => p.stock_quantity <= 10).length;

  const handleStockUpdate = async (productId: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock_quantity: validStock } : p))
    );

    const supabase = createClient();
    if (supabase) {
      await (supabase as any)
        .from('products')
        .update({ stock_quantity: validStock })
        .eq('id', productId);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft">
          <p className="text-xs text-muted-gray uppercase font-semibold">Total Revenue</p>
          <p className="text-2xl font-serif font-semibold text-charcoal mt-1">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[11px] text-forest font-medium mt-1">From {orders.length} orders</p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft">
          <p className="text-xs text-muted-gray uppercase font-semibold">Active Catalog SKUs</p>
          <p className="text-2xl font-serif font-semibold text-charcoal mt-1">
            {products.length}
          </p>
          <p className="text-[11px] text-muted-gray mt-1">Across 6 categories</p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft">
          <p className="text-xs text-muted-gray uppercase font-semibold">Low Stock Items</p>
          <p className="text-2xl font-serif font-semibold text-amber-600 mt-1">
            {lowStockCount}
          </p>
          <p className="text-[11px] text-muted-gray mt-1">Stock ≤ 10 units</p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-subtle-border shadow-soft">
          <p className="text-xs text-muted-gray uppercase font-semibold">Pieces Dispatched</p>
          <p className="text-2xl font-serif font-semibold text-forest mt-1">
            {totalItemsSold}
          </p>
          <p className="text-[11px] text-muted-gray mt-1">White-glove delivery</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-sm border border-subtle-border shadow-soft overflow-hidden">
        <div className="flex border-b border-subtle-border">
          <button
            onClick={() => setSelectedTab('inventory')}
            className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              selectedTab === 'inventory'
                ? 'border-forest text-forest bg-sand-50/50'
                : 'border-transparent text-muted-gray hover:text-charcoal'
            }`}
          >
            Inventory & Catalog Management ({products.length})
          </button>
          <button
            onClick={() => setSelectedTab('orders')}
            className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              selectedTab === 'orders'
                ? 'border-forest text-forest bg-sand-50/50'
                : 'border-transparent text-muted-gray hover:text-charcoal'
            }`}
          >
            Orders & Fulfillment ({orders.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY & CATALOG */}
        {selectedTab === 'inventory' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title or SKU..."
                  className="w-full pl-8 pr-3 py-2 bg-ivory border border-subtle-border rounded-xs text-xs focus:outline-none focus:border-forest"
                />
                <Search className="w-3.5 h-3.5 text-muted-gray absolute left-2.5 top-2.5" />
              </div>
              <p className="text-xs text-muted-gray">
                Real-time inventory levels. Updates affect checkout stock validations immediately.
              </p>
            </div>

            <div className="overflow-x-auto border border-subtle-border rounded-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand-50 border-b border-subtle-border text-[11px] font-semibold text-charcoal uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-ivory/50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-9 h-11 rounded-xs overflow-hidden bg-sand/30 flex-shrink-0">
                            {p.images[0]?.image_url && (
                              <Image
                                src={p.images[0].image_url}
                                alt={p.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="font-medium text-charcoal hover:text-forest"
                            >
                              {p.name}
                            </Link>
                            {p.is_featured && (
                              <span className="ml-2 text-[9px] bg-forest-50 text-forest px-1.5 py-0.5 rounded font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-muted-gray">{p.sku}</td>
                      <td className="p-3 text-muted-gray">{p.category?.name || 'Decor'}</td>
                      <td className="p-3 font-semibold text-charcoal">
                        {formatCurrency(p.base_price)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={p.stock_quantity}
                            onChange={(e) => handleStockUpdate(p.id, Number(e.target.value))}
                            className="w-16 p-1 border border-subtle-border rounded-xs text-center font-semibold bg-white"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        {p.stock_quantity > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                            Sold Out
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {selectedTab === 'orders' && (
          <div className="p-6 space-y-4">
            {orders.length > 0 ? (
              <div className="overflow-x-auto border border-subtle-border rounded-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-50 border-b border-subtle-border text-[11px] font-semibold text-charcoal uppercase">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Destination</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-subtle-border">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-ivory/50">
                        <td className="p-3 font-serif font-semibold text-charcoal">
                          {o.order_number}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-charcoal">{o.shipping_address_snapshot.full_name}</p>
                          <p className="text-muted-gray text-[10px]">{o.email}</p>
                        </td>
                        <td className="p-3 text-muted-gray">
                          {o.shipping_address_snapshot.city}, {o.shipping_address_snapshot.state}
                        </td>
                        <td className="p-3 font-medium text-charcoal">
                          {o.items?.length || 1} pieces
                        </td>
                        <td className="p-3 font-semibold text-charcoal">
                          {formatCurrency(o.total_amount)}
                        </td>
                        <td className="p-3">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/account/orders/${o.id}`}
                            className="text-forest hover:underline font-semibold"
                          >
                            Inspect →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-gray">
                No orders have been received yet. Test by placing a test order via checkout.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
