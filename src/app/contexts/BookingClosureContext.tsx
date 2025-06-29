'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';

interface BookingClosureContextType {
  isClosed: boolean;
  closureEndTime: Date | null;
  closeBookings: (hours: number) => Promise<void>;
  reopenBookings: () => Promise<void>;
  updateClosureStatus: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  remainingTime: string | null;
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
  const [retryCount, setRetryCount] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const MAX_RETRIES = 3;

  // Use ref to access updateClosureStatus without triggering re-renders
  const updateClosureStatusRef = useRef<() => Promise<void>>(() => Promise.resolve());
  
  // Calculate remaining time based on closure status
  useEffect(() => {
    if (!isClosed || !closureEndTime) {
      setRemainingTime(null);
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(closureEndTime);
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setRemainingTime(null);
        // Reopen bookings if end time has passed
        if (updateClosureStatusRef.current) {
          updateClosureStatusRef.current();
        }
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      setRemainingTime(`${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [isClosed, closureEndTime]);

  // Define reopenBookings first since it's used in updateClosureStatus
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

  // Define updateClosureStatus with useCallback to memoize it
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
        
        // If we get a consistent error, stop retrying after MAX_RETRIES
        if (retryCount >= MAX_RETRIES) {
          console.log(`Max retries (${MAX_RETRIES}) reached, setting default values`);
          if (isMounted) {
            setIsClosed(false);
            setClosureEndTime(null);
            // Don't show this error to the user, just log to console
            console.log('Unable to fetch booking closure status. Using default settings.');
            setError(null);
          }
        } else {
          // Increment retry count
          setRetryCount(prevCount => prevCount + 1);
          
          // Set an error for the UI - but only for server errors, not auth issues
          if (response.status !== 401 && response.status !== 403) {
            if (isMounted) {
              setError(`Failed to fetch booking closure status (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            }
          } else {
            // For auth issues, don't show error to the user
            console.log('Authentication required for booking closure settings. Using default values.');
            setError(null);
            // Set default values
            setIsClosed(false);
            setClosureEndTime(null);
          }
        }
        return;
      }
      
      // Reset retry count on success
      setRetryCount(0);
      
      const data = await response.json();
      console.log('Booking closure data:', data);
      
      if (data && data.value) {
        try {
          // Handle both string and object values
          const closureData = typeof data.value === 'string' 
            ? JSON.parse(data.value) 
            : data.value;
          
          if (closureData.isClosed) {
            const endTime = new Date(closureData.endTime);
            if (endTime > new Date()) {
              if (isMounted) {
                setIsClosed(true);
                setClosureEndTime(endTime);
                setError(null);
              }
            } else {
              // End time has passed, reopen bookings
              await reopenBookings();
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
            setError('Error parsing booking closure data');
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
        if (retryCount >= MAX_RETRIES) {
          setIsClosed(false);
          setClosureEndTime(null);
          setError(null); // Don't show errors to the user
          console.log('Unable to connect to the server after multiple attempts. Using default settings.');
        } else {
          setRetryCount(prevCount => prevCount + 1);
          
          // Only show error if it's not auth-related
          const errorMsg = err instanceof Error ? err.message : 'Connection error';
          if (!errorMsg.includes('Authentication') && !errorMsg.includes('401')) {
            setError(`Connection error (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
          } else {
            setError(null);
            // Set default values
            setIsClosed(false);
            setClosureEndTime(null);
          }
        }
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsUpdating(false);
        setInitialized(true);
      }
    }
  }, [MAX_RETRIES, isMounted, isUpdating, reopenBookings, retryCount]);

  // Assign the updateClosureStatus function to the ref when it changes
  useEffect(() => {
    updateClosureStatusRef.current = updateClosureStatus;
  }, [updateClosureStatus]);

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

  useEffect(() => {
    // Initial load
    if (!initialized && updateClosureStatusRef.current) {
      updateClosureStatusRef.current();
    }
    
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
  }, [initialized, isClosed, closureEndTime, updateClosureStatus]);

  return (
    <BookingClosureContext.Provider
      value={{
        isClosed,
        closureEndTime,
        closeBookings,
        reopenBookings,
        updateClosureStatus,
        isLoading,
        error,
        remainingTime
      }}
    >
      {children}
    </BookingClosureContext.Provider>
  );
}; 