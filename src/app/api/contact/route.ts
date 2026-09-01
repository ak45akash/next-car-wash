import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const serviceClient = getServiceSupabase();
    if (!serviceClient) {
      return NextResponse.json({ error: 'Server is not configured' }, { status: 500 });
    }

    const submission = {
      name,
      email,
      phone: phone || '',
      message,
      submitted_at: new Date().toISOString(),
    };

    const { data: existing } = await serviceClient
      .from('settings')
      .select('value')
      .eq('key', 'contact_submissions')
      .single();

    let submissions: typeof submission[] = [];
    if (existing?.value) {
      try {
        submissions = JSON.parse(existing.value);
      } catch {
        submissions = [];
      }
    }

    submissions.unshift(submission);

    const { error } = await serviceClient
      .from('settings')
      .upsert(
        { key: 'contact_submissions', value: JSON.stringify(submissions.slice(0, 100)) },
        { onConflict: 'key' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
  }
}
