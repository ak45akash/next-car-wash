'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaFileDownload, FaSpinner } from 'react-icons/fa';

interface RevenueItem {
  month: string;
  amount: number;
}

interface ServicePopularity {
  name: string;
  count: number;
  percentage: number;
}

interface SatisfactionData {
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('yearly');
  const [downloadFormat, setDownloadFormat] = useState('csv');
  const [isLoading, setIsLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [servicePopularityData, setServicePopularityData] = useState<ServicePopularity[]>([]);
  const [customerSatisfactionData, setCustomerSatisfactionData] = useState<SatisfactionData>({
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    async function fetchReports() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/reports?period=${reportPeriod}`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setRevenueData(data.revenueData || []);
        setServicePopularityData(data.servicePopularityData || []);
        setCustomerSatisfactionData(data.customerSatisfactionData || { excellent: 0, good: 0, average: 0, poor: 0 });
        setTotalRevenue(data.totalRevenue || 0);
        setTotalServices(data.totalServices || 0);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, [reportPeriod]);

  const maxRevenueMonth = revenueData.length > 0
    ? revenueData.reduce((max, item) => (item.amount > max.amount ? item : max), revenueData[0])
    : { month: '—', amount: 0 };

  const maxRevenue = Math.max(...revenueData.map((r) => r.amount), 1);

  const handleDownload = () => {
    if (downloadFormat === 'csv') {
      const rows = [
        ['Month', 'Revenue'],
        ...revenueData.map((r) => [r.month, r.amount]),
        [],
        ['Service', 'Bookings', 'Percentage'],
        ...servicePopularityData.map((s) => [s.name, s.count, s.percentage]),
      ];
      const csv = rows.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportPeriod}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-24">
          <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

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
            <option value="csv">CSV Format</option>
            <option value="pdf">PDF Format</option>
            <option value="excel">Excel Format</option>
          </select>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFileDownload className="mr-2 -ml-1 h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Best month: </span>
            {maxRevenueMonth.month} (₹{maxRevenueMonth.amount.toLocaleString()})
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Services Performed</h3>
          <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
          {servicePopularityData[0] && (
            <p className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Most popular: </span>
              {servicePopularityData[0].name} ({servicePopularityData[0].percentage}%)
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h3>
          <p className="text-3xl font-bold text-gray-900">{customerSatisfactionData.excellent + customerSatisfactionData.good}%</p>
          <p className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Completed: </span>
            {customerSatisfactionData.excellent}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
        </div>
        <div className="p-6">
          <div className="h-64 w-full">
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500 py-2">
                <span>₹{Math.ceil(maxRevenue / 1000)}K</span>
                <span>₹{Math.ceil(maxRevenue * 0.75 / 1000)}K</span>
                <span>₹{Math.ceil(maxRevenue * 0.5 / 1000)}K</span>
                <span>₹{Math.ceil(maxRevenue * 0.25 / 1000)}K</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between items-end h-full ml-10">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-full max-w-10">
                    <div 
                      className="w-6 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600 cursor-pointer relative group"
                      style={{ height: `${maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0}%` }}
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Booking Status Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {(['excellent', 'good', 'average', 'poor'] as const).map((key) => {
                const colors = { excellent: 'bg-green-600', good: 'bg-blue-600', average: 'bg-yellow-500', poor: 'bg-red-500' };
                const labels = { excellent: 'Completed', good: 'Upcoming', average: 'Other', poor: 'Cancelled' };
                return (
                  <div key={key} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{labels[key]}</span>
                      <span className="text-sm font-medium text-gray-700">{customerSatisfactionData[key]}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${colors[key]} h-2.5 rounded-full`}
                        style={{ width: `${customerSatisfactionData[key]}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
