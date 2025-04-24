'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useSupabase } from '../contexts/SupabaseContext';

export default function ProtectedRoute({ 
  children,
  adminOnly = false
}: { 
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const { supabase, isInitialized } = useSupabase();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  // Add debugging info
  console.log('ProtectedRoute - Initial state:', { 
    userExists: !!user, 
    loading, 
    isAdmin, 
    supabaseInitialized: isInitialized,
    checkedAuth, 
    error,
    redirectInProgress,
    environmentInfo: {
      isProduction: process.env.NODE_ENV === 'production',
      isVercel: !!process.env.VERCEL,
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'server-side'
    }
  });

  const redirect = useCallback((path: string) => {
    if (redirectInProgress) return;
    
    setRedirectInProgress(true);
    console.log(`Redirecting to ${path}...`);
    
    // Use router instead of window.location for Next.js navigation
    router.push(path);
  }, [redirectInProgress, router]);

  useEffect(() => {
    // Only run this effect once and only if necessary
    if (!loading && isInitialized && !checkedAuth && !redirectInProgress) {
      const checkAuth = async () => {
        try {
          console.log('ProtectedRoute - Checking auth:', { 
            userExists: !!user, 
            adminOnly, 
            isAdmin 
          });
          
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
          console.log('ProtectedRoute - Session check result:', { 
            hasSession: !!data.session,
            sessionData: data.session ? { 
              userId: data.session.user.id,
              email: data.session.user.email
            } : null
          });
          
          if (!data.session) {
            console.log('No active session, redirecting to login');
            redirect('/login');
            return;
          }
          
          if (adminOnly) {
            // Check if user is admin
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.session.user.id)
                .single();
              
              console.log('ProtectedRoute - Admin check:', { 
                profileData, 
                hasError: !!profileError,
                errorMessage: profileError?.message 
              });
              
              if (profileError) {
                console.error('Error fetching user role:', profileError);
                // Default to not admin on error
                redirect('/dashboard');
                return;
              }
                
              if (profileData?.role !== 'admin') {
                console.log('User is not admin, redirecting to dashboard');
                redirect('/dashboard');
                return;
              }
            } catch (roleErr) {
              console.error('Error checking admin role:', roleErr);
              redirect('/dashboard');
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
  }, [user, loading, isAdmin, adminOnly, checkedAuth, supabase, isInitialized, redirect, redirectInProgress]);

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
                <button 
                  onClick={() => redirect('/login')} 
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Return to Login
                </button>
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