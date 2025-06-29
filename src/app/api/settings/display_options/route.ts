import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET display options setting
export async function GET() {
  try {
    console.log('Fetching display options setting');
    
    if (!supabase) {
      // Return default display options if supabase is not available
      return NextResponse.json({
        key: 'display_options',
        value: JSON.stringify({
          showDuration: true,
          showCategory: true
        }),
        id: null,
        updated_at: new Date().toISOString()
      });
    }
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'display_options')
      .single();
    
    if (error) {
      // If the setting doesn't exist, return defaults
      if (error.code === 'PGRST116' || error.message.includes('not found')) {
        return NextResponse.json({
          key: 'display_options',
          value: JSON.stringify({
            showDuration: true,
            showCategory: true
          }),
          id: null,
          updated_at: new Date().toISOString()
        });
      }
      
      console.error('Error fetching display options:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Try to parse value as JSON if it's a string
    if (data && typeof data.value === 'string') {
      try {
        data.value = JSON.parse(data.value);
      } catch (e) {
        console.error('Invalid JSON in display_options setting:', data.value, e);
        // Return default values if JSON is invalid
        data.value = {
          showDuration: true,
          showCategory: true
        };
      }
    }
    
    console.log('Display options fetched:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to fetch display options:', err);
    // Return defaults on error
    return NextResponse.json({
      key: 'display_options',
      value: JSON.stringify({
        showDuration: true,
        showCategory: true
      }),
      id: null,
      updated_at: new Date().toISOString()
    });
  }
}

// PUT to update display options setting
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (body.value === undefined) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }
    
    // Convert the value to a JSON string if it's an object
    const valueString = typeof body.value === 'object' 
      ? JSON.stringify(body.value) 
      : body.value;
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available. Please check your environment variables.' },
        { status: 503 }
      );
    }
    
    // First try to update existing record
    let { data, error } = await supabase
      .from('settings')
      .update({ value: valueString })
      .eq('key', 'display_options')
      .select()
      .single();
    
    // If no record was updated, create a new one
    if (error && (error.code === 'PGRST116' || error.message.includes('not found'))) {
      const insertResult = await supabase
        .from('settings')
        .insert([{ key: 'display_options', value: valueString }])
        .select()
        .single();
      
      data = insertResult.data;
      error = insertResult.error;
    }
    
    if (error) {
      console.error('Error updating display options:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Try to parse the value back to an object for response
    if (data && typeof data.value === 'string') {
      try {
        data.value = JSON.parse(data.value);
      } catch (e) {
        console.error('Invalid JSON in display_options response:', data.value, e);
        // Return default values if JSON is invalid
        data.value = {
          showDuration: true,
          showCategory: true
        };
      }
    }
    
    console.log('Display options updated:', data);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Failed to update display options:', err);
    return NextResponse.json(
      { error: 'Failed to update display options', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 