/**
 * Unit tests for dashboard stats aggregation logic
 */

function aggregateStats(bookings: Array<{
  date: string;
  status: string;
  service_price: number;
  service_name: string;
  email: string;
  created_at: string;
  time_slot: string;
  customer_name: string;
  id: number;
}>, customerCount: number) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayBookings = bookings.filter((b) => b.date === today);
  const yesterdayBookings = bookings.filter((b) => b.date === yesterday);
  const serviceInProgress = bookings.filter((b) => {
    const status = (b.status || '').toLowerCase();
    return status === 'in progress' || status === 'in-progress';
  }).length;

  const totalRevenue = bookings
    .filter((b) => (b.status || '').toLowerCase() !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  const serviceCounts: Record<string, number> = {};
  bookings.forEach((b) => {
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
    .sort((a, b) => b.count - a.count);

  return {
    todayBookings: todayBookings.length,
    totalCustomers: customerCount,
    serviceInProgress,
    totalRevenue,
    bookingsChange: todayBookings.length - yesterdayBookings.length,
    popularServices,
    recentBookings: bookings.slice(0, 5),
  };
}

describe('Dashboard stats aggregation', () => {
  const today = new Date().toISOString().split('T')[0];

  const sampleBookings = [
    {
      id: 1,
      customer_name: 'John',
      service_name: 'Premium Wash',
      service_price: 799,
      date: today,
      status: 'Upcoming',
      email: 'john@test.com',
      created_at: today,
      time_slot: '10:00',
    },
    {
      id: 2,
      customer_name: 'Jane',
      service_name: 'Basic Wash',
      service_price: 499,
      date: today,
      status: 'In Progress',
      email: 'jane@test.com',
      created_at: today,
      time_slot: '11:00',
    },
    {
      id: 3,
      customer_name: 'Bob',
      service_name: 'Premium Wash',
      service_price: 799,
      date: '2020-01-01',
      status: 'Cancelled',
      email: 'bob@test.com',
      created_at: '2020-01-01',
      time_slot: '12:00',
    },
  ];

  it('calculates today bookings correctly', () => {
    const stats = aggregateStats(sampleBookings, 10);
    expect(stats.todayBookings).toBe(2);
  });

  it('excludes cancelled bookings from revenue', () => {
    const stats = aggregateStats(sampleBookings, 10);
    expect(stats.totalRevenue).toBe(1298);
  });

  it('counts services in progress', () => {
    const stats = aggregateStats(sampleBookings, 10);
    expect(stats.serviceInProgress).toBe(1);
  });

  it('calculates popular services percentages', () => {
    const stats = aggregateStats(sampleBookings, 10);
    expect(stats.popularServices[0].name).toBe('Premium Wash');
    expect(stats.popularServices[0].percentage).toBe(50);
  });

  it('returns recent bookings limited to 5', () => {
    const manyBookings = Array.from({ length: 10 }, (_, i) => ({
      ...sampleBookings[0],
      id: i,
    }));
    const stats = aggregateStats(manyBookings, 10);
    expect(stats.recentBookings).toHaveLength(5);
  });
});
