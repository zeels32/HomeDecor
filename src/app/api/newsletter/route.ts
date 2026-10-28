import { NextResponse } from 'next/server';
import { getPublicSupabase } from '@/lib/supabase/public';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const supabase = getPublicSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.toLowerCase().trim() }] as any);

      if (error && !error.message.includes('unique')) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
