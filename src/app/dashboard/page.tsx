'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardCard from './components/DashboardCard';
import { FaCar, FaClock, FaUserFriends, FaDollarSign } from 'react-icons/fa';
import ProtectedRoute from '../components/ProtectedRoute';

interface DashboardStats {
  todayBookings: number;
  totalCustomers: number;
  serviceInProgress: number;
  totalRevenue: number;
  bookingsChange: number;
  customersChange: number;
  revenueChange: number;
}

interface RecentBooking {
  id: number;
  customer_name: string;
  service: string;
  time: string;
  status: string;
}

interface PopularService {
  name: string;
  count: number;
  percentage: number;
}

function formatChange(value: number, prefix = '') {
  if (value === 0) return '';
  const sign = value > 0 ? '+' : '';
  return `${sign}${prefix}${value.toLocaleString()}`;
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayBookings: 0,
    totalCustomers: 0,
    serviceInProgress: 0,
    totalRevenue: 0,
    bookingsChange: 0,
    customersChange: 0,
    revenueChange: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data.stats);
        setRecentBookings(data.recentBookings || []);
        setPopularServices(data.popularServices || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Today's Bookings"
            value={loading ? '...' : stats.todayBookings.toString()}
            icon={<FaClock className="w-8 h-8 text-blue-600" />}
            change={stats.bookingsChange !== 0 ? `${formatChange(stats.bookingsChange)} from yesterday` : ''}
            positive={stats.bookingsChange >= 0}
          />
          <DashboardCard 
            title="Total Customers"
            value={loading ? '...' : stats.totalCustomers.toString()}
            icon={<FaUserFriends className="w-8 h-8 text-green-600" />}
            change={stats.customersChange > 0 ? `+${stats.customersChange} this week` : ''}
            positive={true}
          />
          <DashboardCard 
            title="Services in Progress"
            value={loading ? '...' : stats.serviceInProgress.toString()}
            icon={<FaCar className="w-8 h-8 text-yellow-600" />}
            change=""
          />
          <DashboardCard 
            title="Total Revenue"
            value={loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
            icon={<FaDollarSign className="w-8 h-8 text-purple-600" />}
            change={stats.revenueChange !== 0 ? `${formatChange(stats.revenueChange, '₹')} from yesterday` : ''}
            positive={stats.revenueChange >= 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                        {loading ? 'Loading bookings...' : 'No recent bookings'}
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.service}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.time}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Popular Services</h2>
            <div className="space-y-4">
              {popularServices.length === 0 ? (
                <p className="text-sm text-gray-500">{loading ? 'Loading...' : 'No service data yet'}</p>
              ) : (
                popularServices.map((service) => (
                  <div key={service.name} className="flex items-center">
                    <div className="w-full flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{service.name}</span>
                        <span className="text-sm font-medium text-gray-700">{service.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${service.percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
