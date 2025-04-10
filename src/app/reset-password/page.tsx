'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setFormError(null);
    setSuccessMessage(null);
    
    // Form validation
    if (!password.trim()) {
      setFormError('Please enter a new password');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!supabase) {
        setFormError('Unable to connect to authentication service');
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setFormError(error.message);
      } else {
        setSuccessMessage('Your password has been successfully reset');
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setFormError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Check if we have a valid session when the component mounts
    const checkSession = async () => {
      if (!supabase) {
        setFormError('Unable to connect to authentication service');
        return;
      }
      
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // No valid session, redirect to login
        setFormError('Your password reset link has expired or is invalid');
      }
    };
    
    checkSession();
  }, [router]);

  // Add debug function to check session
  const checkSessionDebug = async () => {
    try {
      if (!supabase) {
        setDebugInfo('Supabase client not available');
        return;
      }
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setDebugInfo(`Error getting session: ${error.message}`);
        return;
      }
      
      if (!data.session) {
        setDebugInfo('No active session found. You need a valid session to reset your password.');
      } else {
        setDebugInfo(`Active session found for user: ${data.session.user.email || data.session.user.id}
Last sign in: ${new Date(data.session.user.last_sign_in_at || '').toLocaleString()}
Session expires: ${new Date(data.session.expires_at || 0 * 1000).toLocaleString()}`);
      }
    } catch (err) {
      setDebugInfo(`Error checking session: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
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
            Reset Password
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Enter your new password
          </p>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{formError}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p>{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                disabled={isSubmitting || !!successMessage}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
                disabled={isSubmitting || !!successMessage}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={isSubmitting || !!successMessage}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
          
          {successMessage && (
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/login')}
                className="mt-2 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Return to Login
              </button>
            </div>
          )}
          
          {/* Debug button */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={checkSessionDebug}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Check Session Status
            </button>
            
            {debugInfo && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-800 whitespace-pre-line">
                {debugInfo}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 flex space-x-1">
        <span>Remember your password?</span>
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 