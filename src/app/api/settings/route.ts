import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler to fetch all settings
export async function GET() {
  try {
    console.log('Fetching all settings');
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Create a structured object from the array of settings
    const settingsObject: Record<string, any> = {};
    data.forEach((setting) => {
      try {
        // Parse the value as JSON if it's a JSON string
        settingsObject[setting.key] = typeof setting.value === 'string' && setting.value.trim().startsWith('{') 
          ? JSON.parse(setting.value) 
          : setting.value;
      } catch (e) {
        // If parsing fails, use the raw value
        settingsObject[setting.key] = setting.value;
      }
    });
    
    // Add default booking_closure if it doesn't exist
    if (!settingsObject.booking_closure) {
      settingsObject.booking_closure = {
        isClosed: false,
        endTime: null
      };
    }
    
    console.log('Settings fetched:', settingsObject);
    return NextResponse.json(settingsObject);
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST handler to update or create settings
export async function POST(request: Request) {
  try {
    const settingsData = await request.json();
    
    // Validate required fields
    if (!settingsData.key || settingsData.value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }
    
    // Use upsert to create or update
    const { data, error } = await supabase
      .from('settings')
      .upsert([{ key: settingsData.key, value: settingsData.value }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
} 