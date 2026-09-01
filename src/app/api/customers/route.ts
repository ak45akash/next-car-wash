import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

interface CustomerRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface BookingRow {
  email: string;
  date: string;
  service_price: number;
  status: string;
}

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { serviceClient } = auth;

  const [{ data: customers, error: customersError }, { data: bookings, error: bookingsError }] =
    await Promise.all([
      serviceClient.from('customers').select('*').order('created_at', { ascending: false }),
      serviceClient.from('bookings').select('email, date, service_price, status'),
    ]);

  if (customersError) {
    return NextResponse.json({ error: customersError.message }, { status: 500 });
  }
  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  const bookingsByEmail: Record<string, BookingRow[]> = {};
  (bookings || []).forEach((b: BookingRow) => {
    if (!bookingsByEmail[b.email]) bookingsByEmail[b.email] = [];
    bookingsByEmail[b.email].push(b);
  });

  const enriched = ((customers || []) as CustomerRow[]).map((customer) => {
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

  return NextResponse.json(enriched);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { serviceClient } = auth;

  const { name, email, phone } = await request.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'Name, email, and phone are required' }, { status: 400 });
  }

  const { data, error } = await serviceClient
    .from('customers')
    .upsert({ name, email, phone, created_at: new Date().toISOString() }, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { serviceClient } = auth;

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Customer id is required' }, { status: 400 });
  }

  const { error } = await serviceClient.from('customers').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
