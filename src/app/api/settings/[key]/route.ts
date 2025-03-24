import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET a specific setting by key
export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

// PUT to update a specific setting, or create if it doesn't exist
export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    if (body.value === undefined) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }

    // Use upsert to create or update
    const { data, error } = await supabase
      .from('settings')
      .upsert([{ key, value: body.value }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

// DELETE a specific setting
export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
} 