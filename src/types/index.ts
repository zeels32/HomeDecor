export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string | null;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  name: string;
  options: Record<string, string>;
  price_override: number | null;
  compare_at_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  category?: Category;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  base_price: number;
  compare_at_price: number | null;
  sku: string | null;
  material: string | null;
  color: string | null;
  size_label: string | null;
  height: number | null;
  width: number | null;
  depth: number | null;
  diameter: number | null;
  weight: number | null;
  dimensions_unit: string;
  weight_unit: string;
  care_instructions: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  seo_title: string | null;
  seo_description: string | null;
  images: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  rating_summary?: {
    average_rating: number;
    review_count: number;
  };
}

export interface CartItem {
  id: string; // composite key: `${productId}_${variantId || 'base'}`
  product_id: string;
  variant_id?: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    image_url: string;
    stock_quantity: number;
    dimensions_unit?: string;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    options: Record<string, string>;
  } | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Address {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id?: string | null;
  product_name_snapshot: string;
  sku_snapshot: string | null;
  variant_snapshot?: Record<string, string> | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  email: string;
  phone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  currency: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address_snapshot: Address;
  billing_address_snapshot?: Address | null;
  payment_provider: string;
  payment_reference?: string | null;
  created_at: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  color?: string;
  inStockOnly?: boolean;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  query?: string;
}
