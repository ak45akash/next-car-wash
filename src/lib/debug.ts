// Debugging utilities

/**
 * Checks if Supabase environment variables are correctly set
 * Call this function in development to troubleshoot connection issues
 */
export function checkSupabaseConfig() {
  const issues = [];
  
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  } else if (supabaseUrl.includes('undefined') || supabaseUrl === 'your-project-url') {
    issues.push('NEXT_PUBLIC_SUPABASE_URL appears to be invalid');
  }
  
  if (!supabaseKey) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  } else if (supabaseKey.includes('undefined') || supabaseKey.length < 20) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
  }
  
  // Output debug info
  console.log('=============================================');
  console.log('Supabase Configuration Debug Info:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 
    `${supabaseUrl.substring(0, 12)}...` : 'Not set');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 
    `${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 4)}` : 'Not set');
  
  if (issues.length === 0) {
    console.log('✅ Supabase environment variables look valid');
  } else {
    console.log('❌ Issues found with Supabase configuration:');
    issues.forEach(issue => console.log(`- ${issue}`));
    console.log('Please check your .env.local file and ensure variables are set correctly.');
  }
  console.log('=============================================');
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Tests the Supabase connection by making a simple query
 * This helps identify if the project is paused or has connectivity issues
 */
export async function testSupabaseConnection() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Cannot test connection: Supabase credentials not configured');
      return { success: false, error: 'Credentials not configured' };
    }
    
    console.log('Testing Supabase connection...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Set a short timeout for the query to prevent long hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // Simple query to check connection
      const start = Date.now();
      const { error } = await supabase.from('services').select('count', { count: 'exact' }).limit(1);
      const duration = Date.now() - start;
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Supabase connection error:', error);
        return { 
          success: false, 
          error: error.message,
          isPaused: error.message.includes('timeout') || error.message.includes('unavailable')
        };
      }
      
      console.log(`✅ Supabase connection successful (${duration}ms)`);
      return { success: true, duration };
    } catch (queryError) {
      clearTimeout(timeoutId);
      
      const errorMessage = queryError instanceof Error ? queryError.message : String(queryError);
      console.error('Supabase query error:', errorMessage);
      
      // Check for common pause indicators
      const isPaused = 
        errorMessage.includes('timeout') || 
        errorMessage.includes('aborted') ||
        errorMessage.includes('unavailable');
      
      if (isPaused) {
        console.error('⚠️ Your Supabase project may be paused. Please check your Supabase dashboard.');
      }
      
      return { 
        success: false, 
        error: errorMessage,
        isPaused
      };
    }
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
} 