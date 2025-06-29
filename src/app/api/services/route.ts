import { NextResponse } from 'next/server';
import { getServices } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

// GET all services
export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services || []);
  } catch (err) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

// Create a new service
export async function POST(request: Request) {
  try {
    console.log('Service creation request received');
    const serviceData = await request.json();
    console.log('Service data received:', JSON.stringify(serviceData));

    // Validate required fields
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'status'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields.join(', '));
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate data types
    if (typeof serviceData.duration !== 'number' || serviceData.duration <= 0) {
      console.error('Invalid duration:', serviceData.duration);
      return NextResponse.json({ 
        error: 'Duration must be a positive number' 
      }, { status: 400 });
    }

    if (typeof serviceData.price !== 'number' || serviceData.price < 0) {
      console.error('Invalid price:', serviceData.price);
      return NextResponse.json({ 
        error: 'Price must be a non-negative number' 
      }, { status: 400 });
    }

    // Check if Supabase client is available, try to initialize if not
    let dbClient = supabase;
    if (!dbClient) {
      console.log('Supabase client not initialized, trying to initialize...');
      const { initSupabaseClient } = await import('@/lib/supabase');
      dbClient = initSupabaseClient();
      
      if (!dbClient) {
        console.error('Failed to initialize Supabase client');
        return NextResponse.json({ 
          error: 'Database connection not available. Please try again later.' 
        }, { status: 503 });
      }
      console.log('Supabase client initialized successfully');
    }

    // Create a data object without image_url initially
    const serviceDataToInsert = {
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      status: serviceData.status
    };

    // Check if image_url column exists in the services table
    try {
      // Try to query the table structure
      const { error: tableError } = await dbClient
        .from('services')
        .select('image_url')
        .limit(1);
      
      // If no error occurs, the image_url column exists, so add it to the insert data
      if (!tableError) {
        console.log('image_url column exists in services table');
        if (serviceData.image_url) {
          // @ts-expect-error - Add the image_url if it exists in schema
          serviceDataToInsert.image_url = serviceData.image_url;
        }
      } else {
        console.log('image_url column does not exist in services table:', tableError.message);
      }
    } catch (error) {
      console.log('Error checking for image_url column, assuming it does not exist:', error);
    }

    console.log('Inserting service into database with data:', serviceDataToInsert);
    const { data, error } = await dbClient
      .from('services')
      .insert([serviceDataToInsert])
      .select();
      
    if (error) {
      console.error('Database error during service creation:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after service creation');
      return NextResponse.json({ 
        error: 'Service was not created successfully' 
      }, { status: 500 });
    }
    
    console.log('Service created successfully:', data[0]);
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('Unexpected error in service creation:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 });
  }
} 