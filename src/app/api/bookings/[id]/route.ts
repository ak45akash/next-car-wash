import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET a single booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// UPDATE a booking (patch)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 