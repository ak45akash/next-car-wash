import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET a specific setting by key
export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    console.log('Fetching setting with key:', key);
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      console.error('Error fetching setting:', error);
      
      // If the setting doesn't exist, create a default one for booking_closure
      if (error.code === 'PGRST116' && key === 'booking_closure') {
        const defaultValue = {
          isClosed: false,
          endTime: null
        };
        
        return NextResponse.json({
          key: 'booking_closure',
          value: defaultValue,
          id: null,
          updated_at: new Date().toISOString()
        });
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Try to parse value as JSON if it's a string
    if (typeof data.value === 'string') {
      try {
        data.value = JSON.parse(data.value);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch setting:', err);
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

// PUT to update a specific setting, or create if it doesn't exist
export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    console.log('Updating setting with key:', key);
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    console.log('Update body:', body);
    
    if (body.value === undefined) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }

    // Convert the value to a JSON string if it's an object
    const valueString = typeof body.value === 'object' 
      ? JSON.stringify(body.value) 
      : body.value;

    console.log('Stringified value:', valueString);

    // Use upsert to create or update
    const { data, error } = await supabase
      .from('settings')
      .upsert([{ key, value: valueString }])
      .select()
      .single();

    if (error) {
      console.error('Error updating setting:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Setting updated:', data);
    
    // Try to parse the value back to an object for response
    if (typeof data.value === 'string') {
      try {
        data.value = JSON.parse(data.value);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to update setting:', err);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

// DELETE a specific setting
export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    console.log('Deleting setting with key:', key);
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error deleting setting:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Setting deleted successfully');
    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (err) {
    console.error('Failed to delete setting:', err);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
} 