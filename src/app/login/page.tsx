'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSupabase } from '../contexts/SupabaseContext';

// Remove dynamic exports
// const dynamic = 'force-dynamic';
// const fetchCache = 'force-no-store';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const { signIn, user, loading, error: authError } = useAuth();
  const { supabase, isInitialized, error: supabaseError } = useSupabase();
  const router = useRouter();

  // Modify redirect behavior to avoid loops
  useEffect(() => {
    if (user && !loading) {
      console.log('User already logged in, will redirect to dashboard');
      // Check if we're not already on the dashboard
      if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Debug function to check Supabase initialization
  const checkSupabaseDebug = () => {
    if (!isInitialized) {
      setDebugInfo('Supabase is still initializing...');
      return;
    }
    
    if (supabaseError) {
      setDebugInfo(`Supabase initialization error: ${supabaseError}`);
      return;
    }
    
    if (!supabase) {
      setDebugInfo('Supabase client is null, but initialization is complete. Check environment variables.');
      return;
    }
    
    setDebugInfo('Supabase client is initialized and ready to use.');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      setDebugInfo(debugInfo => `${debugInfo}\nMissing NEXT_PUBLIC_SUPABASE_URL environment variable.`);
    }
    
    if (!supabaseKey) {
      setDebugInfo(debugInfo => `${debugInfo}\nMissing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors
    setFormError(null);
    
    // Form validation
    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setFormError('Please enter your password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const { error, success } = await signIn(email, password);
      
      if (error) {
        setFormError(error);
      } else if (success) {
        // Successful login will trigger the useEffect redirect
        console.log('Login successful');
      } else {
        setFormError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 rounded-lg bg-white shadow-md flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Diamond Car Wash Logo"
                width={120}
                height={120}
                className="h-auto"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Welcome Back
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
              Sign in to access your Diamond Car Wash dashboard
            </p>
            
            {(formError || authError) && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{formError || authError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account? Contact admin to get access.
        </p>
        
        {/* Debug button */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg max-w-md w-full">
          <button
            onClick={checkSupabaseDebug}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Check Supabase Status
          </button>
          
          {debugInfo && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-800 whitespace-pre-line">
              {debugInfo}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default LoginPage; 