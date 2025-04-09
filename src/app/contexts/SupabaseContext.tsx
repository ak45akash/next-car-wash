'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  isInitialized: boolean;
  error: string | null;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        // Get Supabase URL and key from environment variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        // Debug output
        console.log('Supabase initialization - URL available:', !!supabaseUrl);
        console.log('Supabase initialization - Key available:', !!supabaseAnonKey);
        
        // Validate that we have the necessary environment variables
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Missing Supabase environment variables');
          
          // Use placeholder values in development for easier debugging
          if (process.env.NODE_ENV === 'development') {
            console.log('Using placeholder client in development mode');
            // Create a mock client that will throw errors when used
            const mockClient = createClient(
              'https://placeholder.supabase.co',
              'placeholder_key'
            );
            setSupabase(mockClient);
            setError('Missing Supabase credentials. Using placeholder client for development.');
            setIsInitialized(true);
            return;
          } else {
            setError('Missing Supabase credentials. Please check your environment variables.');
            setSupabase(null);
            setIsInitialized(true);
            return;
          }
        }
        
        // Create the Supabase client
        const client = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        });
        
        // Set the client immediately so it's available
        setSupabase(client);
        
        // Test the connection with a simple query
        try {
          const response = await client
            .from('settings')
            .select('count(*)', { count: 'exact', head: true });
            
          if (response.error) {
            console.error('Supabase connection test failed:', response.error);
            setError(`Failed to connect to Supabase: ${response.error.message}`);
          } else {
            console.log('Supabase connection test successful');
            setError(null);
          }
        } catch (connectionErr) {
          console.error('Error testing Supabase connection:', connectionErr);
          setError(`Failed to connect to Supabase: ${connectionErr instanceof Error ? connectionErr.message : 'Unknown error'}`);
        }
        
        console.log('Supabase client initialization completed');
      } catch (err) {
        console.error('Error initializing Supabase client:', err);
        setError(`Failed to initialize Supabase client: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setSupabase(null);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isInitialized, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}; 