import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabaseAdmin = getAdminClient();
    const fallbackSupabase = getPublicSupabase();
    const supabase = supabaseAdmin || fallbackSupabase;

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    // 1. Fetch profiles
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profError) {
      console.warn('Profiles query error:', profError);
    }

    // 2. Fetch auth users via admin client
    let authUsers: any[] = [];
    if (supabaseAdmin?.auth?.admin) {
      try {
        const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
        if (authData?.users) {
          authUsers = authData.users;
        }
      } catch (err) {
        console.warn('listUsers error:', err);
      }
    }

    // 3. Fetch all orders to compute stats per user
    const { data: orders } = await supabase
      .from('orders')
      .select('id, user_id, email, total_amount, created_at');

    const ordersList = orders || [];

    const profilesMap = new Map<string, any>();
    (profiles || []).forEach((p: any) => {
      profilesMap.set(p.id, p);
    });

    const combinedMap = new Map<string, any>();

    // Add all auth users
    authUsers.forEach((u) => {
      const prof = profilesMap.get(u.id);
      combinedMap.set(u.id, {
        id: u.id,
        email: u.email || prof?.email || '',
        full_name: prof?.full_name || u.user_metadata?.full_name || u.email?.split('@')[0] || 'Customer',
        phone: prof?.phone || u.phone || null,
        avatar_url: prof?.avatar_url || null,
        is_admin: Boolean(prof?.is_admin),
        created_at: u.created_at || prof?.created_at || new Date().toISOString(),
        orders_count: 0,
        total_spend: 0,
        last_order_date: null,
      });
    });

    // Add any profile not present in auth users
    (profiles || []).forEach((p: any) => {
      if (!combinedMap.has(p.id)) {
        combinedMap.set(p.id, {
          id: p.id,
          email: p.email || 'customer@terraandform.com',
          full_name: p.full_name || 'Customer',
          phone: p.phone || null,
          avatar_url: p.avatar_url || null,
          is_admin: Boolean(p.is_admin),
          created_at: p.created_at || new Date().toISOString(),
          orders_count: 0,
          total_spend: 0,
          last_order_date: null,
        });
      }
    });

    // Aggregate orders
    ordersList.forEach((o: any) => {
      if (o.user_id && combinedMap.has(o.user_id)) {
        const u = combinedMap.get(o.user_id);
        u.orders_count += 1;
        u.total_spend += Number(o.total_amount || 0);
        if (!u.last_order_date || new Date(o.created_at) > new Date(u.last_order_date)) {
          u.last_order_date = o.created_at;
        }
      } else if (o.email) {
        let found = Array.from(combinedMap.values()).find(
          (u) => u.email.toLowerCase() === o.email.toLowerCase()
        );
        if (found) {
          found.orders_count += 1;
          found.total_spend += Number(o.total_amount || 0);
          if (!found.last_order_date || new Date(o.created_at) > new Date(found.last_order_date)) {
            found.last_order_date = o.created_at;
          }
        }
      }
    });

    const userList = Array.from(combinedMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ users: userList });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch users' }, { status: 500 });
  }
}

/**
 * Facility to add a new user or administrator directly from the backoffice
 */
export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabaseAdmin = getAdminClient();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Admin service client unavailable' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, full_name, phone, is_admin } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 1. Create the user in Supabase Auth
    const { data: createdAuthUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase().trim(),
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
        },
      });

    if (authError || !createdAuthUser.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user account' },
        { status: 400 }
      );
    }

    const userId = createdAuthUser.user.id;

    // 2. Upsert profile with designated role
    const { data: profile, error: profError } = await (supabaseAdmin as any)
      .from('profiles')
      .upsert({
        id: userId,
        full_name,
        phone: phone || null,
        is_admin: is_admin !== undefined ? Boolean(is_admin) : true, // default to admin when added from admin panel
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profError) {
      console.warn('Profile creation warning:', profError);
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          email: createdAuthUser.user.email,
          full_name,
          phone: phone || null,
          is_admin: is_admin !== undefined ? Boolean(is_admin) : true,
          created_at: createdAuthUser.user.created_at,
          orders_count: 0,
          total_spend: 0,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

/**
 * Update an existing user role or profile attributes
 */
export async function PATCH(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabaseAdmin = getAdminClient();
    const fallbackSupabase = getPublicSupabase();
    const supabase = supabaseAdmin || fallbackSupabase;

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const body = await request.json();
    const { userId, is_admin, full_name, phone } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };
    if (is_admin !== undefined) updatePayload.is_admin = Boolean(is_admin);
    if (full_name !== undefined) updatePayload.full_name = full_name;
    if (phone !== undefined) updatePayload.phone = phone;

    const { data, error } = await (supabase as any)
      .from('profiles')
      .upsert({ id: userId, ...updatePayload })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
