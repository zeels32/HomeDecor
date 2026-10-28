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
} from './types';

export class AdminService {
  /**
   * Fetch all products
   */
  static async getProducts(): Promise<AdminProduct[]> {
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.error('AdminService.getProducts error:', err);
      return [];
    }
  }

  /**
   * Create new product
   */
  static async createProduct(formData: ProductFormData): Promise<AdminProduct> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    const data = await res.json();
    return data.product;
  }

  /**
   * Update existing product
   */
  static async updateProduct(id: string, formData: Partial<ProductFormData>): Promise<AdminProduct> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    const data = await res.json();
    return data.product;
  }

  /**
   * Update quick stock
   */
  static async updateStock(id: string, newStock: number): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_quantity: Math.max(0, newStock) }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update stock');
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
  }

  /**
   * Fetch all orders
   */
  static async getOrders(): Promise<AdminOrder[]> {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders || [];
    } catch (err) {
      console.error('AdminService.getOrders error:', err);
      return [];
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string,
    status: AdminOrder['status']
  ): Promise<AdminOrder> {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    const data = await res.json();
    return data.order;
  }

  /**
   * Update order payment status
   */
  static async updatePaymentStatus(
    orderId: string,
    payment_status: AdminOrder['payment_status']
  ): Promise<AdminOrder> {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update payment status');
    }
    const data = await res.json();
    return data.order;
  }

  /**
   * Fetch all users
   */
  static async getUsers(): Promise<AdminUser[]> {
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      return data.users || [];
    } catch (err) {
      console.error('AdminService.getUsers error:', err);
      return [];
    }
  }

  /**
   * Update user role / profile
   */
  static async updateUser(
    userId: string,
    payload: { is_admin?: boolean; full_name?: string; phone?: string }
  ): Promise<void> {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...payload }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user profile');
    }
  }

  /**
   * Fetch categories
   */
  static async getCategories(): Promise<AdminCategory[]> {
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories || [];
    } catch (err) {
      console.error('AdminService.getCategories error:', err);
      return [];
    }
  }

  /**
   * Create category
   */
  static async createCategory(formData: CategoryFormData): Promise<AdminCategory> {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create category');
    }
    const data = await res.json();
    return data.category;
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    formData: Partial<CategoryFormData>
  ): Promise<AdminCategory> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update category');
    }
    const data = await res.json();
    return data.category;
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete category');
    }
  }

  /**
   * Fetch reviews
   */
  static async getReviews(): Promise<AdminReview[]> {
    try {
      const res = await fetch('/api/admin/reviews', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      return data.reviews || [];
    } catch (err) {
      console.error('AdminService.getReviews error:', err);
      return [];
    }
  }

  /**
   * Toggle review publish status
   */
  static async toggleReviewPublish(id: string, is_published: boolean): Promise<void> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update review');
    }
  }

  /**
   * Delete review
   */
  static async deleteReview(id: string): Promise<void> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete review');
    }
  }

  /**
   * Fetch site settings
   */
  static async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      return data.settings;
    } catch (err) {
      console.error('AdminService.getSettings error:', err);
      return {
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
          text: 'Thoughtfully chosen pieces for beautiful spaces.',
          enabled: true,
        },
      };
    }
  }

  /**
   * Save site settings
   */
  static async updateSettings(settings: StoreSettings): Promise<void> {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save settings');
    }
  }

  /**
   * Fetch dashboard stats
   */
  static async getStats(): Promise<AdminStats | null> {
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.stats;
    } catch (err) {
      console.error('AdminService.getStats error:', err);
      return null;
    }
  }

  /**
   * Utility: Download array as CSV file in browser
   */
  static downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
