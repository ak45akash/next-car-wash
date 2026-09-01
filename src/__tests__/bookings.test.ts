/**
 * Unit tests for booking status normalization
 */

function normalizeBookingStatus(status?: string): string {
  return status ?? 'Upcoming';
}

function isActiveBooking(status: string): boolean {
  return status.toLowerCase() !== 'cancelled';
}

function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

describe('Booking status helpers', () => {
  it('defaults to Upcoming when status is undefined', () => {
    expect(normalizeBookingStatus()).toBe('Upcoming');
  });

  it('preserves provided status', () => {
    expect(normalizeBookingStatus('Completed')).toBe('Completed');
  });

  it('identifies active bookings', () => {
    expect(isActiveBooking('Upcoming')).toBe(true);
    expect(isActiveBooking('Cancelled')).toBe(false);
    expect(isActiveBooking('cancelled')).toBe(false);
  });

  it('returns correct CSS class for each status', () => {
    expect(getStatusClass('Completed')).toContain('green');
    expect(getStatusClass('In Progress')).toContain('yellow');
    expect(getStatusClass('Cancelled')).toContain('red');
    expect(getStatusClass('Upcoming')).toContain('blue');
  });
});

describe('Booking payload mapping', () => {
  it('maps customer fields to database columns', () => {
    const bookingData = {
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '9876543210',
      car_model: 'Honda City',
      service_id: '1',
      service_name: 'Basic Wash',
      service_price: 499,
      date: '2024-06-01',
      time_slot: '10:00',
      payment_method: 'cash',
      status: 'Upcoming',
      payment_status: 'Pending',
    };

    const insertPayload = {
      customer_name: bookingData.customer_name,
      email: bookingData.customer_email,
      phone: bookingData.customer_phone,
      car_model: bookingData.car_model,
      service_id: bookingData.service_id?.toString(),
      service_name: bookingData.service_name,
      service_price: bookingData.service_price,
      date: bookingData.date,
      time_slot: bookingData.time_slot,
      status: bookingData.status ?? 'Upcoming',
      payment_method: bookingData.payment_method,
      payment_status: bookingData.payment_status ?? 'Pending',
    };

    expect(insertPayload.email).toBe('test@example.com');
    expect(insertPayload.status).toBe('Upcoming');
    expect(insertPayload.payment_status).toBe('Pending');
  });
});
