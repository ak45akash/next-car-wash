import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/admin-auth';

// GET handler to fetch all bookings (admin only)
export async function GET() {
  try {
    const auth = await requireAdmin();
    if ('error' in auth) return auth.error;

    const { serviceClient: serverClient } = auth;

    const { data, error } = await serverClient
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Normalize to the shape the dashboard expects
    const normalized = (data || []).map((b: any) => ({
      ...b,
      service: b.service ?? b.service_name ?? '',
      time: b.time ?? b.time_slot ?? '',
      amount: typeof b.amount === 'number' ? b.amount : Number(b.service_price ?? 0),
    }));
    
    return NextResponse.json(normalized);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST handler to create a new booking (uses service role key)
export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server is not configured with Supabase service credentials' }, { status: 500 });
    }
    const serverClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const booking = await request.json();

    // Normalize and validate
    const payload = {
      customer_name: booking.customer_name,
      email: booking.customer_email ?? booking.email,
      phone: booking.customer_phone ?? booking.phone,
      car_model: booking.car_model,
      service_id: String(booking.service_id),
      service_name: booking.service_name,
      service_price: booking.service_price ?? 0,
      date: booking.date,
      time_slot: booking.time_slot ?? booking.time,
      payment_method: booking.payment_method,
      payment_status: booking.payment_status ?? 'Pending',
      status: booking.status ?? 'Upcoming',
      upi_id: booking.upi_id ?? null,
      created_at: booking.created_at ?? new Date().toISOString(),
    };

    const required = ['customer_name','email','phone','service_id','date','time_slot','payment_method'];
    for (const f of required) {
      if (!(payload as any)[f]) {
        return NextResponse.json({ error: `${f} is required` }, { status: 400 });
      }
    }

    const { data, error } = await serverClient
      .from('bookings')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Upsert customer record (best-effort)
    await serverClient
      .from('customers')
      .upsert({ name: payload.customer_name, email: payload.email, phone: payload.phone, created_at: new Date().toISOString() }, { onConflict: 'email' });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error creating booking (server):', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}