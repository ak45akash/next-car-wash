'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaCalendar, 
  FaUsers, 
  FaCar, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <FaTachometerAlt className="w-5 h-5" />
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: <FaCalendar className="w-5 h-5" />
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: <FaUsers className="w-5 h-5" />
  },
  {
    name: 'Services',
    href: '/dashboard/services',
    icon: <FaCar className="w-5 h-5" />
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: <FaChartLine className="w-5 h-5" />
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <FaCog className="w-5 h-5" />
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile (off-canvas) */}
      <div 
        className={`fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-0 w-64 bg-white shadow-lg transform transition-transform ease-in-out duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-semibold text-gray-800">Diamond</span>
          </Link>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-md">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 sm:px-6 md:px-8 flex items-center justify-between">
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaBars className="w-6 h-6" />
            </button>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {/* Admin initials */}
                    <span className="text-sm font-medium">AM</span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">Admin Manager</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 