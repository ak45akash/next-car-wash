'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock, FaCar, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';

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
};

const services = [
  { id: 'basic-wash', name: 'Basic Wash', price: '₹499' },
  { id: 'premium-wash', name: 'Premium Wash', price: '₹799' },
  { id: 'steam-wash', name: 'Steam Wash', price: '₹999' },
  { id: 'interior-detailing', name: 'Interior Detailing', price: '₹1,499' },
  { id: 'exterior-detailing', name: 'Exterior Detailing', price: '₹1,999' },
  { id: 'full-detailing', name: 'Full Detailing', price: '₹2,999' },
  { id: 'ppf', name: 'Paint Protection Film (PPF)', price: '₹15,999' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedService, setSelectedService] = useState('basic-wash');
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormValues>();
  
  const paymentMethod = watch('paymentMethod');
  const servicePrice = services.find(service => service.id === selectedService)?.price || '';

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Booking data:', {
      ...data,
      date: selectedDate,
      service: selectedService,
      price: servicePrice
    });
    
    // Reset form and show success message
    reset();
    setSelectedDate(null);
    setSelectedService('basic-wash');
    setBookingCompleted(true);
    setIsProcessing(false);
  };

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
                {service.name} - {service.price}
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
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register('time', { required: true })}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <label className="block text-gray-700 mb-4 font-medium">
            Payment Method <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="payment-later"
                value="pay-later"
                className="w-4 h-4 text-blue-600"
                {...register('paymentMethod', { required: true })}
              />
              <label htmlFor="payment-later" className="ml-2 block text-gray-700">
                Pay at Center
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="payment-upi"
                value="upi"
                className="w-4 h-4 text-blue-600"
                {...register('paymentMethod', { required: true })}
              />
              <label htmlFor="payment-upi" className="ml-2 block text-gray-700">
                Pay Now via UPI
              </label>
            </div>
          </div>
          
          {paymentMethod === 'upi' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="mb-2 font-medium">UPI QR Code</p>
              <div className="flex flex-col items-center mb-4">
                <p className="text-sm mb-2">Scan this QR code or use UPI ID</p>
                <div className="w-40 h-40 bg-white p-2 border border-gray-300 flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                    alt="UPI QR Code"
                    className="max-w-full max-h-full"
                  />
                </div>
                <p className="mt-2 font-medium">UPI ID: shinewash@ybl</p>
              </div>
              
              <div className="mb-3">
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Enter your UPI Transaction ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Transaction ID"
                  {...register('upiId', { 
                    required: paymentMethod === 'upi' ? 'UPI Transaction ID is required' : false
                  })}
                />
                {errors.upiId && <p className="mt-1 text-red-500 text-sm">{errors.upiId.message}</p>}
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full btn-primary py-3 flex items-center justify-center"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    </div>
  );
};

export default BookingForm; 