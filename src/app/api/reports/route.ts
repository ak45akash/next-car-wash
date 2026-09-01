import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getPeriodStart(period: string): Date {
  const now = new Date();
  const start = new Date(now);

  switch (period) {
    case 'weekly':
      start.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      start.setDate(now.getDate() - 30);
      break;
    case 'quarterly':
      start.setMonth(now.getMonth() - 3);
      break;
    default:
      start.setFullYear(now.getFullYear() - 1);
  }

  return start;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { serviceClient } = auth;

  const period = request.nextUrl.searchParams.get('period') || 'yearly';
  const periodStart = getPeriodStart(period);

  const { data: bookings, error } = await serviceClient
    .from('bookings')
    .select('service_name, service_price, status, date, created_at')
    .gte('created_at', periodStart.toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const allBookings = (bookings || []).filter(
    (b) => (b.status || '').toLowerCase() !== 'cancelled'
  );

  const revenueByMonth: Record<string, number> = {};
  MONTH_LABELS.forEach((m) => { revenueByMonth[m] = 0; });

  allBookings.forEach((b) => {
    const date = new Date(b.date || b.created_at);
    const month = MONTH_LABELS[date.getMonth()];
    revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(b.service_price || 0);
  });

  const revenueData = MONTH_LABELS.map((month) => ({
    month,
    amount: revenueByMonth[month] || 0,
  }));

  const serviceCounts: Record<string, number> = {};
  allBookings.forEach((b) => {
    const name = b.service_name || 'Unknown';
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });

  const totalServices = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
  const servicePopularityData = Object.entries(serviceCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalServices > 0 ? Math.round((count / totalServices) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const statusCounts = { completed: 0, upcoming: 0, cancelled: 0, other: 0 };
  (bookings || []).forEach((b) => {
    const status = (b.status || '').toLowerCase();
    if (status === 'completed') statusCounts.completed++;
    else if (status === 'upcoming' || status === 'pending') statusCounts.upcoming++;
    else if (status === 'cancelled') statusCounts.cancelled++;
    else statusCounts.other++;
  });

  const total = (bookings || []).length || 1;
  const customerSatisfactionData = {
    excellent: Math.round((statusCounts.completed / total) * 100),
    good: Math.round((statusCounts.upcoming / total) * 100),
    average: Math.round((statusCounts.other / total) * 100),
    poor: Math.round((statusCounts.cancelled / total) * 100),
  };

  const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  return NextResponse.json({
    revenueData,
    servicePopularityData,
    customerSatisfactionData,
    totalRevenue,
    totalServices,
  });
}
