import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET handler to fetch all settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
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