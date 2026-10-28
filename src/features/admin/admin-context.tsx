'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AdminProduct,
  AdminOrder,
  AdminUser,
  AdminCategory,
  AdminReview,
  AdminStats,
  StoreSettings,
  ProductFormData,
  CategoryFormData,
  UserCreateFormData,
} from './types';
import { AdminService } from './admin-service';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'users'
  | 'categories'
  | 'reviews'
  | 'settings';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AdminContextType {
  // Data
  products: AdminProduct[];
  orders: AdminOrder[];
  users: AdminUser[];
  categories: AdminCategory[];
  reviews: AdminReview[];
  settings: StoreSettings;
  stats: AdminStats | null;

  // State
  isLoading: boolean;
  isSaving: boolean;
  activeTab: AdminTab;
  searchQuery: string;
  toasts: ToastNotification[];

  // Navigation & UI controls
  setActiveTab: (tab: AdminTab) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshAll: () => Promise<void>;

  // Products CRUD
  createProduct: (data: ProductFormData) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<boolean>;
  updateStock: (id: string, newStock: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Orders Fulfillment
  updateOrderStatus: (id: string, status: AdminOrder['status']) => Promise<boolean>;
  updatePaymentStatus: (id: string, payment_status: AdminOrder['payment_status']) => Promise<boolean>;

  // Users & Staff
  createUser: (data: UserCreateFormData) => Promise<boolean>;
  updateUserRole: (userId: string, is_admin: boolean) => Promise<boolean>;

  // Categories CRUD
  createCategory: (data: CategoryFormData) => Promise<boolean>;
  updateCategory: (id: string, data: Partial<CategoryFormData>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Reviews Moderation
  toggleReviewPublish: (id: string, is_published: boolean) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;

  // Settings
  updateSettings: (settings: StoreSettings) => Promise<boolean>;

  // Data Exports
  exportProductsCSV: () => void;
  exportOrdersCSV: () => void;
}

const defaultSettings: StoreSettings = {
  brand_info: {
    name: 'Terra & Form',
    tagline: 'Modern Curated Home Decor',
    support_email: 'concierge@terraandform.com',
    phone: '+91 (080) 4123-8899',
  },
  shipping_policy: {
    free_shipping_threshold: 2999,
    standard_shipping_rate: 199,
    currency: 'INR',
  },
  announcement: {
    text: 'Thoughtfully chosen pieces for beautiful spaces. Complimentary delivery across India.',
    enabled: true,
  },
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const computeStatsFallback = (prods: AdminProduct[], ords: AdminOrder[]): AdminStats => {
    const totalRev = ords
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const dayMap = new Map<string, { revenue: number; orders: number }>();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap.set(key, { revenue: 0, orders: 0 });
    }

    ords.forEach((o) => {
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dayMap.has(key) && o.status !== 'cancelled') {
        const item = dayMap.get(key)!;
        item.revenue += o.total_amount;
        item.orders += 1;
      }
    });

    return {
      totalRevenue: totalRev,
      ordersCount: ords.length,
      averageOrderValue: ords.length > 0 ? Math.round(totalRev / ords.length) : 0,
      totalProducts: prods.length,
      lowStockCount: prods.filter((p) => p.stock_quantity <= 10 && p.stock_quantity > 0).length,
      outOfStockCount: prods.filter((p) => p.stock_quantity === 0).length,
      totalUsers: Math.max(users.length, 1),
      publishedReviewsCount: reviews.filter((r) => r.is_published).length,
      ordersByStatus: {
        pending: ords.filter((o) => o.status === 'pending').length,
        processing: ords.filter((o) => o.status === 'processing').length,
        shipped: ords.filter((o) => o.status === 'shipped').length,
        delivered: ords.filter((o) => o.status === 'delivered').length,
        cancelled: ords.filter((o) => o.status === 'cancelled').length,
      },
      revenueByDay: Array.from(dayMap.entries()).map(([date, val]) => ({
        date,
        revenue: val.revenue,
        orders: val.orders,
      })),
      recentOrders: ords.slice(0, 5),
      lowStockProducts: prods.filter((p) => p.stock_quantity <= 10).slice(0, 6),
    };
  };

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pData, oData, uData, cData, rData, sData, statsData] = await Promise.all([
        AdminService.getProducts(),
        AdminService.getOrders(),
        AdminService.getUsers(),
        AdminService.getCategories(),
        AdminService.getReviews(),
        AdminService.getSettings(),
        AdminService.getStats(),
      ]);

      setProducts(pData);
      setOrders(oData);
      setUsers(uData);
      setCategories(cData);
      setReviews(rData);
      if (sData) setSettings(sData);

      if (statsData) {
        setStats(statsData);
      } else {
        setStats(computeStatsFallback(pData, oData));
      }
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast('Error syncing administrative data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Product CRUD
  const createProduct = async (data: ProductFormData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const created = await AdminService.createProduct(data);
      setProducts((prev) => [created, ...prev]);
      showToast(`Product "${created.name}" created successfully`);
      await refreshAll();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to create product', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<boolean> => {
    setIsSaving(true);
    try {
      const updated = await AdminService.updateProduct(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
      showToast(`Product updated successfully`);
      await refreshAll();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update product', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    const valid = Math.max(0, newStock);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock_quantity: valid } : p))
    );
    try {
      await AdminService.updateStock(id, valid);
      showToast(`Stock updated to ${valid} units`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
      await refreshAll();
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      await AdminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product deleted successfully');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Orders Fulfillment
  const updateOrderStatus = async (
    id: string,
    status: AdminOrder['status']
  ): Promise<boolean> => {
    setIsSaving(true);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await AdminService.updateOrderStatus(id, status);
      showToast(`Order status updated to "${status}"`);
      await refreshAll();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
      await refreshAll();
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePaymentStatus = async (
    id: string,
    payment_status: AdminOrder['payment_status']
  ): Promise<boolean> => {
    setIsSaving(true);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, payment_status } : o)));
    try {
      await AdminService.updatePaymentStatus(id, payment_status);
      showToast(`Payment marked as "${payment_status}"`);
      await refreshAll();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update payment status', 'error');
      await refreshAll();
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Users & Staff
  const createUser = async (data: UserCreateFormData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const created = await AdminService.createUser(data);
      setUsers((prev) => [created, ...prev]);
      showToast(`Account "${created.full_name}" created with ${created.is_admin ? 'Admin' : 'Customer'} role`);
      await refreshAll();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to create user account', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateUserRole = async (userId: string, is_admin: boolean): Promise<boolean> => {
    setIsSaving(true);
    try {
      await AdminService.updateUser(userId, { is_admin });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_admin } : u))
      );
      showToast(`User role updated to ${is_admin ? 'Administrator' : 'Customer'}`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update user', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Categories CRUD
  const createCategory = async (data: CategoryFormData): Promise<boolean> => {
    setIsSaving(true);
    try {
      const created = await AdminService.createCategory(data);
      setCategories((prev) => [...prev, created]);
      showToast(`Category "${created.name}" created`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to create category', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategory = async (
    id: string,
    data: Partial<CategoryFormData>
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const updated = await AdminService.updateCategory(id, data);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      showToast(`Category updated`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update category', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      await AdminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Category deleted');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Reviews Moderation
  const toggleReviewPublish = async (id: string, is_published: boolean): Promise<boolean> => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_published } : r))
    );
    try {
      await AdminService.toggleReviewPublish(id, is_published);
      showToast(`Review ${is_published ? 'published' : 'hidden'}`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update review', 'error');
      await refreshAll();
      return false;
    }
  };

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      await AdminService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast('Review removed');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to remove review', 'error');
      return false;
    }
  };

  // Settings
  const updateSettings = async (newSettings: StoreSettings): Promise<boolean> => {
    setIsSaving(true);
    try {
      await AdminService.updateSettings(newSettings);
      setSettings(newSettings);
      showToast('Store settings saved successfully');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Exports
  const exportProductsCSV = () => {
    const headers = [
      'ID',
      'Name',
      'SKU',
      'Category',
      'Base Price',
      'Compare At Price',
      'Stock Quantity',
      'Active Status',
      'Featured',
      'Material',
      'Color',
    ];
    const rows = products.map((p) => [
      p.id,
      p.name,
      p.sku || '',
      p.category?.name || '',
      p.base_price,
      p.compare_at_price || '',
      p.stock_quantity,
      p.is_active ? 'Active' : 'Draft',
      p.is_featured ? 'Yes' : 'No',
      p.material || '',
      p.color || '',
    ]);
    AdminService.downloadCSV('products_catalog', headers, rows);
    showToast('Exported product catalog to CSV');
  };

  const exportOrdersCSV = () => {
    const headers = [
      'Order Number',
      'Date',
      'Customer Email',
      'Customer Name',
      'Status',
      'Payment Status',
      'Items Count',
      'Subtotal',
      'Shipping',
      'Total Amount',
      'Destination City',
    ];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString(),
      o.email,
      o.shipping_address_snapshot.full_name,
      o.status,
      o.payment_status,
      o.items?.length || 0,
      o.subtotal,
      o.shipping_amount,
      o.total_amount,
      o.shipping_address_snapshot.city,
    ]);
    AdminService.downloadCSV('orders_report', headers, rows);
    showToast('Exported orders report to CSV');
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        users,
        categories,
        reviews,
        settings,
        stats,
        isLoading,
        isSaving,
        activeTab,
        searchQuery,
        toasts,
        setActiveTab,
        setSearchQuery,
        showToast,
        removeToast,
        refreshAll,
        createProduct,
        updateProduct,
        updateStock,
        deleteProduct,
        updateOrderStatus,
        updatePaymentStatus,
        createUser,
        updateUserRole,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleReviewPublish,
        deleteReview,
        updateSettings,
        exportProductsCSV,
        exportOrdersCSV,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
