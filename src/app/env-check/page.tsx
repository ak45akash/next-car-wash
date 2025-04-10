'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<{[key: string]: string | undefined}>({});
  const { supabase, isInitialized, error: supabaseError } = useSupabase();

  useEffect(() => {
    // Collect all environment variables
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : undefined,
    };
    
    setEnvVars(env);
  }, []);

  const pingSupabase = async () => {
    if (!supabase) {
      return 'Supabase client not available';
    }
    
    try {
      const start = Date.now();
      const { error } = await supabase.from('settings').select('count(*)', { count: 'exact', head: true });
      const duration = Date.now() - start;
      
      if (error) {
        return `Error connecting to Supabase: ${error.message} (${duration}ms)`;
      }
      
      return `Successfully connected to Supabase in ${duration}ms`;
    } catch (err) {
      return `Exception connecting to Supabase: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <ul className="space-y-2">
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} className="flex">
              <span className="font-mono text-sm bg-gray-100 p-1 rounded mr-2 w-72">{key}</span>
              <span className={`font-mono text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
                {value || 'Not set'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Supabase Context</h2>
        <ul className="space-y-2">
          <li className="flex">
            <span className="font-mono text-sm bg-gray-100 p-1 rounded mr-2 w-72">isInitialized</span>
            <span className={`font-mono text-sm ${isInitialized ? 'text-green-600' : 'text-yellow-600'}`}>
              {isInitialized ? 'Yes' : 'No'}
            </span>
          </li>
          <li className="flex">
            <span className="font-mono text-sm bg-gray-100 p-1 rounded mr-2 w-72">supabase client</span>
            <span className={`font-mono text-sm ${supabase ? 'text-green-600' : 'text-red-600'}`}>
              {supabase ? 'Available' : 'Not available'}
            </span>
          </li>
          <li className="flex">
            <span className="font-mono text-sm bg-gray-100 p-1 rounded mr-2 w-72">error</span>
            <span className={`font-mono text-sm ${!supabaseError ? 'text-green-600' : 'text-red-600'}`}>
              {supabaseError || 'None'}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Connection Test</h2>
        <button 
          onClick={async () => {
            const result = document.getElementById('ping-result');
            if (result) {
              result.textContent = 'Testing connection...';
              result.className = 'mt-4 p-2 bg-yellow-50 rounded';
              const pingResult = await pingSupabase();
              result.textContent = pingResult;
              result.className = pingResult.includes('Successfully') 
                ? 'mt-4 p-2 bg-green-50 rounded' 
                : 'mt-4 p-2 bg-red-50 rounded';
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Test Supabase Connection
        </button>
        <div id="ping-result" className="mt-4 p-2 bg-gray-50 rounded"></div>
      </div>
    </div>
  );
} 