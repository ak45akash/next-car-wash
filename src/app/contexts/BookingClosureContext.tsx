'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BookingClosureContextType {
  isClosed: boolean;
  closureEndTime: Date | null;
  closeBookings: (hours: number) => void;
  reopenBookings: () => void;
  formatClosureTime: () => string | null;
  remainingTime: string | null;
}

const defaultContext: BookingClosureContextType = {
  isClosed: false,
  closureEndTime: null,
  closeBookings: () => {},
  reopenBookings: () => {},
  formatClosureTime: () => null,
  remainingTime: null
};

const BookingClosureContext = createContext<BookingClosureContextType>(defaultContext);

export const useBookingClosure = () => useContext(BookingClosureContext);

export const BookingClosureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [closureEndTime, setClosureEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  // Check local storage on initial load
  useEffect(() => {
    const storedEndTime = localStorage.getItem('bookingClosureEndTime');
    if (storedEndTime) {
      const endTime = new Date(storedEndTime);
      if (endTime > new Date()) {
        setClosureEndTime(endTime);
        setIsClosed(true);
      } else {
        // If end time has passed, clear storage
        localStorage.removeItem('bookingClosureEndTime');
      }
    }
  }, []);

  // Update remaining time every minute
  useEffect(() => {
    if (!closureEndTime) return;
    
    const updateRemainingTime = () => {
      const now = new Date();
      if (closureEndTime <= now) {
        setIsClosed(false);
        setClosureEndTime(null);
        setRemainingTime(null);
        localStorage.removeItem('bookingClosureEndTime');
        return;
      }
      
      const diffMs = closureEndTime.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeStr = '';
      if (diffHrs > 0) {
        timeStr += `${diffHrs} hour${diffHrs > 1 ? 's' : ''}`;
      }
      if (diffMins > 0 || diffHrs === 0) {
        if (diffHrs > 0) timeStr += ' and ';
        timeStr += `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
      }
      
      setRemainingTime(timeStr);
    };
    
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [closureEndTime]);

  const closeBookings = (hours: number) => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    setClosureEndTime(endTime);
    setIsClosed(true);
    localStorage.setItem('bookingClosureEndTime', endTime.toISOString());
  };

  const reopenBookings = () => {
    setIsClosed(false);
    setClosureEndTime(null);
    setRemainingTime(null);
    localStorage.removeItem('bookingClosureEndTime');
  };

  const formatClosureTime = () => {
    if (!closureEndTime) return null;
    return closureEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BookingClosureContext.Provider
      value={{
        isClosed,
        closureEndTime,
        closeBookings,
        reopenBookings,
        formatClosureTime,
        remainingTime
      }}
    >
      {children}
    </BookingClosureContext.Provider>
  );
}; 