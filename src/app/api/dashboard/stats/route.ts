import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function weekAgoISO() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().split('T')[0];
}

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { serviceClient } = auth;

  const today = todayISO();
  const yesterday = yesterdayISO();
  const weekAgo = weekAgoISO();

  const [
    { data: bookings, error: bookingsError },
    { count: customerCount, error: customersError },
  ] = await Promise.all([
    serviceClient.from('bookings').select('*').order('created_at', { ascending: false }),
    serviceClient.from('customers').select('*', { count: 'exact', head: true }),
  ]);

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }
  if (customersError) {
    return NextResponse.json({ error: customersError.message }, { status: 500 });
  }

  const allBookings = bookings || [];
  const todayBookings = allBookings.filter((b) => b.date === today);
  const yesterdayBookings = allBookings.filter((b) => b.date === yesterday);
  const serviceInProgress = allBookings.filter((b) => {
    const status = (b.status || '').toLowerCase();
    return status === 'in progress' || status === 'in-progress';
  }).length;

  const revenueForDate = (date: string) =>
    allBookings
      .filter((b) => b.date === date && (b.status || '').toLowerCase() !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  const totalRevenue = allBookings
    .filter((b) => (b.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  const todayRevenue = revenueForDate(today);
  const yesterdayRevenue = revenueForDate(yesterday);

  const newCustomersThisWeek = allBookings
    .filter((b) => b.created_at && b.created_at >= weekAgo)
    .reduce((acc, b) => {
      if (b.email) acc.add(b.email);
      return acc;
    }, new Set<string>()).size;

  const serviceCounts: Record<string, number> = {};
  allBookings.forEach((b) => {
    const name = b.service_name || 'Unknown';
    if ((b.status || '').toLowerCase() !== 'cancelled') {
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
    }
  });

  const totalServiceBookings = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
  const popularServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalServiceBookings > 0 ? Math.round((count / totalServiceBookings) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentBookings = allBookings.slice(0, 5).map((b) => ({
    id: b.id,
    customer_name: b.customer_name,
    service: b.service_name,
    time: b.time_slot,
    status: b.status,
  }));

  return NextResponse.json({
    stats: {
      todayBookings: todayBookings.length,
      totalCustomers: customerCount ?? 0,
      serviceInProgress,
      totalRevenue,
      bookingsChange: todayBookings.length - yesterdayBookings.length,
      customersChange: newCustomersThisWeek,
      revenueChange: todayRevenue - yesterdayRevenue,
    },
    recentBookings,
    popularServices,
  });
}
