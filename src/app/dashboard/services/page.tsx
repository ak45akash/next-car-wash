'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Mock services data
const services = [
  {
    id: 1,
    name: 'Express Wash',
    description: 'Quick exterior wash with foam and rinse',
    duration: 15,
    price: 499,
    category: 'Basic',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Premium Wash',
    description: 'Exterior wash with wax protection and wheel cleaning',
    duration: 30,
    price: 899,
    category: 'Standard',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Interior Detailing',
    description: 'Complete interior cleaning including vacuum, dashboard, and seats',
    duration: 60,
    price: 1499,
    category: 'Detailing',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Exterior Detailing',
    description: 'Clay bar treatment, paint correction and protection',
    duration: 90,
    price: 1999,
    category: 'Detailing',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Full Detailing',
    description: 'Complete interior and exterior detailing service',
    duration: 180,
    price: 2999,
    category: 'Premium',
    status: 'Active'
  },
  {
    id: 6,
    name: 'Ceramic Coating',
    description: 'Professional ceramic coating application for long-lasting protection',
    duration: 240,
    price: 8999,
    category: 'Premium',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Paint Protection Film',
    description: 'PPF application for ultimate paint protection',
    duration: 300,
    price: 15999,
    category: 'Premium',
    status: 'Inactive'
  }
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Filter services based on search term and category filter
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterCategory === 'all' || 
      service.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
        <p className="text-gray-600">View, add, edit or delete the services offered by your car wash.</p>
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <div className="relative inline-block text-left">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="detailing">Detailing</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FaPlus className="mr-2 -ml-1 h-4 w-4" />
              Add Service
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.duration} mins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{service.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredServices.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No services found matching your search criteria.</p>
          </div>
        )}
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredServices.length}</span> of{' '}
              <span className="font-medium">{services.length}</span> services
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 