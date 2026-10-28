import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getPublicSupabase } from '@/lib/supabase/public';
import { verifyAdminRequest } from '@/lib/supabase/admin-auth';

const DEFAULT_SETTINGS = {
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

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    const { data: rows, error } = await supabase.from('site_settings').select('*');
    if (error || !rows) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    const map: any = { ...DEFAULT_SETTINGS };
    rows.forEach((r: any) => {
      map[r.key] = r.value;
    });

    return NextResponse.json({ settings: map });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.authorized) return auth.errorResponse!;

  try {
    const supabase = getAdminClient() || getPublicSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 });
    }

    const body = await request.json();
    const keys = ['brand_info', 'shipping_policy', 'announcement'];
    const now = new Date().toISOString();

    for (const key of keys) {
      if (body[key] !== undefined) {
        await (supabase as any).from('site_settings').upsert({
          key,
          value: body[key],
          updated_at: now,
        });
      }
    }

    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
