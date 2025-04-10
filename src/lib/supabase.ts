import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
} else {
  console.log('NEXT_PUBLIC_SUPABASE_URL is set:', supabaseUrl.substring(0, 10) + '...');
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
} else {
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY is set:', supabaseAnonKey.substring(0, 5) + '...');
}

// Default supabase client - initialize with safer checks
let supabase: SupabaseClient | null = null;

// Function to initialize Supabase client - this can be called to retry initialization if needed
export function initSupabaseClient(): SupabaseClient | null {
  if (supabase) {
    return supabase; // Return existing client if already initialized
  }
  
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Cannot initialize Supabase client: missing environment variables');
      return null;
    }
    
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    
    supabase = client;
    console.log('Supabase client initialized successfully');
    return client;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
}

// Initialize on import
initSupabaseClient();

// Helper functions with fallbacks for when Supabase is not available
export async function getBookings() {
  try {
    console.log('Fetching bookings from Supabase...');
    
    if (!supabase) {
      supabase = initSupabaseClient();
      if (!supabase) {
        console.error('Supabase client not available');
        return [];
      }
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} bookings`);
    return data || [];
  } catch (err) {
    console.error('Exception in getBookings:', err);
    return []; // Return empty array instead of throwing error
  }
}

export async function getServices() {
  try {
    console.log('Fetching services from Supabase...');
    
    if (!supabase) {
      supabase = initSupabaseClient();
      if (!supabase) {
        console.error('Supabase client not available');
        return [];
      }
    }
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned when fetching services');
      return []; // Return empty array instead of throwing error
    }
    
    console.log(`Successfully fetched ${data.length} services`);
    return data;
  } catch (err) {
    console.error('Exception in getServices:', err);
    return []; // Return empty array instead of throwing error
  }
}

export async function getServiceById(id: string) {
  try {
    console.log(`Fetching service with ID: ${id}`);
    
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      console.error(`Service with ID ${id} not found`);
      return null; // Return null instead of throwing error
    }
    
    console.log(`Successfully fetched service with ID ${id}`);
    return data;
  } catch (err) {
    console.error(`Exception in getServiceById(${id}):`, err);
    return null; // Return null instead of throwing error
  }
}

export async function getSettings(key: string) {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (err) {
    console.error(`Error in getSettings(${key}):`, err);
    return null; // Return null instead of throwing
  }
}

export async function updateSetting(key: string, value: any) {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    const { data, error } = await supabase
      .from('settings')
      .upsert({ key, value })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error in updateSetting(${key}):`, err);
    return null; // Return null instead of throwing
  }
}

export async function createBooking(bookingData: any) {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error in createBooking:', err);
    throw err; // We still throw here as this is critical
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error in updateBookingStatus(${id}, ${status}):`, err);
    return null; // Return null instead of throwing
  }
}

export async function getCustomers() {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return [];
    }
    
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error in getCustomers:', err);
    return []; // Return empty array instead of throwing
  }
}

// Export the Supabase client
export { supabase }; 