'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSearch, FaFilter, FaPlus, FaCalendarTimes, FaClock } from 'react-icons/fa';
import { useBookingClosure } from '../../contexts/BookingClosureContext';

// Mock booking data
const bookings = [
  {
    id: 1,
    customer: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 95555 12345',
    service: 'Premium Wash',
    date: '2023-03-18',
    time: '10:30 AM',
    status: 'Completed',
    payment: 'Paid',
    amount: 899
  },
  {
    id: 2,
    customer: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 98765 54321',
    service: 'Interior Detailing',
    date: '2023-03-18',
    time: '11:45 AM',
    status: 'In Progress',
    payment: 'Paid',
    amount: 1499
  },
  {
    id: 3,
    customer: 'Amit Singh',
    email: 'amit.s@example.com',
    phone: '+91 87654 32198',
    service: 'Ceramic Coating',
    date: '2023-03-18',
    time: '1:30 PM',
    status: 'Upcoming',
    payment: 'Pending',
    amount: 8999
  },
  {
    id: 4,
    customer: 'Neha Verma',
    email: 'neha.v@example.com',
    phone: '+91 77777 88888',
    service: 'Express Wash',
    date: '2023-03-19',
    time: '9:00 AM',
    status: 'Upcoming',
    payment: 'Pending',
    amount: 499
  },
  {
    id: 5,
    customer: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 99999 11111',
    service: 'Full Detailing',
    date: '2023-03-19',
    time: '10:15 AM',
    status: 'Upcoming',
    payment: 'Paid',
    amount: 2999
  }
];

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bookingsData, setBookingsData] = useState(bookings);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  
  // Booking closure state
  const [closureHours, setClosureHours] = useState(1);
  const [showClosureModal, setShowClosureModal] = useState(false);
  
  // Use the booking closure context
  const { isClosed, remainingTime, closeBookings, reopenBookings } = useBookingClosure();
  
  // Filter bookings based on search term and status filter
  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      booking.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Handle booking cancellation
  const handleCancelClick = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowConfirmModal(true);
  };

  const confirmCancelBooking = () => {
    if (bookingToCancel !== null) {
      const updatedBookings = bookingsData.map(booking => 
        booking.id === bookingToCancel 
          ? { ...booking, status: 'Cancelled' } 
          : booking
      );
      setBookingsData(updatedBookings);
      setShowConfirmModal(false);
      setBookingToCancel(null);
    }
  };

  // Handle booking closure
  const handleClosureClick = () => {
    setShowClosureModal(true);
  };

  const confirmClosureAction = () => {
    closeBookings(closureHours);
    setShowClosureModal(false);
  };

  const getStatusClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentClass = (payment: string) => {
    switch(payment.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
          <p className="text-gray-600">Manage all customer bookings.</p>
        </div>
        <div>
          {isClosed ? (
            <div className="flex flex-col items-end">
              <div className="mb-2 text-right">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium inline-flex items-center">
                  <FaCalendarTimes className="mr-1" /> Bookings Closed
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {remainingTime ? `Reopens in ${remainingTime}` : 'Temporarily closed'}
                </p>
              </div>
              <button 
                onClick={reopenBookings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Reopen Bookings
              </button>
            </div>
          ) : (
            <button 
              onClick={handleClosureClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaCalendarTimes className="mr-2 -ml-1 h-4 w-4" />
              Close Bookings
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
                <option value="upcoming">Upcoming</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              New Booking
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{booking.customer}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentClass(booking.payment)}`}>
                      {booking.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{booking.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    {booking.status.toLowerCase() !== 'cancelled' && (
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleCancelClick(booking.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No bookings found matching your search criteria.</p>
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredBookings.length}</span> of{' '}
              <span className="font-medium">{bookingsData.length}</span> bookings
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cancel Booking</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 mr-2 shadow-sm hover:bg-gray-400"
                >
                  No
                </button>
                <button
                  onClick={confirmCancelBooking}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 shadow-sm hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Closure Modal */}
      {showClosureModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Close Bookings</h3>
              <div className="mt-4 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  This will temporarily disable the booking form on your website. Customers will not be able to make new bookings until you reopen it.
                </p>
                <div className="flex items-center justify-center mb-4">
                  <FaClock className="text-gray-500 mr-2" />
                  <label htmlFor="closureHours" className="block text-sm font-medium text-gray-700 mr-3">
                    Close for
                  </label>
                  <select
                    id="closureHours"
                    className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={closureHours}
                    onChange={(e) => setClosureHours(Number(e.target.value))}
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={8}>8 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>24 hours</option>
                    <option value={48}>2 days</option>
                    <option value={72}>3 days</option>
                  </select>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowClosureModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 mr-2 shadow-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClosureAction}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 shadow-sm hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 