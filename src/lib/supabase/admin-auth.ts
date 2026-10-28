import { NextResponse } from 'next/server';
import { createServerClientOptional } from './server';
import { getAdminClient } from './admin';

export interface AdminAuthResult {
  authorized: boolean;
  userId?: string;
  email?: string;
  fullName?: string;
  errorResponse?: NextResponse;
}

/**
 * Verifies that the incoming request is made by an authenticated user with is_admin = true.
 * Inspects both Bearer Authorization header and SSR Session Cookies.
 */
export async function verifyAdminRequest(request?: Request): Promise<AdminAuthResult> {
  const adminClient = getAdminClient();
  const serverClient = createServerClientOptional();

  if (!adminClient) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { error: 'Server misconfiguration: Service role client unavailable' },
        { status: 500 }
      ),
    };
  }

  let user: { id: string; email?: string } | null = null;

  // 1. Check Bearer Authorization header if provided
  const authHeader = request?.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      try {
        const { data, error } = await adminClient.auth.getUser(token);
        if (!error && data?.user) {
          user = data.user;
        }
      } catch (err) {
        console.warn('Bearer token verification error:', err);
      }
    }
  }

  // 2. Check SSR Session Cookies if Bearer token was not present or valid
  if (!user && serverClient) {
    try {
      const { data, error } = await serverClient.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    } catch (err) {
      console.warn('Cookie session verification error:', err);
    }
  }

  // If no authenticated user found at all
  if (!user) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        {
          error: 'Unauthorized: Authentication is required to access administrative endpoints.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }

  // 3. Check if user profile has is_admin === true
  const { data, error: profError } = await (adminClient as any)
    .from('profiles')
    .select('id, is_admin, full_name')
    .eq('id', user.id)
    .maybeSingle();

  const profile = data as { id: string; is_admin?: boolean; full_name?: string } | null;

  if (profError || !profile || !profile.is_admin) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        {
          error: 'Forbidden: Administrator privileges are required to perform this action.',
          code: 'FORBIDDEN',
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    userId: user.id,
    email: user.email,
    fullName: profile.full_name || undefined,
  };
}
