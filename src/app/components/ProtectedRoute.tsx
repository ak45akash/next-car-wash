'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';

export default function ProtectedRoute({ 
  children,
  adminOnly = false
}: { 
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading, isAdmin } = useAuth();
  const { supabase, isInitialized } = useSupabase();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run this effect once and only if necessary
    if (!loading && isInitialized && !checkedAuth) {
      const checkAuth = async () => {
        try {
          // If user exists in context and we're not checking for admin, we're good
          if (user && (!adminOnly || isAdmin)) {
            console.log('User authenticated from context');
            setCheckedAuth(true);
            return;
          }
          
          // If Supabase client is not available, we can't check authentication
          if (!supabase) {
            console.error('Supabase client not available for authentication check');
            setError('Authentication service is not available. Please check your environment variables.');
            setCheckedAuth(true);
            return;
          }
          
          // Otherwise double-check with Supabase directly
          const { data } = await supabase.auth.getSession();
          
          if (!data.session) {
            console.log('No active session, redirecting to login');
            window.location.href = '/login';
            return;
          }
          
          if (adminOnly) {
            // Check if user is admin
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.session.user.id)
              .single();
              
            if (profileData?.role !== 'admin') {
              console.log('User is not admin, redirecting to home');
              window.location.href = '/';
              return;
            }
          }
          
          setCheckedAuth(true);
        } catch (error) {
          console.error('Error checking authentication:', error);
          setError('Failed to verify your authentication. Please try logging in again.');
          // Avoid redirect loop by setting checked
          setCheckedAuth(true);
        }
      };
      
      checkAuth();
    }
  }, [user, loading, isAdmin, adminOnly, checkedAuth, supabase, isInitialized]);

  // Show loading spinner while checking auth
  if (loading || !isInitialized || !checkedAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If there's an error, show it
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <a 
                  href="/login" 
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Return to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and authorized
  return <>{children}</>;
} 