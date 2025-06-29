import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler to fetch all bookings
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST handler to create a new booking
export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'service_id', 'date', 'time_slot'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    
    // Set default values if not provided
    if (!bookingData.status) bookingData.status = 'pending';
    if (!bookingData.created_at) bookingData.created_at = new Date().toISOString();
    
    // Add to bookings table
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Check if customer already exists
    if (bookingData.customer_email) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', bookingData.customer_email)
        .single();
      
      // If customer doesn't exist, add to customers table
      if (!existingCustomer) {
        await supabase.from('customers').insert([{
          name: bookingData.customer_name,
          email: bookingData.customer_email,
          phone: bookingData.customer_phone,
          created_at: new Date().toISOString()
        }]);
      }
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error creating booking:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
} 