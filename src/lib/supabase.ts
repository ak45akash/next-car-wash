import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug environment variables (development only)
const isDev = process.env.NODE_ENV === 'development';
if (isDev && !supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
}
if (isDev && !supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
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
    if (!supabase) {
      supabase = initSupabaseClient();
      if (!supabase) return [];
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception in getBookings:', err);
    }
    return [];
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

// Define a more specific type for settings values
type SettingValue = string | number | boolean | object | null;

export async function updateSetting(key: string, value: SettingValue) {
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

// Define a type for booking data
interface BookingData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string | number;
  date: string;
  time_slot: string;
  status?: string;
  payment_status?: string;
  payment_method?: string;
  created_at?: string;
  // Use Record<string, unknown> instead of any for additional fields
  [key: string]: string | number | boolean | object | null | undefined;
}

export async function createBooking(bookingData: BookingData) {
  try {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }
    
    // Map request payload to actual DB columns
    const insertPayload = {
      customer_name: bookingData.customer_name,
      email: bookingData.customer_email, // DB column is 'email'
      phone: bookingData.customer_phone, // DB column is 'phone'
      car_model: bookingData.car_model,
      service_id: bookingData.service_id?.toString(),
      service_name: bookingData.service_name,
      service_price: bookingData.service_price,
      date: bookingData.date,
      time_slot: bookingData.time_slot,
      status: bookingData.status ?? 'Upcoming',
      payment_method: bookingData.payment_method,
      payment_status: bookingData.payment_status ?? 'Pending',
      upi_id: (bookingData.upi_id as string | null) ?? null,
      created_at: bookingData.created_at ?? new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([insertPayload])
      .select()
      .single();
    
    if (error) {
      // Fallback: ask server to create with service role key
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insertPayload)
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || error.message);
      }
      return await resp.json();
    }
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