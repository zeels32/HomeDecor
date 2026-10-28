import { Product, ProductImage, ProductVariant, Order, OrderItem, Category, Review, Address } from '@/types';

export interface AdminProduct extends Product {
  variants?: ProductVariant[];
  images: ProductImage[];
  category?: Category;
}

export interface AdminOrder extends Order {
  items?: OrderItem[];
  shipping_address_snapshot: Address;
  billing_address_snapshot?: Address | null;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  is_admin: boolean;
  created_at: string;
  orders_count: number;
  total_spend: number;
  last_order_date?: string | null;
}

export interface AdminCategory extends Category {
  product_count?: number;
}

export interface AdminReview extends Review {
  product_name?: string;
  product_slug?: string;
  is_published: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  ordersCount: number;
  averageOrderValue: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalUsers: number;
  publishedReviewsCount: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  revenueByDay: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  recentOrders: AdminOrder[];
  lowStockProducts: AdminProduct[];
}

export interface StoreSettings {
  brand_info: {
    name: string;
    tagline: string;
    support_email: string;
    phone: string;
  };
  shipping_policy: {
    free_shipping_threshold: number;
    standard_shipping_rate: number;
    currency: string;
  };
  announcement: {
    text: string;
    enabled: boolean;
  };
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  category_id: string;
  sku: string;
  base_price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  short_description: string;
  description: string;
  material: string;
  color: string;
  size_label: string;
  height: number | null;
  width: number | null;
  depth: number | null;
  diameter: number | null;
  weight: number | null;
  dimensions_unit: string;
  weight_unit: string;
  care_instructions: string;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  images: {
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
  }[];
}

export interface CategoryFormData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}


export interface UserCreateFormData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  is_admin: boolean;
}
