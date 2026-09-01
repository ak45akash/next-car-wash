import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !hasAnonKey) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Missing Supabase environment variables',
      checks: { supabaseUrl: !!supabaseUrl, anonKey: hasAnonKey, serviceKey: hasServiceKey },
    }, { status: 503 });
  }

  const serviceClient = getServiceSupabase();

  if (!serviceClient) {
    return NextResponse.json({
      status: 'partial',
      connected: false,
      message: 'Anon key configured but service role key missing',
      checks: { supabaseUrl: true, anonKey: true, serviceKey: false },
    }, { status: 503 });
  }

  const tables = ['bookings', 'services', 'customers', 'settings', 'profiles'] as const;
  const tableResults: Record<string, boolean> = {};

  await Promise.all(
    tables.map(async (table) => {
      const { error } = await serviceClient.from(table).select('id', { count: 'exact', head: true });
      tableResults[table] = !error;
    })
  );

  const allConnected = Object.values(tableResults).every(Boolean);

  return NextResponse.json({
    status: allConnected ? 'ok' : 'degraded',
    connected: allConnected,
    message: allConnected ? 'Database connection verified' : 'Some tables are unreachable',
    checks: { supabaseUrl: true, anonKey: true, serviceKey: true },
    tables: tableResults,
    timestamp: new Date().toISOString(),
  });
}
