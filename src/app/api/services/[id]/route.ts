import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET a single service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Fetching service with ID:', id);
    
    // Convert numeric string ID to number if needed
    const numericId = parseInt(id, 10);
    console.log('Numeric ID:', numericId);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', numericId)
      .single();
    
    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      console.error('Service not found');
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    console.log('Service fetched:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error during service fetch:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

// UPDATE a service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Updating service with ID:', id);
    
    const updates = await request.json();
    console.log('Update data:', updates);
    
    // Convert numeric string ID to number if needed
    const numericId = parseInt(id, 10);
    console.log('Numeric ID:', numericId);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    // Explicitly structure the data to ensure proper handling of all fields
    const updateData = {
      name: updates.name,
      description: updates.description,
      duration: updates.duration,
      price: updates.price,
      category: updates.category,
      status: updates.status,
      image_url: updates.image_url || null // Handle the image URL
    };
    
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', numericId)
      .select();
    
    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      console.error('Service not found');
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    console.log('Updated service:', data[0]);
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error('Unexpected error during service update:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

// DELETE a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Deleting service with ID:', id);
    
    // Convert numeric string ID to number if needed
    const numericId = parseInt(id, 10);
    console.log('Numeric ID:', numericId);
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', numericId);
    
    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('Service deleted successfully');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error during service deletion:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
} 