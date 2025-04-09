'use client';

import Link from 'next/link';
import DashboardLayout from './components/DashboardLayout';

export default function DashboardNotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              404 - Page Not Found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The dashboard page you are looking for does not exist or has been moved.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/dashboard" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 