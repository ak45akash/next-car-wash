/**
 * Unit tests for customer data enrichment logic
 */

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Booking {
  email: string;
  date: string;
  service_price: number;
  status: string;
}

function enrichCustomers(customers: Customer[], bookings: Booking[]) {
  const bookingsByEmail: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    if (!bookingsByEmail[b.email]) bookingsByEmail[b.email] = [];
    bookingsByEmail[b.email].push(b);
  });

  return customers.map((customer) => {
    const customerBookings = bookingsByEmail[customer.email] || [];
    const activeBookings = customerBookings.filter(
      (b) => (b.status || '').toLowerCase() !== 'cancelled'
    );
    const totalSpent = activeBookings.reduce((sum, b) => sum + Number(b.service_price || 0), 0);
    const sortedDates = activeBookings.map((b) => b.date).sort().reverse();

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalVisits: activeBookings.length,
      lastVisit: sortedDates[0] || '—',
      totalSpent,
      joinDate: customer.created_at?.split('T')[0] || customer.created_at,
    };
  });
}

describe('Customer enrichment', () => {
  const customers: Customer[] = [
    { id: 1, name: 'Alice', email: 'alice@test.com', phone: '123', created_at: '2024-01-01T00:00:00Z' },
    { id: 2, name: 'Bob', email: 'bob@test.com', phone: '456', created_at: '2024-02-01T00:00:00Z' },
  ];

  const bookings: Booking[] = [
    { email: 'alice@test.com', date: '2024-06-01', service_price: 500, status: 'Completed' },
    { email: 'alice@test.com', date: '2024-07-01', service_price: 800, status: 'Upcoming' },
    { email: 'alice@test.com', date: '2024-05-01', service_price: 300, status: 'Cancelled' },
  ];

  it('calculates total visits excluding cancelled', () => {
    const result = enrichCustomers(customers, bookings);
    expect(result[0].totalVisits).toBe(2);
  });

  it('calculates total spent excluding cancelled', () => {
    const result = enrichCustomers(customers, bookings);
    expect(result[0].totalSpent).toBe(1300);
  });

  it('returns most recent visit date', () => {
    const result = enrichCustomers(customers, bookings);
    expect(result[0].lastVisit).toBe('2024-07-01');
  });

  it('handles customers with no bookings', () => {
    const result = enrichCustomers(customers, bookings);
    expect(result[1].totalVisits).toBe(0);
    expect(result[1].totalSpent).toBe(0);
    expect(result[1].lastVisit).toBe('—');
  });
});
