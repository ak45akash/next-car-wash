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
  const { isInitialized } = useSupabase();
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
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'server-side',
  });

  const redirect = useCallback((path: string) => {
    // Avoid redirecting if already at the destination
    if (typeof window !== 'undefined' && window.location.pathname === path) {
      console.log(`Already at ${path}, skipping redirect`);
      return;
    }
    
    if (redirectInProgress) return;
    
    setRedirectInProgress(true);
    console.log(`Redirecting to ${path}...`);
    
    // Use router instead of window.location for Next.js navigation
    router.push(path);
  }, [redirectInProgress, router]);

  useEffect(() => {
    if (redirectInProgress) {
      // Reset redirect state after 2 seconds to avoid getting stuck
      const timer = setTimeout(() => {
        setRedirectInProgress(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [redirectInProgress]);

  useEffect(() => {
    // Simplify auth check
    if (!loading && !checkedAuth && !redirectInProgress) {
      const checkAuth = async () => {
        try {
          console.log('ProtectedRoute - Current URL path:', 
            typeof window !== 'undefined' ? window.location.pathname : 'server-side');
          
          // If user exists in context and we're not checking for admin, we're good
          if (user && (!adminOnly || isAdmin)) {
            console.log('User authenticated from context');
            setCheckedAuth(true);
            return;
          }
          
          // Simplify this to avoid potential loops
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            // Only redirect if not already on login page
            console.log('No user in context, redirecting to login');
            redirect('/login');
            return;
          }
          
          setCheckedAuth(true);
        } catch (error) {
          console.error('Error checking authentication:', error);
          setError('Authentication error occurred');
          setCheckedAuth(true);
        }
      };
      
      checkAuth();
    }
  }, [user, loading, isAdmin, adminOnly, checkedAuth, redirect, redirectInProgress]);

  // Show loading spinner while checking auth
  if (loading || !checkedAuth) {
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