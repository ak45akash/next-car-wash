import { NextResponse } from 'next/server';
import { getServices } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

// GET all services
export async function GET() {
  try {
    console.log('Fetching all services');
    
    const services = await getServices();
    console.log('Services fetched successfully:', services);
    
    return NextResponse.json(services || []);
  } catch (err) {
    console.error('Error fetching services:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}

// Create a new service
export async function POST(request: Request) {
  try {
    const serviceData = await request.json();
    console.log('Creating new service with data:', serviceData);

    // Validate required fields
    const requiredFields = ['name', 'description', 'duration', 'price', 'category', 'status'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
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

    const { data, error } = await supabase
      .from('services')
      .insert([{
        name: serviceData.name,
        description: serviceData.description,
        duration: serviceData.duration,
        price: serviceData.price,
        category: serviceData.category,
        status: serviceData.status
      }])
      .select();
      
    if (error) {
      console.error('Supabase error creating service:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
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
    console.error('Unexpected error in POST /api/services:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 });
  }
} 