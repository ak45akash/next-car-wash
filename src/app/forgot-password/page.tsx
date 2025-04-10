'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setFormError(null);
    setSuccessMessage(null);
    
    // Form validation
    if (!email.trim()) {
      setFormError('Please enter your email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!supabase) {
        setFormError('Unable to connect to authentication service');
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        setFormError(error.message);
      } else {
        setSuccessMessage('Password reset instructions have been sent to your email');
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setFormError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
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
            Forgot Password
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Enter your email address and we'll send you instructions to reset your password
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
                  Sending...
                </div>
              ) : (
                'Send Reset Instructions'
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

export default ForgotPasswordPage; 