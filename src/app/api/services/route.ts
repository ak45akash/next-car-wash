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
    const serviceData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'status'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Validate data types
    if (typeof serviceData.duration !== 'number' || serviceData.duration <= 0) {
      return NextResponse.json({ 
        error: 'Duration must be a positive number' 
      }, { status: 400 });
    }

    if (typeof serviceData.price !== 'number' || serviceData.price < 0) {
      return NextResponse.json({ 
        error: 'Price must be a non-negative number' 
      }, { status: 400 });
    }

    // Check if Supabase client is available
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('services')
      .insert([{
        name: serviceData.name,
        description: serviceData.description,
        duration: serviceData.duration,
        price: serviceData.price,
        category: serviceData.category,
        status: serviceData.status,
        image_url: serviceData.image_url || null // Handle the image URL
      }])
      .select();
      
    if (error) {
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({ 
        error: 'Service was not created successfully' 
      }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 });
  }
} 