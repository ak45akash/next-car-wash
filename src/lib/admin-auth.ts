import { NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAuthServerClient, getServiceSupabase } from './supabase-server';

type AuthError = { error: NextResponse };
type AuthSuccess = { user: User; supabase: SupabaseClient };
type AdminSuccess = { user: User; serviceClient: SupabaseClient };

export async function requireAuth(): Promise<AuthError | AuthSuccess> {
  const supabase = await createAuthServerClient();
  if (!supabase) {
    return { error: NextResponse.json({ error: 'Server is not configured' }, { status: 500 }) };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { user, supabase };
}

export async function requireAdmin(): Promise<AuthError | AdminSuccess> {
  const authResult = await requireAuth();
  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult;
  const serviceClient = getServiceSupabase();
  if (!serviceClient) {
    return { error: NextResponse.json({ error: 'Server is not configured' }, { status: 500 }) };
  }

  const { data: profile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user, serviceClient };
}
