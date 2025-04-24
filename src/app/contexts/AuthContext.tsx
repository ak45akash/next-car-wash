'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from './SupabaseContext';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Types
type User = {
  id: string;
  email?: string;
  role?: string;
} | null;

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase, isInitialized } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add debug logging
  console.log('AuthContext - Initial state:', {
    userExists: !!user,
    isAdmin,
    loading,
    error,
    supabaseInitialized: isInitialized,
    environmentInfo: {
      isProduction: process.env.NODE_ENV === 'production',
      isVercel: !!process.env.VERCEL,
      baseUrl: typeof window !== 'undefined' ? window.location.origin : 'server-side'
    }
  });

  const refreshAuthState = async () => {
    if (!supabase) {
      console.error('Supabase client not available');
      setError('Authentication service unavailable. Please check your connection.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        setError('Failed to verify your authentication status.');
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (data?.session?.user) {
        setUser(data.session.user);
        
        // Check if user is admin
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user role:', profileError);
            setIsAdmin(false);
          } else {
            setIsAdmin(profileData?.role === 'admin');
          }
        } catch (roleErr) {
          console.error('Error checking admin role:', roleErr);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Unexpected error in auth context:', err);
      setError('An unexpected authentication error occurred.');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    // Initial auth check
    refreshAuthState();

    // Subscribe to auth changes
    let authListener: any;
    
    if (supabase) {
      try {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (session) {
            setUser(session.user);
            
            // Check if user is admin
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              
              if (profileError) {
                console.error('Error fetching user role:', profileError);
                setIsAdmin(false);
              } else {
                setIsAdmin(profileData?.role === 'admin');
              }
            } catch (roleErr) {
              console.error('Error checking admin role:', roleErr);
              setIsAdmin(false);
            }
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        });
        
        authListener = data;
      } catch (err) {
        console.error('Error setting up auth listener:', err);
        setError('Failed to monitor authentication status.');
      }
    }

    // Cleanup
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase, isInitialized]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error('Supabase client not available for sign in');
      return { 
        error: 'Authentication service unavailable. Please try again later.',
        success: false 
      };
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`Attempting to sign in with email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        return { error: error.message, success: false };
      }

      if (data?.user) {
        console.log('Sign in successful, user details:', {
          id: data.user.id,
          email: data.user.email,
          last_sign_in: data.user.last_sign_in_at
        });
        
        setUser(data.user);
        
        // Check if user is admin
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user role:', profileError);
            setIsAdmin(false);
          } else {
            console.log('User role data:', profileData);
            setIsAdmin(profileData?.role === 'admin');
          }
        } catch (roleErr) {
          console.error('Error checking admin role:', roleErr);
          setIsAdmin(false);
        }
        
        return { error: null, success: true };
      } else {
        console.error('User data is missing in sign in response');
        return { 
          error: 'Failed to authenticate. Please check your credentials.',
          success: false 
        };
      }
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      const errorMessage = err instanceof Error 
        ? err.message
        : 'An unexpected error occurred during sign in.';
      setError(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) {
      console.error('Supabase client not available for sign out');
      setError('Authentication service unavailable. Please try again later.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setError(error.message);
      } else {
        setUser(null);
        setIsAdmin(false);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      setError('An unexpected error occurred during sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        error,
        signIn,
        signOut,
        refreshAuthState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 