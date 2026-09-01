jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => ({ data: null, error: { message: 'RLS blocked' } })),
        })),
      })),
    })),
  })),
}));

const originalFetch = global.fetch;

describe('createBooking fallback', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ id: 123 }),
    })) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetModules();
  });

  it('falls back to API when direct insert fails', async () => {
    const { createBooking } = await import('@/lib/supabase');

    const result = await createBooking({
      customer_name: 'Test',
      customer_email: 't@test.com',
      customer_phone: '9999999999',
      service_id: '1',
      service_name: 'Basic',
      service_price: 499,
      car_model: 'Car',
      date: '2025-10-31',
      time_slot: '10:00 AM',
      payment_method: 'upi',
    });

    expect(result).toEqual({ id: 123 });
    expect(global.fetch).toHaveBeenCalledWith('/api/bookings', expect.objectContaining({ method: 'POST' }));
  });
});
