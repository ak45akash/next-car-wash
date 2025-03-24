'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock, FaCar, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import { useBookingClosure } from '../contexts/BookingClosureContext';
import BookingClosureNotice from './BookingClosureNotice';
import { createBooking, getServices } from '@/lib/supabase';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  carModel: string;
  service: string;
  date: Date | null;
  time: string;
  paymentMethod: string;
  upiId?: string;
  terms: boolean;
};

type Service = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  duration: number;
  status: string;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState('');
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormValues>();
  const { isClosed } = useBookingClosure();
  
  const paymentMethod = watch('paymentMethod');
  const selectedServiceObject = services.find(service => service.id === selectedService);
  const servicePrice = selectedServiceObject ? `₹${selectedServiceObject.price}` : '';

  useEffect(() => {
    async function loadServices() {
      try {
        const serviceData = await getServices();
        setServices(serviceData || []);
        if (serviceData && serviceData.length > 0) {
          setSelectedService(serviceData[0].id);
        }
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    
    loadServices();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedDate) {
      return; // Date validation
    }
    
    setIsProcessing(true);
    
    try {
      // Format date for database
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Find service details
      const service = services.find(s => s.id === selectedService);
      
      // Create booking object
      const bookingData = {
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        car_model: data.carModel,
        service_id: selectedService,
        service_name: service?.name || '',
        service_price: service?.price || 0,
        date: formattedDate,
        time_slot: data.time,
        payment_method: data.paymentMethod,
        upi_id: data.upiId || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      // Submit to Supabase
      await createBooking(bookingData);
      
      // Reset form and show success message
      reset();
      setSelectedDate(null);
      if (services.length > 0) {
        setSelectedService(services[0].id);
      }
      setBookingCompleted(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn-primary"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (bookingCompleted) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg shadow-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="heading-lg mb-4 text-green-600">Booking Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your car wash appointment has been scheduled. A confirmation has been sent to your email.
        </p>
        <button 
          onClick={() => setBookingCompleted(false)}
          className="btn-primary"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Your Appointment</h2>
      
      <BookingClosureNotice />
      
      {isClosed ? (
        <div className="text-center py-12">
          <div className="animate-pulse">
            <Image 
              src="/images/closed.svg"
              alt="Bookings Closed"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="text-gray-500 mt-4">
              Please check back later when our booking system reopens.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your name"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your phone number"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number'
                    }
                  })}
                />
              </div>
              {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Your email address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Car Model <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCar className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.carModel ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Honda City, Maruti Swift"
                  {...register('carModel', { required: 'Car model is required' })}
                />
              </div>
              {errors.carModel && <p className="mt-1 text-red-500 text-sm">{errors.carModel.message}</p>}
            </div>
          </div>
          
          {/* Service Selection */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Select Service <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₹{service.price}
                </option>
              ))}
            </select>
            <input type="hidden" {...register('service', { required: true })} value={selectedService} />
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Select Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholderText="Select a date"
                />
              </div>
              {!selectedDate && errors.date && <p className="mt-1 text-red-500 text-sm">Date is required</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Select Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <select
                  className={`w-full pl-10 pr-3 py-2 rounded-md border ${errors.time ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register('time', { required: 'Time is required' })}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              {errors.time && <p className="mt-1 text-red-500 text-sm">{errors.time.message}</p>}
            </div>
          </div>
          
          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 mb-4 font-medium">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="relative flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="cash"
                  className="mr-2"
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                />
                <span className="ml-2">Pay at Location</span>
              </label>
              
              <label className="relative flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="card"
                  className="mr-2"
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                />
                <span className="ml-2">Card Payment</span>
              </label>
              
              <label className="relative flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="upi"
                  className="mr-2"
                  {...register('paymentMethod', { required: 'Payment method is required' })}
                />
                <span className="ml-2">UPI Payment</span>
              </label>
            </div>
            {errors.paymentMethod && <p className="mt-1 text-red-500 text-sm">{errors.paymentMethod.message}</p>}
            
            {paymentMethod === 'upi' && (
              <div className="mt-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-md border ${errors.upiId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="your-upi-id@bank"
                  {...register('upiId', { 
                    required: paymentMethod === 'upi' ? 'UPI ID is required' : false,
                    pattern: {
                      value: /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{3,}$/,
                      message: 'Please enter a valid UPI ID'
                    }
                  })}
                />
                {errors.upiId && <p className="mt-1 text-red-500 text-sm">{errors.upiId.message}</p>}
              </div>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                className="border-gray-300 rounded-sm focus:ring-blue-500 h-4 w-4 text-blue-600"
                {...register('terms', { required: 'You must accept the terms and conditions' })}
              />
            </div>
            <div className="ml-3">
              <label className="text-gray-700 text-sm">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
              {errors.terms && <p className="mt-1 text-red-500 text-sm">{errors.terms.message}</p>}
            </div>
          </div>
          
          {/* Price and Submit */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-200">
            <div className="mb-4 md:mb-0">
              <span className="text-gray-600">Total Price:</span>
              <span className="ml-2 font-bold text-2xl text-blue-600">{servicePrice}</span>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingForm; 