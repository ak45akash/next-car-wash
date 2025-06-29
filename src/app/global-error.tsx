'use client';

import { Inter } from "next/font/google";
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Application Error
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                The application has encountered a critical error.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm text-gray-500 mb-4">
                <p>Error details:</p>
                <p className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
                  {error.message || 'Unknown error occurred'}
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={reset}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try again
                </button>
                
                <p className="mt-6">
                  <Link href="/" className="text-blue-600 hover:text-blue-800">
                    Go back to homepage
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 