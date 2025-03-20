'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSearch, FaUserPlus, FaSortAmountDown } from 'react-icons/fa';

// Mock customer data
const customers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.s@example.com',
    phone: '+91 95555 12345',
    totalVisits: 8,
    lastVisit: '2023-03-18',
    totalSpent: 7299,
    joinDate: '2022-09-15'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+91 98765 54321',
    totalVisits: 5,
    lastVisit: '2023-03-18',
    totalSpent: 5499,
    joinDate: '2022-11-03'
  },
  {
    id: 3,
    name: 'Amit Singh',
    email: 'amit.s@example.com',
    phone: '+91 87654 32198',
    totalVisits: 3,
    lastVisit: '2023-03-18',
    totalSpent: 12999,
    joinDate: '2023-01-22'
  },
  {
    id: 4,
    name: 'Neha Verma',
    email: 'neha.v@example.com',
    phone: '+91 77777 88888',
    totalVisits: 2,
    lastVisit: '2023-03-15',
    totalSpent: 1499,
    joinDate: '2023-02-10'
  },
  {
    id: 5,
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 99999 11111',
    totalVisits: 1,
    lastVisit: '2023-03-17',
    totalSpent: 2999,
    joinDate: '2023-03-01'
  },
  {
    id: 6,
    name: 'Anjali Desai',
    email: 'anjali.d@example.com',
    phone: '+91 88888 22222',
    totalVisits: 6,
    lastVisit: '2023-03-10',
    totalSpent: 5899,
    joinDate: '2022-10-05'
  }
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(customer.name) ||
      searchRegex.test(customer.email) ||
      searchRegex.test(customer.phone)
    );
  });

  // Sort customers based on sort criteria
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a];
    let bValue = b[sortBy as keyof typeof b];
    
    // Convert to strings for comparison if they're not already
    if (typeof aValue !== 'string') aValue = String(aValue);
    if (typeof bValue !== 'string') bValue = String(bValue);
    
    if (sortOrder === 'asc') {
      return (aValue as string).localeCompare(bValue as string);
    } else {
      return (bValue as string).localeCompare(aValue as string);
    }
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage your customer database and view customer details.</p>
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
            Add Customer
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortBy === 'name' && (
                      <FaSortAmountDown className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalVisits')}
                >
                  <div className="flex items-center">
                    Visits
                    {sortBy === 'totalVisits' && (
                      <FaSortAmountDown className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastVisit')}
                >
                  <div className="flex items-center">
                    Last Visit
                    {sortBy === 'lastVisit' && (
                      <FaSortAmountDown className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalSpent')}
                >
                  <div className="flex items-center">
                    Total Spent
                    {sortBy === 'totalSpent' && (
                      <FaSortAmountDown className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('joinDate')}
                >
                  <div className="flex items-center">
                    Join Date
                    {sortBy === 'joinDate' && (
                      <FaSortAmountDown className={`ml-1 h-3 w-3 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalVisits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedCustomers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No customers found matching your search criteria.</p>
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{sortedCustomers.length}</span> of{' '}
              <span className="font-medium">{customers.length}</span> customers
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
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
    </DashboardLayout>
  );
} 