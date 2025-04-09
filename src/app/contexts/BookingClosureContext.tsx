'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BookingClosureContextType {
  isClosed: boolean;
  closureEndTime: Date | null;
  closeBookings: (hours: number) => void;
  reopenBookings: () => void;
  formatClosureTime: () => string | null;
  remainingTime: string | null;
  isLoading: boolean;
}

const defaultContext: BookingClosureContextType = {
  isClosed: false,
  closureEndTime: null,
  closeBookings: () => {},
  reopenBookings: () => {},
  formatClosureTime: () => null,
  remainingTime: null,
  isLoading: true
};

const BookingClosureContext = createContext<BookingClosureContextType>(defaultContext);

export const useBookingClosure = () => useContext(BookingClosureContext);

export const BookingClosureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClosed, setIsClosed] = useState(false); // Default to open until we check
  const [closureEndTime, setClosureEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load booking closure status from API
  useEffect(() => {
    async function fetchClosureStatus() {
      try {
        const response = await fetch('/api/settings/booking_closure');
        
        if (!response.ok) {
          if (response.status === 404) {
            // Setting not found - initialize with default (open)
            await updateClosureStatus(false, null);
            setClosureEndTime(null);
            setIsClosed(false);
          } else {
            console.error('Error fetching closure status:', await response.text());
          }
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log("Booking closure data:", data);
        
        // Check if the data is in the new format (direct object) or old format (nested in value)
        const closureData = data.value || data;
        
        if (closureData) {
          setIsClosed(!!closureData.isClosed);
          
          if (closureData.endTime) {
            const endTime = new Date(closureData.endTime);
            
            if (endTime > new Date()) {
              setClosureEndTime(endTime);
            } else if (closureData.isClosed) {
              // End time passed but status is still closed
              setIsClosed(true);
              setClosureEndTime(null);
              await updateClosureStatus(true, null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch booking closure status:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchClosureStatus();
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
        updateClosureStatus(false, null);
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

  // Update booking closure in API
  const updateClosureStatus = async (closed: boolean, endTime: Date | null) => {
    try {
      const response = await fetch('/api/settings/booking_closure', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: {
            isClosed: closed,
            endTime: endTime ? endTime.toISOString() : null
          }
        }),
      });
      
      if (!response.ok) {
        console.error('Error updating closure status:', await response.text());
      }
    } catch (error) {
      console.error('Failed to update booking closure status:', error);
    }
  };

  const closeBookings = (hours: number) => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    setClosureEndTime(endTime);
    setIsClosed(true);
    updateClosureStatus(true, endTime);
  };

  const reopenBookings = () => {
    setIsClosed(false);
    setClosureEndTime(null);
    setRemainingTime(null);
    updateClosureStatus(false, null);
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
        remainingTime,
        isLoading
      }}
    >
      {children}
    </BookingClosureContext.Provider>
  );
}; 