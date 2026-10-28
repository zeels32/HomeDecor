'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, Order } from '@/types';
import { useAuth } from '@/features/auth/auth-context';
import { createClient } from '@/lib/supabase/client';

interface OrdersContextType {
  orders: Order[];
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Promise<Address>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => Promise<Order>;
  getOrderById: (orderIdOrNumber: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Load orders and addresses from Supabase
  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient();
      if (!supabase) return;

      if (user?.id) {
        // Fetch customer addresses
        const { data: addressRows } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (addressRows) {
          setAddresses(
            addressRows.map((a: any) => ({
              id: a.id,
              user_id: a.user_id,
              full_name: a.full_name,
              phone: a.phone,
              address_line_1: a.address_line_1,
              address_line_2: a.address_line_2 || undefined,
              city: a.city,
              state: a.state,
              postal_code: a.postal_code,
              country: a.country,
              is_default: Boolean(a.is_default),
            }))
          );
        }

        // Fetch customer orders
        const { data: orderRows } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (orderRows) {
          setOrders(
            orderRows.map((o: any) => ({
              id: o.id,
              user_id: o.user_id,
              order_number: o.order_number,
              email: o.email || o.shipping_address_snapshot?.email || user.email || '',
              phone: o.phone || o.shipping_address_snapshot?.phone || '',
              status: o.status,
              subtotal: Number(o.subtotal),
              shipping_amount: Number(o.shipping_amount),
              discount_amount: Number(o.discount_amount || 0),
              tax_amount: Number(o.tax_amount || 0),
              total_amount: Number(o.total_amount),
              currency: o.currency || 'INR',
              shipping_address_snapshot: o.shipping_address_snapshot,
              billing_address_snapshot: o.billing_address_snapshot,
              payment_provider: o.payment_provider || 'Razorpay',
              payment_status: o.payment_status || 'paid',
              created_at: o.created_at,
              items: (o.items || []).map((it: any) => ({
                id: it.id,
                order_id: it.order_id,
                product_id: it.product_id,
                variant_id: it.variant_id,
                product_name_snapshot: it.product_name_snapshot,
                sku_snapshot: it.sku_snapshot,
                variant_snapshot: it.variant_snapshot,
                unit_price: Number(it.unit_price),
                quantity: Number(it.quantity),
                line_total: Number(it.line_total),
              })),
            }))
          );
        }
      } else {
        setOrders([]);
        setAddresses([]);
      }
    }

    loadUserData();
  }, [user?.id, user?.email]);

  const addAddress = async (addressData: Omit<Address, 'id'>): Promise<Address> => {
    const supabase = createClient();
    const isFirst = addresses.length === 0;
    const shouldBeDefault = isFirst || !!addressData.is_default;

    if (supabase && user?.id) {
      if (shouldBeDefault) {
        await (supabase as any)
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      const { data, error } = await (supabase as any)
        .from('addresses')
        .insert([
          {
            user_id: user.id,
            full_name: addressData.full_name,
            phone: addressData.phone,
            address_line_1: addressData.address_line_1,
            address_line_2: addressData.address_line_2 || null,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.postal_code,
            country: addressData.country,
            is_default: shouldBeDefault,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const created: Address = {
          id: data.id,
          user_id: data.user_id,
          full_name: data.full_name,
          phone: data.phone,
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2 || undefined,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
          is_default: Boolean(data.is_default),
        };

        setAddresses((prev) => {
          const list = shouldBeDefault ? prev.map((a) => ({ ...a, is_default: false })) : prev;
          return [...list, created];
        });

        return created;
      }
    }

    const fallback: Address = {
      ...addressData,
      id: 'addr_' + Date.now(),
      user_id: user?.id,
      is_default: shouldBeDefault,
    };
    setAddresses((prev) => [...prev, fallback]);
    return fallback;
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    const supabase = createClient();
    if (supabase && user?.id) {
      if (addressData.is_default) {
        await (supabase as any)
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }

      await (supabase as any)
        .from('addresses')
        .update({
          full_name: addressData.full_name,
          phone: addressData.phone,
          address_line_1: addressData.address_line_1,
          address_line_2: addressData.address_line_2 || null,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country,
          is_default: addressData.is_default,
        })
        .eq('id', id);
    }

    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...addressData };
        }
        if (addressData.is_default) {
          return { ...a, is_default: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = async (id: string) => {
    const supabase = createClient();
    if (supabase) {
      await (supabase as any).from('addresses').delete().eq('id', id);
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = async (id: string) => {
    const supabase = createClient();
    if (supabase && user?.id) {
      await (supabase as any)
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      await (supabase as any)
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);
    }

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        is_default: a.id === id,
      }))
    );
  };

  const createOrder = async (
    orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>
  ): Promise<Order> => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `TF-${new Date().getFullYear()}-${randomHex}`;

    const supabase = createClient();
    let createdOrderId = 'ord_' + Date.now();

    if (supabase) {
      try {
        const { data: orderRow, error: orderErr } = await (supabase as any)
          .from('orders')
          .insert([
            {
              order_number: orderNumber,
              user_id: user?.id || null,
              email: orderData.email,
              phone: orderData.phone,
              status: orderData.status || 'processing',
              payment_status: orderData.payment_status || 'paid',
              subtotal: orderData.subtotal,
              shipping_amount: orderData.shipping_amount,
              discount_amount: orderData.discount_amount || 0,
              tax_amount: orderData.tax_amount || 0,
              total_amount: orderData.total_amount,
              currency: orderData.currency || 'INR',
              shipping_address_snapshot: orderData.shipping_address_snapshot,
              billing_address_snapshot: orderData.billing_address_snapshot || null,
              payment_provider: orderData.payment_provider || 'Razorpay',
            },
          ])
          .select()
          .single();

        if (!orderErr && orderRow) {
          createdOrderId = orderRow.id;

          // Insert order items
          if (orderData.items && orderData.items.length > 0) {
            const itemsToInsert = orderData.items.map((it) => ({
              order_id: createdOrderId,
              product_id: it.product_id,
              variant_id: it.variant_id || null,
              product_name_snapshot: it.product_name_snapshot,
              sku_snapshot: it.sku_snapshot || null,
              variant_snapshot: it.variant_snapshot || null,
              unit_price: it.unit_price,
              quantity: it.quantity,
              line_total: it.line_total,
            }));

            await (supabase as any).from('order_items').insert(itemsToInsert);
          }
        }
      } catch (e) {
        console.error('Failed to save order to Supabase:', e);
      }
    }

    const newOrder: Order = {
      ...orderData,
      id: createdOrderId,
      order_number: orderNumber,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderIdOrNumber: string): Order | undefined => {
    return orders.find(
      (o) => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
