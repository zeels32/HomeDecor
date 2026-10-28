export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          base_price: number;
          compare_at_price?: number | null;
          sku?: string | null;
          material?: string | null;
          color?: string | null;
          size_label?: string | null;
          height?: number | null;
          width?: number | null;
          depth?: number | null;
          diameter?: number | null;
          weight?: number | null;
          dimensions_unit?: string;
          weight_unit?: string;
          care_instructions?: string | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          is_best_seller?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          sku?: string | null;
          material?: string | null;
          color?: string | null;
          size_label?: string | null;
          height?: number | null;
          width?: number | null;
          depth?: number | null;
          diameter?: number | null;
          weight?: number | null;
          dimensions_unit?: string;
          weight_unit?: string;
          care_instructions?: string | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          is_new_arrival?: boolean;
          is_best_seller?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string | null;
          name: string;
          options: Json;
          price_override: number | null;
          compare_at_price: number | null;
          stock_quantity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku?: string | null;
          name: string;
          options?: Json;
          price_override?: number | null;
          compare_at_price?: number | null;
          stock_quantity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string | null;
          name?: string;
          options?: Json;
          price_override?: number | null;
          compare_at_price?: number | null;
          stock_quantity?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
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
          shipping_address_snapshot: Json;
          billing_address_snapshot: Json | null;
          payment_provider: string;
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          email: string;
          phone: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded';
          currency?: string;
          subtotal: number;
          shipping_amount?: number;
          discount_amount?: number;
          tax_amount?: number;
          total_amount: number;
          shipping_address_snapshot: Json;
          billing_address_snapshot?: Json | null;
          payment_provider?: string;
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded';
          payment_reference?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name_snapshot: string;
          sku_snapshot: string | null;
          variant_snapshot: Json | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name_snapshot: string;
          sku_snapshot?: string | null;
          variant_snapshot?: Json | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          created_at?: string;
        };
        Update: {
          unit_price?: number;
          quantity?: number;
          line_total?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          order_item_id: string | null;
          author_name: string;
          rating: number;
          title: string | null;
          body: string;
          is_verified_purchase: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          order_item_id?: string | null;
          author_name?: string;
          rating: number;
          title?: string | null;
          body: string;
          is_verified_purchase?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          is_published?: boolean;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          status: string;
          consent_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          status?: string;
          consent_at?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_at?: string;
        };
      };
    };
  };
}
