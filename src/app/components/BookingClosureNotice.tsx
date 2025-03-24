'use client';

import React from 'react';
import { FaCalendarTimes, FaClock, FaSpinner } from 'react-icons/fa';
import { useBookingClosure } from '../contexts/BookingClosureContext';

export default function BookingClosureNotice() {
  const { isClosed, remainingTime, isLoading } = useBookingClosure();

  if (isLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-md mb-6 flex items-center justify-center">
        <FaSpinner className="animate-spin mr-2" />
        <span>Checking booking availability...</span>
      </div>
    );
  }

  if (!isClosed) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 flex items-center">
      <div className="flex-shrink-0 mr-3">
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <FaCalendarTimes className="h-5 w-5 text-red-600" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">Bookings Temporarily Closed</h3>
        <p className="text-sm mt-1 flex items-center">
          <FaClock className="mr-1 text-red-500" />
          {remainingTime ? (
            <>We'll be accepting new bookings in <span className="font-medium">{remainingTime}</span></>
          ) : (
            <>Bookings are temporarily unavailable. Please check back later.</>
          )}
        </p>
      </div>
    </div>
  );
} 