import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET schema information
export async function GET() {
  try {
    console.log('Schema check requested');
    
    // Check if Supabase client is available, try to initialize if not
    let dbClient = supabase;
    if (!dbClient) {
      console.log('Supabase client not initialized, trying to initialize...');
      const { initSupabaseClient } = await import('@/lib/supabase');
      dbClient = initSupabaseClient();
      
      if (!dbClient) {
        console.error('Failed to initialize Supabase client');
        return NextResponse.json({ 
          supportsImages: false,
          error: 'Database connection not available'
        }, { status: 503 });
      }
      console.log('Supabase client initialized successfully');
    }

    // Try to query the table structure to check if image_url exists
    try {
      const { error } = await dbClient
        .from('services')
        .select('image_url')
        .limit(1);
      
      // If no error occurs, the image_url column exists
      if (!error) {
        console.log('image_url column exists in services table');
        return NextResponse.json({
          supportsImages: true
        });
      } else {
        console.log('Schema check error:', error.message);
        return NextResponse.json({
          supportsImages: false,
          error: error.message
        });
      }
    } catch (error) {
      console.error('Error checking schema:', error);
      return NextResponse.json({
        supportsImages: false,
        error: error instanceof Error ? error.message : 'Error checking schema'
      });
    }
  } catch (err) {
    console.error('Unexpected error in schema check:', err);
    return NextResponse.json({ 
      supportsImages: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
} 