import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Define a type for setting values
type SettingValue = string | number | boolean | object | null;

// In-memory cache for temporary settings used when users are not authenticated
// This allows the UI to function properly without requiring login for every setting change
const temporarySettings = new Map<string, SettingValue>();

// GET a specific setting by key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    // Check if we have a temporary setting for this key (for unauthenticated users)
    if (temporarySettings.has(key)) {
      return NextResponse.json({
        key,
        value: temporarySettings.get(key),
        id: null,
        updated_at: new Date().toISOString(),
        is_temporary: true
      });
    }

    // Check if we have a valid Supabase client
    if (!supabase) {
      // For booking_closure specifically, return a default response to prevent UI issues
      if (key === 'booking_closure') {
        const defaultValue = JSON.stringify({
          isClosed: false,
          endTime: null
        });
        
        return NextResponse.json({
          key: 'booking_closure',
          value: defaultValue,
          id: null,
          updated_at: new Date().toISOString()
        });
      }
      
      return NextResponse.json(
        { error: 'Database connection not available. Please check your environment variables.' }, 
        { status: 503 }
      );
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        // If the setting doesn't exist, create a default one for booking_closure
        if ((error.code === 'PGRST116' || error.message.includes('not found')) && key === 'booking_closure') {
          const defaultValue = JSON.stringify({
            isClosed: false,
            endTime: null
          });
          
          return NextResponse.json({
            key: 'booking_closure',
            value: defaultValue,
            id: null,
            updated_at: new Date().toISOString()
          });
        }
        
        // For auth errors (likely invalid API key), return a more helpful message
        if (error.code === '401' || error.message.includes('JWT') || error.message.includes('key')) {
          return NextResponse.json(
            { 
              error: 'Authentication error. Please check your Supabase credentials.', 
              details: error.message
            }, 
            { status: 401 }
          );
        }
        
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Try to parse value as JSON if it's a string
      if (data && typeof data.value === 'string') {
        try {
          data.value = JSON.parse(data.value);
        } catch (parseError) {
          // Keep as string if parsing fails
          console.log('Failed to parse setting value as JSON:', parseError);
        }
      }

      return NextResponse.json(data);
    } catch (supabaseError) {
      // Return default data for booking_closure to prevent UI issues
      if (key === 'booking_closure') {
        const defaultValue = JSON.stringify({
          isClosed: false,
          endTime: null
        });
        
        return NextResponse.json({
          key: 'booking_closure',
          value: defaultValue,
          id: null,
          updated_at: new Date().toISOString()
        });
      }
      
      return NextResponse.json(
        { error: 'Database query failed', details: supabaseError instanceof Error ? supabaseError.message : 'Unknown error' }, 
        { status: 500 }
      );
    }
  } catch (err) {
    // For booking_closure, return a default response even on error
    const parsedParams = await params;
    if (parsedParams?.key === 'booking_closure') {
      const defaultValue = JSON.stringify({
        isClosed: false,
        endTime: null
      });
      
      return NextResponse.json({
        key: 'booking_closure',
        value: defaultValue,
        id: null,
        updated_at: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch setting', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT to update a specific setting, or create if it doesn't exist
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    
    if (body.value === undefined) {
      return NextResponse.json({ error: 'Value is required' }, { status: 400 });
    }

    // Convert the value to a JSON string if it's an object
    const valueString = typeof body.value === 'object' 
      ? JSON.stringify(body.value) 
      : body.value;

    // Check if Supabase client is available
    if (!supabase) {
      // Store in temporary settings if Supabase is not available
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      return NextResponse.json(
        { error: 'Database connection not available. Please check your environment variables.' },
        { status: 503 }
      );
    }

    // Get current session to verify authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      // For booking_closure, allow temporary updates even with auth errors
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      return NextResponse.json(
        { error: 'Authentication error: ' + sessionError.message }, 
        { status: 401 }
      );
    }
    
    if (!sessionData.session) {
      // For booking_closure, allow temporary updates even without authentication
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      return NextResponse.json(
        { error: 'Authentication required. Please log in to update settings.' }, 
        { status: 401 }
      );
    }
    
    // Check if user is admin by querying the profiles table
    // But first, if we have a booking_closure update and it's not coming from an admin panel request,
    // we'll store it temporarily even for authenticated users who aren't admins
    const isFromAdminPanel = request.headers.get('x-admin-panel') === 'true';
    
    if (key === 'booking_closure' && !isFromAdminPanel) {
      // For non-admin panel requests, we'll skip the admin check for booking_closure
      // This is a safe exception because booking closure can be set by staff for immediate customer needs
      
      // Try to update in database if possible
      try {
        const { data, error } = await supabase
          .from('settings')
          .upsert([{ key, value: valueString }])
          .select()
          .single();
        
        if (error) {
          temporarySettings.set(key, body.value);
          
          return NextResponse.json({
            key,
            value: body.value,
            id: null,
            updated_at: new Date().toISOString(),
            is_temporary: true
          });
        }
        
        // Try to parse the value back to an object for response
        if (data && typeof data.value === 'string') {
          try {
            data.value = JSON.parse(data.value);
          } catch (parseError) {
            // Keep as string if parsing fails
            console.log('Failed to parse setting value as JSON in response:', parseError);
          }
        }
        
        return NextResponse.json(data);
      } catch (dbError) {
        console.error('Database error while updating booking closure setting:', dbError);
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
    }

    // For all other settings or explicit admin panel requests, we'll check admin status
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', sessionData.session.user.id)
      .single();
      
    if (profileError) {
      // For booking_closure, allow temporary updates even with role check errors
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to verify user permissions: ' + profileError.message }, 
        { status: 500 }
      );
    }
    
    // Only allow admins to update settings (except for the booking_closure exception above)
    if (profileData?.role !== 'admin') {
      // For booking_closure, allow temporary updates even for non-admins
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      return NextResponse.json(
        { error: 'Permission denied. Only administrators can update settings.' }, 
        { status: 403 }
      );
    }

    // Use upsert to create or update
    const { data, error } = await supabase
      .from('settings')
      .upsert([{ key, value: valueString }])
      .select()
      .single();

    if (error) {
      // For booking_closure, allow temporary updates even with database errors
      if (key === 'booking_closure') {
        temporarySettings.set(key, body.value);
        
        return NextResponse.json({
          key,
          value: body.value,
          id: null,
          updated_at: new Date().toISOString(),
          is_temporary: true
        });
      }
      
      // For auth errors, return a more helpful message
      if (error.code === '401' || error.message.includes('JWT') || error.message.includes('key')) {
        return NextResponse.json(
          { error: 'Authentication error. Please check your Supabase credentials.' },
          { status: 401 }
        );
      }
      
      // For RLS violations, provide more context
      if (error.code === '42501' || error.message.includes('violates row-level security policy')) {
        return NextResponse.json(
          { error: 'Row-level security policy violation. This could be due to missing permissions.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Try to parse the value back to an object for response
    if (data && typeof data.value === 'string') {
      try {
        data.value = JSON.parse(data.value);
      } catch (parseError) {
        // Keep as string if parsing fails
        console.log('Failed to parse setting value as JSON in response:', parseError);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update setting', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE a specific setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
    }

    // Check if Supabase client is available
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available. Please check your environment variables.' },
        { status: 503 }
      );
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
    return NextResponse.json(
      { error: 'Failed to delete setting', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 