import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    // 1. Fetch products
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, sku, base_price, stock_quantity, is_active, images:product_images(image_url)')
      .order('stock_quantity', { ascending: true });

    // 2. Fetch orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    // 3. Fetch reviews count
    const { count: reviewsCount } = await (supabase as any)
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true);

    // 4. Fetch users count
    const { count: usersCount } = await (supabase as any)
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const prodList = products || [];
    const orderList = orders || [];

    const totalRevenue = orderList
      .filter((o: any) => o.status !== 'cancelled')
      .reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

    const ordersCount = orderList.length;
    const averageOrderValue = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;

    const lowStockProducts = prodList.filter((p: any) => p.stock_quantity <= 10 && p.stock_quantity > 0);
    const outOfStockProducts = prodList.filter((p: any) => p.stock_quantity === 0);

    const ordersByStatus = {
      pending: orderList.filter((o: any) => o.status === 'pending').length,
      processing: orderList.filter((o: any) => o.status === 'processing').length,
      shipped: orderList.filter((o: any) => o.status === 'shipped').length,
      delivered: orderList.filter((o: any) => o.status === 'delivered').length,
      cancelled: orderList.filter((o: any) => o.status === 'cancelled').length,
    };

    // Revenue by day (last 7 days)
    const dayMap = new Map<string, { revenue: number; orders: number }>();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap.set(key, { revenue: 0, orders: 0 });
    }

    orderList.forEach((o: any) => {
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dayMap.has(key) && o.status !== 'cancelled') {
        const item = dayMap.get(key)!;
        item.revenue += Number(o.total_amount || 0);
        item.orders += 1;
      }
    });

    const revenueByDay = Array.from(dayMap.entries()).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      orders: val.orders,
    }));

    return NextResponse.json({
      stats: {
        totalRevenue,
        ordersCount,
        averageOrderValue,
        totalProducts: prodList.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        totalUsers: Math.max(usersCount || 0, 1),
        publishedReviewsCount: reviewsCount || 0,
        ordersByStatus,
        revenueByDay,
        recentOrders: orderList.slice(0, 5),
        lowStockProducts: prodList.filter((p: any) => p.stock_quantity <= 10).slice(0, 6),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to compute stats' }, { status: 500 });
  }
}
