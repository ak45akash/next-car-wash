'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface BookingClosureContextType {
  isClosed: boolean;
  closureEndTime: Date | null;
  closeBookings: (hours: number) => Promise<void>;
  reopenBookings: () => Promise<void>;
  updateClosureStatus: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const BookingClosureContext = createContext<BookingClosureContextType | undefined>(undefined);

export const useBookingClosure = () => {
  const context = useContext(BookingClosureContext);
  if (!context) {
    throw new Error('useBookingClosure must be used within a BookingClosureProvider');
  }
  return context;
};

interface BookingClosureProviderProps {
  children: ReactNode;
}

export const BookingClosureProvider: React.FC<BookingClosureProviderProps> = ({ children }) => {
  const [isClosed, setIsClosed] = useState(false);
  const [closureEndTime, setClosureEndTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateClosureStatus = useCallback(async () => {
    // Prevent multiple concurrent updates
    if (isUpdating) {
      console.log('Closure status update already in progress, skipping');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      console.log('Fetching booking closure status...');
      const response = await fetch('/api/settings/booking_closure');
      
      if (!response.ok) {
        console.log('Response from fetching booking closure status:', response.status, response.statusText);
        
        // For auth issues, don't show error to the user
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication required for booking closure settings. Using default values.');
          if (isMounted) {
            setError(null);
            setIsClosed(false);
            setClosureEndTime(null);
          }
        } else {
          console.log('Unable to fetch booking closure status. Using default settings.');
          if (isMounted) {
            setError(null);
            setIsClosed(false);
            setClosureEndTime(null);
          }
        }
        return;
      }
      
      const data = await response.json();
      console.log('Booking closure data:', data);
      
      if (data && data.value) {
        try {
          // Handle both string and object values
          let closureData;
          if (typeof data.value === 'string') {
            // Validate JSON before parsing
            if (data.value.trim() === '' || data.value === 'null' || data.value === 'undefined') {
              closureData = { isClosed: false, endTime: null };
            } else {
              try {
                closureData = JSON.parse(data.value);
              } catch (jsonError) {
                console.error('Invalid JSON in booking closure data:', data.value, jsonError);
                closureData = { isClosed: false, endTime: null };
              }
            }
          } else {
            closureData = data.value;
          }
          
          if (closureData.isClosed) {
            const endTime = new Date(closureData.endTime);
            if (endTime > new Date()) {
              if (isMounted) {
                setIsClosed(true);
                setClosureEndTime(endTime);
                setError(null);
              }
            } else {
              // End time has passed, just update the UI
              if (isMounted) {
                setIsClosed(false);
                setClosureEndTime(null);
                setError(null);
              }
            }
          } else {
            if (isMounted) {
              setIsClosed(false);
              setClosureEndTime(null);
              setError(null);
            }
          }
        } catch (parseErr) {
          console.error('Error parsing closure data:', parseErr);
          if (isMounted) {
            setError(null);
            setIsClosed(false);
            setClosureEndTime(null);
          }
        }
      } else {
        if (isMounted) {
          setIsClosed(false);
          setClosureEndTime(null);
          setError(null);
        }
      }
    } catch (err) {
      console.log('Exception in updateClosureStatus:', err);
      if (isMounted) {
        setIsClosed(false);
        setClosureEndTime(null);
        setError(null);
        console.log('Connection error. Using default settings.');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsUpdating(false);
      }
    }
  }, [isUpdating, isMounted]);

  const closeBookings = async (hours: number) => {
    setIsLoading(true);
    setError(null);
    
    // Define endTime outside the try block so it's accessible in the catch block
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    
    try {
      const closureData = {
        isClosed: true,
        endTime: endTime.toISOString(),
      };
      
      const response = await fetch('/api/settings/booking_closure', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: closureData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || response.statusText;
        
        console.log('Response from closing bookings:', response.status, errorMessage);
        
        // For auth errors, don't show to regular users, just log to console
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication/Permission issue - admin login required to update settings');
          
          // Just set the UI state without showing error
          if (isMounted) {
            setIsClosed(true);
            setClosureEndTime(endTime);
            setError(null);
          }
          return;
        } else {
          throw new Error(`Failed to close bookings: ${errorMessage}`);
        }
      }
      
      if (isMounted) {
        setIsClosed(true);
        setClosureEndTime(endTime);
        setError(null);
      }
    } catch (err) {
      console.log('Exception in closeBookings:', err);
      if (isMounted) {
        // Don't show error to user for auth issues
        const errorMsg = err instanceof Error ? err.message : 'Failed to close bookings';
        if (!errorMsg.includes('Authentication') && !errorMsg.includes('401')) {
          setError(errorMsg);
        } else {
          // For auth errors, still set the UI state as if it succeeded
          setIsClosed(true);
          setClosureEndTime(endTime);
          setError(null);
        }
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const reopenBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const closureData = {
        isClosed: false,
        endTime: null,
      };
      
      const response = await fetch('/api/settings/booking_closure', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: closureData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || response.statusText;
        
        // Log for debugging but don't show as error
        console.log('Response from reopening bookings:', response.status, errorMessage);
        
        // For auth errors, don't show to regular users, just log to console
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication/Permission issue - admin login required to update settings');
          
          // Just reset the UI state without showing error
          if (isMounted) {
            setIsClosed(false);
            setClosureEndTime(null);
            setError(null);
          }
          return;
        } else {
          throw new Error(`Failed to reopen bookings: ${errorMessage}`);
        }
      }
      
      if (isMounted) {
        setIsClosed(false);
        setClosureEndTime(null);
        setError(null);
      }
    } catch (err) {
      // Don't log error to console to avoid red error messages
      if (isMounted) {
        // Don't show error to user for auth issues
        const errorMsg = err instanceof Error ? err.message : 'Failed to reopen bookings';
        if (!errorMsg.includes('Authentication') && !errorMsg.includes('401')) {
          setError(errorMsg);
        } else {
          setError(null);
        }
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    // Initial load - only run once when component mounts
    updateClosureStatus();
    
    // Check every minute if the closure end time has passed
    const interval = setInterval(() => {
      if (isClosed && closureEndTime && closureEndTime < new Date()) {
        // When the closure time has passed, just update the UI without making API call
        setIsClosed(false);
        setClosureEndTime(null);
        setError(null);
      }
    }, 60000);
    
    return () => {
      setIsMounted(false);
      clearInterval(interval);
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <BookingClosureContext.Provider
      value={{
        isClosed,
        closureEndTime,
        closeBookings,
        reopenBookings,
        updateClosureStatus,
        isLoading,
        error
      }}
    >
      {children}
    </BookingClosureContext.Provider>
  );
}; 