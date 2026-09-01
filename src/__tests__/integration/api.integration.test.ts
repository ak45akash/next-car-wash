/**
 * @jest-environment node
 *
 * HTTP integration tests against a running Next.js dev server.
 * Server is started via globalSetup.ts before these tests run.
 */

const BASE_URL = process.env.INTEGRATION_BASE_URL || 'http://localhost:3000';

describe('Integration: Database & API Health', () => {
  it('GET /api/health confirms database connectivity', async () => {
    const response = await fetch(`${BASE_URL}/api/health`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.connected).toBe(true);
    expect(body.status).toBe('ok');
    expect(body.tables).toMatchObject({
      bookings: true,
      services: true,
      customers: true,
      settings: true,
      profiles: true,
    });
  });
});

describe('Integration: Public API Routes', () => {
  it('GET /api/services returns service list', async () => {
    const response = await fetch(`${BASE_URL}/api/services`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    if (body.length > 0) {
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('price');
    }
  });

  it('GET /api/settings/display_options returns settings', async () => {
    const response = await fetch(`${BASE_URL}/api/settings/display_options`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.key).toBe('display_options');
    expect(body.value).toBeDefined();
  });

  it('POST /api/contact accepts valid submission', async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Test User',
        email: `integration-${Date.now()}@example.com`,
        phone: '9999999999',
        message: 'Integration test message',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
  });

  it('POST /api/contact rejects missing fields', async () => {
    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });
});

describe('Integration: Booking API', () => {
  let createdBookingId: number | null = null;

  afterAll(async () => {
    if (!createdBookingId) return;
    const health = await fetch(`${BASE_URL}/api/health`).then((r) => r.json());
    if (!health.connected) return;

    const dotenv = await import('dotenv');
    dotenv.config({ path: '.env.local' });
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    await client.from('bookings').delete().eq('id', createdBookingId);
  });

  it('POST /api/bookings creates a booking', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Integration Test',
        customer_email: `booking-int-${Date.now()}@example.com`,
        customer_phone: '9876543210',
        car_model: 'Test Car',
        service_id: '1',
        service_name: 'Basic Wash',
        service_price: 499,
        date: tomorrow.toISOString().split('T')[0],
        time_slot: '10:00 AM',
        payment_method: 'cash',
        status: 'Upcoming',
        payment_status: 'Pending',
      }),
    });

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.customer_name).toBe('Integration Test');
    createdBookingId = body.id;
  });

  it('POST /api/bookings rejects incomplete payload', async () => {
    const response = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_name: 'Incomplete' }),
    });

    expect(response.status).toBe(400);
  });
});

describe('Integration: Admin-protected API Routes', () => {
  it('GET /api/bookings returns 401 without auth', async () => {
    const response = await fetch(`${BASE_URL}/api/bookings`);
    expect(response.status).toBe(401);
  });

  it('GET /api/dashboard/stats returns 401 without auth', async () => {
    const response = await fetch(`${BASE_URL}/api/dashboard/stats`);
    expect(response.status).toBe(401);
  });

  it('GET /api/customers returns 401 without auth', async () => {
    const response = await fetch(`${BASE_URL}/api/customers`);
    expect(response.status).toBe(401);
  });

  it('GET /api/admin/users returns 401 without auth', async () => {
    const response = await fetch(`${BASE_URL}/api/admin/users`);
    expect(response.status).toBe(401);
  });
});

describe('Integration: Page Routes', () => {
  it('GET / returns homepage', async () => {
    const response = await fetch(`${BASE_URL}/`);
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('Diamond');
  }, 30000);

  it('GET /book returns booking page', async () => {
    const response = await fetch(`${BASE_URL}/book`);
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html.toLowerCase()).toMatch(/book/);
  }, 30000);

  it('GET /dashboard redirects to login', async () => {
    const response = await fetch(`${BASE_URL}/dashboard`, { redirect: 'manual' });
    expect([307, 308, 302, 303]).toContain(response.status);
    expect(response.headers.get('location')).toContain('/login');
  }, 30000);
});
