'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import React from 'react';

// Add a simple test component to verify Supabase connection
const SupabaseConnectionTest = () => {
  const [testResult, setTestResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/services');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error testing Supabase connection:', err);
      setError('Failed to connect to Supabase. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <h3 className="text-lg font-medium mb-2">Test Supabase Connection</h3>
      <button 
        onClick={testConnection}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {testResult && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Services Data from Supabase:</h4>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection />
      <Benefits />
      <Testimonials />
      <Footer />
      <div className="container mx-auto px-4 py-8">
        <SupabaseConnectionTest />
      </div>
    </>
  );
}
