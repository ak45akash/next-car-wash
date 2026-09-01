/**
 * Unit tests for reports aggregation logic
 */

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function aggregateReports(bookings: Array<{
  service_name: string;
  service_price: number;
  status: string;
  date: string;
  created_at: string;
}>) {
  const allBookings = bookings.filter(
    (b) => (b.status || '').toLowerCase() !== 'cancelled'
  );

  const revenueByMonth: Record<string, number> = {};
  MONTH_LABELS.forEach((m) => { revenueByMonth[m] = 0; });

  allBookings.forEach((b) => {
    const date = new Date(b.date || b.created_at);
    const month = MONTH_LABELS[date.getMonth()];
    revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(b.service_price || 0);
  });

  const serviceCounts: Record<string, number> = {};
  allBookings.forEach((b) => {
    const name = b.service_name || 'Unknown';
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });

  const totalServices = Object.values(serviceCounts).reduce((a, b) => a + b, 0);
  const totalRevenue = allBookings.reduce((sum, b) => sum + Number(b.service_price || 0), 0);

  return { revenueByMonth, serviceCounts, totalServices, totalRevenue };
}

describe('Reports aggregation', () => {
  it('aggregates revenue by month', () => {
    const bookings = [
      { service_name: 'Wash', service_price: 500, status: 'Completed', date: '2024-01-15', created_at: '2024-01-15' },
      { service_name: 'Wash', service_price: 300, status: 'Completed', date: '2024-01-20', created_at: '2024-01-20' },
      { service_name: 'Detail', service_price: 1000, status: 'Completed', date: '2024-02-10', created_at: '2024-02-10' },
    ];

    const result = aggregateReports(bookings);
    expect(result.revenueByMonth['Jan']).toBe(800);
    expect(result.revenueByMonth['Feb']).toBe(1000);
  });

  it('excludes cancelled bookings', () => {
    const bookings = [
      { service_name: 'Wash', service_price: 500, status: 'Cancelled', date: '2024-01-15', created_at: '2024-01-15' },
      { service_name: 'Wash', service_price: 300, status: 'Completed', date: '2024-01-20', created_at: '2024-01-20' },
    ];

    const result = aggregateReports(bookings);
    expect(result.totalRevenue).toBe(300);
    expect(result.totalServices).toBe(1);
  });

  it('counts service popularity', () => {
    const bookings = [
      { service_name: 'Premium Wash', service_price: 500, status: 'Completed', date: '2024-01-15', created_at: '2024-01-15' },
      { service_name: 'Premium Wash', service_price: 500, status: 'Completed', date: '2024-01-16', created_at: '2024-01-16' },
      { service_name: 'Basic Wash', service_price: 300, status: 'Completed', date: '2024-01-17', created_at: '2024-01-17' },
    ];

    const result = aggregateReports(bookings);
    expect(result.serviceCounts['Premium Wash']).toBe(2);
    expect(result.serviceCounts['Basic Wash']).toBe(1);
  });
});
