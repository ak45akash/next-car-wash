'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaFileDownload } from 'react-icons/fa';

// Mock data for reports
const revenueData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 61000 },
  { month: 'Apr', amount: 58000 },
  { month: 'May', amount: 63000 },
  { month: 'Jun', amount: 72000 },
  { month: 'Jul', amount: 85000 },
  { month: 'Aug', amount: 93000 },
  { month: 'Sep', amount: 80000 },
  { month: 'Oct', amount: 77000 },
  { month: 'Nov', amount: 82000 },
  { month: 'Dec', amount: 91000 }
];

const servicePopularityData = [
  { name: 'Premium Wash', count: 320, percentage: 40 },
  { name: 'Interior Detailing', count: 180, percentage: 22.5 },
  { name: 'Express Wash', count: 150, percentage: 18.75 },
  { name: 'Ceramic Coating', count: 80, percentage: 10 },
  { name: 'Full Detailing', count: 70, percentage: 8.75 }
];

const customerSatisfactionData = {
  excellent: 63,
  good: 28,
  average: 7,
  poor: 2
};

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('yearly');
  const [downloadFormat, setDownloadFormat] = useState('pdf');

  // Calculate totals
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);
  const totalServices = servicePopularityData.reduce((sum, item) => sum + item.count, 0);
  
  // Find max revenue month for display
  const maxRevenueMonth = revenueData.reduce((max, item) => 
    item.amount > max.amount ? item : max, revenueData[0]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600">View insights and analytics about your business performance.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
          >
            <option value="weekly">Last 7 days</option>
            <option value="monthly">Last 30 days</option>
            <option value="quarterly">Last 3 months</option>
            <option value="yearly">Last 12 months</option>
          </select>
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
          >
            <option value="pdf">PDF Format</option>
            <option value="excel">Excel Format</option>
            <option value="csv">CSV Format</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaFileDownload className="mr-2 -ml-1 h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">+12.5% </span>
            <span className="text-gray-500 ml-1">from previous period</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Best month: </span>
            {maxRevenueMonth.month} (₹{maxRevenueMonth.amount.toLocaleString()})
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Services Performed</h3>
          <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">+8.3% </span>
            <span className="text-gray-500 ml-1">from previous period</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Most popular: </span>
            {servicePopularityData[0].name} ({servicePopularityData[0].percentage}%)
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Satisfaction</h3>
          <p className="text-3xl font-bold text-gray-900">{customerSatisfactionData.excellent + customerSatisfactionData.good}%</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 font-medium">+5.2% </span>
            <span className="text-gray-500 ml-1">from previous period</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Excellent ratings: </span>
            {customerSatisfactionData.excellent}%
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        <div className="p-6">
          <div className="h-64 w-full">
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
                <span>₹100K</span>
                <span>₹75K</span>
                <span>₹50K</span>
                <span>₹25K</span>
                <span>₹0</span>
              </div>
              {/* Chart bars */}
              <div className="flex justify-between items-end h-full ml-10">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-full max-w-10">
                    <div 
                      className="w-6 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600 cursor-pointer relative group"
                      style={{ height: `${(item.amount / 100000) * 100}%` }}
                    >
                      <div className="hidden group-hover:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        ₹{item.amount.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Service Popularity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {servicePopularityData.map((service, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    <span className="text-sm font-medium text-gray-700">{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{service.count} bookings</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Customer Satisfaction</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Excellent</span>
                  <span className="text-sm font-medium text-gray-700">{customerSatisfactionData.excellent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${customerSatisfactionData.excellent}%` }}
                  ></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Good</span>
                  <span className="text-sm font-medium text-gray-700">{customerSatisfactionData.good}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${customerSatisfactionData.good}%` }}
                  ></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Average</span>
                  <span className="text-sm font-medium text-gray-700">{customerSatisfactionData.average}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: `${customerSatisfactionData.average}%` }}
                  ></div>
                </div>
              </div>
              <div className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Poor</span>
                  <span className="text-sm font-medium text-gray-700">{customerSatisfactionData.poor}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: `${customerSatisfactionData.poor}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 